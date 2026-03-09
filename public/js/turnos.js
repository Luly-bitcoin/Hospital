document.addEventListener("DOMContentLoaded", () => {
  const btnBuscar = document.getElementById("btnBuscar");
  const dniInput = document.getElementById("dni");
  const datosDiv = document.getElementById("datosPaciente");
  const mensajeDiv = document.getElementById("mensajePaciente");
  const nombreSpan = document.getElementById("nombrePaciente");
  const apellidoSpan = document.getElementById("apellidoPaciente");
  const fechaSpan = document.getElementById("fechaNacimiento");
  const telSpan = document.getElementById("telefonoPaciente");
  const turnoForm = document.getElementById("turnoForm");

  // Buscar paciente
  btnBuscar?.addEventListener("click", async () => {
    const dni = dniInput.value.trim();
    if(!dni) {
      mensajeDiv.textContent = "Ingrese un DNI válido.";
      datosDiv.style.display = "none";
      return;
    }

    try {
      const res = await fetch("/turnos/buscar-paciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni })
      });
      const data = await res.json();

      if(data.existe) {
        datosDiv.style.display = "block";
        mensajeDiv.textContent = "";
        nombreSpan.textContent = data.paciente.nombre;
        apellidoSpan.textContent = data.paciente.apellido;
        fechaSpan.textContent = data.paciente.fecha_nacimiento;
        telSpan.textContent = data.paciente.telefono;
        turnoForm.style.display = "block"; // mostrar formulario de turno
      } else {
        datosDiv.style.display = "none";
        turnoForm.style.display = "none";
        mensajeDiv.textContent = "El paciente no está registrado en la base de datos.";
      }
    } catch(err) {
      console.error("Error al buscar paciente:", err);
      datosDiv.style.display = "none";
      turnoForm.style.display = "none";
      mensajeDiv.textContent = "Ocurrió un error al buscar el paciente.";
    }
  });

  // Enviar formulario
  turnoForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      dni_paciente: dniInput.value,
      id_medico: document.getElementById("medico").value,
      fecha_solicitada: document.getElementById("fecha").value,
      motivo: document.getElementById("motivo").value
    };

    const res = await fetch("/turnos/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    alert(data.message);
    if(data.success) location.href = "/turnos";
  });
});
