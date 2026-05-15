// =========================
// CARRITO
// =========================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// GUARDAR COLORES SELECCIONADOS
let coloresSeleccionados = {};


// =========================
// SELECCIONAR COLOR
// =========================

function seleccionarColor(idProducto, color, btn) {

    // GUARDAR COLOR
    coloresSeleccionados[idProducto] = color;

    // EFECTO VISUAL
    const contenedor = btn.parentElement;

    contenedor.querySelectorAll(".btn-color")
        .forEach(b => b.classList.remove("activo"));

    btn.classList.add("activo");

}


// =========================
// AGREGAR AL CARRITO
// =========================

function agregarAlCarrito(btn, id, nombre, precio, imagen, extra = {}) {

    const card =
        btn?.closest(".producto") ||
        btn?.closest(".card");

    // TALLA
    const talla =
        extra.talla ||
        card?.querySelector(".select-talla")?.value;

    // COLOR
    const color =
        extra.color ||
        coloresSeleccionados[id];

    // IMAGEN
    const imgFinal =
        imagen ||
        extra.imagen ||
        card?.querySelector("img")?.src ||
        "./img/error.png";

    // VALIDAR TALLA
    if (!talla) {

        mostrarNotificacion("⚠️ Selecciona una talla");
        return;

    }

    // VALIDAR COLOR
    if (!color) {

        mostrarNotificacion("⚠️ Selecciona un color");
        return;

    }

    // CREAR PRODUCTO
    const producto = {

        id,
        nombre,
        precio: Number(precio),
        imagen: imgFinal,
        talla,
        color,
        cantidad: 1

    };

    // VERIFICAR SI YA EXISTE
    const productoExistente = carrito.find(item =>

        item.id == producto.id &&
        item.talla == producto.talla &&
        item.color == producto.color

    );

    // SUMAR CANTIDAD
    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push(producto);

    }

    guardarCarrito();
    actualizarCarrito();

    mostrarNotificacion(
        "✅ Producto agregado exitosamente"
    );

}


// =========================
// GUARDAR CARRITO
// =========================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// =========================
// ACTUALIZAR CARRITO
// =========================

function actualizarCarrito() {

    const items =
        document.getElementById("itemsCarrito");

    const total =
        document.getElementById("totalCarrito");

    const contador =
        document.getElementById("contadorCarrito");

    if (!items) return;

    items.innerHTML = "";

    let totalFinal = 0;

    carrito.forEach((item, index) => {

        totalFinal += item.precio * item.cantidad;

        items.innerHTML += `

        <div class="item-carrito">

            <img src="${item.imagen}" alt="${item.nombre}">

            <div class="item-info">

                <h4>${item.nombre}</h4>

                <p>
                    $${Number(item.precio).toLocaleString()}
                </p>

                <p>
                    <b>Talla:</b> ${item.talla}
                </p>

                <p>
                    <b>Color:</b>
                    <span class="color-badge">
                        ${item.color}
                    </span>
                </p>

                <div class="cantidad-box">

                    <button onclick="cambiarCantidad(${index}, -1)">
                        -
                    </button>

                    <span>${item.cantidad}</span>

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

    const totalItems = carrito.reduce((acc, item) => {

        return acc + item.cantidad;

    }, 0);

    contador.innerText = totalItems;

}


// =========================
// CAMBIAR CANTIDAD
// =========================

function cambiarCantidad(index, cambio) {

    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {

        carrito.splice(index, 1);

    }

    guardarCarrito();
    actualizarCarrito();

}


// =========================
// ELIMINAR PRODUCTO
// =========================

function eliminarProducto(index) {

    carrito.splice(index, 1);

    guardarCarrito();
    actualizarCarrito();

}


// =========================
// TOGGLE CARRITO
// =========================

function toggleCarrito() {

    document
        .getElementById("carrito")
        .classList.toggle("active");

}

function cerrarCarrito() {

    document
        .getElementById("carrito")
        .classList.remove("active");

}


// =========================
// FINALIZAR COMPRA
// =========================

function finalizarCompra() {

    if (carrito.length === 0) {

        mostrarNotificacion("⚠️ Carrito vacío");
        return;

    }

    // DATOS CLIENTE
    const nombre =
        document.getElementById("clienteNombre")?.value.trim();

    const telefono =
        document.getElementById("clienteTelefono")?.value.trim();

    const direccion =
        document.getElementById("clienteDireccion")?.value.trim();

    // VALIDACIONES
    if (!nombre) {

        mostrarNotificacion("⚠️ Ingresa tu nombre");
        return;

    }

    if (!telefono) {

        mostrarNotificacion("⚠️ Ingresa tu teléfono");
        return;

    }

    if (!direccion) {

        mostrarNotificacion("⚠️ Ingresa dirección");
        return;

    }

    // MENSAJE
    let msg = `

🛍️ Pedido La Tienda de Yerlis

👤 Cliente: ${nombre}
📱 Teléfono: ${telefono}
📍 Dirección: ${direccion}

`;

    let total = 0;

    carrito.forEach(i => {

        const subtotal =
            i.precio * i.cantidad;

        total += subtotal;

        msg += `

📦 ${i.nombre}
📏 Talla: ${i.talla}
🎨 Color: ${i.color}
🔢 Cantidad: ${i.cantidad}
💰 Subtotal: $${subtotal.toLocaleString()}

`;

    });

    // TOTAL
    msg += `

🧾 TOTAL: $${total.toLocaleString()}

💖 Gracias por comprar en La Tienda de Yerlis

`;

    // CODIFICAR
    const mensajeCodificado =
        encodeURIComponent(msg);

    // WHATSAPP
   // ABRIR WHATSAPP
window.open(
    `https://wa.me/573148471107?text=${mensajeCodificado}`,
    "_blank"
);

// LIMPIAR CARRITO
carrito = [];

guardarCarrito();
actualizarCarrito();

// CERRAR CARRITO
cerrarCarrito();

// MENSAJE
mostrarNotificacion(
    "✅ Pedido enviado a WhatsApp"
);


// =========================
// NOTIFICACIONES
// =========================

function mostrarNotificacion(texto) {

    const noti =
        document.getElementById("notificacion");

    if (!noti) return;

    noti.innerText = texto;

    noti.classList.add("active");

    setTimeout(() => {

        noti.classList.remove("active");

    }, 2500);

}
