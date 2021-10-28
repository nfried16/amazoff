from flask import Blueprint, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity

accounts_blueprint = Blueprint('accounts_blueprint', __name__)


@accounts_blueprint.route('/user/<string:id>', methods=['GET'])
@jwt_required()
def get_user(id):

    user_id = get_jwt_identity()

    try:
        user = app.db.execute('''
        SELECT *
        FROM Users
        WHERE id = :id
        ''', id = id)[0]
        isSeller = len(app.db.execute('''
                SELECT *
                FROM Seller
                WHERE id=:id
                ''', id=id)) > 0
        if(isSeller):
            products = app.db.execute('''
                SELECT Product.name, SellerProduct.amt_in_stock, SellerProduct.price
                FROM SellerProduct, Product
                WHERE SellerProduct.seller_id=:id 
                    AND SellerProduct.product_id=Product.id
                ''', id=id)
            user['products'] = products
        return user
    except IndexError:
        return 'User does not exist', 400
