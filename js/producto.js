// =======================
// CARGAR DATOS
// =======================
const productos = JSON.parse(localStorage.getItem("productos")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let cantidad = 1;

// =======================
// OBTENER ID DESDE LA URL ✅
// =======================
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// 🔥 Buscar producto (CORREGIDO)
let producto = productos.find(p => p.id == id);

// 🔥 SI NO EXISTE EN LOCALSTORAGE (PRODUCTOS HTML)
if (!producto) {

  const productosHTML = {
  101: { nombre: "Blusa Elegante", precio: 50000, imagen: "img/imagen1.png" },
  102: { nombre: "Vestido Rojo", precio: 80000, imagen: "img/imagen2.png" },
  103: { nombre: "Jean Ajustado", precio: 70000, imagen: "img/imagen3.png" },
  104: { nombre: "Falda Casual", precio: 45000, imagen: "img/imagen1.png" },
  105: { nombre: "Chaqueta Denim", precio: 120000, imagen: "img/imagen2.png" },
  106: { nombre: "Top Negro", precio: 35000, imagen: "img/imagen1.png" },
  107: { nombre: "Vestido Floral", precio: 90000, imagen: "img/imagen2.png" },
  108: { nombre: "Pantalón Elegante", precio: 85000, imagen: "img/imagen1.png" },
  109: { nombre: "Blusa Blanca", precio: 55000, imagen: "img/imagen1.png" },
  110: { nombre: "Short Jeans", precio: 60000, imagen: "img/imagen4.png" },
  111: { nombre: "Blazer Formal", precio: 150000, imagen: "img/imagen1.png" },
  112: { nombre: "Crop Top", precio: 40000, imagen: "img/imagen5.png" },
  113: { nombre: "Falda Larga", precio: 75000, imagen: "img/imagen1.png" },
  114: { nombre: "Enterizo", precio: 110000, imagen: "img/imagen2.png" },
  115: { nombre: "Camisa Rayas", precio: 65000, imagen: "img/imagen1.png" },
  116: { nombre: "Sudadera", precio: 95000, imagen: "img/imagen3.png" },
  117: { nombre: "Leggings", precio: 50000, imagen: "img/imagen5.png" },
  118: { nombre: "Vestido Negro", precio: 130000, imagen: "img/imagen1.png" },
  119: { nombre: "Blusa Seda", precio: 85000, imagen: "img/imagen4.png" },
  120: { nombre: "Chaqueta Cuero", precio: 200000, imagen: "img/imagen1.png" }
};

  if (productosHTML[id]) {
    producto = {
      id: id,
      ...productosHTML[id]
    };
  }
}

// =======================
// PINTAR DETALLE
// =======================
function pintarProducto() {

  if (!producto) {
    document.querySelector(".detalle").innerHTML = "<h2>Producto no encontrado 😢</h2>";
    return;
  }

  document.getElementById("img-producto").src = producto.imagen;
  document.getElementById("nombre").innerText = producto.nombre;
  document.getElementById("precio").innerText = "$" + producto.precio.toLocaleString();
  document.getElementById("cant").innerText = cantidad;
}

// =======================
// SUMAR / RESTAR
// =======================
window.sumar = function () {
  cantidad++;
  document.getElementById("cant").innerText = cantidad;
};

window.restar = function () {
  if (cantidad > 1) cantidad--;
  document.getElementById("cant").innerText = cantidad;
};

// =======================
// AGREGAR AL CARRITO
// =======================
window.agregarCarrito = function () {

  if (!producto) return;

  const existe = carrito.find(p => p.id == producto.id);

  if (existe) {
    existe.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: cantidad
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  alert("Producto agregado al carrito 🛒");
};

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", pintarProducto);


window.comprarAhora = function () {

  if (!producto) return;

  carrito = [];

  carrito.push({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    cantidad: cantidad
  });

  localStorage.setItem("carrito", JSON.stringify(carrito));

  window.location.href = "checkout.html"; // 🔥 página de compra
};