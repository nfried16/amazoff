\COPY Users FROM 'Users.csv' WITH DELIMITER ',' NULL '' CSV
-- SELECT pg_catalog.setval('public.users_id_seq',
--                          (SELECT MAX(id)+1 FROM Users),
--                          false);
\COPY Category FROM 'Category.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Seller FROM 'Seller.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Product FROM 'Products.csv' WITH DELIMITER ',' NULL '' CSV
\COPY Sellerproduct FROM 'SellerProduct.csv' WITH DELIMITER ',' NULL '' CSV
-- \COPY Orderitem FROM 'OrderItem.csv' WITH DELIMITER ',' NULL '' CSV