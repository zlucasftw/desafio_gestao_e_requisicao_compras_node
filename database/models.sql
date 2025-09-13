CREATE TABLE users {
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'APPROVER') DEFAULT 'USER',
    createdAt TIMESTAMP DEFAULT NOW(),
}

CREATE TABLE purchase_requests {
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    
    description VARCHAR(255),
    status ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',

    quantity INT NOT NULL CHECK (quantity > 0),
    totalPrice DECIMAL(10, 2) NOT NULL CHECK (totalPrice >= 0),

    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE NOW(),
    
    userId INT,
    FOREIGN KEY (userId) REFERENCES users(id)
}

CREATE TABLE request_items {
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),

    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),

    purchase_requests_id INT,
    FOREIGN KEY (purchase_requests_id) REFERENCES purchase_requests(id)
}
