// =========================
// CARRITO GLOBAL
// =========================

let carrito =
JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// GUARDAR CARRITO
// =========================

function guardarCarrito(){

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}

// =========================
// ABRIR / CERRAR
// =========================

function toggleCarrito(){

    document
    .getElementById("carrito")
    .classList
    .toggle("active");

}

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

    precio = Number(precio);

    const existe =
    carrito.find(
        producto => producto.id == id
    );

    if(existe){

        existe.cantidad++;

    }else{

        carrito.push({

            id:id,
            nombre:nombre,
            precio:precio,
            imagen:imagen,
            cantidad:1

        });

    }

    guardarCarrito();

    renderCarrito();

}

// =========================
// RENDER
// =========================

function renderCarrito(){

    const items =
    document.getElementById("itemsCarrito");

    const totalHTML =
    document.getElementById("totalCarrito");

    const contador =
    document.getElementById("contadorCarrito");

    items.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    if(carrito.length === 0){

        items.innerHTML = `

        <p class="carrito-vacio">
            Tu carrito está vacío
        </p>

        `;

    }

    carrito.forEach((producto,index)=>{

        total +=
        producto.precio * producto.cantidad;

        cantidadTotal +=
        producto.cantidad;

        items.innerHTML += `

        <div class="item-carrito">

            <img
            src="${producto.imagen}"
            alt="${producto.nombre}">

            <div class="item-info">

                <h4>${producto.nombre}</h4>

                <p>
                    $${producto.precio.toLocaleString()}
                </p>

                <div class="cantidad-box">

                    <button
                    onclick="restarCantidad(${index})">

                        -

                    </button>

                    <span>
                        ${producto.cantidad}
                    </span>

                    <button
                    onclick="sumarCantidad(${index})">

                        +

                    </button>

                </div>

            </div>

            <button
            class="btn-eliminar"
            onclick="eliminarProducto(${index})">

                ✖

            </button>

        </div>

        `;

    });

    totalHTML.textContent =
    total.toLocaleString();

    contador.textContent =
    cantidadTotal;

    guardarCarrito();

}

// =========================
// SUMAR CANTIDAD
// =========================

function sumarCantidad(index){

    carrito[index].cantidad++;

    renderCarrito();

}

// =========================
// RESTAR CANTIDAD
// =========================

function restarCantidad(index){

    if(carrito[index].cantidad > 1){

        carrito[index].cantidad--;

    }else{

        carrito.splice(index,1);

    }

    renderCarrito();

}

// =========================
// ELIMINAR
// =========================

function eliminarProducto(index){

    carrito.splice(index,1);

    renderCarrito();

}

// =========================
// WHATSAPP
// =========================

function finalizarCompra(){

    if(carrito.length === 0){

        alert("Tu carrito está vacío");

        return;

    }

    let mensaje =
    "🛍️ Hola, quiero comprar:%0A%0A";

    carrito.forEach(producto=>{

        mensaje +=
        `• ${producto.nombre}%0A`;

        mensaje +=
        `Cantidad: ${producto.cantidad}%0A`;

        mensaje +=
        `Precio: $${producto.precio}%0A%0A`;

    });

    window.open(
        `https://wa.me/573148471107?text=${mensaje}`,
        "_blank"
    );

}

// =========================
// INICIAR
// =========================

document.addEventListener(
    "DOMContentLoaded",
    renderCarrito
);
