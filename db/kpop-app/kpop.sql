CREATE DATABASE IF NOT EXISTS kpopapp;
USE kpopapp;

-- Tabla de Artistas (Solistas o Grupos)
CREATE TABLE artistas (
    id_artista INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    num_integrantes INT DEFAULT 1, -- 1 si es solista
    es_grupo BOOLEAN DEFAULT FALSE,
    logo_url VARCHAR(255),
    id_padre INT NULL, -- Para relacionar integrantes con grupos
    FOREIGN KEY (id_padre) REFERENCES artistas(id_artista)
);

-- Tabla de Álbumes
CREATE TABLE albumes (
    id_album INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_lanzamiento DATE,
    tipo_album ENUM('Sencillo', 'Mini album (EP)', 'Full album (LP)', 'Single Album'),
    portada_url VARCHAR(255),
    id_artista INT,
    FOREIGN KEY (id_artista) REFERENCES artistas(id_artista)
);

-- Tabla de Canciones
CREATE TABLE canciones (
    id_cancion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion_segundos INT,
    id_album INT,
    FOREIGN KEY (id_album) REFERENCES albumes(id_album)
);

-- Tabla intermedia para artistas colaboradores (Muchos a Muchos)
CREATE TABLE colaboraciones (
    id_cancion INT,
    id_artista INT,
    PRIMARY KEY (id_cancion, id_artista),
    FOREIGN KEY (id_cancion) REFERENCES canciones(id_cancion),
    FOREIGN KEY (id_artista) REFERENCES artistas(id_artista)
);

CREATE TABLE rankings (
    id_ranking INT AUTO_INCREMENT PRIMARY KEY,
    id_cancion INT,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 10), -- Escala del 1 al 10
    comentario TEXT,
    fecha_ranking TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cancion) REFERENCES canciones(id_cancion)
);