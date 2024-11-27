<?php
$servidor = "localhost";
$usuario = "root"; // Cambia a tu usuario de base de datos
$clave = "";       // Cambia a tu contraseña de base de datos
$bd = "formularios_ia";

// Crear la conexión
$conexion = new mysqli($servidor, $usuario, $clave, $bd);

// Verificar la conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>
