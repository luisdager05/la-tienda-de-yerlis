// Obtener ID desde URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Lista de productos (igual a mujer.html)
const productos = [
    {id: "101", nombre: "Blusa Elegante", precio: 50000, imagen: "img/mujer1.jpg"},
    {id: "102", nombre: "Vestido Rojo", precio: 80000, imagen: "img/mujer2.jpg"},
    {id: "103", nombre: "Jean Ajustado", precio: 70000, imagen: "img/mujer3.jpg"},
    {id: "104", nombre: "Falda Casual", precio: 45000, imagen: "img/mujer4.jpg"},
    {id: "105", nombre: "Chaqueta Denim", precio: 120000, imagen: "img/mujer5.jpg"},
    {id: "106", nombre: "Top Negro", precio: 35000, imagen: "img/mujer6.jpg"},
    {id: "107", nombre: "Vestido Floral", precio: 90000, imagen: "img/mujer7.jpg"},
    {id: "108", nombre: "Pantalón Elegante", precio: 85000, imagen: "img/mujer8.jpg"},
    {id: "109", nombre: "Blusa Blanca", precio: 55000, imagen: "img/mujer9.jpg"},
    {id: "110", nombre: "Short Jeans", precio: 60000, imagen: "img/mujer10.jpg"},
    {id: "111", nombre: "Blazer Formal", precio: 150000, imagen: "img/mujer11.jpg"},
    {id: "112", nombre: "Crop Top", precio: 40000, imagen: "img/mujer12.jpg"},
    {id: "113", nombre: "Falda Larga", precio: 75000, imagen: "img/mujer13.jpg"},
    {id: "114", nombre: "Enterizo", precio: 110000, imagen: "img/mujer14.jpg"},
    {id: "115", nombre: "Camisa Rayas", precio: 65000, imagen: "img/mujer15.jpg"},
    {id: "116", nombre: "Sudadera", precio: 95000, imagen: "img/mujer16.jpg"},
    {id: "117", nombre: "Leggings", precio: 50000, imagen: "img/mujer17.jpg"},
    {id: "118", nombre: "Vestido Negro", precio: 130000, imagen: "img/mujer18.jpg"},
    {id: "119", nombre: "Blusa Seda", precio: 85000, imagen: "img/mujer19.jpg"},
    {id: "120", nombre: "Chaqueta Cuero", precio: 200000, imagen: "img/mujer20.jpg"}
];

// Buscar producto
const producto = productos.find(p => p.id === id);

// Mostrar en pantalla
const contenedor = document.getElementById("detalle-producto");

if (producto) {
    contenedor.innerHTML = `
        <div class="detalle-card">
            <img src="${producto.imagen}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <button class="btn-agregar"
                data-id="${producto.id}"
                data-nombre="${producto.nombre}"
                data-precio="${producto.precio}"
                data-imagen="${producto.imagen}">
                Agregar al carrito
            </button>
        </div>
    `;
}