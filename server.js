const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const User = require('./models/User'); // Asegurate de tener este archivo bien hecho

const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mipimusic', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('🟢 Conectado a MongoDB')).catch(err => console.error(err));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'clave-secreta-mipi',
    resave: false,
    saveUninitialized: false
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ----------- AUTENTICACIÓN ------------

// REGISTRO
app.post("/auth/register", async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const userExist = await User.findOne({ username });
        if (userExist) return res.json({ success: false, message: "El usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();

        req.session.user = username;
        req.session.role = role;

        res.json({ success: true, user: username, role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
});

// LOGIN
app.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.json({ success: false, message: "Credenciales incorrectas" });
        }

        req.session.user = username;
        req.session.role = user.role;

        res.json({ success: true, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
});

// SESIÓN ACTIVA
app.get("/auth/session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user, role: req.session.role });
    } else {
        res.json({ loggedIn: false });
    }
});

// CERRAR SESIÓN
app.post("/auth/logout", (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ----------- SUBIDA DE ARCHIVOS (MULTER) ------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.post("/subir", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]), (req, res) => {
    const { titulo, descripcion } = req.body;
    const cover = req.files.cover?.[0]?.filename;
    const audio = req.files.audio?.[0]?.filename;

    console.log("🎵 Nuevo tema:", titulo, descripcion, cover, audio);
    res.json({ success: true });
});

// ----------- HOME ------------


// ----------- ARRANQUE ------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Error al iniciar el servidor:', err);
});

