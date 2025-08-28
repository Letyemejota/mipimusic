<?php
session_start();
if ($_SESSION['rol'] != 'admin') {
    header("Location: login.php");
    exit;
}
include("conexion.php");

// Crear
if (isset($_POST['agregar'])) {
    $titulo = $_POST['titulo'];
    $album = $_POST['album'];
    $artista_id = $_POST['artista_id'];

    $conn->query("INSERT INTO canciones (titulo, album, artista_id) VALUES ('$titulo','$album','$artista_id')");
}

// Eliminar
if (isset($_GET['eliminar'])) {
    $id = $_GET['eliminar'];
    $conn->query("DELETE FROM canciones WHERE id=$id");
}

// Editar
if (isset($_POST['editar'])) {
    $id = $_POST['id'];
    $titulo = $_POST['titulo'];
    $album = $_POST['album'];
    $artista_id = $_POST['artista_id'];

    $conn->query("UPDATE canciones SET titulo='$titulo', album='$album', artista_id='$artista_id' WHERE id=$id");
}

// Mostrar canciones
$result = $conn->query("SELECT canciones.id, canciones.titulo, canciones.album, artistas.nombre AS artista 
                        FROM canciones 
                        LEFT JOIN artistas ON canciones.artista_id=artistas.id");
?>

<h2>Panel de Administrador</h2>
<a href="logout.php">Cerrar sesión</a>

<h3>Agregar Canción</h3>
<form method="POST">
    <input type="text" name="titulo" placeholder="Título" required>
    <input type="text" name="album" placeholder="Álbum" required>
    <input type="number" name="artista_id" placeholder="ID Artista" required>
    <button type="submit" name="agregar">Agregar</button>
</form>

<h3>Lista de Canciones</h3>
<table border="1">
    <tr><th>ID</th><th>Título</th><th>Álbum</th><th>Artista</th><th>Acciones</th></tr>
    <?php while($row = $result->fetch_assoc()){ ?>
        <tr>
            <td><?= $row['id'] ?></td>
            <td><?= $row['titulo'] ?></td>
            <td><?= $row['album'] ?></td>
            <td><?= $row['artista'] ?></td>
            <td>
                <a href="panel_admin.php?eliminar=<?= $row['id'] ?>">Eliminar</a>
                <form method="POST" style="display:inline;">
                    <input type="hidden" name="id" value="<?= $row['id'] ?>">
                    <input type="text" name="titulo" value="<?= $row['titulo'] ?>">
                    <input type="text" name="album" value="<?= $row['album'] ?>">
                    <input type="number" name="artista_id" value="<?= $row['artista'] ?>">
                    <button type="submit" name="editar">Editar</button>
                </form>
            </td>
        </tr>
    <?php } ?>
</table>
