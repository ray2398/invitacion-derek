/* =====================================================================
   INVITACIÓN CARS · BAUTIZO Y 2° CUMPLEAÑOS DE DEREK
   script.js — JavaScript Vanilla (sin frameworks)

   >>> TODA LA INFORMACIÓN EDITABLE ESTÁ AQUÍ ARRIBA <<<
   Cambia los valores del objeto CONFIG y la invitación se actualiza sola.
   ===================================================================== */

const CONFIG = {
  /* ---- Datos del niño y evento ---- */
  nombreNino: "Derek",
  fechaEvento: "2026-07-26T15:00:00",   // Domingo 26 de Julio, 12:00 PM (formato AAAA-MM-DDTHH:MM:SS)
  fechaTexto: "Domingo 26 de Julio",     // Texto que se muestra en pantalla

  /* ---- Padres y padrinos ---- */
  mama:    "Danna Lárraga",
  papa:    "Raymundo Aparicio",
  madrina: "Mayra Lárraga",
  padrino: "Emmanuel Diez",

  /* ---- Ceremonia religiosa ---- */
  parroquia:        "Parroquia de San Francisco de Asís",
  horaIglesia:      "12:00 PM",
  coordenadasIglesia: "20.4575283,-97.0865872",   // "LAT,LNG" (respaldo)
  // Si hay link completo de Google Maps, se usa este en lugar de las coordenadas:
  linkIglesia: "https://www.google.com/maps/place/IGLESIA+SAN+FRANCISCO+DE+ASIS/@20.4575769,-97.0862402,19.5z/data=!4m12!1m5!3m4!2zMjDCsDI3JzI3LjEiTiA5N8KwMDUnMTEuNyJX!8m2!3d20.4575283!4d-97.0865872!3m5!1s0x85dbb34ef55e71cf:0xb16a7a388fd3cbea!8m2!3d20.457638!4d-97.0861279!16s%2Fg%2F1tdh8t69",

  /* ---- Recepción ---- */
  recepcion:        "Hotel Santa Luisa Finca Boutique",
  horaRecepcion:    "3:00 PM",
  coordenadasRecepcion: "20.469315,-97.0822156", // "LAT,LNG" (respaldo)
  linkRecepcion: "https://www.google.com/maps/place/HOTEL+SANTA+LUISA+FINCA+BOUTIQUE/@20.469315,-97.0847905,17z/data=!4m15!1m5!3m4!2zMjDCsDI4JzA5LjUiTiA5N8KwMDQnNTYuMCJX!8m2!3d20.469315!4d-97.0822156!3m8!1s0x85dbb359ba1174c7:0x2f7adcd34ad45178!5m2!4m1!1i2!8m2!3d20.4693168!4d-97.0812171!16s%2Fg%2F1tkc70px",

  /* ---- Mesa de regalos ---- */
  numeroLiverpool:  "60007208",
  linkMesaRegalos:  "https://mesaderegalos.liverpool.com.mx/milistaderegalos/60007208",

  /* ---- Confirmación por WhatsApp ---- */
  telefonoConfirmacion: "527661136849", // 52 (México) + 10 dígitos, sin espacios
  mensajeWhatsapp: "¡Hola! 🚗 Confirmo mi asistencia al cumpleaños de Derek 🏁❤️ ¡Gracias por la invitación!",

  /* ---- Música de fondo ---- */
  cancion: "assets/audio/sh-boom.mp3",   // reemplaza el archivo localmente si quieres otra
  autoIntentarMusica: true               // intenta reproducir al primer toque/clic del usuario
};


/* =====================================================================
   1) Inyectar datos del CONFIG en el HTML
   ===================================================================== */
function setText(id, value){ const el = document.getElementById(id); if(el) el.textContent = value; }

document.addEventListener("DOMContentLoaded", () => {
  setText("fecha-texto", CONFIG.fechaTexto);
  setText("mama", CONFIG.mama);
  setText("papa", CONFIG.papa);
  setText("madrina", CONFIG.madrina);
  setText("padrino", CONFIG.padrino);
  setText("parroquia", CONFIG.parroquia);
  setText("hora-iglesia", CONFIG.horaIglesia);
  setText("recepcion", CONFIG.recepcion);
  setText("hora-recepcion", CONFIG.horaRecepcion);
  setText("liverpool-num", CONFIG.numeroLiverpool);

  const audio = document.getElementById("bg-audio");
  if (audio) audio.querySelector("source").src = CONFIG.cancion;

  initCountdown();
  initReveal();
  initMaps();
  initGifts();
  initWhatsApp();
  initMusic();
  initTopButton();
  initScrollProgress();
  launchConfetti();
});


/* =====================================================================
   2) Cuenta regresiva
   ===================================================================== */
function initCountdown(){
  const target = new Date(CONFIG.fechaEvento).getTime();
  const d = document.getElementById("cd-d"), h = document.getElementById("cd-h"),
        m = document.getElementById("cd-m"), s = document.getElementById("cd-s"),
        gauges = document.getElementById("gauges"), raceDay = document.getElementById("race-day");
  const pad = n => (n < 10 ? "0" : "") + n;

  function tick(){
    const diff = target - Date.now();
    if (diff <= 0){
      if (gauges) gauges.style.display = "none";
      if (raceDay) raceDay.style.display = "block";
      return;
    }
    const sec = Math.floor(diff / 1000);
    d.textContent = pad(Math.floor(sec / 86400));
    h.textContent = pad(Math.floor((sec % 86400) / 3600));
    m.textContent = pad(Math.floor((sec % 3600) / 60));
    s.textContent = pad(sec % 60);
  }
  tick();
  setInterval(tick, 1000);
}


/* =====================================================================
   3) Aparición progresiva al hacer scroll (IntersectionObserver)
   ===================================================================== */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { threshold: 0.18 });
  items.forEach(el => obs.observe(el));
}


/* =====================================================================
   4) Botones "Ver Ubicación" → Google Maps
   ===================================================================== */
function initMaps(){
  document.querySelectorAll(".map-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const which = btn.getAttribute("data-map");
      const link = which === "iglesia" ? CONFIG.linkIglesia : CONFIG.linkRecepcion;
      const coords = which === "iglesia" ? CONFIG.coordenadasIglesia : CONFIG.coordenadasRecepcion;
      const url = link ? link : ("https://maps.google.com/?q=" + encodeURIComponent(coords));
      window.location.href = url; // navega en la misma pestaña (abre la app de Maps si está instalada)
    });
  });
}


/* =====================================================================
   5) Mesa de regalos Liverpool
   ===================================================================== */
function initGifts(){
  const btn = document.getElementById("btn-liverpool");
  if (btn) btn.addEventListener("click", () => { window.location.href = CONFIG.linkMesaRegalos; });
}


/* =====================================================================
   6) Confirmar asistencia por WhatsApp
   ===================================================================== */
function initWhatsApp(){
  const btn = document.getElementById("btn-confirmar");
  if (btn) btn.addEventListener("click", () => {
    const url = "https://wa.me/" + CONFIG.telefonoConfirmacion +
                "?text=" + encodeURIComponent(CONFIG.mensajeWhatsapp);
    window.location.href = url; // navega en la misma pestaña (abre WhatsApp si está instalado)
  });
}


/* =====================================================================
   7) Música de fondo (botón flotante)
   ===================================================================== */
function initMusic(){
  const audio = document.getElementById("bg-audio");
  const btn = document.getElementById("music-btn");
  if (!audio || !btn) return;

  function toggle(){
    if (audio.paused){
      audio.play().then(() => btn.classList.add("playing")).catch(() => {});
    } else {
      audio.pause();
      btn.classList.remove("playing");
    }
  }
  btn.addEventListener("click", toggle);

  // Intento de reproducción automática tras la primera interacción (políticas del navegador)
  if (CONFIG.autoIntentarMusica){
    const tryPlay = () => {
      audio.play().then(() => btn.classList.add("playing")).catch(() => {});
      window.removeEventListener("pointerdown", tryPlay);
    };
    window.addEventListener("pointerdown", tryPlay, { once: true });
  }
}


/* =====================================================================
   8) Botón "Volver arriba"
   ===================================================================== */
function initTopButton(){
  const btn = document.getElementById("top-btn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.pageYOffset > 600);
  }, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}


/* =====================================================================
   9) Barra de progreso de scroll + parallax suave
   ===================================================================== */
function initScrollProgress(){
  const bar = document.getElementById("scroll-progress");
  const layers = Array.prototype.slice.call(document.querySelectorAll("[data-depth]"));
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  let ticking = false;

  function update(){
    const y = window.pageYOffset;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

    if (!reduce){
      for (const el of layers){
        const r = el.getBoundingClientRect();
        if (r.bottom > -200 && r.top < window.innerHeight + 200){
          const depth = parseFloat(el.getAttribute("data-depth")) || 0;
          el.style.transform = "translate3d(0," + (y * depth) + "px,0)";
        }
      }
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking){ window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}


/* =====================================================================
   10) Confeti al cargar (canvas ligero, sin librerías)
   ===================================================================== */
function launchConfetti(){
  if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#D62828", "#F4D03F", "#2874A6", "#ffffff", "#111111"];
  const pieces = [];
  for (let i = 0; i < 140; i++){
    pieces.push({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: 5 + Math.random() * 7,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 4,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: -0.1 + Math.random() * 0.2
    });
  }

  const start = performance.now();
  function frame(now){
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of pieces){
      p.y += p.vy; p.x += p.vx; p.rot += p.vr;
      if (p.y < H + 20) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    }
    // Cae durante ~4.5s y luego se detiene para no consumir recursos
    if (alive && now - start < 4500){
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }
  requestAnimationFrame(frame);
}
