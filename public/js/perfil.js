function confirmarLogout() {

    const respuesta = confirm(
        "¿Está seguro que desea cerrar sesión?"
    );

    if (respuesta) {

        window.location.href = "/logout";

    }

}

const btnEditar =
document.getElementById("btnEditar");

const form =
document.getElementById("formPerfil");

let modoEdicion = false;

btnEditar.addEventListener(
    "click",
    () => {

        const campos =
        document.querySelectorAll(
            ".editable"
        );

        if(!modoEdicion){

            campos.forEach(campo=>{
                campo.removeAttribute(
                    "readonly"
                );
            });

            btnEditar.textContent =
            "Guardar Cambios";

            modoEdicion = true;

            

        }else{

            const nombre =
            document.querySelector(
                '[name="nombre"]'
            ).value.trim();

            const apellido =
            document.querySelector(
                '[name="apellido"]'
            ).value.trim();

            const email =
            document.querySelector(
                '[name="email"]'
            ).value.trim();

            const soloTexto =
            /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

            if(!soloTexto.test(nombre)){
                alert("Nombre inválido");
                return;
            }

            if(!soloTexto.test(apellido)){
                alert("Apellido inválido");
                return;
            }

            const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!emailRegex.test(email)){
                alert("Correo electrónico inválido");
                return;
            }

            form.submit();

        }

    }
);