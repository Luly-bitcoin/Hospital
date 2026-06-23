function confirmarLogout() {

    const respuesta = confirm(
        "¿Está seguro que desea cerrar sesión?"
    );

    if (respuesta) {

        window.location.href = "/logout";

    }

}