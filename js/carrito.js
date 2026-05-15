// =========================
// CARRITO
// =========================

let carrito =
JSON.parse(localStorage.getItem("carrito")) || [];

let coloresSeleccionados = {};

// =========================
// SELECCIONAR COLOR
// =========================

function seleccionarColor(elemento){

    const card =
    elemento.closest(".producto");

    card
    .querySelectorAll(".color-option")
    .forEach(c => {

        c.style.border =
        "2px solid #ccc";

    });

    elemento.style.border =
    "3px solid black";

    card.dataset.color =
    elemento.dataset.color;

}

// =========================
// AGREGAR AL CARRITO
// =========================

function agregarAlCarrito(
    btn,
    id,
    nombre,
    precio,
    imagen,
    extra = {}
){

    const card =
    btn?.closest(".producto");

    const talla =
    extra.talla ||
    card?.querySelector(".select-talla")?.value;

    const color =
    extra.color ||
    card?.dataset.color;

    const imgFinal =
    imagen ||
    card?.querySelector("img")?.src ||
    "./img/error.png";

    if(!talla){

        mostrarNotificacion(
            "⚠️ Selecciona una talla"
        );

        return;

    }

    if(!color){

        mostrarNotificacion(
            "⚠️ Selecciona un color"
        );

        return;

    }

    const producto = {

        id,
        nombre,
        precio: Number(precio),
        imagen: imgFinal,
        talla,
        color,
        cantidad: 1

    };

    const existe =
    carrito.find(item =>

        item.id == id &&
        item.talla == talla &&
        item.color == color

    );

    if(existe){

        existe.cantidad++;

    }else{

        carrito.push(producto);

    }

    guardarCarrito();

    actualizarCarrito();

    mostrarNotificacion(
        "✅ Producto agregado"
    );

}

// =========================
// GUARDAR
// =========================

function guardarCarrito(){

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}

// =========================
// ACTUALIZAR CARRITO
// =========================

function actualizarCarrito(){

    const items =
    document.getElementById("itemsCarrito");

    const total =
    document.getElementById("totalCarrito");

    const contador =
    document.getElementById("contadorCarrito");

    if(!items) return;

    items.innerHTML = "";

    let totalFinal = 0;

    carrito.forEach((item, index) => {

        totalFinal +=
        item.precio * item.cantidad;

        items.innerHTML += `

            <div class="item-carrito">

                <img
                src="${item.imagen}"
                alt="${item.nombre}">

                <div class="item-info">

                    <h4>${item.nombre}</h4>

                    <p>
                        $${item.precio.toLocaleString()}
                    </p>

                    <p>
                        Talla:
                        ${item.talla}
                    </p>

                    <p>
                        Color:
                        ${item.color}
                    </p>

                    <div class="cantidad-box">

                        <button onclick="cambiarCantidad(${index}, -1)">
                            -
                        </button>

                        <span>
                            ${item.cantidad}
                        </span>

                        <button onclick="cambiarCantidad(${index}, 1)">
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

    total.innerText =
    totalFinal.toLocaleString();

    contador.innerText =
    carrito.reduce((acc, item) => {

        return acc + item.cantidad;

    }, 0);

}

// =========================
// CAMBIAR CANTIDAD
// =========================

function cambiarCantidad(index, cambio){

    carrito[index].cantidad += cambio;

    if(carrito[index].cantidad <= 0){

        carrito.splice(index, 1);

    }

    guardarCarrito();

    actualizarCarrito();

}

// =========================
// ELIMINAR
// =========================

function eliminarProducto(index){

    carrito.splice(index, 1);

    guardarCarrito();

    actualizarCarrito();

}

// =========================
// TOGGLE CARRITO
// =========================

function toggleCarrito(){

    document
    .getElementById("carrito")
    .classList.toggle("active");

}

function cerrarCarrito(){

    document
    .getElementById("carrito")
    .classList.remove("active");

}

// =========================
// FINALIZAR COMPRA
// =========================

function finalizarCompra(){

    if(carrito.length === 0){

        mostrarNotificacion(
            "⚠️ Carrito vacío"
        );

        return;

    }

    const nombre =
    document
    .getElementById("clienteNombre")
    ?.value.trim();

    const telefono =
    document
    .getElementById("clienteTelefono")
    ?.value.trim();

    const direccion =
    document
    .getElementById("clienteDireccion")
    ?.value.trim();

    if(!nombre || !telefono || !direccion){

        mostrarNotificacion(
            "⚠️ Completa los datos"
        );

        return;

    }

    let mensaje = `🛍️ Pedido La Tienda de Yerlis

👤 Cliente: ${nombre}
📱 Teléfono: ${telefono}
📍 Dirección: ${direccion}

`;

    let total = 0;

    carrito.forEach(item => {

        const subtotal =
        item.precio * item.cantidad;

        total += subtotal;

        mensaje += `

📦 ${item.nombre}
📏 Talla: ${item.talla}
🎨 Color: ${item.color}
🔢 Cantidad: ${item.cantidad}
💰 $${subtotal.toLocaleString()}

`;

    });

    mensaje += `

🧾 TOTAL:
$${total.toLocaleString()}

💖 Gracias por comprar
en La Tienda de Yerlis
`;

    const url =

    `https://wa.me/573148471107?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");

}

// =========================
// NOTIFICACION
// =========================

function mostrarNotificacion(texto){

    const noti =
    document.getElementById("notificacion");

    if(!noti) return;

    noti.innerText = texto;

    noti.classList.add("active");

    setTimeout(() => {

        noti.classList.remove("active");

    }, 2500);

}

// =========================
// INICIAR
// =========================

actualizarCarrito();
