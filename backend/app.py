from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from flask import Flask
from db import DB
# Blueprints:
from routes.accounts.accounts import accounts_blueprint
from routes.inventory.inventory import inventory_blueprint
from routes.products.products import products_blueprint
from routes.sellers.sellers import sellers_blueprint
from routes.social.social import social_blueprint

app = Flask(__name__)

# DB
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:12345678@localhost/amazoff"
app.db = DB(app)

# Register Blueprints
app.register_blueprint(accounts_blueprint)
app.register_blueprint(inventory_blueprint)
app.register_blueprint(products_blueprint)
app.register_blueprint(sellers_blueprint)
app.register_blueprint(social_blueprint)

@app.route('/')
def default():
    return 'Base Route'

if __name__ == '__main__':
    app.run()
