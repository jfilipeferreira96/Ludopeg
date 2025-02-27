CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT NULL, -- Corrigido para permitir NULL ou adicionar um valor padrão
    fullname VARCHAR(255),
    phone VARCHAR(15) DEFAULT NULL UNIQUE,
    birthdate DATE,
    user_type ENUM('admin', 'jogador') DEFAULT 'jogador' NOT NULL,
    is_subscribed_to_newsletter TINYINT(1) DEFAULT 0,
    has_fees_paid TINYINT(1) DEFAULT 0,
    fee_expiration_date DATE DEFAULT NULL,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fee_history (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    validated_by INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (validated_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    href VARCHAR(255) DEFAULT NULL,
    url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agenda (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT DEFAULT NULL,
    image_path TEXT DEFAULT NULL,
    user_id INT NOT NULL,
    date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tournaments (
    tournament_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    player1_id INT NOT NULL,
    player2_id INT NOT NULL,
    match_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location_id INT DEFAULT NULL,
    winner_id INT DEFAULT NULL,
    score VARCHAR(20) DEFAULT NULL, -- Exemplo: '6-3, 4-6, 7-5'
    status ENUM('scheduled', 'in_progress', 'completed') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (player1_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (player2_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tournament_players (
    tournament_id INT NOT NULL,
    user_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    PRIMARY KEY (tournament_id, user_id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_by INT,
    validated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (validated_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Inserções

INSERT INTO locations (name, address, city, country, href, created_at) 
VALUES 
('Pro Padel - Mozelos', 'Rua Bairro da Mata, 644, Santa Maria de Lamas', 'Mozelos', 'Portugal', '', CURRENT_TIMESTAMP),
('Pro Padel - Lamas', 'Travessa da Salgueirinha, Nº 64, 4535-416 St. M. de Lamas', 'Lamas', 'Portugal', '', CURRENT_TIMESTAMP);

INSERT INTO users (username, password, email, avatar, user_type, fullname, birthdate, is_subscribed_to_newsletter) 
VALUES 
('admin', '$2b$10$8B9HU4VxyxQhIBEdsl.E9OqrJqxScn8.AuEz4Gc2gP.QDtGbMTCaa', 'admin@ludo.com', NULL, 'admin', 'User', '1999-01-01', 1);

INSERT INTO agenda (event_date, title, location_id) 
VALUES 
('2025-01-11', 'Encontro de jogos narrativos', 1);

INSERT INTO fee_history (user_id, payment_date, amount, validated_by) 
VALUES 
(1, '2025-01-01', 50.00, 1);
