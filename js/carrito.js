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

    const producto = {
        id,
        nombre,
        precio: Number(precio),
        imagen: imgFinal,
        talla,
        color,
        cantidad: 1
    };
    if(!talla){

    mostrarNotificacion("⚠️ Selecciona una talla");
    return;

}

if(!color){

    mostrarNotificacion("⚠️ Selecciona un color");
    return;

}

    const productoExistente = carrito.find(item =>

    item.id == producto.id &&
    item.talla == producto.talla &&
    item.color == producto.color

);

if(productoExistente){

    productoExistente.cantidad++;

}else{

    carrito.push(producto);

}

    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(
    "✅ Producto agregado exitosamente"
);
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
               <p><b>Color:</b> <span class="color-badge">${item.color}</span></p>

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
   const totalItems = carrito.reduce((acc, item) => {

    return acc + item.cantidad;

}, 0);

contador.innerText = totalItems;
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
    let total = 0;

carrito.forEach(i => {

    total += i.precio * i.cantidad;

});

    window.open(`https://wa.me/573148471107?text=${msg}`, "_blank");
}

actualizarCarrito();
msg += `💰 Total: $${total.toLocaleString()}`;


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
