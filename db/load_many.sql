\COPY Users(email, password, first_name, last_name, address, balance) FROM 'generation/data/Users.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Category FROM 'generation/data/Category.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Seller FROM 'generation/data/Seller.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Product(name, description, image, category, creator) FROM 'generation/data/Products.csv' WITH DELIMITER ',' NULL '' CSV
\COPY SellerProduct FROM 'generation/data/SellerProduct.csv' WITH DELIMITER ',' NULL '' CSV
\COPY UserReview(user_id, seller_id, rating, title, description) FROM 'generation/data/UserReview.csv' WITH DELIMITER ',' NULL '' CSV
\COPY ProductReview(user_id, product_id, rating, title, description) FROM 'generation/data/ProductReview.csv' WITH DELIMITER ',' NULL '' CSV