document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#tablaPacientes tbody");
  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");

  // Función para cargar pacientes desde el backend
  async function cargarPacientes(query = "") {
    try {
      const res = await fetch(`/pacientes/api/pacientes?buscar=${query}`);
      const pacientes = await res.json();

      tabla.innerHTML = ""; // Limpiar tabla

      pacientes.forEach(paciente => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${paciente.dni}</td>
          <td>${paciente.nombre}</td>
          <td>${paciente.apellido}</td>
          <td>
            <a href="/pacientes/editar/${paciente.dni}" class="btn btn-warning btn-sm me-1">Editar</a>
            <button class="btn btn-danger btn-sm btn-borrar" data-dni="${paciente.dni}">Borrar</button>
            <a href="/pacientes/ver/${paciente.dni}" class="btn btn-info btn-sm">Observar</a>
          </td>
        `;

        tabla.appendChild(tr);
      });

      // Asignar evento de borrar a los botones
      document.querySelectorAll(".btn-borrar").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const dni = btn.dataset.dni;
          const confirmar = confirm(`¿Está seguro de borrar al paciente con DNI ${dni}?`);
          if (confirmar) {
            try {
              const res = await fetch(`/pacientes/api/pacientes/${dni}`, { method: "DELETE" });
              const data = await res.json();
              if (data.success) {
                alert("Paciente borrado correctamente.");
                cargarPacientes(inputBuscar.value); // recargar tabla
              } else {
                alert("Error al borrar paciente.");
              }
            } catch (err) {
              console.error(err);
              alert("Error de conexión al borrar paciente.");
            }
          }
        });
      });

    } catch (err) {
      console.error(err);
      tabla.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar pacientes</td></tr>`;
    }
  }

  // Cargar todos al iniciar
  cargarPacientes();

  // Buscar pacientes
  btnBuscar.addEventListener("click", () => {
    cargarPacientes(inputBuscar.value.trim());
  });

  // Filtrado al presionar Enter
  inputBuscar.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      cargarPacientes(inputBuscar.value.trim());
    }
  });
});


// Mostrar vista de editar paciente
router.get("/editar/:dni", async (req, res) => {
  const { dni } = req.params;
  try {
    const [[paciente]] = await db.query("SELECT * FROM pacientes WHERE dni = ?", [dni]);
    if (!paciente) {
      return res.send("Paciente no encontrado");
    }
    res.render("pacientes/editar-paciente", { paciente });
  } catch (err) {
    console.error(err);
    res.send("Error al cargar datos del paciente");
  }
});

// Actualizar paciente
router.post("/editar/:dni", async (req, res) => {
  const { dni } = req.params;
  const { nombre, apellido, direccion, localidad, fecha_nacimiento, edad, telefono, tel_emergencia, nombre_dueno, sexo } = req.body;

  try {
    await db.query(`
      UPDATE pacientes SET nombre = ?, apellido = ?, direccion = ?, localidad = ?, fecha_nacimiento = ?, edad = ?, telefono = ?, tel_emergencia = ?, nombre_dueno = ?, sexo = ?
      WHERE dni = ?
    `, [nombre, apellido, direccion, localidad, fecha_nacimiento, edad, telefono, tel_emergencia, nombre_dueno, sexo, dni]);

    res.redirect("/pacientes/lista-pacientes");
  } catch (err) {
    console.error(err);
    res.send("Error al actualizar paciente");
  }
});
