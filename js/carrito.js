// =========================
// CARRITO
// =========================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// AGREGAR AL CARRITO
// =========================

function agregarAlCarrito(btn, id, nombre, precio, imagen, extra = {}) {

    const card =
        btn?.closest(".producto") ||
        btn?.closest(".card");

    const talla =
        extra.talla ||
        card?.querySelector(".select-talla")?.value;

    const color =
        extra.color ||
        card?.dataset.color;

    const imgFinal =
        imagen ||
        extra.imagen ||
        card?.querySelector("img")?.src ||
        "./img/error.png";

    if (!talla) {

        mostrarNotificacion("⚠️ Selecciona una talla");
        return;

    }

    if (!color) {

        mostrarNotificacion("⚠️ Selecciona un color");
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

    const productoExistente = carrito.find(item =>

        item.id == producto.id &&
        item.talla == producto.talla &&
        item.color == producto.color

    );

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
// GUARDAR
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

    if (!items || !total || !contador) return;

    items.innerHTML = "";

    let totalFinal = 0;

    carrito.forEach((item, index) => {

        totalFinal +=
            item.precio * item.cantidad;

        items.innerHTML += `

        <div class="item-carrito">

            <img
                src="${item.imagen}"
                alt="${item.nombre}"
                onerror="this.src='./img/error.png'"
            >

            <div class="item-info">

                <h4>${item.nombre}</h4>

                <p>
                    $${Number(item.precio).toLocaleString()}
                </p>

                <p>
                    <b>Talla:</b>
                    ${item.talla}
                </p>

                <p>
                    <b>Color:</b>
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
                onclick="eliminarProducto(${index})"
            >
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
// FORZAR REFRESCO VISUAL
items.offsetHeight;
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
// ELIMINAR
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

    const nombre =
        document.getElementById("clienteNombre")?.value.trim();

    const telefono =
        document.getElementById("clienteTelefono")?.value.trim();

    const direccion =
        document.getElementById("clienteDireccion")?.value.trim();

    if (!nombre || !telefono || !direccion) {

        mostrarNotificacion(
            "⚠️ Completa todos los datos"
        );

        return;

    }

    let msg = `🛍️ Pedido La Tienda de Yerlis

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

    msg += `
🧾 TOTAL: $${total.toLocaleString()}
`;

    window.open(

        `https://wa.me/573148471107?text=${encodeURIComponent(msg)}`,
        "_blank"

    );

}


// LIMPIAR CARRITO
carrito.length = 0;

localStorage.removeItem("carrito");

// ACTUALIZAR EN TIEMPO REAL
actualizarCarrito();

// CERRAR PANEL
cerrarCarrito();

mostrarNotificacion(
    "✅ Pedido enviado correctamente"
);

// =========================
// NOTIFICACION
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

// =========================
// MOSTRAR PRODUCTOS
// =========================

function mostrarSecciones(productos) {

    const destacados =
        document.getElementById("destacados");

    if (!destacados) return;

    destacados.innerHTML = "";

    productos.forEach(p => {

        const imagenProducto =

            p.imagen ||
            p.imagen_url ||
            p.image ||
            "./img/error.png";

        let tallasHTML = "";

        if (Array.isArray(p.talla)) {

            tallasHTML =
                p.talla.map(t => `

                <option value="${t}">
                    ${t}
                </option>

            `).join("");

        }

        let coloresHTML = "";

        if (Array.isArray(p.colores)) {

            coloresHTML =
                p.colores.map(color => `

                <span
                    class="color-option"
                    data-color="${color}"
                    style="
                        background:${color};
                        width:22px;
                        height:22px;
                        border-radius:50%;
                        display:inline-block;
                        margin:3px;
                        border:2px solid #ccc;
                        cursor:pointer;
                    "
                    onclick="seleccionarColor(this)"
                ></span>

            `).join("");

        }

        destacados.innerHTML += `

        <div class="producto">

            <img
                class="img-producto"
                src="${imagenProducto}"
                alt="${p.nombre}"
                onerror="this.src='./img/error.png'"
            >

            <h3>${p.nombre}</h3>

            <p class="precio">
                $${Number(p.precio).toLocaleString()}
            </p>

            <div class="selector-opciones">

                <label>Talla:</label>

                <select class="select-talla">

                    <option value="">
                        Seleccionar
                    </option>

                    ${tallasHTML}

                </select>

            </div>

            <div class="selector-opciones">

                <label>Color:</label>

                <div class="colores">

                    ${coloresHTML}

                </div>

            </div>

            <button
                class="btn-carrito"
                onclick="agregarProductoDesdeCard(
                    this,
                    ${p.id},
                    '${p.nombre.replace(/'/g, "\\'")}',
                    ${p.precio},
                    '${imagenProducto}'
                )"
            >
                Agregar al carrito
            </button>

        </div>

        `;

    });

}

// =========================
// FILTRAR
// =========================

function filtrarCategoria(categoria) {

    const titulo =
        document.getElementById("tituloCategoria");

    if (!window.productosGlobalData) return;

    if (categoria === "todos") {

        titulo.innerText =
            "🔥 Todos los productos";

        mostrarSecciones(
            window.productosGlobalData
        );

        return;

    }

    const filtrados =
        window.productosGlobalData.filter(p =>

            p.categoria &&
            p.categoria.toLowerCase().trim() ===
            categoria.toLowerCase().trim()

        );

    titulo.innerText =
        categoria.charAt(0).toUpperCase() +
        categoria.slice(1);

    mostrarSecciones(filtrados);

}

// =========================
// COLOR
// =========================

function seleccionarColor(elemento) {

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
// AGREGAR DESDE CARD
// =========================

function agregarProductoDesdeCard(
    btn,
    id,
    nombre,
    precio,
    imagen
) {

    agregarAlCarrito(
        btn,
        id,
        nombre,
        precio,
        imagen
    );

}

// =========================
// INICIAR
// =========================

actualizarCarrito();
