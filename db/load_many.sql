\COPY Users(email, password, first_name, last_name, address, balance) FROM 'data/Users.csv' WITH DELIMITER ',' NULL '' CSV
-- SELECT pg_catalog.setval('public.users_id_seq',
--                          (SELECT MAX(id)+1 FROM Users),
--                          false);
\COPY Category FROM 'data/Category.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Seller FROM 'data/Seller.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Product(name, description, image, category, creator) FROM 'data/Products.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Sellerproduct FROM 'data/SellerProduct.csv' WITH DELIMITER ',' NULL '' CSV
-- \COPY Orderitem FROM 'OrderItem.csv' WITH DELIMITER ',' NULL '' CSV