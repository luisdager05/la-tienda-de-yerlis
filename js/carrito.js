let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// ABRIR CARRITO
// =========================

function toggleCarrito(){
    document.getElementById("carrito").classList.toggle("active");
}

function cerrarCarrito(){
    document.getElementById("carrito").classList.remove("active");
}

// =========================
// AGREGAR PRODUCTO
// =========================

function agregarAlCarrito(producto){

    const existe = carrito.find(p => p.id === producto.id);

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

    const contenedor = document.getElementById("itemsCarrito");
    const totalHTML = document.getElementById("totalCarrito");
    const contador = document.getElementById("contadorCarrito");

    contenedor.innerHTML = "";

    let total = 0;
    let totalProductos = 0;

    carrito.forEach(producto => {

        total += producto.precio * producto.cantidad;
        totalProductos += producto.cantidad;

        contenedor.innerHTML += `

            <div class="item-carrito">

                <img src="${producto.imagen}" alt="">

                <div class="item-info">

                    <h4>${producto.nombre}</h4>

                    <p>$${producto.precio}</p>

                    <div class="controles">

                        <button onclick="restarCantidad(${producto.id})">-</button>

                        <span>${producto.cantidad}</span>

                        <button onclick="sumarCantidad(${producto.id})">+</button>
renderCarrito();
