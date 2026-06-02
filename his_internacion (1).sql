-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2026 a las 20:02:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `his_internacion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admisiones`
--

CREATE TABLE `admisiones` (
  `id_admision` int(11) NOT NULL,
  `dni_paciente` int(11) NOT NULL,
  `fecha_ingreso` datetime NOT NULL DEFAULT current_timestamp(),
  `motivo` text DEFAULT NULL,
  `estado` enum('activa','cancelada','finalizada') NOT NULL DEFAULT 'activa',
  `id_cama` int(11) DEFAULT NULL,
  `usuario_registra` int(11) DEFAULT NULL,
  `fecha_egreso` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `admisiones`
--

INSERT INTO `admisiones` (`id_admision`, `dni_paciente`, `fecha_ingreso`, `motivo`, `estado`, `id_cama`, `usuario_registra`, `fecha_egreso`) VALUES
(1, 30123456, '2025-11-26 16:05:18', 'Cirugía programada', '', 1, NULL, '2025-11-26 21:16:34'),
(2, 30987654, '2025-11-26 16:19:28', 'dolor de pecho ', '', 1, NULL, '2025-11-26 21:16:51'),
(3, 30987654, '2025-11-27 17:26:26', 'dolor de estomago', '', 1, NULL, '2025-11-27 17:27:11'),
(4, 35766234, '2026-02-21 16:56:45', 'Dolor de rodilla', '', 2, NULL, '2026-02-21 16:59:42'),
(5, 30123456, '2026-02-21 16:59:15', 'Dolor de cabeza', 'activa', 3, NULL, NULL),
(6, 35766234, '2026-02-21 17:01:09', 'dolores de ovario', '', 1, NULL, '2026-02-21 17:39:53'),
(7, 35766234, '2026-02-21 17:39:24', 'aehsrjty', 'activa', 2, NULL, NULL),
(8, 39887456, '2026-06-02 13:28:08', 'fiebre', 'finalizada', 4, NULL, '2026-06-02 14:02:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alas`
--

CREATE TABLE `alas` (
  `id_ala` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `alas`
--

INSERT INTO `alas` (`id_ala`, `nombre`) VALUES
(1, 'Ala Norte'),
(2, 'Ala Sur'),
(3, 'Urgencias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `altas`
--

CREATE TABLE `altas` (
  `id_alta` int(11) NOT NULL,
  `id_admision` int(11) NOT NULL,
  `fecha_alta` datetime NOT NULL DEFAULT current_timestamp(),
  `indicaciones` text DEFAULT NULL,
  `usuario_registra` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `altas`
--

INSERT INTO `altas` (`id_alta`, `id_admision`, `fecha_alta`, `indicaciones`, `usuario_registra`) VALUES
(1, 8, '2026-06-02 14:02:02', 'Tomar las pastillas que le resetaron por 1 semana', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camas`
--

CREATE TABLE `camas` (
  `id_cama` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `id_habitacion` int(11) NOT NULL,
  `estado` enum('libre','ocupada','higienizando','mantenimiento') NOT NULL DEFAULT 'libre',
  `sexo_permitido` enum('M','F','N') NOT NULL DEFAULT 'N',
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `camas`
--

INSERT INTO `camas` (`id_cama`, `codigo`, `id_habitacion`, `estado`, `sexo_permitido`, `descripcion`) VALUES
(1, 'H101-C1', 1, 'higienizando', 'N', 'Cama 1 de hab 101'),
(2, 'H101-C2', 1, 'ocupada', 'N', 'Cama 2 de hab 101'),
(3, 'H102-C1', 2, 'ocupada', 'N', 'Cama habitacion 102'),
(4, 'U01-C1', 3, 'ocupada', 'N', 'Cama urgencias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emergencias`
--

CREATE TABLE `emergencias` (
  `id_emergencia` int(11) NOT NULL,
  `codigo_temporal` varchar(20) NOT NULL,
  `sexo` enum('M','F','N') DEFAULT 'N',
  `descripcion` text DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT current_timestamp(),
  `estado` enum('sin_identificar','identificado','alta') DEFAULT 'sin_identificar',
  `id_cama` int(11) DEFAULT NULL,
  `dni_paciente` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `emergencias`
--

INSERT INTO `emergencias` (`id_emergencia`, `codigo_temporal`, `sexo`, `descripcion`, `fecha_ingreso`, `estado`, `id_cama`, `dni_paciente`) VALUES
(1, 'EMG-1780423064745', 'F', 'Accidente de moto', '2026-06-02 14:57:44', 'identificado', 4, 39887456);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_enfermeria`
--

CREATE TABLE `evaluacion_enfermeria` (
  `id_eval_enf` int(11) NOT NULL,
  `id_admision` int(11) NOT NULL,
  `antecedentes` text DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `medicamentos` text DEFAULT NULL,
  `motivo_internacion` text DEFAULT NULL,
  `signos_vitales_temp` decimal(4,1) DEFAULT NULL,
  `signos_vitales_fc` int(11) DEFAULT NULL,
  `signos_vitales_fr` int(11) DEFAULT NULL,
  `signos_vitales_pa` varchar(30) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `usuario_registra` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evaluacion_enfermeria`
--

INSERT INTO `evaluacion_enfermeria` (`id_eval_enf`, `id_admision`, `antecedentes`, `alergias`, `medicamentos`, `motivo_internacion`, `signos_vitales_temp`, `signos_vitales_fc`, `signos_vitales_fr`, `signos_vitales_pa`, `fecha_registro`, `usuario_registra`) VALUES
(1, 1, 'HTA controlada', 'Ninguna', 'Enalapril', 'Control posoperatorio', 36.7, 78, 18, '120/80', '2025-11-26 16:05:18', NULL),
(2, 4, 'cancer de mama', 'ninguna', 'ninguna', 'dolor de rodilla', 37.3, 63, 13, '120/80', '2026-02-21 16:58:53', NULL),
(3, 8, 'ninguno', 'ninguno', 'ninguno', 'fiebre', 40.0, 98, 5, '120/80', '2026-06-02 13:41:02', NULL),
(4, 8, 'ninguno', 'ninguno', 'ninguno', 'fiebre', 40.0, 98, 5, '120/80', '2026-06-02 13:41:48', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_medica`
--

CREATE TABLE `evaluacion_medica` (
  `id_eval_med` int(11) NOT NULL,
  `id_admision` int(11) NOT NULL,
  `diagnostico` text DEFAULT NULL,
  `estudios` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `evolucion` text DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `usuario_registra` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evaluacion_medica`
--

INSERT INTO `evaluacion_medica` (`id_eval_med`, `id_admision`, `diagnostico`, `estudios`, `tratamiento`, `evolucion`, `fecha_registro`, `usuario_registra`) VALUES
(1, 1, 'Apendicitis aguda', 'ANALISIS: Hemograma, Rx abdomen', 'Cirugía laparoscópica, analgesia', 'Evoluciona favorable', '2025-11-26 16:05:18', NULL),
(2, 8, 'fiebre por intoxicacion', 'ninguno', 'pastillas', 'mejora', '2026-06-02 13:47:27', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `id_habitacion` int(11) NOT NULL,
  `numero` varchar(20) NOT NULL,
  `capacidad` tinyint(4) NOT NULL CHECK (`capacidad` in (1,2)),
  `id_ala` int(11) NOT NULL,
  `piso` varchar(20) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`id_habitacion`, `numero`, `capacidad`, `id_ala`, `piso`, `descripcion`) VALUES
(1, '101', 2, 1, '1', 'Habitación doble con ventana'),
(2, '102', 1, 1, '1', 'Habitación individual'),
(3, 'U01', 1, 3, 'PB', 'Cama de urgencias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id_medico` int(11) NOT NULL,
  `dni` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `sexo` enum('M','F') NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo_electronico` varchar(100) DEFAULT NULL,
  `especialidad` varchar(50) DEFAULT NULL,
  `matricula` varchar(50) NOT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id_medico`, `dni`, `nombre`, `apellido`, `sexo`, `fecha_nacimiento`, `telefono`, `correo_electronico`, `especialidad`, `matricula`, `estado`, `created_at`) VALUES
(7, 11111111, 'Juan', 'Pérez', 'M', '1980-01-10', '123456789', 'juan.perez@hospital.com', 'Médico General', 'MAT001', 'activo', '2025-11-27 14:30:20'),
(8, 11111112, 'Lucía', 'Fernández', 'F', '1985-03-15', '234567890', 'lucia.fernandez@hospital.com', 'Médico General', 'MAT002', 'activo', '2025-11-27 14:30:20'),
(9, 11111113, 'Laura', 'Gómez', 'F', '1978-07-20', '345678901', 'laura.gomez@hospital.com', 'Cardióloga', 'MAT003', 'activo', '2025-11-27 14:30:20'),
(10, 11111114, 'Marcos', 'Santos', 'M', '1982-05-05', '456789012', 'marcos.santos@hospital.com', 'Cardiólogo', 'MAT004', 'activo', '2025-11-27 14:30:20'),
(11, 11111115, 'Carlos', 'Ramírez', 'M', '1990-09-12', '567890123', 'carlos.ramirez@hospital.com', 'Enfermero', 'MAT005', 'activo', '2025-11-27 14:30:20'),
(12, 11111116, 'Ana', 'López', 'F', '1988-12-01', '678901234', 'ana.lopez@hospital.com', 'Pediatra', 'MAT006', 'activo', '2025-11-27 14:30:20'),
(13, 29667666, 'Gilberto', 'Funes', 'M', '1999-05-07', '2445332211', 'Gilberto@gmail.com', 'Psicologo', 'MAT007', 'activo', '2026-06-02 14:18:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `dni` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `sexo` enum('M','F') NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `tel_emergencia` varchar(20) DEFAULT NULL,
  `nombre_dueno` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `localidad` varchar(100) NOT NULL,
  `edad` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`dni`, `nombre`, `apellido`, `sexo`, `fecha_nacimiento`, `telefono`, `tel_emergencia`, `nombre_dueno`, `direccion`, `localidad`, `edad`, `created_at`, `activo`) VALUES
(11223344, 'Abel', 'Pintos', 'M', '1984-03-11', '02664000000', '2664123441', 'Mamá de Abel', 'Mitre 222', 'Bahia Blanca', 41, '2025-11-26 21:08:10', 1),
(30123456, 'Juan', 'Perez', 'M', '1980-05-12', '2611234567', '2664009876', 'Elsa Castro', 'Calle Falsa 123', 'San Luis', 45, '2025-11-26 16:05:18', 0),
(30987654, 'María', 'Gomez', 'F', '1992-11-30', '2617654321', NULL, NULL, 'Avenida Siempreviva 742', '', 0, '2025-11-26 16:05:18', 1),
(35766234, 'Velen', 'Calles', 'F', '1999-06-07', '2664990999', '2664887788', 'Celena Gomez', 'Calle cualquiera 222', 'Buenos Aires', 26, '2026-02-21 16:56:02', 1),
(39887456, 'lala', 'lole', 'F', '2000-05-09', '2665667766', NULL, NULL, NULL, 'La Toma', 26, '2026-06-02 13:23:08', 1),
(46332709, 'Maria Lourdes', 'Villegas', 'F', '2005-02-17', '02665112822', '2664112348', 'Romina Pereyra', 'Sarmiento 670', 'La Toma', 20, '2025-11-26 20:53:46', 1);

--
-- Disparadores `pacientes`
--
DELIMITER $$
CREATE TRIGGER `calcular_edad` BEFORE INSERT ON `pacientes` FOR EACH ROW BEGIN
    SET NEW.edad = TIMESTAMPDIFF(YEAR, NEW.fecha_nacimiento, CURDATE());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'ADMIN'),
(4, 'ADMISION'),
(2, 'ENFERMERIA'),
(3, 'MEDICO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `dni_paciente` int(11) NOT NULL,
  `id_medico` int(11) NOT NULL,
  `fecha_solicitada` datetime NOT NULL,
  `fecha_realizacion` datetime DEFAULT NULL,
  `estado` enum('pendiente','realizado','cancelado') DEFAULT 'pendiente',
  `motivo` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `usuario_registra` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `dni_paciente`, `id_medico`, `fecha_solicitada`, `fecha_realizacion`, `estado`, `motivo`, `observaciones`, `usuario_registra`, `created_at`) VALUES
(1, 46332709, 7, '2025-11-27 18:32:08', '2025-11-30 14:00:00', 'pendiente', 'consulta', NULL, NULL, '2025-11-27 14:33:23'),
(2, 11223344, 10, '2025-11-29 17:00:00', NULL, 'pendiente', 'dolor de pecho', NULL, NULL, '2025-11-27 14:35:26'),
(3, 39887456, 13, '2026-06-03 17:00:00', NULL, 'pendiente', 'personales', NULL, NULL, '2026-06-02 14:26:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `usuario`, `password`, `nombre`, `email`, `id_rol`, `activo`, `created_at`) VALUES
(6, 'Luu', '$2b$10$pI3Cd93HiEUT18k4eptAXOYgGDIQQsLJFgd/8yTnBt/Uf26A4Tx2W', 'Maria Lourdes', 'villegasmarialuly@gmail.com', 2, 1, '2026-06-02 13:22:06');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_camas_detalle`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_camas_detalle` (
`id_cama` int(11)
,`codigo` varchar(20)
,`estado` enum('libre','ocupada','higienizando','mantenimiento')
,`sexo_permitido` enum('M','F','N')
,`id_habitacion` int(11)
,`numero_habitacion` varchar(20)
,`capacidad` tinyint(4)
,`id_ala` int(11)
,`ala_nombre` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_camas_detalle`
--
DROP TABLE IF EXISTS `vw_camas_detalle`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_camas_detalle`  AS SELECT `c`.`id_cama` AS `id_cama`, `c`.`codigo` AS `codigo`, `c`.`estado` AS `estado`, `c`.`sexo_permitido` AS `sexo_permitido`, `h`.`id_habitacion` AS `id_habitacion`, `h`.`numero` AS `numero_habitacion`, `h`.`capacidad` AS `capacidad`, `a`.`id_ala` AS `id_ala`, `a`.`nombre` AS `ala_nombre` FROM ((`camas` `c` join `habitaciones` `h` on(`c`.`id_habitacion` = `h`.`id_habitacion`)) join `alas` `a` on(`h`.`id_ala` = `a`.`id_ala`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD PRIMARY KEY (`id_admision`),
  ADD KEY `fk_admision_usuario` (`usuario_registra`),
  ADD KEY `idx_admisiones_paciente` (`dni_paciente`),
  ADD KEY `idx_admisiones_cama` (`id_cama`);

--
-- Indices de la tabla `alas`
--
ALTER TABLE `alas`
  ADD PRIMARY KEY (`id_ala`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `altas`
--
ALTER TABLE `altas`
  ADD PRIMARY KEY (`id_alta`),
  ADD KEY `fk_alta_admision` (`id_admision`),
  ADD KEY `fk_alta_usuario` (`usuario_registra`);

--
-- Indices de la tabla `camas`
--
ALTER TABLE `camas`
  ADD PRIMARY KEY (`id_cama`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `idx_camas_habitacion` (`id_habitacion`);

--
-- Indices de la tabla `emergencias`
--
ALTER TABLE `emergencias`
  ADD PRIMARY KEY (`id_emergencia`),
  ADD KEY `id_cama` (`id_cama`),
  ADD KEY `dni_paciente` (`dni_paciente`);

--
-- Indices de la tabla `evaluacion_enfermeria`
--
ALTER TABLE `evaluacion_enfermeria`
  ADD PRIMARY KEY (`id_eval_enf`),
  ADD KEY `fk_eval_enf_admision` (`id_admision`),
  ADD KEY `fk_eval_enf_usuario` (`usuario_registra`);

--
-- Indices de la tabla `evaluacion_medica`
--
ALTER TABLE `evaluacion_medica`
  ADD PRIMARY KEY (`id_eval_med`),
  ADD KEY `fk_eval_med_admision` (`id_admision`),
  ADD KEY `fk_eval_med_usuario` (`usuario_registra`);

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`id_habitacion`),
  ADD KEY `fk_habitacion_ala` (`id_ala`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id_medico`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`dni`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `dni_paciente` (`dni_paciente`),
  ADD KEY `id_medico` (`id_medico`),
  ADD KEY `usuario_registra` (`usuario_registra`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admisiones`
--
ALTER TABLE `admisiones`
  MODIFY `id_admision` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `alas`
--
ALTER TABLE `alas`
  MODIFY `id_ala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `altas`
--
ALTER TABLE `altas`
  MODIFY `id_alta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `camas`
--
ALTER TABLE `camas`
  MODIFY `id_cama` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `emergencias`
--
ALTER TABLE `emergencias`
  MODIFY `id_emergencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `evaluacion_enfermeria`
--
ALTER TABLE `evaluacion_enfermeria`
  MODIFY `id_eval_enf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `evaluacion_medica`
--
ALTER TABLE `evaluacion_medica`
  MODIFY `id_eval_med` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `id_habitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id_medico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admisiones`
--
ALTER TABLE `admisiones`
  ADD CONSTRAINT `fk_admision_cama` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id_cama`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_admision_paciente` FOREIGN KEY (`dni_paciente`) REFERENCES `pacientes` (`dni`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_admision_usuario` FOREIGN KEY (`usuario_registra`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `altas`
--
ALTER TABLE `altas`
  ADD CONSTRAINT `fk_alta_admision` FOREIGN KEY (`id_admision`) REFERENCES `admisiones` (`id_admision`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_alta_usuario` FOREIGN KEY (`usuario_registra`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `camas`
--
ALTER TABLE `camas`
  ADD CONSTRAINT `fk_cama_habitacion` FOREIGN KEY (`id_habitacion`) REFERENCES `habitaciones` (`id_habitacion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `emergencias`
--
ALTER TABLE `emergencias`
  ADD CONSTRAINT `emergencias_ibfk_1` FOREIGN KEY (`id_cama`) REFERENCES `camas` (`id_cama`),
  ADD CONSTRAINT `emergencias_ibfk_2` FOREIGN KEY (`dni_paciente`) REFERENCES `pacientes` (`dni`);

--
-- Filtros para la tabla `evaluacion_enfermeria`
--
ALTER TABLE `evaluacion_enfermeria`
  ADD CONSTRAINT `fk_eval_enf_admision` FOREIGN KEY (`id_admision`) REFERENCES `admisiones` (`id_admision`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eval_enf_usuario` FOREIGN KEY (`usuario_registra`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `evaluacion_medica`
--
ALTER TABLE `evaluacion_medica`
  ADD CONSTRAINT `fk_eval_med_admision` FOREIGN KEY (`id_admision`) REFERENCES `admisiones` (`id_admision`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eval_med_usuario` FOREIGN KEY (`usuario_registra`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `fk_habitacion_ala` FOREIGN KEY (`id_ala`) REFERENCES `alas` (`id_ala`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`dni_paciente`) REFERENCES `pacientes` (`dni`) ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON UPDATE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`usuario_registra`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
