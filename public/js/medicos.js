document.querySelectorAll(".btn-estado").forEach(btn => {

    btn.addEventListener("click", async () => {

        const dni = btn.dataset.id;
        const estadoActual = btn.dataset.estado;

        const nuevoEstado = estadoActual === "activo"
            ? "inactivo"
            : "activo";

        const confirmar = confirm(
            `¿Seguro que querés cambiar el estado a ${nuevoEstado}?`
        );

        if (!confirmar) return;

        const res = await fetch(`/medicos/estado/${dni}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (res.ok) {
            location.reload();
        } else {
            alert("Error al cambiar estado");
        }
    });

});