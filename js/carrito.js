// =========================
// CARRITO
// =========================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// GUARDAR EN LOCALSTORAGE
// =========================

function guardarCarrito(){

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}

// =========================
// ABRIR CARRITO
// =========================

function toggleCarrito(){

    document
    .getElementById("carrito")
    .classList
    .toggle("active");

}

// =========================
// CERRAR CARRITO
// =========================

function cerrarCarrito(){

    document
    .getElementById("carrito")
    .classList
    .remove("active");

}

// =========================
// AGREGAR PRODUCTO
// =========================

function agregarAlCarrito(
    id,
    nombre,
    precio,
    imagen
){

    const productoExistente =
    carrito.find(item => item.id === id);

    if(productoExistente){

        productoExistente.cantidad++;

    }else{

        carrito.push({
            id,
            nombre,
            precio,
            imagen,
            cantidad:1
        });

    }

    guardarCarrito();

    renderCarrito();

}

// =========================
// RENDER CARRITO
// =========================

function renderCarrito(){

    const itemsCarrito =
    document.getElementById("itemsCarrito");

    const totalCarrito =
    document.getElementById("totalCarrito");

    const contador =
    document.getElementById("contadorCarrito");

    itemsCarrito.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    carrito.forEach((producto,index)=>{

        total += producto.precio * producto.cantidad;

        totalItems += producto.cantidad;

        itemsCarrito.innerHTML += `

        <div class="item-carrito">

            <img src="${producto.imagen}" width="70">

            <div class="item-info">

                <h4>${producto.nombre}</h4>

                <p>$${producto.precio}</p>

                <p>
                    Cantidad:
                    ${producto.cantidad}
                </p>

            </div>

            <button onclick="eliminarProducto(${index})">

                ✖

            </button>

        </div>

        `;

    });

    totalCarrito.textContent = total;

    contador.textContent = totalItems;

}

// =========================
// ELIMINAR PRODUCTO
// =========================

function eliminarProducto(index){

    carrito.splice(index,1);

    guardarCarrito();

    renderCarrito();

}

// =========================
// FINALIZAR COMPRA
// =========================

function finalizarCompra(){

    if(carrito.length === 0){

        alert("Tu carrito está vacío");

        return;

    }

    let mensaje =
    "Hola, quiero comprar:%0A%0A";

    carrito.forEach(producto=>{

        mensaje +=
        `• ${producto.nombre}
Cantidad: ${producto.cantidad}
Precio: $${producto.precio}%0A`;

    });

    window.open(
        `https://wa.me/573148471107?text=${mensaje}`,
        "_blank"
    );

}

// =========================
// CARGAR AL INICIO
// =========================

document.addEventListener(
    "DOMContentLoaded",
    renderCarrito
);
