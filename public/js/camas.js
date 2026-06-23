function filtrar(estado){

    const camas = document.querySelectorAll('.cama');

    camas.forEach(cama => {

        if(estado === 'todos'){
            cama.style.display = 'flex';
            return;
        }

        if(cama.classList.contains(estado)){
            cama.style.display = 'flex';
        }else{
            cama.style.display = 'none';
        }

    });
}

function seleccionarCama(cama){

    document
        .querySelectorAll('.cama')
        .forEach(c => c.classList.remove('seleccionada'));

    cama.classList.add('seleccionada');
}

async function crearCama(idHabitacion){

    const res = await fetch("/camas/cama",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id_habitacion:idHabitacion
        })
    });

    if(res.ok){
        location.reload();
    }
}

async function crearHabitacion(idAla){

    const res = await fetch("/camas/habitacion",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id_ala:idAla
        })
    });

    if(res.ok){
        location.reload();
    }
}

async function crearAla(){

    const esUrgencias = confirm(
        "Aceptar = Ala Normal\nCancelar = Ala de Urgencias"
    );

    const tipo = esUrgencias
        ? "normal"
        : "urgencias";

    const res = await fetch("/camas/ala",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            tipo
        })
    });

    if(res.ok){
        location.reload();
    }else{
        alert("Error al crear ala");
    }
}