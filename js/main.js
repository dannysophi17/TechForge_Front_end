/* =========================
   Utilidad para incluir HTML
   ========================= */
async function includeHTML(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error(`No se pudo cargar ${file}:`, error.message);
  }
}

/* =========================
   Validación simple del form
   ========================= */
function validarFormularioContacto() {
  const nombre = document.getElementById("nombre")?.value.trim();
  const email = document.getElementById("correo")?.value.trim();
  const mensaje = document.getElementById("mensaje")?.value.trim();
  if (!nombre || !email || !mensaje) {
    pushToast({ body: "Por favor completa todos los campos requeridos.", variant: "warning" });
    return false;
  }
  return true;
}

/* =========================
   Helper: Toast (Bootstrap 5)
   ========================= */
function pushToast({ body = "", variant = "primary", delay = 5000 } = {}) {
  const holder = document.getElementById("toast-holder");
  if (!holder) return alert(body); // fallback

  const el = document.createElement("div");
  el.className = "toast align-items-center text-white border-0";
  el.classList.add(`bg-${variant}`);
  el.setAttribute("role", "alert");
  el.setAttribute("aria-live", "assertive");
  el.setAttribute("aria-atomic", "true");

  el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${body}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" 
              data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  holder.appendChild(el);

  const toast = bootstrap.Toast.getOrCreateInstance(el, { delay, autohide: true });
  toast.show();

  el.addEventListener("hidden.bs.toast", () => el.remove());
}

/* =========================
   App
   ========================= */
document.addEventListener("DOMContentLoaded", async () => {
  // Cargar header primero (para que el ícono de login exista)
  await includeHTML("header-container", "components/header.html");

  // Abrir modal login al hacer click en el icono
  const loginIconLinks = document.querySelectorAll('a[href="#login"]');
  loginIconLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const modal = document.getElementById("loginModal");
      const container = document.getElementById("login-container");

      if (container.innerHTML.trim() === "") {
        const res = await fetch("components/login.html");
        const html = await res.text();
        container.innerHTML = html;

        // Cerrar modal
        const closeBtn = container.querySelector("#closeLogin");
        closeBtn?.addEventListener("click", () => {
          const box = container.querySelector(".login-box-modern");
          modal.classList.add("fade-out");
          box.classList.add("closing");
          setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("fade-out");
            container.innerHTML = "";
            document.body.classList.remove("no-scroll");
          }, 400);
        });

        // Mostrar/ocultar password
        const togglePassword = container.querySelector("#togglePassword");
        const passwordInput = container.querySelector("#password");
        togglePassword?.addEventListener("click", () => {
          const type = passwordInput.type === "password" ? "text" : "password";
          passwordInput.type = type;
          togglePassword.classList.toggle("fa-eye");
          togglePassword.classList.toggle("fa-eye-slash");
        });

        // Login submit (solo demo)
        const form = container.querySelector("#loginForm");
        form?.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = form.email.value.trim();
          const password = form.password.value.trim();
          if (!email || !password) {
            document.getElementById("loginMessage").textContent =
              "Todos los campos son obligatorios.";
            return;
          }
          localStorage.setItem("usuarioLogueado", email);
          document.getElementById("loginMessage").textContent = "¡Bienvenido, " + email + "!";
        });

        // Ir a registro
        const openRegister = container.querySelector("#openRegister");
        openRegister?.addEventListener("click", async (e) => {
          e.preventDefault();
          modal.classList.add("fade-out");
          setTimeout(async () => {
            container.innerHTML = "";
            modal.classList.remove("fade-out");
            const res = await fetch("components/register.html");
            const html = await res.text();
            container.innerHTML = html;

            const closeBtn = container.querySelector("#closeRegister");
            closeBtn?.addEventListener("click", () => {
              const box = container.querySelector(".login-box-modern");
              modal.classList.add("fade-out");
              box.classList.add("closing");
              setTimeout(() => {
                modal.style.display = "none";
                modal.classList.remove("fade-out");
                container.innerHTML = "";
                document.body.classList.remove("no-scroll");
              }, 400);
            });

            const togglePassword = container.querySelector("#togglePassword");
            const passwordInput = container.querySelector("#password");
            togglePassword?.addEventListener("click", () => {
              const type = passwordInput.type === "password" ? "text" : "password";
              passwordInput.type = type;
              togglePassword.classList.toggle("fa-eye");
              togglePassword.classList.toggle("fa-eye-slash");
            });

            const registerForm = container.querySelector("#registerForm");
            registerForm?.addEventListener("submit", (e) => {
              e.preventDefault();
              pushToast({ body: "Registro exitoso (solo frontend)", variant: "success" });
              registerForm.reset();
            });

            modal.style.display = "flex";
          }, 400);
        });
      }

      modal.style.display = "flex";
      document.body.classList.add("no-scroll");
    });
  });

  // Cargar el resto de secciones
  await includeHTML("hero-container", "components/hero.html");
  await includeHTML("about-container", "components/about.html");
  await includeHTML("services-container", "components/services.html");
  await includeHTML("portfolio-container", "components/portafolio.html");
  await includeHTML("testimonials-container", "components/testimonials.html");
  await includeHTML("contact-container", "components/contact.html");
  await includeHTML("footer-container", "components/footer.html");

  // Navbar hide/show on scroll
  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      navbar.style.top = scrollTop > lastScrollTop ? "-100px" : "0";
      lastScrollTop = Math.max(scrollTop, 0);
    });
  }

  // Esperar a que se inyecte el contact.html y enganchar el submit
  setTimeout(() => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // Honeypot anti-spam
    const trap = document.createElement("input");
    trap.type = "text";
    trap.name = "_honey";
    trap.style.display = "none";
    trap.tabIndex = -1;
    form.appendChild(trap);

    // Estado de "enviando" en el botón
    const setLoading = (isLoading) => {
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = isLoading;
      btn.style.opacity = isLoading ? 0.7 : 1;
      btn.innerHTML = isLoading
        ? '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...'
        : '<i class="fas fa-paper-plane me-2"></i>Enviar mensaje';
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validarFormularioContacto()) return;

      const payload = {
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("correo").value.trim(),
        asunto: document.getElementById("asunto")?.value.trim() || "",
        mensaje: document.getElementById("mensaje").value.trim(),
        _subject: "Nuevo mensaje desde Techforge",
        _captcha: "false",
        _template: "table"
        // _next: "https://www.techforges.com/#contacto"
      };

      try {
        setLoading(true);

        const res = await fetch(
          "https://formsubmit.co/ajax/eduardo.coavas@techforges.com",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );

        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          pushToast({ body: "¡Gracias! Tu mensaje fue enviado.", variant: "success" });
          form.reset();
        } else {
          console.error("FormSubmit error:", data);
          pushToast({
            body: "No se pudo enviar tu mensaje. Intenta más tarde.",
            variant: "danger"
          });
        }
      } catch (err) {
        console.error(err);
        pushToast({ body: "Error de conexión. Intenta más tarde.", variant: "danger" });
      } finally {
        setLoading(false);
      }
    });
  }, 300);

  // Botón volver arriba
  const btnTop = document.getElementById("backToTop");
  if (btnTop) {
    window.addEventListener("scroll", () => {
      btnTop.style.display = window.scrollY > 300 ? "block" : "none";
    });
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Resaltar en navbar la sección visible
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    let current = "";
    sections.forEach((section) => {
      const top = window.scrollY;
      const offset = section.offsetTop - 100;
      const height = section.offsetHeight;
      if (top >= offset && top < offset + height) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Animaciones on scroll
  const animar = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__fadeInUp");
      }
    });
  });
  animar.forEach((el) => observer.observe(el));
});








