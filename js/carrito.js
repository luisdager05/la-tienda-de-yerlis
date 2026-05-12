let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// AGREGAR AL CARRITO
// =========================
function agregarAlCarrito(btn, id, nombre, precio, imagen) {

    const card = btn.closest(".producto") || btn.closest(".card");

    const talla = card.querySelector(".select-talla")?.value || "";
    const color = card.dataset.color || "";

    if (!talla || !color) {
        alert("Selecciona talla y color");
        return;
    }

    const producto = {
        id,
        nombre,
        precio: Number(precio),
        imagen: imagen || "./img/error.png",
        talla,
        color,
        cantidad: 1
    };

    carrito.push(producto);

    guardarCarrito();
    actualizarCarrito();
}

// =========================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// =========================
function actualizarCarrito() {

    const items = document.getElementById("itemsCarrito");
    const total = document.getElementById("totalCarrito");
    const contador = document.getElementById("contadorCarrito");

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
                <p>$${Number(item.precio).toLocaleString()}</p>
                <p><b>Talla:</b> ${item.talla}</p>
                <p><b>Color:</b> ${item.color}</p>

                <div class="cantidad-box">

                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>

                </div>

            </div>

            <button class="btn-eliminar" onclick="eliminarProducto(${index})">✖</button>

        </div>
        `;
    });

    total.innerText = totalFinal.toLocaleString();
    contador.innerText = carrito.length;
}

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
function eliminarProducto(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
}

// =========================
function toggleCarrito() {
    document.getElementById("carrito").classList.toggle("active");
}

function cerrarCarrito() {
    document.getElementById("carrito").classList.remove("active");
}

// =========================
function finalizarCompra() {

    if (carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }

    let msg = "🛍️ Pedido:%0A%0A";

    carrito.forEach(i => {
        msg += `• ${i.nombre}%0ATalla: ${i.talla}%0AColor: ${i.color}%0ACant: ${i.cantidad}%0A%0A`;
    });

    window.open(`https://wa.me/573148471107?text=${msg}`, "_blank");
}

actualizarCarrito();
