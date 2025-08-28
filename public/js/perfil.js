window.addEventListener("load", () => {
  document.querySelector(".fade-in")?.classList.add("show");
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // ====== SESIÓN ======
    const res = await fetch("/auth/session");
    const data = await res.json();

    if (!data.loggedIn) {
      alert("Necesitás iniciar sesión para ver tu perfil.");
      return window.location.href = "index.html";
    }

    const username = data.user;
    document.getElementById("welcomeUser").innerHTML = `¡Bienvenido, <strong>${username}</strong>!`;
    document.getElementById("dropdownUsername").textContent = username;

    // ====== AVATAR ======
    const avatar = document.getElementById("avatar");
    const avatarInput = document.getElementById("avatarInput");
    const deleteIcon = document.getElementById("deleteAvatar");
    const avatarKey = `avatarImage_${username}`;

    const savedAvatar = localStorage.getItem(avatarKey);
    avatar.src = savedAvatar || "Imagenes/user.png";
    deleteIcon.style.display = savedAvatar ? "block" : "none";

    document.getElementById("avatarWrapper").addEventListener("click", (e) => {
      if (e.target.id !== "deleteAvatar") avatarInput.click();
    });

    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        avatar.src = reader.result;
        localStorage.setItem(avatarKey, reader.result);
        deleteIcon.style.display = "block";
      };
      reader.readAsDataURL(file);
    });

    deleteIcon.addEventListener("click", (e) => {
      e.stopPropagation(); // evitar que dispare el click del wrapper
      localStorage.removeItem(avatarKey);
      avatar.src = "Imagenes/user.png";
      deleteIcon.style.display = "none";
    });

    // ====== BANNER ======
    const bannerImg = document.getElementById("bannerImg");
    const bannerInput = document.getElementById("bannerInput");
    const bannerKey = `bannerImage_${username}`;

    const savedBanner = localStorage.getItem(bannerKey);
    bannerImg.src = savedBanner || "Imagenes/banner-default.jpg";

    bannerInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        bannerImg.src = reader.result;
        localStorage.setItem(bannerKey, reader.result);
      };
      reader.readAsDataURL(file);
    });

    // ====== FAVORITOS ======
    const favKey = `favoritos_${username}`;
    let favoritos = JSON.parse(localStorage.getItem(favKey) || "[]");
    const container = document.getElementById("favoritosContainer");

    const renderFavoritos = () => {
      if (favoritos.length === 0) {
        container.innerHTML = `<p style="color: gray;">Todavía no tenés artistas guardados.</p>`;
      } else {
        container.innerHTML = favoritos.map(nombre => `
          <div class="artist-card">
            <strong>${nombre}</strong>
            <button class="remove-fav" data-nombre="${nombre}">Quitar</button>
          </div>
        `).join("");

        document.querySelectorAll(".remove-fav").forEach(btn => {
          btn.addEventListener("click", () => {
            const nombre = btn.getAttribute("data-nombre");
            favoritos = favoritos.filter(n => n !== nombre);
            localStorage.setItem(favKey, JSON.stringify(favoritos));
            renderFavoritos();
          });
        });
      }
    };

    renderFavoritos();

    // ====== LOGOUT ======
    const logout = async () => {
      await fetch("/auth/logout", { method: "POST" });
      window.location.href = "index.html";
    };

    document.getElementById("logoutBtnHeader")?.addEventListener("click", logout);

    // ====== DROPDOWN ======
    const dropdownMenu = document.getElementById("dropdownMenu");
    const dropdownToggle = document.getElementById("userDropdown");

    dropdownToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu")) {
        dropdownMenu.classList.remove("show");
      }
    });

    // ====== TABS SPA (Mostrar sólo el activo) ======
    const tabs = document.querySelectorAll(".profile-tabs a");
    const cards = document.querySelectorAll(".profile-content .card");

    const showTab = (tabText) => {
      cards.forEach(card => card.style.display = "none");

      if (tabText.includes("Favoritos")) {
        cards[0].style.display = "block";
      } else if (tabText.includes("Tracks")) {
        cards[1].style.display = "block";
      } else {
        alert(`Sección "${tabText}" aún no disponible.`);
      }
    };

    // Inicializar en la pestaña activa
    const activeTab = document.querySelector(".profile-tabs a.active");
    if (activeTab) showTab(activeTab.textContent);

    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        showTab(tab.textContent);
      });
    });

  } catch (err) {
    console.error("Error en perfil:", err);
    document.getElementById("welcomeUser").textContent = "Error al cargar perfil.";
  }
});
