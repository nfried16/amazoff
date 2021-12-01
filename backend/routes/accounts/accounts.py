from flask import Blueprint, current_app as app, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash, safe_str_cmp, _hash_internal

accounts_blueprint = Blueprint('accounts_blueprint', __name__)

# Get user by id
@accounts_blueprint.route('/user/<string:id>', methods=['GET'])
@jwt_required()
def get_user(id):

    user_id = get_jwt_identity()

    try:
        # Get user by id
        user = app.db.execute('''
        SELECT *
        FROM Users
        WHERE id = :id
        ''', id = id)[0]
        # Check if seller
        isSeller = len(app.db.execute('''
                SELECT *
                FROM Seller
                WHERE id=:id
                ''', id=id)) > 0
        user['isSeller'] = isSeller
        return user
    except IndexError:
        return 'User does not exist', 400

# Edit user info
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
        # Set new user info
        user = app.db.execute('''
        UPDATE Users
        SET first_name = :first_name, 
            last_name = :last_name, 
            email = :email,
            address = :address,
            balance = :balance
            WHERE id = :id
            RETURNING *
        ''', id = user_id, first_name=first_name, last_name=last_name, email=email, address=address, balance=balance)[0]
        app.db.session.commit()

        return user
    except IndexError:
        app.db.session.rollback()
        return 'Invalid updates', 400

# Edit user password
@accounts_blueprint.route('/user/password', methods=['PATCH'])
@jwt_required()
def edit_password():

    user_id = get_jwt_identity()
    old_pass = request.json.get('old_pass')
    new_pass = request.json.get('new_pass')

    try:
        # Validate username password
        pwhash = app.db.execute('''
        SELECT password
        FROM Users
        WHERE id=:user_id
        ''', user_id=user_id)[0]['password']

        method, salt, hashval = pwhash.split("$", 2)
        match = safe_str_cmp(_hash_internal(method, salt, old_pass)[0], hashval)
        if not match:
            return 'Incorrect password', 403

        # Update to new password
        new_pwhash = generate_password_hash(new_pass)
        user = app.db.execute('''
        UPDATE Users
        SET password=:password
        WHERE id=:user_id
            RETURNING id
        ''', user_id = user_id, password=new_pwhash)[0]
        app.db.session.commit()

        return user
    except IndexError:
        app.db.session.rollback()
        return 'Invalid updates', 400