let carrito =
JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// TOGGLE
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
// AGREGAR
// =========================

function agregarAlCarrito(producto){

    const existe =
    carrito.find(p => p.id === producto.id);

    if(existe){

        existe.cantidad++;

    }else{

        carrito.push({
            ...producto,
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

    const contenedor =
    document.getElementById("itemsCarrito");

    const totalHTML =
    document.getElementById("totalCarrito");

    const contador =
    document.getElementById("contadorCarrito");

    contenedor.innerHTML = "";

    let total = 0;
    let totalProductos = 0;

    carrito.forEach(producto => {

        total +=
        producto.precio * producto.cantidad;

        totalProductos += producto.cantidad;

        contenedor.innerHTML += `

        <div class="item-carrito">

            <img src="${producto.imagen}" alt="">

            <div class="item-info">

                <h4>${producto.nombre}</h4>

                <p>$${producto.precio}</p>

                <div class="controles">

                    <button
                    onclick="restarCantidad(${producto.id})">

                        -

                    </button>

                    <span>${producto.cantidad}</span>

                    <button
                    onclick="sumarCantidad(${producto.id})">

                        +

                    </button>

                </div>

                <button
                class="btn-eliminar"
                onclick="eliminarProducto(${producto.id})">

                    Eliminar

                </button>

            </div>

        </div>

        `;

    });

    totalHTML.textContent =
    total.toLocaleString();

    contador.textContent =
    totalProductos;

}

// =========================
// SUMAR
// =========================

function sumarCantidad(id){

    const producto =
    carrito.find(p => p.id === id);

    if(producto){

        producto.cantidad++;

    }

    guardarCarrito();
    renderCarrito();

}

// =========================
// RESTAR
// =========================

function restarCantidad(id){

    const producto =
    carrito.find(p => p.id === id);

    if(producto && producto.cantidad > 1){

        producto.cantidad--;

    }

    guardarCarrito();
    renderCarrito();

}

// =========================
// ELIMINAR
// =========================

function eliminarProducto(id){

    carrito =
    carrito.filter(p => p.id !== id);

    guardarCarrito();
    renderCarrito();

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
// WHATSAPP
// =========================

function finalizarCompra(){

    if(carrito.length === 0){

        alert("Tu carrito está vacío");
        return;

    }

    let mensaje =
    "Hola, quiero comprar:%0A%0A";

    carrito.forEach(producto => {

        mensaje +=
        `• ${producto.nombre}
        x${producto.cantidad}
        - $${producto.precio}%0A`;

    });

    const total =
    carrito.reduce((acc,p) => {

        return acc +
        (p.precio * p.cantidad);

    },0);

    mensaje += `%0ATotal: $${total}`;

    window.open(
    `https://wa.me/573148471107?text=${mensaje}`
    );

}

// =========================
// INICIAR
// =========================

renderCarrito();
