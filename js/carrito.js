let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarCarrito(nombre, precio) {

    carrito.push({ nombre, precio });

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
}

function mostrarCarrito() {

    const contenedor = document.getElementById("itemsCarrito");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach((p, i) => {

        total += p.precio;

        contenedor.innerHTML += `
            <p>${p.nombre} - $${p.precio.toLocaleString()}</p>
        `;
    });

    contenedor.innerHTML += `<h3>Total: $${total.toLocaleString()}</h3>`;
}

function toggleCarrito() {
    document.getElementById("carrito").classList.toggle("active");
}

function cerrarCarrito() {
    document.getElementById("carrito").classList.remove("active");
}
