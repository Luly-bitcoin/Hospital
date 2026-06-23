document.addEventListener("DOMContentLoaded", () => {

    const buscador =
        document.getElementById("buscarPaciente");

    const filas =
        document.querySelectorAll(
            "#tablaPacientes tr"
        );

    buscador.addEventListener("input", () => {

        const texto =
            buscador.value.toLowerCase().trim();

        filas.forEach(fila => {

            const contenido =
                fila.textContent.toLowerCase();

            fila.style.display =
                contenido.includes(texto)
                    ? ""
                    : "none";
        });

    });

});