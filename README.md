HIS - Hospital Information System

Programación Web II

Sistema de gestión hospitalaria desarrollado como Trabajo Práctico Integrador para la materia "Programación Web II".

El objetivo del proyecto es administrar el proceso de internación de pacientes dentro de un hospital, permitiendo gestionar camas, admisiones, evaluaciones médicas y de enfermería, altas hospitalarias, historial clínico y usuarios del sistema mediante una aplicación web desarrollada completamente del lado del servidor.


Tecnologías utilizadas

* Node.js
* Express.js
* PUG
* MySQL
* MySQL2
* express-session
* bcryptjs
* HTML5
* CSS3
* JavaScript


Funcionalidades

 Autenticación

* Inicio de sesión mediante usuario y contraseña.
* Contraseñas encriptadas con bcrypt.
* Manejo de sesiones mediante express-session.
* Control de acceso según el rol del usuario.



 Gestión de Pacientes

Permite:

* Registrar pacientes.
* Modificar información.
* Buscar pacientes.
* Consultar historial.



 Gestión de Camas

El sistema administra:

* Alas hospitalarias.
* Habitaciones.
* Camas.

Cada cama puede encontrarse en alguno de los siguientes estados:

* Libre
* Ocupada
* Higienizando

Además permite:

* Asignar pacientes.
* Liberar camas.
* Visualizar disponibilidad.
* Filtrar camas por estado.


Admisiones

Permite registrar una nueva internación indicando:

* Paciente
* Motivo
* Fecha de ingreso
* Cama asignada



Emergencias

Permite registrar a pacientes no identificados.

Incluye:

* Código temporal
* Descripción del paciente
* Identificación posterior
* Asignación de cama



Evaluación Inicial de Enfermería

Registro de información clínica inicial:

* Signos vitales
* Peso
* Talla
* Alergias
* Antecedentes
* Observaciones



Evaluación Médica

Permite registrar:

* Diagnóstico
* Tratamiento
* Medicación
* Indicaciones médicas


Historial Clínico

El sistema conserva el historial completo del paciente, mostrando:

* Internaciones
* Evaluaciones de enfermería
* Evaluaciones médicas
* Altas hospitalarias


Altas Hospitalarias

Permite registrar:

* Fecha de alta
* Motivo
* Resumen clínico

Al finalizar una internación:

* se libera automáticamente la cama
* la cama pasa al estado Higienizando


Gestión de Usuarios

Cada usuario posee:

* Nombre
* Apellido
* DNI
* Matrícula (si corresponde)
* Correo electrónico
* Usuario
* Contraseña
* Rol

También puede:

* Editar perfil
* Cambiar contraseña
* Cambiar rol


Roles del sistema

# Administrador

Acceso completo al sistema.


# Admisión

Puede acceder a:

* Pacientes
* Camas
* Admisiones
* Turnos
* Médicos

No puede acceder a:

* Enfermería
* A medicar
* Historial Clínico
* Altas


# Enfermería

Puede acceder a:

* Pacientes
* Camas
* Enfermería
* Historial Clínico
* Turnos
* Altas

No puede acceder a:

* Admisiones
* A medicar

# Médico

Puede acceder a:

* Pacientes
* Camas
* A medicar
* Historial Clínico
* Turnos
* Altas

No puede acceder a:

* Admisiones
* Enfermería


# Limpieza

Puede acceder únicamente a:

* Camas

Visualiza solamente las camas para gestionar el estado de higienización.


Seguridad

El sistema implementa:

* Contraseñas cifradas con bcrypt.
* Sesiones mediante express-session.
* Middleware de autenticación.
* Middleware por roles.
* Validaciones de formularios.
* Consultas SQL parametrizadas para evitar SQL Injection.


# Instalación

1. Clonar el proyecto

git clone "https://github.com/Luly-bitcoin/Hospital.git"


2. Instalar dependencias

npm install

3. Configurar la base de datos

Crear la base de datos MySQL e importar el script SQL correspondiente.

Configurar la conexión en:

config/db.js

4. Ejecutar el servidor

node app.js



Autor

# Lourdes

Trabajo Práctico Integrador

Programación Web II

Universidad de La Punta

2025-2026
