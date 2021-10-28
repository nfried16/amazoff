from flask import Blueprint, current_app as app, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
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

        
