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
        VALUES
        (:name, :description, :image, :category, :seller_id) 
        RETURNING id
        ''', name=name, description=description, image=image, category=category, seller_id=seller_id)[0]['id']

    # Create this SellerProduct
    app.db.execute('''
        INSERT INTO SellerProduct
        VALUES(:seller_id, :product_id, :amt_in_stock, :price)
        RETURNING seller_id
        ''', seller_id=seller_id, product_id=product_id, amt_in_stock=amt_in_stock, price=price)

    return jsonify(product_id)

# Search by name
@products_blueprint.route('/product', methods=['GET'])
@jwt_required()
def search():

    search = request.args['search']

    # Get Products
    products = app.db.execute('''
        SELECT Product.*, 
            Users.first_name, Users.last_name, 
            Cast(AVG(COALESCE(ProductReview.rating, 0)) as Decimal(10, 1)) as rating, 
            Cast(AVG(COALESCE(SellerProduct.price, 0)) as Decimal(10, 2)) as price
        FROM Product LEFT OUTER JOIN ProductReview
            ON Product.id=ProductReview.product_id
            LEFT OUTER JOIN SellerProduct
            ON Product.id=SellerProduct.product_id,
        Users
        WHERE Product.name LIKE '%:search%' AND 
            Product.creator=Users.id
        GROUP BY Product.id, Users.id
        ''', search=AsIs(search))

    for product in products:
        product['image'] = base64.encodebytes(product['image'].tobytes()).decode('ascii')

    return jsonify(products)

# Get Categories
@products_blueprint.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():

    categories = app.db.execute('''
        SELECT name
        FROM Category
        ''')

    return jsonify([cat['name'] for cat in categories])


        
