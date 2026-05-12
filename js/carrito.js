let carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];

// =========================
// AGREGAR AL CARRITO
// =========================

function agregarAlCarrito(
    btn,
    id,
    nombre,
    precio,
    imagen
){

    const card =
    btn.closest(".producto") ||
    btn.closest(".card");

    const talla =
    card.querySelector(".select-talla")?.value || "";

    const color =
    card.querySelector(".select-color")?.value || "";

    if(talla === "" || color === ""){

        alert("Selecciona talla y color");
        return;

    }

    precio = Number(precio);
    imagen = imagen || "./img/error.png";

    const producto = {

        id,
        nombre,
        precio,
        imagen,
        talla,
        color,
        cantidad: 1

    };

    carrito.push(producto);

    guardarCarrito();
    actualizarCarrito();

}

// =========================
// GUARDAR STORAGE
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

        totalFinal += item.precio * item.cantidad;

        items.innerHTML += `

            <div class="item-carrito">

                <img src="${item.imagen}" alt="${item.nombre}">

                <div class="item-info">

                    <h4>${item.nombre}</h4>

                    <p>$${Number(item.precio).toLocaleString()}</p>

                    <p><strong>Talla:</strong> ${item.talla}</p>

                    <p><strong>Color:</strong> ${item.color}</p>

                    <div class="cantidad-box">

                        <button onclick="cambiarCantidad(${index}, -1)">-</button>

                        <span>${item.cantidad}</span>

                        <button onclick="cambiarCantidad(${index}, 1)">+</button>

                    </div>

                </div>

                <button class="btn-eliminar"
                onclick="eliminarProducto(${index})">
                    ✖
                </button>

            </div>

        `;

    });

    total.innerText = totalFinal.toLocaleString();
    contador.innerText = carrito.length;

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
// CARRITO UI
// =========================

function toggleCarrito(){

    document.getElementById("carrito")
    .classList.toggle("active");

}

function cerrarCarrito(){

    document.getElementById("carrito")
    .classList.remove("active");

}

// =========================
// FINALIZAR COMPRA
// =========================

function finalizarCompra(){

    if(carrito.length === 0){
        alert("Tu carrito está vacío");
        return;
    }

    let mensaje = "🛍️ Pedido La Tienda de Yerlis:%0A%0A";

    carrito.forEach(item => {

        mensaje += `
• ${item.nombre}
Talla: ${item.talla}
Color: ${item.color}
Cantidad: ${item.cantidad}
Precio: $${item.precio}%0A%0A`;

    });

    window.open(
        `https://wa.me/573148471107?text=${mensaje}`,
        "_blank"
    );

}

// =========================
// INICIAR
// =========================

actualizarCarrito();
