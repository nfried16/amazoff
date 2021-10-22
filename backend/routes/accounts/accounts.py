from flask import Blueprint, request, make_response
from flask_sqlalchemy import SQLAlchemy

accounts_blueprint = Blueprint('accounts_blueprint', __name__)

@accounts_blueprint.route('/accounts', methods=['GET'])
def get_accounts():
    return 'Accounts'
