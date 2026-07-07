-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS listasuper;
USE listasuper;

-- 2. Crear tablas independientes (sin dependencias)
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(7) -- Formato hex, ej: #FFFFFF
);

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE unidades (
    id_unidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- 3. Crear tablas con dependencias simples
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

-- 4. Crear tablas de relación principal
CREATE TABLE lista (
    id_lista INT AUTO_INCREMENT PRIMARY KEY,
    id_prodcuto_lista INT NOT NULL, -- Nota: No es auto_increment según pediste
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

-- 1. Si ya habías agregado id_lista, úsalo. Si no, agrégalo:
ALTER TABLE marca ADD COLUMN id_lista INT;

-- 2. Ahora vinculamos la relación:
ALTER TABLE marca ADD FOREIGN KEY (id_lista) REFERENCES lista(id_lista);

-- 3. Para evitar que el mismo producto se marque varias veces en la misma lista,
-- la clave única debe ser sobre id_lista y id_prodcuto_lista (o id_producto si lo agregas)
ALTER TABLE marca ADD UNIQUE(id_lista, id_prodcuto_lista);