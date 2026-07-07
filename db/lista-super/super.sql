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
    id_prodcuto_lista INT NOT NULL, 
    id_producto INT,
    id_categoria INT,
    fecha DATE,
    cantidad INT,
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    id_prodcuto_lista INT NOT NULL,
    marcado BOOLEAN DEFAULT FALSE,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

ALTER TABLE lista MODIFY id_prodcuto_lista INT AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE marca ADD COLUMN id_lista INT;
ALTER TABLE marca ADD FOREIGN KEY (id_lista) REFERENCES lista(id_lista);
ALTER TABLE marca ADD UNIQUE(id_lista, id_prodcuto_lista);