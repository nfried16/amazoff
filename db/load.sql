-- User
INSERT INTO Users(email, password, first_name, last_name, balance, address) 
    VALUES
    ('natty@gmail.com', '12345678', 'Nathaniel', 'Friedman', 0, '300 Swift Ave'),
    ('niam@gmail.com', 'password', 'Niam', 'Kothari', 0, '300 Swift Ave'),
    ('keith@gmail.com', 'imdumbverydumb1', 'Keith', 'Williams', 0, '407 Towerview Rd'),
    ('anisha@gmail.com', 'abcdefghi', 'Anisha', 'Kumar', 1000, '407 Towerview Rd');
    
-- Seller
INSERT INTO Seller
    (SELECT id FROM Users WHERE email='natty@gmail.com');

-- Category
INSERT INTO Category(name)
    VALUES
    ('Electronics'),
    ('Sports'),
    ('Leisure'),
    ('Clothing'),
    ('Household Items');

-- Product
INSERT INTO Product(name, description, image, category, creator)
    VALUES
    ('Ball', 'This is a ball', decode('02135ae4', 'hex'), 'Sports', (SELECT id from Seller)),
    ('Hat', 'This is a hat', decode('02135ae4', 'hex'), 'Clothing', (SELECT id from Seller)),
    ('Water Bottle', 'This is a water bottle', decode('02135ae4', 'hex'), 'Sports', (SELECT id from Seller)),
    ('iPhone', 'This is an iPhone 12', decode('02135ae4', 'hex'), 'Electronics', (SELECT id from Seller)),
    ('Detergent', 'This is detergent', decode('02135ae4', 'hex'), 'Household Items', (SELECT id from Seller)),
    ('Barbie', 'This is a Barbie doll', decode('02135ae4', 'hex'), 'Leisure', (SELECT id from Seller));

-- SellerProduct
INSERT INTO SellerProduct 
    VALUES((SELECT id FROM Seller), (SELECT id FROM Product WHERE name='Ball'), 0, 45.40);

-- CartItem
INSERT INTO CartItem VALUES(
        (SELECT id FROM Users WHERE email='anisha@gmail.com'), 
        (SELECT id FROM Seller), 
        (SELECT id FROM Product WHERE name='Ball'), 
        4
    );

-- OrderItem
INSERT INTO OrderItem(user_id, seller_id, product_id, amount, price)
    VALUES(
        (SELECT id FROM Users WHERE email='keith@gmail.com'), 
        (SELECT id FROM Seller), 
        (SELECT id FROM Product WHERE name='Ball'), 
        4,
        45.40
    );

-- UserReview
INSERT INTO UserReview(user_id, seller_id, rating, title, description, date)
    VALUES
    ((SELECT id FROM Users WHERE email='keith@gmail.com'), (SELECT id FROM Users WHERE email='natty@gmail.com'), 1, 'Garbo human', 'All of Nattys products are garbo', '2021-10-07 10:00:00'),
    ((SELECT id FROM Users WHERE email='niam@gmail.com'), (SELECT id FROM Users WHERE email='natty@gmail.com'), 5, 'Love him', 'All of Nattys products are fantastic', '2021-10-08 10:00:00');
    
-- ProductReview
INSERT INTO ProductReview(user_id, product_id, rating, title, description, date)
    VALUES
    ((SELECT id FROM Users WHERE email='natty@gmail.com'), (SELECT id FROM Product WHERE name='Ball'), 3, 'This ball sucks', 'This ball really sucks man wish I aint buy it', '2021-10-07 10:00:00'),
    ((SELECT id FROM Users WHERE email='niam@gmail.com'), (SELECT id FROM Product WHERE name='Ball'), 1, 'This product SUCKS!', 'This thing literally exploded when I used it.', '2021-10-07 10:00:00' ),
    ((SELECT id FROM Users WHERE email='keith@gmail.com'), (SELECT id FROM Product WHERE name='Ball'), 5, 'This product is AMAZING!', 'This thing literally saved my marriage.', '2021-10-08 10:00:00' ),
    ((SELECT id FROM Users WHERE email='anisha@gmail.com'), (SELECT id FROM Product WHERE name='Ball'), 3, 'Meh it was okay', 'It worked for like 3 days and then broke', '2021-10-08 10:00:00' );