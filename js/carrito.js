// ABRIR / CERRAR CARRITO
function toggleCarrito(){
    const panel = document.getElementById("panel-carrito");
    const overlay = document.getElementById("overlay");

    panel.classList.toggle("activo");

    if(overlay){
        overlay.classList.toggle("activo");
    }

    mostrarCarrito();
}

// CERRAR CARRITO
function cerrarCarrito(){
    const panel = document.getElementById("panel-carrito");
    const overlay = document.getElementById("overlay");

    panel.classList.remove("activo");

    if(overlay){
        overlay.classList.remove("activo");
    }
}

// MOSTRAR PRODUCTOS EN CARRITO
function mostrarCarrito(){
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const lista = document.getElementById("lista-carrito");
    const total = document.getElementById("total");

    if(!lista || !total) return;

    lista.innerHTML = "";

    let suma = 0;

    carrito.forEach(p => {
        lista.innerHTML += `
            <div class="item-carrito">
                <img src="${p.imagen}" width="60">
                <div>
                    <p>${p.nombre}</p>
                    <p>Cantidad: ${p.cantidad}</p>
                    <p>$${p.precio}</p>
                </div>
            </div>
        `;

        suma += p.precio * p.cantidad;
    });

    total.textContent = "Total: $" + suma;
}

// VACIAR
function vaciarCarrito(){
    localStorage.removeItem("carrito");
    mostrarCarrito();
    actualizarContador();
}

// COMPRAR
function comprar(){
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if(carrito.length === 0){
        alert("Tu carrito está vacío ❌");
        return;
    }

    alert("Compra realizada con éxito 🎉");

    localStorage.removeItem("carrito");

    mostrarCarrito();
    actualizarContador();
}

// CONTADOR
function actualizarContador(){
    const contador = document.getElementById("contador-carrito");

    if(!contador) return;

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let total = 0;
    carrito.forEach(p => total += p.cantidad);

    contador.textContent = total;
}

// EVENTO AL CARGAR
document.addEventListener("DOMContentLoaded", actualizarContador);

// DETECTAR BOTÓN AGREGAR
document.addEventListener("click", function(e){
    const boton = e.target.closest(".btn-agregar");

    if(boton){

        const producto = {
            id: boton.dataset.id,
            nombre: boton.dataset.nombre,
            precio: parseInt(boton.dataset.precio),
            imagen: boton.dataset.imagen
        };

        agregarAlCarrito(producto);
    }
});

// AGREGAR PRODUCTO
function agregarAlCarrito(producto){
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    let existe = carrito.find(p => p.id === producto.id);

    if(existe){
        existe.cantidad += 1;
    }else{
        producto.cantidad = 1;
        carrito.push(producto);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContador();
    mostrarCarrito();
}