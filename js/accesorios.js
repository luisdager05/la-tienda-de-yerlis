document.addEventListener("DOMContentLoaded", () => {

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    const contenedor = document.getElementById("contenedor-mujer");

    productos
    .filter(p => p.categoria === "accesorios")
    .forEach(p => {

        contenedor.innerHTML += `
            <div class="producto">
                <img src="${p.imagen}">
                <h3>${p.nombre}</h3>
                <p>$${p.precio}</p>
            </div>
        `;
    });

});