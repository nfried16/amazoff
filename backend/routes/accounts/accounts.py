from flask import Blueprint, current_app as app

accounts_blueprint = Blueprint('accounts_blueprint', __name__)


@accounts_blueprint.route('/user/<string:id>', methods=['GET'])
def get_user(id):

    users = app.db.execute('''
    SELECT *
    FROM Users
    WHERE id = :id
    ''', id = id)

    if len(users) == 0:
        return 'User does not exist', 400

    return dict(users[0])
