<?php
// Configuración de base de datos
$host = 'localhost';
$db_usuario = 'root';
$db_contrasena = '123456';
$db_nombre = 'formularios_ia';

// Conexión a la base de datos
$conexion = new mysqli($host, $db_usuario, $db_contrasena, $db_nombre);

// Verificar conexión
if ($conexion->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Error de conexión: ' . $conexion->connect_error]));
}

// Capturar y validar datos
$nombre = trim($conexion->real_escape_string($_POST['nombre']));
$email = trim($conexion->real_escape_string($_POST['email']));
$telefono = trim($conexion->real_escape_string($_POST['telefono']));
$modalidad = 'hibrido'; // Valor por defecto según tu select

// Validaciones del lado del servidor
$errores = [];

if (empty($nombre) || str_word_count($nombre) < 2) {
    $errores[] = 'Nombre inválido';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'Email inválido';
}

if (!preg_match('/^9\d{8}$/', $telefono)) {
    $errores[] = 'Teléfono inválido';
}

// Si hay errores, responder con error
if (!empty($errores)) {
    echo json_encode(['status' => 'error', 'message' => implode(', ', $errores)]);
    $conexion->close();
    exit;
}

// Verificar si el email ya existe
$stmt_check = $conexion->prepare("SELECT id FROM formulario_inscripcion WHERE email = ?");
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$resultado = $stmt_check->get_result();

if ($resultado->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Este correo ya está registrado']);
    $stmt_check->close();
    $conexion->close();
    exit;
}

// Preparar inserción segura
$stmt = $conexion->prepare("INSERT INTO formulario_inscripcion (nombre, email, telefono, modalidad) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $email, $telefono, $modalidad);

// Ejecutar inserción
if ($stmt->execute()) {
    // Enviar correo de confirmación (opcional)
    $asunto = "Inscripción al Diplomado de IA - UNHEVAL";
    $mensaje = "Hola $nombre,\n\nTu inscripción ha sido recibida exitosamente.";
    mail($email, $asunto, $mensaje);

    echo json_encode(['status' => 'success', 'message' => 'Inscripción realizada con éxito']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar la inscripción']);
}

// Cerrar conexiones
$stmt->close();
$conexion->close();
?>