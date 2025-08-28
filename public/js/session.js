// ======================= LOGIN =======================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    alert("Bienvenido " + username);
    window.location.reload(); // recarga para mostrar los cambios de sesión
  } else {
    alert("Error: " + data.message);
  }
});

// ===================== REGISTER ======================
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;
  const role = e.target.role.value;

  const res = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  });

  const data = await res.json();

  if (data.success) {
    alert("Cuenta creada correctamente 🎉");
    window.location.reload(); // inicia sesión al registrarse
  } else {
    alert("Error: " + data.message);
  }
});

// =============== VERIFICAR SESIÓN ACTIVA ================
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/auth/session");
    const data = await res.json();

    if (data.loggedIn) {
      const userActions = document.querySelector(".user-actions");

      if (userActions) {
        userActions.innerHTML = `
          <div class="welcome-message">👋 Hola, <strong>${data.user}</strong></div>
          <a href="perfil.html" class="btn btn-outline">Mi Perfil</a>
          <button id="logoutBtn" class="btn btn-outline">Cerrar sesión</button>
        `;

        document.getElementById("logoutBtn").addEventListener("click", async () => {
          await fetch("/auth/logout", { method: "POST" });
          location.reload();
        });
      }
    }
  } catch (err) {
    console.error("Error al verificar la sesión:", err);
  }
});
