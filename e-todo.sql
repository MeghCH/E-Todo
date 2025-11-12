CREATE DATABASE IF NOT EXISTS `e-todo`;
USE `e-todo`;

CREATE TABLE IF NOT EXISTS `user` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`email` VARCHAR(255) NOT NULL UNIQUE,
`password` VARCHAR(255) NOT NULL,
`name` VARCHAR(255) NOT NULL,
`firstname` VARCHAR(255) NOT NULL,
`role` ENUM('manager', 'employee') DEFAULT 'employee',
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `todo` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`title` VARCHAR(255) NOT NULL,
`description` TEXT NOT NULL,
`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
`due_time` DATETIME NOT NULL,
`status` ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
`user_id` INT NOT NULL,
FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

CREATE TABLE IF NOT EXISTS `timer_sessions` (
`id` INT AUTO_INCREMENT PRIMARY KEY,
`user_id` INT NOT NULL,
`start_time` TIMESTAMP NOT NULL,
`end_time` TIMESTAMP NULL,
`duration` INT NULL, -- in seconds
`note` TEXT NULL,
FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);
