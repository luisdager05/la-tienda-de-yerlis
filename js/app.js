console.log("SUPABASE:", window.supabaseClient);

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosGlobal = [];

let index = 0;
let intervalo;

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    // =========================
    // ESPERAR SUPABASE
    // =========================
    const waitSupabase = () => {
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (window.supabaseClient) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    };

    waitSupabase().then(cargarProductos);

    // =========================
    // CARGAR PRODUCTOS
    // =========================
    async function cargarProductos() {

        const { data, error } = await window.supabaseClient
            .from("productos")
            .select("*");

        if (error || !data) {
            console.error(error);
            slider.innerHTML = "<h2>Error cargando productos</h2>";
            return;
        }

        productosGlobal = data;

        render(data);
        actualizarCarrito();
    }

    // =========================
    // RENDER
    // =========================
    function render(productos) {

        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {

            const tallas = parseArray(p.talla);
            const colores = parseArray(p.colores);

            let imgFinal = "./img/error.png";

            if (p.imagen) {
                if (p.imagen.startsWith("http")) {
                    imgFinal = p.imagen;
                } else {
                    imgFinal = `https://sgkhlrimsanjeoxjtvnx.supabase.co/storage/v1/object/public/${p.imagen}`;
                }
            }

            slider.innerHTML += `
            <div class="card-producto">

                <div class="img-box">
                    <img src="${imgFinal}" class="img-producto" onerror="this.src='./img/error.png'">
                </div>

                <div class="info-producto">

                    <h3 class="titulo-producto">${p.nombre}</h3>

                    <p class="precio-producto">$${Number(p.precio).toLocaleString()}</p>

                    <select class="select-talla">
                        <option value="">Seleccionar</option>
                        ${tallas.map(t => `<option value="${t}">${t}</option>`).join("")}
                    </select>

                    <div class="colores">
                        ${colores.map(c => `
                            <span class="color ${c.toLowerCase()}"
                                onclick="seleccionarColor('${c}', this)">
                            </span>
                        `).join("")}
                    </div>

                    <button class="btn-agregar"
                        onclick="agregarAlCarrito(this,'${p.id}','${p.nombre}','${p.precio}','${imgFinal}')">
                        🛒 Agregar
                    </button>

                </div>
            </div>
            `;

            dots.innerHTML += `<span></span>`;
        });

        iniciarCarrusel();
    }

    // =========================
    // CARRUSEL
    // =========================
    function iniciarCarrusel() {

        clearInterval(intervalo);

        const slides = document.querySelectorAll("#slider .card-producto");

        if (!slides.length) return;

        index = 0;

        intervalo = setInterval(() => {

            const slides = document.querySelectorAll("#slider .card-producto");
            if (!slides.length) return;

            index++;

            if (index >= slides.length) {
                index = 0;
            }

            const width = slides[0].offsetWidth + 20;

            slider.scrollTo({
                left: index * width,
                behavior: "smooth"
            });

            actualizarDots();

        }, 2500);
    }

   // =========================
// ACTUALIZAR CARRITO
// =========================
function actualizarCarrito() {

    const items = document.getElementById("itemsCarrito");
    const total = document.getElementById("totalCarrito");
    const contador = document.getElementById("contadorCarrito");

    if (!items) return;

    items.innerHTML = "";

    let totalFinal = 0;

    carrito.forEach((producto, i) => {

        totalFinal += producto.precio * producto.cantidad;

        items.innerHTML += `
        <div class="item-carrito">

            <img src="${producto.imagen}" alt="${producto.nombre}">

            <div class="item-info">

                <h4>${producto.nombre}</h4>

                <p class="precio-carrito">
                    $${Number(producto.precio).toLocaleString()}
                </p>

                <p class="detalle-carrito">
                    ${producto.talla} | ${producto.color}
                </p>

                <div class="cantidad-box">

                    <button type="button"
                        onclick="cambiarCantidad(${i}, -1)">
                        -
                    </button>

                    <span>${producto.cantidad}</span>

                    <button type="button"
                        onclick="cambiarCantidad(${i}, 1)">
                        +
                    </button>

                </div>

            </div>

            <button type="button"
                class="btn-eliminar"
                onclick="eliminarProducto(${i})">

                ✕

            </button>

        </div>
        `;
    });

    total.innerText =
        Number(totalFinal).toLocaleString();

    contador.innerText =
        carrito.reduce(
            (total, item) => total + item.cantidad,
            0
        );

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}

    // =========================
    // DETENER CARRUSEL
    // =========================
    slider?.addEventListener("mouseenter", () => clearInterval(intervalo));
    slider?.addEventListener("mouseleave", iniciarCarrusel);

});

// =========================
// COLOR (CORREGIDO)
// =========================
function seleccionarColor(color, el) {

    const card = el.closest(".card-producto");
    if (!card) return;

    card.dataset.color = color;

    card.querySelectorAll(".color").forEach(c =>
        c.classList.remove("activo")
    );

    el.classList.add("activo");
}

// =========================
// AGREGAR AL CARRITO (CORREGIDO)
// =========================
function agregarAlCarrito(btn, id, nombre, precio, imagen) {

    const card = btn.closest(".card-producto");

    const talla = card?.querySelector(".select-talla")?.value;
    const color = card?.dataset.color;

    if (!talla) return alert("Selecciona talla");
    if (!color) return alert("Selecciona color");

    const producto = {
        id,
        nombre,
        precio: Number(precio),
        imagen,
        talla,
        color,
        cantidad: 1
    };

    const existe = carrito.find(i =>
        i.id == id && i.talla == talla && i.color == color
    );

    if (existe) existe.cantidad++;
    else carrito.push(producto);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

// =========================
// CARRITO
// =========================
function actualizarCarrito() {

    const items = document.getElementById("itemsCarrito");
    const total = document.getElementById("totalCarrito");
    const contador = document.getElementById("contadorCarrito");

    if (!items) return;
    itemsCarrito.innerHTML += `
<div class="item-carrito">

    <img src="${producto.imagen}" alt="${producto.nombre}">

    <div class="item-info">

        <h4>${producto.nombre}</h4>

        <p class="precio-carrito">
            $${producto.precio.toLocaleString()}
        </p>

        <p class="detalle-carrito">
            ${producto.talla} | ${producto.color}
        </p>

        <div class="cantidad-box">

            <button onclick="cambiarCantidad(${i}, -1)">
                -
            </button>

            <span>${producto.cantidad}</span>

            <button onclick="cambiarCantidad(${i}, 1)">
                +
            </button>

        </div>

    </div>

    <button class="btn-eliminar"
        onclick="eliminarProducto(${i})">

        ✕

    </button>

</div>
`;

 

    total.innerText = totalFinal.toLocaleString();
    contador.innerText = carrito.reduce((a, b) => a + b.cantidad, 0);
}

// =========================
// CONTROL CARRITO
// =========================
function cambiarCantidad(i, c) {

    if (!carrito[i]) return;

    carrito[i].cantidad += c;

    if (carrito[i].cantidad <= 0) {
        carrito.splice(i, 1);
    }

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    actualizarCarrito();
}

function eliminarProducto(i) {

    carrito.splice(i, 1);

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    actualizarCarrito();
}

// =========================
// UI CARRITO
// =========================
function toggleCarrito() {
    document.getElementById("carrito")?.classList.toggle("active");
}

function cerrarCarrito() {
    document.getElementById("carrito")?.classList.remove("active");
}

// =========================
// UTILIDAD
// =========================
function mostrarNotificacion(texto) {
    const noti = document.getElementById("notificacion");
    if (!noti) return;

    noti.innerText = texto;
    noti.classList.add("active");

    setTimeout(() => noti.classList.remove("active"), 2500);
}

// =========================
// PARSE ARRAY
// =========================
function parseArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return value.split(",").map(v => v.trim());
}

function cambiarCantidad(i, cambio) {

    if (!carrito[i]) return;

    carrito[i].cantidad += cambio;

    if (carrito[i].cantidad <= 0) {
        carrito.splice(i, 1);
    }

    actualizarCarrito();
}

function eliminarProducto(i) {

    carrito.splice(i, 1);

    actualizarCarrito();
}


