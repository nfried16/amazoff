CREATE TABLE Users (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    balance DECIMAL(10,2) NOT NULL
);

CREATE TABLE Seller (
    id INT NOT NULL PRIMARY KEY REFERENCES Users(id)
);

CREATE TABLE Category (
    name VARCHAR(255) NOT NULL PRIMARY KEY
);

CREATE TABLE Product (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR NOT NULL,
    image BYTEA NOT NULL,
    category VARCHAR(255) NOT NULL REFERENCES Category(name),
    creator INT NOT NULL REFERENCES Seller(id)
);

CREATE TABLE SellerProduct (
    seller_id INT NOT NULL REFERENCES Seller(id),
    product_id INT NOT NULL REFERENCES Product(id),
    amt_in_stock INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (seller_id, product_id)
);

CREATE TABLE CartItem (
    user_id INT NOT NULL REFERENCES Users(id),
    seller_id INT NOT NULL,
    product_id INT NOT NULL,
    amount INT NOT NULL CHECK(amount > 0),
    PRIMARY KEY (user_id, seller_id, product_id),
    FOREIGN KEY(seller_id, product_id) REFERENCES SellerProduct(seller_id, product_id)
);

CREATE TABLE OrderItem (
    user_id INT NOT NULL REFERENCES Users(id),
    time_purchased timestamp without time zone NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC'),
    seller_id INT NOT NULL,
    product_id INT NOT NULL,
    amount INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    fulfillDate DATE,
    PRIMARY KEY (user_id, time_purchased, seller_id, product_id),
    FOREIGN KEY(seller_id, product_id) REFERENCES SellerProduct(seller_id, product_id)
);

CREATE TABLE UserReview (
    user_id INT NOT NULL REFERENCES Users(id),
    seller_id INT NOT NULL REFERENCES Seller(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    description VARCHAR NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id, seller_id)
);

CREATE TABLE ProductReview (
    user_id INT NOT NULL REFERENCES Users(id),
    product_id INT NOT NULL REFERENCES Product(id),
    rating INT NOT NULL CHECK(rating>=1 AND rating <= 5),
    title VARCHAR(255),
    description VARCHAR NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, product_id)
);