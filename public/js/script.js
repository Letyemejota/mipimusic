// ============================
// Reproductor de música - script.js
// ============================

// Lista de canciones
const songs = [
  {
    title: "Si No Es Contigo",
    artist: "Cris Mj",
    src: "musica/si_no_es_contigo.mp3",
    cover: "Imagenes/Si No Es Contigo.jpg",
  },
  {
    title: "Safaera",
    artist: "Bad Bunny, Jowell & Randy, Ñengo Flow",
    src: "musica/safaera.mp3",
    cover: "Imagenes/Safaera.jpg",
  },
  {
    title: "Timeless",
    artist: "The Weeknd",
    src: "musica/timeless.mp3",
    cover: "Imagenes/Timeless.jpg",
  }
];

// Elementos del DOM
const audio = document.getElementById("audioPlayer");
const masterPlay = document.getElementById("masterPlay");
const fixedPlay = document.getElementById("fixedPlay");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const seekBar = document.getElementById("seekBar");

const trackCover = document.querySelector(".track_cover");
const trackTitle = document.querySelector(".track_title");
const trackArtist = document.querySelector(".track_artist");
const fixedTitle = document.getElementById("fixedTitle");

const songItems = document.querySelectorAll(".songItem i");

let currentIndex = 0;
let isPlaying = false;

// Cargar canción
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  trackCover.src = song.cover;
  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;
  fixedTitle.textContent = `${song.title} - ${song.artist}`;
}

// Reproducir
function playSong() {
  audio.play();
  isPlaying = true;
  masterPlay.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
  fixedPlay.classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
}

// Pausar
function pauseSong() {
  audio.pause();
  isPlaying = false;
  masterPlay.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
  fixedPlay.classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
}

// Alternar reproducción
function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

// Cambiar canción
function changeSong(direction) {
  currentIndex = (currentIndex + direction + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

// Actualizar barra de progreso
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  seekBar.value = progress || 0;
});

// Cambiar posición de la canción con el slider
seekBar.addEventListener("input", () => {
  const seekTo = (seekBar.value / 100) * audio.duration;
  audio.currentTime = seekTo;
});

// Controles principales
masterPlay.addEventListener("click", togglePlay);
fixedPlay.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", () => changeSong(-1));
nextBtn.addEventListener("click", () => changeSong(1));

// Elegir canción desde el menú lateral
songItems.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    currentIndex = index;
    loadSong(currentIndex);
    playSong();
  });
});

// Al terminar una canción, ir a la siguiente
audio.addEventListener("ended", () => changeSong(1));

// Cargar primera canción al iniciar
window.addEventListener("DOMContentLoaded", () => {
  loadSong(currentIndex);
});
