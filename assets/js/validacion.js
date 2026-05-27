// ======================================
// VALIDACIÓN FORMULARIO CONTACTO
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  const formulario = document.getElementById("form-contacto");
  const respuesta = document.getElementById("respuesta");

  // Verificar si existe el formulario
  if (!formulario) return;

  formulario.addEventListener("submit", (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const mensaje = document.getElementById("mensaje");

    let valido = true;

    // Limpiar errores anteriores
    limpiarErrores([nombre, correo, mensaje]);

    respuesta.innerHTML = "";

    // ======================================
    // VALIDAR NOMBRE
    // ======================================

    if (nombre.value.trim().length < 3) {

      mostrarError(nombre, "El nombre debe tener mínimo 3 caracteres");

      valido = false;
    }

    // ======================================
    // VALIDAR CORREO
    // ======================================

    if (correo.value.trim() === "") {

      mostrarError(correo, "El correo es obligatorio");

      valido = false;

    } else if (!validarCorreo(correo.value)) {

      mostrarError(correo, "Ingresa un correo válido");

      valido = false;
    }

    // ======================================
    // VALIDAR MENSAJE
    // ======================================

    if (mensaje.value.trim().length < 10) {

      mostrarError(mensaje, "El mensaje debe tener mínimo 10 caracteres");

      valido = false;
    }

    // ======================================
    // FORMULARIO CORRECTO
    // ======================================

    if (valido) {

      respuesta.innerHTML = `
        <div class="alert alert-success mt-3">
          ✔ Formulario enviado correctamente
        </div>
      `;

      console.log("Formulario enviado");

      formulario.reset();

    } else {

      respuesta.innerHTML = `
        <div class="alert alert-danger mt-3">
          ❌ Corrige los errores del formulario
        </div>
      `;
    }

  });

});

// ======================================
// VALIDAR CORREO
// ======================================

function validarCorreo(correo) {

  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  return regex.test(correo);
}

// ======================================
// MOSTRAR ERROR
// ======================================

function mostrarError(input, mensaje) {

  input.classList.add("is-invalid");

  // Evitar mensajes duplicados
  if (!input.parentNode.querySelector(".invalid-feedback")) {

    const feedback = document.createElement("div");

    feedback.className = "invalid-feedback";

    feedback.textContent = mensaje;

    input.parentNode.appendChild(feedback);
  }
}

// ======================================
// LIMPIAR ERRORES
// ======================================

function limpiarErrores(inputs) {

  inputs.forEach(input => {

    input.classList.remove("is-invalid");

    const feedback = input.parentNode.querySelector(".invalid-feedback");

    if (feedback) {
      feedback.remove();
    }

  });

}