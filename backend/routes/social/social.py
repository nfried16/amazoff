import base64
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, current_app as app, jsonify
from flask import Blueprint

social_blueprint = Blueprint('social_blueprint', __name__)


@social_blueprint.route('/reviews/seller/<string:id>', methods=['GET'])
@jwt_required()
def get_seller_reviews(id):

    reviews = app.db.execute('''
    SELECT Users.first_name, Users.last_name, UserReview.title, UserReview.rating, UserReview.date, UserReview.description
    FROM UserReview, Users
    WHERE UserReview.seller_id = :id
        AND Users.id=UserReview.user_id
    ''', id=id)

    return jsonify(reviews)

@social_blueprint.route('/reviews/product/<string:id>', methods=['GET'])
@jwt_required()
def get_product_reviews(id):

    reviews = app.db.execute('''
    SELECT Users.first_name, Users.last_name, ProductReview.title, ProductReview.rating, ProductReview.date, ProductReview.description
    FROM ProductReview, Users
    WHERE ProductReview.product_id = :id
        AND Users.id=ProductReview.user_id
    ''', id=id)

    return jsonify(reviews)

