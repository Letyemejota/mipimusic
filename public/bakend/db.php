<?php
$host = "localhost";
$user = "root";
$pass = ""; 
$dbname = "mipimusic";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>
