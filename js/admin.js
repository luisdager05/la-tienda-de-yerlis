function guardar(){

    let nombre = document.getElementById("nombre").value;
    let precio = document.getElementById("precio").value;
    let categoria = document.getElementById("categoria").value;

    let file = document.getElementById("imagenFile").files[0];

    if(nombre === "" || precio === "" || categoria === "" || !file){
        alert("Completa todos los campos");
        return;
    }

    let reader = new FileReader();

    reader.onload = function(e){

        let productos = JSON.parse(localStorage.getItem("productos")) || [];

        let nuevo = {
            id: Date.now(),
            nombre,
            precio: parseFloat(precio),
            categoria,
            imagen: e.target.result // 🔥 base64
        };

        productos.push(nuevo);

        localStorage.setItem("productos", JSON.stringify(productos));

        limpiar();
        mostrar();

        alert("Producto guardado ✅");
    };

    reader.readAsDataURL(file);

}

function mostrar(){

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    productos.forEach(p => {

        lista.innerHTML += `
            <div class="item-admin">
                <img src="${p.imagen}">
                <span>${p.nombre}</span>
                <span>$${p.precio}</span>
                <button onclick="eliminar(${p.id})">X</button>
            </div>
        `;
    });
}

function eliminar(id){

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos = productos.filter(p => p.id !== id);

    localStorage.setItem("productos", JSON.stringify(productos));

    mostrar();
}

function limpiar(){
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("imagen").value = "";
}

document.addEventListener("DOMContentLoaded", mostrar);

function volverInicio(){
    window.location.href = "index.html";
}

limpiar();
mostrar();

// 🔥 ACTUALIZA LA TIENDA AUTOMÁTICAMENTE
window.open("index.html", "_blank");