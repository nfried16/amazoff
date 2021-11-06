from flask import request, jsonify, Blueprint, current_app as app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

auth_blueprint = Blueprint('auth_blueprint', __name__)


@auth_blueprint.route('/login', methods=['POST'])
def create_token():

    email = request.json.get("email", None)
    password = request.json.get("password", None)

    try:
        # Validate username password
        user = app.db.execute('''
        SELECT *
        FROM Users
        WHERE email = :email AND password = :password
        ''', email=email, password=password)[0]
 
        try:
            app.db.execute('''
            SELECT *
            FROM SELLER
            WHERE id=:id
            ''', id=user['id'])[0]
            isSeller = True
        except: 
            isSeller = False

        # Create a new token with the user id inside
        access_token = create_access_token(identity=user['id'], expires_delta=timedelta(hours=1))
        return jsonify({"token": access_token, "id": user['id'], "isSeller": isSeller})
    except IndexError:
        # Invalid username or password
        return jsonify({"msg": "Bad username or password"}), 401



@auth_blueprint.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    try:
        user = app.db.execute('''
        SELECT *
        FROM Users
        WHERE id = :id
        ''', id=user_id)[0]

        try:
            app.db.execute('''
            SELECT *
            FROM SELLER
            WHERE id=:id
            ''', id=user['id'])[0]
            isSeller = True
        except: 
            isSeller = False
        
        user['isSeller'] = isSeller
        return user
    except IndexError:
        return 'User does not exist', 400
