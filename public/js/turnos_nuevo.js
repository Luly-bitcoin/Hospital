document.addEventListener("DOMContentLoaded", () => {
  const btnBuscar = document.getElementById("btnBuscar");
  const dniInput = document.getElementById("dni");
  const mensajeDiv = document.getElementById("mensajePaciente");

  btnBuscar.addEventListener("click", async () => {
    const dni = dniInput.value.trim();

    if (!dni) {
      mensajeDiv.textContent = "Ingrese un DNI válido.";
      mensajeDiv.style.color = "red";
      return;
    }

    try {
      const res = await fetch("/turnos/buscar-paciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni })
      });

      const data = await res.json();

      if (data.existe) {
        mensajeDiv.textContent = "Paciente registrado";
        mensajeDiv.style.color = "green";
      } else {
        mensajeDiv.textContent = "Paciente NO registrado";
        mensajeDiv.style.color = "red";
      }

    } catch (error) {
      mensajeDiv.textContent = "Error al buscar el paciente.";
      mensajeDiv.style.color = "red";
    }
  });
});
