console.log("SUPABASE:", window.supabaseClient);

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosGlobal = [];

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    let index = 0;
    let intervalo;

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

    async function cargarProductos() {

        const { data, error } = await window.supabaseClient
            .from("productos")
            .select("*");

        if (error || !data) {
            slider.innerHTML = "<h2>Error cargando productos</h2>";
            console.error(error);
            return;
        }

        productosGlobal = data;

        render(data);
        mostrarSecciones(data);
        activarBuscador();
    }

    function parseArray(valor) {
        if (!valor) return [];
        if (Array.isArray(valor)) return valor;

        try {
            return JSON.parse(valor);
        } catch {
            return String(valor)
                .replace(/[{}"]/g, "")
                .split(",")
                .map(v => v.trim());
        }
    }

    // =========================
    // 🔥 AQUÍ ESTÁ LA CORRECCIÓN CLAVE
    // =========================
    function render(productos) {

    slider.innerHTML = "";
    dots.innerHTML = "";

    productos.forEach((p, i) => {

        const tallas = parseArray(p.talla);
        const colores = parseArray(p.colores);

        // =========================
        // 🔥 IMAGEN SEGURA (SUPABASE + FALLBACK)
        // =========================
        let imgFinal = "./img/error.png";

        if (p.imagen) {
            if (p.imagen.startsWith("http")) {
                imgFinal = p.imagen; // URL Supabase
            } else {
                imgFinal = `./img/${p.imagen}`; // imagen local
            }
        }

        slider.innerHTML += `
            <div class="card">

                <img src="${imgFinal}"
                    onerror="this.src='./img/error.png'"
                    onclick="abrirModalProductoPorId(${p.id})">

                <h3>${p.nombre}</h3>

                <p>$${Number(p.precio).toLocaleString()}</p>

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

                <button onclick="abrirModalProductoPorId(${p.id})">
                    👁 Ver
                </button>

                <button onclick="agregarAlCarrito(
                    this,
                    '${p.id}',
                    '${p.nombre}',
                    '${p.precio}',
                    '${imgFinal}'
                )">
                    🛒 Agregar
                </button>

            </div>
        `;

        dots.innerHTML += `<span class="${i === 0 ? "active" : ""}"></span>`;
    });

    iniciarCarrusel();
}

    function iniciarCarrusel() {

        clearInterval(intervalo);

        intervalo = setInterval(() => {

            const cards = document.querySelectorAll(".card");
            if (!cards.length) return;

            index++;
            if (index >= cards.length) index = 0;

            const width = cards[0].offsetWidth + 20;

            slider.scrollTo({
                left: index * width,
                behavior: "smooth"
            });

        }, 2000);
    }
});

    slider?.addEventListener("mouseenter", () => clearInterval(intervalo));
    slider?.addEventListener("mouseleave", iniciarCarrusel);

    // =========================
    // BUSCADOR
    // =========================
    function activarBuscador() {

        const buscador = document.getElementById("buscador");
        if (!buscador) return;

        buscador.addEventListener("input", () => {

            const texto = buscador.value.toLowerCase();

            if (!texto) {
                mostrarSecciones(productosGlobal);
                render(productosGlobal);
                return;
            }

            const filtrados = productosGlobal.filter(p =>
                p.nombre?.toLowerCase().includes(texto) ||
                p.categoria?.toLowerCase().includes(texto)
            );

            mostrarSecciones(filtrados);
            render(filtrados);
        });
    }

});

// =========================
// COLOR
// =========================
function seleccionarColor(color, el) {

    const card = el.closest(".card") || el.closest(".producto");
    if (!card) return;

    card.dataset.color = color;

    card.querySelectorAll(".color").forEach(c =>
        c.classList.remove("activo")
    );

    el.classList.add("activo");
}

// =========================
// CARRITO
// =========================
function agregarAlCarrito(btn, id, nombre, precio, imagen) {

    const card = btn.closest(".card") || btn.closest(".producto");

    const talla = card?.querySelector(".select-talla")?.value;
    const color = card?.dataset.color;

    if (!talla) return mostrarNotificacion("⚠️ Selecciona talla");
    if (!color) return mostrarNotificacion("⚠️ Selecciona color");

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

    guardarCarrito();
    actualizarCarrito();

    mostrarNotificacion("✅ Agregado al carrito");
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {

    const items = document.getElementById("itemsCarrito");
    const total = document.getElementById("totalCarrito");
    const contador = document.getElementById("contadorCarrito");

    if (!items) return;

    items.innerHTML = "";
    let totalFinal = 0;

    carrito.forEach((item, i) => {

        totalFinal += item.precio * item.cantidad;

        items.innerHTML += `
        <div class="item-carrito">

            <img src="${item.imagen}">

            <div>
                <h4>${item.nombre}</h4>
                <p>$${Number(item.precio).toLocaleString()}</p>
                <p>${item.talla} | ${item.color}</p>

                <button onclick="cambiarCantidad(${i}, -1)">-</button>
                ${item.cantidad}
                <button onclick="cambiarCantidad(${i}, 1)">+</button>
            </div>

            <button onclick="eliminarProducto(${i})">✖</button>

        </div>`;
    });

    total.innerText = totalFinal.toLocaleString();
    contador.innerText = carrito.reduce((a, b) => a + b.cantidad, 0);
}

function cambiarCantidad(i, c) {
    carrito[i].cantidad += c;
    if (carrito[i].cantidad <= 0) carrito.splice(i, 1);

    guardarCarrito();
    actualizarCarrito();
}

function eliminarProducto(i) {
    carrito.splice(i, 1);
    guardarCarrito();
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
// NOTIFICACION
// =========================
function mostrarNotificacion(texto) {

    const noti = document.getElementById("notificacion");
    if (!noti) return;

    noti.innerText = texto;
    noti.classList.add("active");

    setTimeout(() => {
        noti.classList.remove("active");
    }, 2500);
}

