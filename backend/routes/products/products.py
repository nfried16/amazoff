from flask import Blueprint, current_app as app, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from psycopg2.extensions import AsIs
import base64

products_blueprint = Blueprint('products_blueprint', __name__)

# Get product info by its id
@products_blueprint.route('/product/<string:id>', methods=['GET'])
@jwt_required()
def get_product_by_id(id):

    try:
        product = app.db.execute('''
        SELECT *
        FROM Product
        WHERE id = :id
        ''', id=id)[0]

        # Convert image to ascii
        product['image'] = base64.encodebytes(product['image'].tobytes()).decode('ascii')
    
        return product
    except IndexError:
        return 'Product does not exist', 400

# Get products for a particular seller
@products_blueprint.route('/products/<string:id>', methods=['GET'])
@jwt_required()
def get_products_for_seller(id):

    try:
        first_name = app.db.execute('''
        SELECT first_name
        FROM Users
        WHERE id=:id
        ''', id=id)[0]

        products = app.db.execute('''
        SELECT SellerProduct.*, Product.name
        FROM SellerProduct, Product
        WHERE SellerProduct.seller_id=:seller_id
            AND SellerProduct.product_id=Product.id
        ''', seller_id=id)
    
        return jsonify({**first_name, 'products': products})
    except Exception as e:
        print(e)
        return 'Product does not exist', 400

# Edit a seller product
@products_blueprint.route('/product/seller/<string:id>', methods=['PATCH'])
@jwt_required()
def edit_seller_product(id):

    seller_id = get_jwt_identity()
    price = request.form['price']
    amt_in_stock = request.form['amt_in_stock']

    try:
        product = app.db.execute('''
        UPDATE SellerProduct
        SET price=:price,
            amt_in_stock=:amt_in_stock
        WHERE SellerProduct.seller_id=:seller_id
            AND SellerProduct.product_id=:product_id
        RETURNING product_id
        ''', price=price, amt_in_stock=amt_in_stock, seller_id=seller_id, product_id=id)[0]
        app.db.session.commit()
    
        return jsonify(product)
    except:
        return 'Invalid updates', 400


# Get sellers of a particular product
@products_blueprint.route('/product/<string:id>/sellers', methods=['GET'])
@jwt_required()
def get_seller_products(id):

    sellers = app.db.execute('''
    SELECT Users.id, Users.first_name, Users.last_name, SellerProduct.amt_in_stock, SellerProduct.price
    FROM SellerProduct, Users
    WHERE SellerProduct.product_id=:id
        AND Users.id=SellerProduct.seller_id
    ''', id=id)

    return jsonify(sellers)

# Create product
@products_blueprint.route('/product', methods=['POST'])
@jwt_required()
def create_product():

    seller_id = get_jwt_identity()

    name = request.form['name']
    description = request.form['description']
    image = request.files['image'].read()
    category = request.form['category']
    price = request.form['price']
    amt_in_stock = request.form['amt_in_stock']

    # Create Product
    product_id = app.db.execute('''
        INSERT INTO Product(name, description, image, category, creator)
        VALUES(:name, :description, :image, :category, :seller_id) 
        RETURNING id
        ''', name=name, description=description, image=image, category=category, seller_id=seller_id)[0]['id']

    # Create this SellerProduct
    app.db.execute('''
        INSERT INTO SellerProduct
        VALUES(:seller_id, :product_id, :amt_in_stock, :price)
        RETURNING seller_id
        ''', seller_id=seller_id, product_id=product_id, amt_in_stock=amt_in_stock, price=price)
    app.db.session.commit()

    return jsonify(product_id)

# Edit product
@products_blueprint.route('/product/<string:id>', methods=['PATCH'])
@jwt_required()
def edit_product(id):

    seller_id = get_jwt_identity()

    name = request.form['name']
    description = request.form['description']
    category = request.form['category']

    # Edit Product
    product_id = app.db.execute('''
        UPDATE Product
        SET name=:name,
            description=:description,
            category=:category
        WHERE id=:product_id
        RETURNING id
        ''', product_id=id, name=name, description=description, category=category)[0]
    app.db.session.commit()

    return jsonify(product_id)

# Start selling product
@products_blueprint.route('/product/<string:id>', methods=['POST'])
@jwt_required()
def start_selling(id):

    seller_id = get_jwt_identity()

    price = request.form['price']
    amt_in_stock = request.form['amt_in_stock']

    # Start Selling Product
    product_id = app.db.execute('''
        INSERT INTO SellerProduct
            VALUES(:seller_id, :product_id, :amt_in_stock, :price) 
        RETURNING product_id
        ''', seller_id=seller_id, product_id=id, amt_in_stock=amt_in_stock, price=price)
    app.db.session.commit()

    return jsonify(product_id)

# Stop selling product
@products_blueprint.route('/product/<string:id>', methods=['DELETE'])
@jwt_required()
def stop_selling(id):

    seller_id = get_jwt_identity()

    # Delete seller product
    product_id = app.db.execute('''
        DELETE FROM SellerProduct
            WHERE product_id=:product_id AND
                seller_id=:seller_id
        RETURNING product_id
        ''', product_id=id, seller_id=seller_id)
    app.db.session.commit()

    return jsonify(product_id)

# Search by name
@products_blueprint.route('/product', methods=['GET'])
@jwt_required()
def search():

    search = request.args['search']
    page = int(request.args.get('page', 1))
    category = request.args.get('category', None)
    sort = request.args.get('sort', None)
    per_page = 15
    offset = (page-1)*per_page

    # Category filterng
    if not category:
        cat_filter = 'true'
    else:
        cat_filter = f"Product.category='{category}'"

    # Sorting by price
    if sort == 'low':
        sort_filter = 'ORDER BY price'
    elif sort == 'high':
        sort_filter = 'ORDER BY price DESC'
    else:
        sort_filter = ''

    num_rows = app.db.execute(f'''
        SELECT COUNT(*)
        FROM Product
        WHERE (Product.name ILIKE '%:search%'
            OR Product.description ILIKE '%:search%') AND
            {cat_filter}
    ''', search=AsIs(search))[0]['count']

    if num_rows == 0:
        # No products match
        return jsonify({'products': [], 'start': 0, 'end': 0, 'page': 0, 'num_rows': 0})
    elif offset >= num_rows:
        # Page is greater than total pages
        return 'Invalid page', 400

    # Get Products
    products = app.db.execute(f'''
        SELECT Product.*, 
            Users.first_name, Users.last_name, 
            Cast(AVG(COALESCE(ProductReview.rating, 0)) as Decimal(10, 1)) as rating, 
            Cast(AVG(COALESCE(SellerProduct.price, 0)) as Decimal(10, 2)) as price
        FROM Product LEFT OUTER JOIN ProductReview
            ON Product.id=ProductReview.product_id
            LEFT OUTER JOIN SellerProduct
            ON Product.id=SellerProduct.product_id,
            Users
        WHERE (Product.name ILIKE '%:search%' OR 
            Product.description ILIKE '%:search%') AND 
            Product.creator=Users.id AND
            {cat_filter}
        GROUP BY Product.id, Users.id
        {sort_filter}
        LIMIT :per_page
        OFFSET :offset
        ''', search=AsIs(search), per_page=per_page, offset=offset)

    # Convert image to correct format
    for product in products:
        product['image'] = base64.encodebytes(product['image'].tobytes()).decode('ascii')

    # Result range
    start = offset+1
    end = min(offset+15, num_rows)
    
    return jsonify({'products': products, 'start': start, 'end': end, 'page': page, 'num_rows': num_rows})

# Get Categories
@products_blueprint.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():

    # Get all categoriew
    categories = app.db.execute('''
        SELECT name
        FROM Category
        ''')

    return jsonify([cat['name'] for cat in categories])


        
