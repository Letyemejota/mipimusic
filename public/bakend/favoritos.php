<?php
session_start();
include 'db.php';

if (!isset($_SESSION["user_id"])) {
    die("No logueado");
}

$user_id = $_SESSION["user_id"];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title = $_POST["title"];
    $artist = $_POST["artist"];
    $src = $_POST["src"];
    $cover = $_POST["cover"];

    $stmt = $conn->prepare("INSERT INTO favoritos (user_id, song_title, song_artist, song_src, song_cover) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $user_id, $title, $artist, $src, $cover);
    $stmt->execute();
    $stmt->close();

    echo "Favorito agregado";
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $result = $conn->query("SELECT * FROM favoritos WHERE user_id = $user_id");
    $favoritos = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($favoritos);
}
?>
