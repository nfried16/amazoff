from flask import Blueprint, current_app as app, jsonify, request, make_response
from sqlalchemy import exc
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from psycopg2.extensions import AsIs

inventory_blueprint = Blueprint('inventory_blueprint', __name__)

# Get items in cart
@inventory_blueprint.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():

    user_id = get_jwt_identity()

    cart_items = app.db.execute('''
        SELECT Product.id, Product.name, Users.first_name, Users.last_name, SellerProduct.price, SellerProduct.seller_id, CartItem.amount 
        FROM CartItem, SellerProduct, Product, Users
        WHERE CartItem.user_id = :id 
            AND CartItem.seller_id=SellerProduct.seller_id 
            AND CartItem.product_id=SellerProduct.product_id
            AND SellerProduct.product_id=Product.id
            AND SellerProduct.Seller_id=Users.id
        ''', id=user_id)

    return jsonify(cart_items)

# Add to cart
@inventory_blueprint.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():

    user_id = get_jwt_identity()
    seller_id = request.json['seller_id']
    product_id = request.json['product_id']
    amount = request.json['amount']

    cart_item = app.db.execute('''
        INSERT INTO CartItem 
            VALUES(:user_id, :seller_id, :product_id, :amount)
            ON CONFLICT(user_id, seller_id, product_id) DO UPDATE
            SET amount = LEAST(10, CartItem.amount+EXCLUDED.amount)
            RETURNING seller_id, product_id, amount
    ''', user_id=user_id, seller_id=seller_id, product_id=product_id, amount=AsIs(amount))[0]
    app.db.session.commit()

    return jsonify(cart_item)

# Edit cart item quantity
@inventory_blueprint.route('/cart/<string:product_id>/<string:seller_id>', methods=['PATCH'])
@jwt_required()
def edit_item(product_id, seller_id):

    user_id = get_jwt_identity()
    amount = request.json['amount']

    cart_item = app.db.execute('''
        UPDATE CartItem
            SET amount=:amount
            WHERE user_id=:user_id AND seller_id=:seller_id AND product_id=:product_id
            RETURNING seller_id, product_id, amount
    ''', user_id=user_id, seller_id=seller_id, product_id=product_id, amount=amount)[0]
    app.db.session.commit()

    return jsonify(cart_item)

# Remove from cart
@inventory_blueprint.route('/cart/<string:product_id>/<string:seller_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id, seller_id):

    user_id = get_jwt_identity()

    cart_item = app.db.execute('''
        DELETE FROM CartItem
            WHERE user_id=:user_id AND seller_id=:seller_id AND product_id=:product_id
            RETURNING seller_id, product_id
    ''', user_id=user_id, seller_id=seller_id, product_id=product_id)[0]
    app.db.session.commit()

    return jsonify(cart_item)

# Order
@inventory_blueprint.route('/cart/order', methods=['POST'])
@jwt_required()
def order():

    user_id = get_jwt_identity()
    
    cart_items = app.db.execute('''
        SELECT Product.name, Users.first_name, Users.last_name,
            SellerProduct.seller_id, SellerProduct.product_id, SellerProduct.price, 
            CartItem.amount as amount_requested
        FROM CartItem, SellerProduct, Product, Users
        WHERE CartItem.user_id = :id 
            AND CartItem.seller_id=SellerProduct.seller_id 
            AND CartItem.product_id=SellerProduct.product_id
            AND SellerProduct.product_id=Product.id
            AND SellerProduct.seller_id=Users.id
        ''', id=user_id)

    if(len(cart_items) == 0):
        return 'Cart is empty', 400
    try:
        order_id = app.db.execute('''
            INSERT INTO Orders(user_id)
                VALUES(:user_id)
                RETURNING id
            ''', user_id=user_id)[0]['id']
        for cart_item in cart_items:
            name = cart_item['name']
            first_name = cart_item['first_name']
            last_name = cart_item['last_name']
            seller_id = cart_item['seller_id']
            product_id = cart_item['product_id']
            price = cart_item['price']
            amount_requested = cart_item['amount_requested']
            diff = amount_requested*price
            # Increase seller balance
            app.db.execute('''
                UPDATE Users
                SET balance=balance+:revenue
                WHERE id=:seller_id
                RETURNING id
            ''', revenue=AsIs(diff), seller_id=seller_id)
            try:
                # Decrease user balance
                app.db.execute('''
                    UPDATE Users
                    SET balance=balance-:revenue
                    WHERE id=:user_id
                    RETURNING id
                ''', revenue=AsIs(diff), user_id=user_id)
            except Exception as e:
                raise Exception('Insufficient balance') from e
            try:
                # Reduce amount in stock
                app.db.execute('''
                    UPDATE SellerProduct
                    SET amt_in_stock=amt_in_stock-:amount_requested
                    WHERE seller_id=:seller_id AND product_id=:product_id
                    RETURNING seller_id, product_id
                ''', amount_requested=AsIs(amount_requested), seller_id=seller_id, product_id=product_id)
            except Exception as e:
                raise Exception(f'Insufficient stock for product \"{name}\" from seller \"{first_name} {last_name}\"') from e
            # Add to order
            app.db.execute('''
                INSERT INTO OrderItem(seller_id, product_id, amount, price, order_id)
                    VALUES(:seller_id, :product_id, :amount, :price, :order_id)
                    RETURNING seller_id, product_id
            ''', seller_id=seller_id, product_id=product_id, amount=amount_requested, price=price, order_id=order_id)
            # Delete from cart
            app.db.execute('''
                DELETE FROM CartItem
                WHERE user_id=:user_id AND seller_id=:seller_id AND product_id=:product_id
                RETURNING seller_id, product_id
                ''', user_id=user_id, seller_id=seller_id, product_id=product_id)
        app.db.session.commit()
    except Exception as e:
        app.db.session.rollback()
        return str(e), 400

    return jsonify(order_id)

# Get orders for user
@inventory_blueprint.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():

    user_id = get_jwt_identity()

    orders = app.db.execute('''
        SELECT Orders.id, Orders.order_date, 
            SUM(OrderItem.price*OrderItem.amount) as total, COUNT(*), 
            COUNT(*)-COUNT(OrderItem.fulfill_date)=0 as fulfilled
            FROM Orders, OrderItem
            WHERE user_id=:user_id
                AND Orders.id=OrderItem.order_id
            GROUP BY Orders.id
            ORDER BY Orders.id DESC
    ''', user_id=user_id)

    return jsonify(orders)

# Get orders for seller
@inventory_blueprint.route('/orders/seller', methods=['GET'])
@jwt_required()
def get_seller_orders():

    user_id = get_jwt_identity()

    orders = app.db.execute('''
        SELECT Orders.order_date, Orders.user_id, Product.name, OrderItem.*, Users.first_name, Users.last_name
            FROM Orders, OrderItem, Product, Users
            WHERE Orders.id=OrderItem.order_id
                AND OrderItem.seller_id=:seller_id
                AND OrderItem.product_id=Product.id
                AND Orders.user_id=Users.id
            ORDER BY Orders.id DESC
    ''', seller_id=user_id)

    return jsonify(orders)

# Get order by id
@inventory_blueprint.route('/order/<string:id>', methods=['GET'])
@jwt_required()
def get_order(id):

    user_id = get_jwt_identity()

    order_items = app.db.execute('''
        SELECT Orders.id, Orders.order_date, Orders.user_id, OrderItem.*, Product.name, Users.first_name, Users.last_name
            FROM OrderItem, Orders, Product, Users
            WHERE Orders.id=:id
            AND OrderItem.order_id=Orders.id
            AND OrderItem.product_id=Product.id
            AND OrderItem.seller_id=Users.id
    ''', id=id)

    if order_items[0]['user_id'] != user_id:
        return 'Invalid permissions', 400
    
    return jsonify(order_items)

# Fulfill order
@inventory_blueprint.route('/order/fulfill', methods=['POST'])
@jwt_required()
def fulfill():

    user_id = get_jwt_identity()
    order_id = request.json['order_id']
    product_id = request.json['product_id']

    order_item = app.db.execute('''
        UPDATE OrderItem
            Set fulfill_date=CURRENT_TIMESTAMP
            WHERE OrderItem.order_id=:order_id
                AND OrderItem.seller_id=:user_id
                AND OrderItem.product_id=:product_id
            RETURNING order_id, product_id
        ''', order_id=order_id, user_id=user_id, product_id=product_id)
    app.db.session.commit()
    
    return jsonify(order_item)