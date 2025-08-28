// ----------------------------------------------
// main.js completo con carga dinámica y buscador
// ----------------------------------------------

// --------------------
// MODALES: LOGIN / REGISTRO
// --------------------

// Abrir modal de login
document.querySelector('.btn-outline').addEventListener('click', () => {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.add('show');
  loginModal.style.display = 'flex';
  document.getElementById('mainContent').classList.add('blur');
});

// Cerrar modal de login
document.querySelector('.close').addEventListener('click', () => {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.remove('show');
  setTimeout(() => {
    loginModal.style.display = 'none';
    document.getElementById('mainContent').classList.remove('blur');
  }, 300);
});

// Enviar datos de login
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.success) {
    window.location.href = "index pagina 2.html";
  } else {
    alert("Datos incorrectos, papu. Probá de nuevo.");
  }
});

// Abrir modal de registro
document.querySelector('.btn-primary').addEventListener('click', () => {
  const registerModal = document.getElementById('registerModal');
  registerModal.classList.add('show');
  registerModal.style.display = 'flex';
  document.getElementById('mainContent').classList.add('blur');
});

// Cerrar modal de registro
document.querySelector('.close-register').addEventListener('click', () => {
  const registerModal = document.getElementById('registerModal');
  registerModal.classList.remove('show');
  setTimeout(() => {
    registerModal.style.display = 'none';
    document.getElementById('mainContent').classList.remove('blur');
  }, 300);
});

// Enviar datos de registro (con rol)
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  const role = document.getElementById("userRole").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });

  const data = await res.json();
  if (data.success) {
    window.location.href = "index pagina 2.html";
  } else {
    alert(data.message || "No se pudo registrar. Intenta con otro usuario.");
  }
});

// ----------------------------------------------
// ANIMACIÓN AL SCROLL (fade-in)
// ----------------------------------------------
function revealOnScroll() {
  const elements = document.querySelectorAll(".fade-in");
  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.9) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ----------------------------------------------
// TOGGLE MODO CLARO/OSCURO
// ----------------------------------------------
const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
}

toggleBtn?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const currentTheme = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
});

// ----------------------------------------------
// CARGA DINÁMICA DE ARTISTAS y BUSCADOR EN VIVO
// ----------------------------------------------
async function cargarArtistas() {
  try {
    const res = await fetch("artistas.json");
    const data = await res.json();
    const contenedor = document.getElementById("artistContainer");

    data.forEach((artista) => {
      const card = document.createElement("div");
      card.classList.add("artist-card");
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.innerHTML = `
        <div class="artist-image">
          <img src="${artista.imagen}" alt="${artista.nombre}">
          <div class="artist-verified"><i class="fas fa-check"></i></div>
        </div>
        <div class="artist-info">
          <h3 class="artist-name">${artista.nombre}</h3>
          <p class="artist-genre">${artista.genero}</p>
          <div class="artist-stats">
            <span><i class="fas fa-headphones"></i> ${artista.oyentes}</span>
            <span><i class="fas fa-user-friends"></i> ${artista.seguidores}</span>
          </div>
          <button class="listen-btn">Escuchar ahora</button>
        </div>
      `;
      contenedor.appendChild(card);

      const idx = Array.from(contenedor.children).indexOf(card);
      setTimeout(() => {
        card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, idx * 100);
    });

  } catch (error) {
    console.error("Error al cargar artistas:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cargarArtistas();

  const searchInput = document.getElementById("searchInput");
  const noResults = document.getElementById("noResults");

  searchInput?.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    let encontrados = 0;

    document.querySelectorAll(".artist-card").forEach(card => {
      const nombre = card.querySelector(".artist-name")?.textContent.toLowerCase();
      if (nombre.includes(term)) {
        card.style.display = "block";
        encontrados++;
      } else {
        card.style.display = "none";
      }
    });

    if (noResults) {
      noResults.style.display = (encontrados === 0) ? "block" : "none";
    }
  });
});
