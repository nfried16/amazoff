from flask import Blueprint, current_app as app, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

inventory_blueprint = Blueprint('inventory_blueprint', __name__)

# Get items in cart
@inventory_blueprint.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():

    user_id = get_jwt_identity()
    
    cart_items = app.db.execute('''
        SELECT Product.id, Product.name, SellerProduct.price, SellerProduct.seller_id, CartItem.amount 
        FROM CartItem, SellerProduct, Product
        WHERE CartItem.user_id = :id 
            AND CartItem.seller_id=SellerProduct.seller_id 
            AND CartItem.product_id=SellerProduct.product_id
            AND SellerProduct.product_id=Product.id
        ''', id=user_id)

    return jsonify(cart_items)
