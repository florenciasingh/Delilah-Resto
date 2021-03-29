CREATE DATABASE delilahresto; 
USE delilahresto;

CREATE TABLE users (
 username varchar(100) NOT NULL,
 fullname varchar(100) NOT NULL,
 email varchar(255) NOT NULL,
 phone varchar(20) NOT NULL,
 password varchar(255) NOT NULL,
 address varchar(255) NOT NULL,
 role enum('admin','basico') NOT NULL,
 PRIMARY KEY (username),
 UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
 productid varchar(10) NOT NULL,
 name varchar(100) NOT NULL,
 photourl varchar(255) NOT NULL,
 unitprice double NOT NULL,
 favorites tinyint(1) NOT NULL,
 PRIMARY KEY (productid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orderstatus (
 id int(11) NOT NULL,
 name varchar(100) NOT NULL,
 color varchar(25) NOT NULL,
 PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
 orderid int(11) NOT NULL AUTO_INCREMENT,
 orderdate datetime NOT NULL,
 clientinfo varchar(100) NOT NULL,
 amount double NOT NULL,
 payment enum('Efectivo','Tarjeta de Crédito','Tarjeta de Débito') NOT NULL,
 statusinfo int(11) NOT NULL,
 PRIMARY KEY (orderid),
 KEY fk_order_user (clientinfo),
 KEY fk_order_status (statusinfo),
 CONSTRAINT fk_order_status FOREIGN KEY (statusinfo) REFERENCES orderstatus (id),
 CONSTRAINT fk_order_user FOREIGN KEY (clientinfo) REFERENCES users (username)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4;

CREATE TABLE orderdetails (
	 orderid int(11) NOT NULL,
	 productid varchar(10) NOT NULL,
	 quantity int(11) NOT NULL,
	 unitprice double NOT NULL,
	 PRIMARY KEY (orderid,productid,unitprice),
	 KEY fk_order_products (productid),
	 CONSTRAINT fk_order_details FOREIGN KEY (orderid) REFERENCES orders (orderid)  ON DELETE CASCADE,
	 CONSTRAINT fk_order_products FOREIGN KEY (productid) REFERENCES products (productid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (username, fullname, email, phone, password, address, role) VALUES('admin', 'Administrador', 'admin@admin.com', '123456789', '$2a$10$rISWFSiwFAnEcV0qEReM3e7FVQCpbqZC5dH0/J/jORy7NfhM.yFHe', '--', 'admin');

commit;

INSERT INTO orderstatus (id, name, color) VALUES(1, 'NUEVO', '#FF2D00');
INSERT INTO orderstatus (id, name, color) VALUES(2, 'CONFIRMADO', '#FD7052');
INSERT INTO orderstatus (id, name, color) VALUES(3, 'PREPARANDO', '#FFC300');
INSERT INTO orderstatus (id, name, color) VALUES(4, 'ENVIANDO', '#00CB62');
INSERT INTO orderstatus (id, name, color) VALUES(5, 'CANCELADO', '#B58EEB');
INSERT INTO orderstatus (id, name, color) VALUES(6, 'ENTREGADO', '#B4AEBD');

COMMIT;
