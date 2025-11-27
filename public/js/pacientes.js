document.addEventListener("DOMContentLoaded", () => {

    const btnBuscar = document.getElementById("btnBuscar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const mensaje = document.getElementById("mensaje");

    // BUSCAR POR DNI
    btnBuscar.addEventListener("click", async () => {

        const dni = document.getElementById("dni").value;

        if (!dni) {
            mensaje.textContent = "Ingrese un DNI.";
            return;
        }

        const resp = await fetch(`/pacientes/buscar?dni=${dni}`);
        const data = await resp.json();

        mensaje.textContent = "";

        if (!data.existe) {
            mensaje.textContent = "Paciente no registrado.";
            habilitarCampos(true);
            limpiarCampos();
            document.getElementById("dni_hidden").value = dni;
            return;
        }

        mensaje.textContent = "Paciente existente.";

        // Cargar datos
        document.getElementById("nombre").value = data.datos.nombre;
        document.getElementById("apellido").value = data.datos.apellido;
        document.getElementById("direccion").value = data.datos.direccion;
        document.getElementById("localidad").value = data.datos.localidad;
        document.getElementById("edad").value = data.datos.edad;
        document.getElementById("telefono").value = data.datos.telefono;
        document.getElementById("tel_emergencia").value = data.datos.tel_emergencia || "";
        document.getElementById("nombre_dueno").value = data.datos.nombre_dueno || "";
        document.getElementById("fecha_nacimiento").value = data.datos.fecha_nacimiento;

        document.getElementById("dni_hidden").value = data.datos.dni;

        habilitarCampos(false);
    });

    // LIMPIAR
    btnLimpiar.addEventListener("click", () => {
        limpiarCampos();
        habilitarCampos(true);
        mensaje.textContent = "";
    });

    function limpiarCampos() {
        document.querySelectorAll("#formGuardar input").forEach(i => i.value = "");
    }

    function habilitarCampos(valor) {
        document.querySelectorAll("#formGuardar input").forEach(i => i.disabled = !valor);
    }

    // CALCULAR EDAD
    const fechaNac = document.getElementById("fecha_nacimiento");
    const campoEdad = document.getElementById("edad");

    if (fechaNac) {
        fechaNac.addEventListener("change", () => {
            const hoy = new Date();
            const nacimiento = new Date(fechaNac.value);

            if (!fechaNac.value) {
                campoEdad.value = "";
                return;
            }

            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();

            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }

            campoEdad.value = edad >= 0 ? edad : "";
        });
    }
});
