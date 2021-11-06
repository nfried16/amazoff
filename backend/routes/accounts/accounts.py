from flask import Blueprint, current_app as app, request
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

@accounts_blueprint.route('/user', methods=['PATCH'])
@jwt_required()
def edit_user():

    user_id = get_jwt_identity()
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    email = request.json.get('email')
    address = request.json.get('address')
    balance = request.json.get('balance')

    try:
        app.db.execute('''
        UPDATE Users
        SET first_name = :first_name, 
            last_name = :last_name, 
            email = :email,
            address = :address,
            balance = :balance
        WHERE id = :id;
        ''', id = user_id, first_name=first_name, last_name=last_name, email=email, address=address, balance=balance)

        user = app.db.execute('''
        SELECT *
        FROM Users
        WHERE id = :id
        ''', id = user_id)[0]

        return user
    except IndexError:
        return 'Invalid updates', 400

