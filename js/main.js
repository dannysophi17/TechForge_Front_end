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

function validarFormularioContacto() {
  const nombre = document.getElementById("nombre")?.value.trim();
  const email = document.getElementById("correo")?.value.trim();
  const mensaje = document.getElementById("mensaje")?.value.trim();
  if (!nombre || !email || !mensaje) {
    alert("Por favor completa todos los campos requeridos.");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", async () => {
  await includeHTML("header-container", "components/header.html");

  const loginIconLinks = document.querySelectorAll('a[href="#login"]');
  loginIconLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const modal = document.getElementById("loginModal");
      const container = document.getElementById("login-container");

      if (container.innerHTML.trim() === "") {
        const res = await fetch("components/login.html");
        const html = await res.text();
        container.innerHTML = html;

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

        const togglePassword = container.querySelector("#togglePassword");
        const passwordInput = container.querySelector("#password");
        togglePassword?.addEventListener("click", () => {
          const type = passwordInput.type === "password" ? "text" : "password";
          passwordInput.type = type;
          togglePassword.classList.toggle("fa-eye");
          togglePassword.classList.toggle("fa-eye-slash");
        });

        const form = container.querySelector("#loginForm");
        form?.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = form.email.value.trim();
          const password = form.password.value.trim();
          if (!email || !password) {
            document.getElementById("loginMessage").textContent = "Todos los campos son obligatorios.";
            return;
          }
          localStorage.setItem("usuarioLogueado", email);
          document.getElementById("loginMessage").textContent = "¡Bienvenido, " + email + "!";
        });

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
              // Aquí se podría integrar con backend luego
              alert("Registro exitoso (solo frontend)");
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

  await includeHTML("hero-container", "components/hero.html");
  await includeHTML("about-container", "components/about.html");
  await includeHTML("services-container", "components/services.html");
  await includeHTML("portfolio-container", "components/portafolio.html");
  await includeHTML("testimonials-container", "components/testimonials.html");
  await includeHTML("contact-container", "components/contact.html");
  await includeHTML("footer-container", "components/footer.html");

  let lastScrollTop = 0;
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      navbar.style.top = (scrollTop > lastScrollTop) ? "-100px" : "0";
      lastScrollTop = Math.max(scrollTop, 0);
    });
  }

  setTimeout(() => {
    const form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validarFormularioContacto()) return;
        alert("Mensaje listo para ser enviado. (Conexión backend desactivada)");
        form.reset();
      });
    }
  }, 300);

  const btnTop = document.getElementById("backToTop");
  if (btnTop) {
    window.addEventListener("scroll", () => {
      btnTop.style.display = window.scrollY > 300 ? "block" : "none";
    });
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    let current = "";
    sections.forEach(section => {
      const top = window.scrollY;
      const offset = section.offsetTop - 100;
      const height = section.offsetHeight;
      if (top >= offset && top < offset + height) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  const animar = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__fadeInUp");
      }
    });
  });
  animar.forEach(el => observer.observe(el));
});







