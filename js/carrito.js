function toggleCarrito(){
    document.getElementById("carrito").classList.toggle("active");
}

function cerrarCarrito(){
    document.getElementById("carrito").classList.remove("active");
}

// =========================
// AGREGAR PRODUCTO
// =========================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarCarrito(nombre, precio){

    carrito.push({ nombre, precio });

    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderCarrito();
}

// =========================
// MOSTRAR CARRITO
// =========================

function renderCarrito(){

    const contenedor = document.getElementById("itemsCarrito");

    contenedor.innerHTML = "";

    carrito.forEach((item, i) => {

        contenedor.innerHTML += `
            <div class="item-carrito">

                <p>${item.nombre}</p>

                <strong>$${Number(item.precio).toLocaleString()}</strong>

                <button onclick="eliminarItem(${i})">Eliminar</button>

            </div>
        `;

    });

}

// =========================
// ELIMINAR
// =========================

function eliminarItem(index){

    carrito.splice(index, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    renderCarrito();
}

// inicial
renderCarrito();
