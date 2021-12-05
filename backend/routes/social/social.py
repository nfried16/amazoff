import base64
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, current_app as app, jsonify, request
from flask import Blueprint

social_blueprint = Blueprint('social_blueprint', __name__)

# Get all reviews by this user
@social_blueprint.route('/reviews', methods=['GET'])
@jwt_required()
def get_my_reviews():

    user_id = get_jwt_identity()

    # Get all seller reviews for this user
    user_reviews = app.db.execute('''
    SELECT u1.first_name as first_name, u1.last_name as last_name, 
        UserReview.title, UserReview.rating, UserReview.date, UserReview.description, UserReview.user_id, UserReview.seller_id,
        u2.first_name as seller_first_name, u2.last_name as seller_last_name
    FROM UserReview, Users as u1, Users as u2
    WHERE UserReview.user_id = :id
        AND u1.id=UserReview.user_id
        AND u2.id=UserReview.seller_id
    ORDER BY date DESC
    ''', id=user_id)

    # Get all product reviews for this user
    product_reviews = app.db.execute('''
    SELECT Users.first_name, Users.last_name,
        ProductReview.title, ProductReview.rating, ProductReview.date, ProductReview.description, ProductReview.user_id, ProductReview.product_id,
        Product.name
    FROM ProductReview, Users, Product
    WHERE ProductReview.user_id = :id
        AND Users.id=ProductReview.user_id
        AND Product.id=ProductReview.product_id
    ORDER BY date DESC
    ''', id=user_id)

    # Combine user and product reviews and sort by date
    combined = [*user_reviews, *product_reviews]
    sorted_combined = sorted(combined, key=lambda d: (d['date'], d['title']), reverse=True)
    return jsonify(sorted_combined)

# Get reviews for a certain seller
@social_blueprint.route('/reviews/seller/<string:id>', methods=['GET'])
@jwt_required()
def get_seller_reviews(id):

    reviews = app.db.execute('''
    SELECT Users.first_name, Users.last_name, UserReview.title, UserReview.rating, UserReview.date, UserReview.description, UserReview.user_id, UserReview.seller_id
    FROM UserReview, Users
    WHERE UserReview.seller_id = :id
        AND Users.id=UserReview.user_id
    ORDER BY date DESC
    ''', id=id)

    return jsonify(reviews)

# Get reviews for a certain product
@social_blueprint.route('/reviews/product/<string:id>', methods=['GET'])
@jwt_required()
def get_product_reviews(id):

    reviews = app.db.execute('''
    SELECT Users.first_name, Users.last_name, ProductReview.title, ProductReview.rating, ProductReview.date, ProductReview.description, ProductReview.user_id, ProductReview,product_id
    FROM ProductReview, Users
    WHERE ProductReview.product_id = :id
        AND Users.id=ProductReview.user_id
    ORDER BY date DESC
    ''', id=id)

    return jsonify(reviews)

# Check if this user can review a certain seller
@social_blueprint.route('/review/validate/seller/<string:seller_id>', methods=['GET'])
@jwt_required()
def can_review_seller(seller_id):

    user_id = get_jwt_identity()

    # Check if this user has bought from this seller
    bought_from = len(app.db.execute('''
    SELECT *
    FROM OrderItem, Orders
    WHERE OrderItem.order_id=Orders.id
        AND Orders.user_id=:user_id
        AND OrderItem.seller_id=:seller_id
    ''', user_id = user_id, seller_id=seller_id)) > 0

    # Check if this user has already reviewed this seller
    already_reviewed = len(app.db.execute('''
    SELECT *
    FROM UserReview
    WHERE UserReview.user_id=:user_id
        AND UserReview.seller_id=:seller_id
    ''', user_id = user_id, seller_id=seller_id)) > 0

    return jsonify(bought_from and not already_reviewed)

# Check if this user can review a certain product
@social_blueprint.route('/review/validate/product/<string:product_id>', methods=['GET'])
@jwt_required()
def can_review_product(product_id):

    user_id = get_jwt_identity()

    # Check if this user has bought this product
    bought = len(app.db.execute('''
    SELECT *
    FROM OrderItem, Orders
    WHERE OrderItem.order_id=Orders.id
        AND Orders.user_id=:user_id
        AND OrderItem.product_id=:product_id
    ''', user_id = user_id, product_id=product_id)) > 0

    # Check if this user has already reviewed this product
    already_reviewed = len(app.db.execute('''
    SELECT *
    FROM ProductReview
    WHERE ProductReview.user_id=:user_id
        AND ProductReview.product_id=:product_id
    ''', user_id = user_id, product_id=product_id)) > 0

    return jsonify(bought and not already_reviewed)

# Create a review for a seller
@social_blueprint.route('/review/seller/<string:seller_id>', methods=['POST'])
@jwt_required()
def create_seller_review(seller_id):

    user_id = get_jwt_identity()

    rating = request.json['rating']
    title = request.json['title']
    description = request.json['description']

    review = app.db.execute('''
        INSERT INTO UserReview(user_id, seller_id, rating, title, description)
        VALUES(:user_id, :seller_id, :rating, :title, :description)
        RETURNING *
        ''', user_id = user_id, seller_id=seller_id, rating=rating, title=title, description=description)[0]
    app.db.session.commit()

    return jsonify(review)

# Create a review for a product
@social_blueprint.route('/review/product/<string:product_id>', methods=['POST'])
@jwt_required()
def create_product_review(product_id):

    user_id = get_jwt_identity()

    rating = request.json['rating']
    title = request.json['title']
    description = request.json['description']

    review = app.db.execute('''
        INSERT INTO ProductReview(user_id, product_id, rating, title, description)
        VALUES(:user_id, :product_id, :rating, :title, :description)
        RETURNING *
        ''', user_id = user_id, product_id=product_id, rating=rating, title=title, description=description)[0]
    app.db.session.commit()

    return jsonify(review)

# Edit an exisiting seller review
@social_blueprint.route('/review/seller/<string:seller_id>', methods=['PATCH'])
@jwt_required()
def update_seller_review(seller_id):

    user_id = get_jwt_identity()

    rating = request.json['rating']
    title = request.json['title']
    description = request.json['description']

    review = app.db.execute('''
        UPDATE UserReview
        SET title=:title,
            rating=:rating,
            description=:description
        WHERE user_id=:user_id AND seller_id=:seller_id
        RETURNING *
        ''', user_id = user_id, seller_id=seller_id, rating=rating, title=title, description=description)[0]
    app.db.session.commit()

    return jsonify(review)

# Edit an exisiting product review
@social_blueprint.route('/review/product/<string:product_id>', methods=['PATCH'])
@jwt_required()
def update_product_review(product_id):

    user_id = get_jwt_identity()

    rating = request.json['rating']
    title = request.json['title']
    description = request.json['description']

    review = app.db.execute('''
        UPDATE ProductReview
        SET title=:title,
            rating=:rating,
            description=:description
        WHERE user_id=:user_id AND product_id=:product_id
        RETURNING *
        ''', user_id = user_id, product_id=product_id, rating=rating, title=title, description=description)[0]
    app.db.session.commit()

    return jsonify(review)

# Delete a seller review
@social_blueprint.route('/review/seller/<string:seller_id>', methods=['DELETE'])
@jwt_required()
def remove_seller_review(seller_id):

    user_id = get_jwt_identity()

    review = app.db.execute('''
        DELETE FROM UserReview
        WHERE user_id=:user_id AND seller_id=:seller_id
        RETURNING *
        ''', user_id = user_id, seller_id=seller_id)[0]
    app.db.session.commit()

    return jsonify(review)

# Delete a product review
@social_blueprint.route('/review/product/<string:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product_review(product_id):

    user_id = get_jwt_identity()

    review = app.db.execute('''
        DELETE FROM ProductReview
        WHERE user_id=:user_id AND product_id=:product_id
        RETURNING *
        ''', user_id = user_id, product_id=product_id)[0]
    app.db.session.commit()

    return jsonify(review)
