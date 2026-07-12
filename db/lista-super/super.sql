CREATE DATABASE IF NOT EXISTS listasuper;
USE listasuper;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(7) 
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE unidades (
    id_unidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_categoria INT,
    id_unidad INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_unidad) REFERENCES unidades(id_unidad)
);

CREATE TABLE permanente (
    id_permanente INT AUTO_INCREMENT PRIMARY KEY,
    es_permanente BOOLEAN DEFAULT FALSE,
    id_producto INT,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE lista (
    id_lista INT AUTO_INCREMENT PRIMARY KEY,
    id_prodcuto_lista BIGINT NOT NULL, 
    id_producto INT,
    id_categoria INT,
    fecha DATE,
    cantidad INT,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    id_prodcuto_lista BIGINT NOT NULL,
    marcado BOOLEAN DEFAULT FALSE,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

ALTER TABLE permanente ADD UNIQUE(id_producto);
ALTER TABLE marca ADD COLUMN id_lista INT;
ALTER TABLE marca ADD FOREIGN KEY (id_lista) REFERENCES lista(id_lista);
ALTER TABLE marca ADD UNIQUE(id_lista, id_prodcuto_lista);
ALTER TABLE lista MODIFY COLUMN cantidad DECIMAL(10, 3);

INSERT INTO categoria (nombre) VALUES 
('Salchichonería'),
('Despensa'),
('Lácteos y huevos'),
('Higiene'),
('Bebidas'),
('Panadería'),
('Fruta'),
('Verdura'),
('Tortillas'),
('Carne'),
('Pollo'),
('Cerdo'),
('Pescado'),
('Otros');

INSERT INTO unidades (nombre) VALUES 
('miligramos (mg)'),
('gramos (g)'),
('kilogramos (kg)'),
('mililitros (ml)'),
('litros (l)'),
('Pieza(s)'),
('Paquete de 2'),
('Paquete de 4'),
('Paquete de 6'),
('Paquete de 8'),
('Paquete de 10'),
('Paquete de 12'),
('Paquete de 14'),
('Paquete de 16'),
('Paquete de 18'),
('Paquete de 20'),
('Paquete de 24'),
('Paquete de 32');

INSERT INTO usuario (nombre, color) VALUES 
('Marcela', '#850000'),
('Javier', '#0b00a6'),
('Emilia', '#7500db');