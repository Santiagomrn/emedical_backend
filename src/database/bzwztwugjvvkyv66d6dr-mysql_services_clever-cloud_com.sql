-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: bzwztwugjvvkyv66d6dr-mysql.services.clever-cloud.com:3306
-- Generation Time: Jan 30, 2021 at 05:21 AM
-- Server version: 8.0.15-5
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bzwztwugjvvkyv66d6dr`
--
CREATE DATABASE IF NOT EXISTS `bzwztwugjvvkyv66d6dr` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `bzwztwugjvvkyv66d6dr`;

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `emergencyPhone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthdate` date NOT NULL,
  `medicalArea` enum('médico general','dentista','pediatra','nutriólogo','cardiólogo','médico obsteta','otorrinolaringólogo','médico de diagnóstico') NOT NULL,
  `description` text,
  `jobTitle` varchar(255) NOT NULL,
  `professionalLicense` varchar(255) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `maritalStatus` enum('casado','soltero','divorciado','viudo') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `name`, `lastName`, `phone`, `email`, `emergencyPhone`, `password`, `birthdate`, `medicalArea`, `description`, `jobTitle`, `professionalLicense`, `nationality`, `maritalStatus`) VALUES
(1, 'nuevo d', 'kast name', '12333454', 'san@hotmail.com', '12345677', '$2b$10$dC3eb5acxTBrWjtb1jcxJ.JNSLMQJmI15fO.TOtJYuDU9oisfsFiC', '2020-11-13', 'médico general', 'hola soy una prueba', 'medico', '123343243', 'mexicana', 'casado'),
(2, 'Intento2', 'kasts name', '123334541', 'san2@hotmail.com', '1112345677', '$2b$10$XMEmVMaGNTZJ.I7MUvL7s.Cg9/kQvIzZE09cuDmKslf1gnsy8a1eG', '2020-11-13', 'médico general', 'hola soy una prueba', 'medico', '123343243', 'mexicana', 'casado'),
(3, 'Francisco', 'Pech', '12333451', 'doctor@hotmail.com', '1112345677', '$2b$10$c1TO.Vcz2igKqFLXsmCveunfmf0sWVEK3.GGc2tdgIf/9r6MxuqWC', '2020-11-13', 'médico general', 'hola soy una prueba', 'medico', '123343243', 'mexicana', 'casado');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(52, '20201207175139_pathients.js', 1, '2021-01-26 00:05:15'),
(53, '20201207175743_doctors.js', 1, '2021-01-26 00:05:15'),
(54, '20201207180213_medical_appointments.js', 1, '2021-01-26 00:05:16'),
(55, '20210122190655_manager.js', 1, '2021-01-26 00:05:16');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

CREATE TABLE `manager` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`id`, `email`, `password`) VALUES
(1, 'san2@hotmail.com', '$2b$10$QRKDKq/C/pxU.N4GakozXOHv4fvyRXKn3JZSpYw57G8Kk.wClr.jW');

-- --------------------------------------------------------

--
-- Table structure for table `medicalAppointments`
--

CREATE TABLE `medicalAppointments` (
  `id` int(10) UNSIGNED NOT NULL,
  `doctorId` int(10) UNSIGNED NOT NULL,
  `pathientId` int(10) UNSIGNED NOT NULL,
  `QRCode` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
  `turn` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `medicalAppointments`
--

INSERT INTO `medicalAppointments` (`id`, `doctorId`, `pathientId`, `QRCode`, `date`, `time`, `turn`) VALUES
(8, 1, 1, NULL, '2021-01-28', '08:00:00', 1),
(9, 1, 1, NULL, '2021-01-28', '15:30:00', 16),
(24, 2, 1, NULL, '2021-01-29', '15:30:00', 16),
(25, 2, 1, NULL, '2021-01-29', '08:00:00', 1),
(34, 1, 1, '50639696dca8147428c4e2134c6672c567cc3f3ab85ffd12681858fe226e0912', '2021-10-16', '09:30:00', 4),
(35, 1, 1, NULL, '2021-10-16', '10:00:00', 5),
(37, 1, 1, NULL, '2021-01-31', '15:30:00', 16);

-- --------------------------------------------------------

--
-- Table structure for table `pathients`
--

CREATE TABLE `pathients` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL,
  `emergencyPhone` varchar(15) NOT NULL,
  `password` varchar(100) NOT NULL,
  `birthdate` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pathients`
--

INSERT INTO `pathients` (`id`, `name`, `lastName`, `phone`, `email`, `emergencyPhone`, `password`, `birthdate`) VALUES
(1, 'Alejandro', 'Pech', '98345677', 'prueba@gmail.com', '12344567', '$2b$10$8N67TWPotUKxnpf8UJSSae2dJyLrP2mnmgktFs2hUTwI3lBdpQ/NO', '1997-11-13'),
(2, 'Alejandro', 'Pech', '98345677', 'prueba2@gmail.com', '12344567', '$2b$10$N6Y18qbeY1/1m7TfmPSCIOAk8JMLaTHTZvHZf9tN7repF3GgfxlIm', '1997-11-13'),
(3, 'Francisco', 'Pech', '983456717', 'prueba3@gmail.com', '112344567', '$2b$10$ww2cZS0.sNRBFR1Nmw1axOWnJN3alyvVhAASv2bStLdrjqgXMW9..', '1997-11-13'),
(4, 'Alejandro', 'Pech', '98345677', 'prueba4@gmail.com', '12344567', '$2b$10$.pKXi3DBBKB4rWMXO.Lb9.Il7X87NHNIMR3BRygqYlRTwAq0nphIS', '1997-11-13'),
(5, 'Alejandro', 'García', '98345677', 'prueba6@gmail.com', '44444444', '$2b$10$17uKpTFcLcMD/Gc7Zbn.2e6DUzNeMrbvdRoQ.Ymr7EpYWc5x.tv0u', '2021-01-29'),
(6, 'Alejandro', 'Pech', '98345677', 'prueba78@gmail.com', '12344567', '$2b$10$zqCaM4k1x30uQxQcblUXHexisTScTSZ6EG.YQ124G8jvGtiGsL0ju', '1997-11-13'),
(7, 'Alejandro', 'Pech', '98345677', 'prueba70@gmail.com', '12344567', '$2b$10$3j8RqFBM78qt1mnTrmO/XObtxJDsROPe.a.bvkO4rLGy1P3waPiO6', '1997-11-13'),
(8, 'Alejandro', 'Pech', '98345677', 'prueba71@gmail.com', '12344567', '$2b$10$ULbicUiiUvK6Sr4wnR0/ZeLK2tJkGZzN1qlY378vQQbMtOf.3JK9u', '1997-11-13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doctors_phone_unique` (`phone`),
  ADD UNIQUE KEY `doctors_email_unique` (`email`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medicalAppointments`
--
ALTER TABLE `medicalAppointments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `medicalappointments_date_time_doctorid_unique` (`date`,`time`,`doctorId`),
  ADD KEY `medicalappointments_doctorid_foreign` (`doctorId`),
  ADD KEY `medicalappointments_pathientid_foreign` (`pathientId`);

--
-- Indexes for table `pathients`
--
ALTER TABLE `pathients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pathients_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `manager`
--
ALTER TABLE `manager`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medicalAppointments`
--
ALTER TABLE `medicalAppointments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `pathients`
--
ALTER TABLE `pathients`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `medicalAppointments`
--
ALTER TABLE `medicalAppointments`
  ADD CONSTRAINT `medicalappointments_doctorid_foreign` FOREIGN KEY (`doctorId`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `medicalappointments_pathientid_foreign` FOREIGN KEY (`pathientId`) REFERENCES `pathients` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
