```javascript
console.log("SUPABASE:", window.supabaseClient);

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    let index = 0;
    let intervalo;
    let productosGlobal = [];

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

        const { data, error } =
        await window.supabaseClient
            .from("productos")
            .select("*");

        if (error || !data) {

            slider.innerHTML =
            "<h2>Error cargando productos</h2>";

            return;
        }

        window.productosGlobalData = data;
        productosGlobal = data;

        render(data);
        mostrarSecciones(data);
        activarBuscador();

    }

    // =========================
    // RENDER SLIDER
    // =========================

    function render(productos) {

        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {

            slider.innerHTML += `

                <div class="card">

                    <img
                    class="img-producto"
                    src="${p.imagen || './img/error.png'}"
                    alt="${p.nombre}"
                    onclick="abrirModalProductoPorId(${p.id})">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">
                            $${Number(p.precio).toLocaleString()}
                        </p>

                        <!-- TALLAS -->
                        <div class="selector-opciones">

                            <label>Talla:</label>

                            <select class="select-talla">

                                <option value="">
                                    Seleccionar
                                </option>

                                ${p.talla?.map(t => `

                                    <option value="${t}">
                                        ${t}
                                    </option>

                                `).join("") || ""}

                            </select>

                        </div>

                        <!-- COLORES -->
                        <div class="selector-opciones">

                            <label>Color:</label>

                            <div class="colores">

                                ${p.colores?.map(color => `

                                    <span
                                    class="color ${color.toLowerCase()}"
                                    onclick="seleccionarColor('${color}', this)"
                                    title="${color}">
                                    </span>

                                `).join("") || ""}

                            </div>

                        </div>

                        <!-- BOTON VER -->
                        <button
                        onclick="abrirModalProductoPorId(${p.id})">

                            👁 Ver rápido

                        </button>

                        <!-- BOTON CARRITO -->
                        <button onclick="
                            agregarAlCarrito(
                                this,
                                '${p.id}',
                                '${p.nombre}',
                                '${p.precio}',
                                '${p.imagen}',
                                {
                                    talla: this.closest('.card')?.querySelector('.select-talla')?.value || '',
                                    color: this.closest('.card')?.dataset.color || ''
                                }
                            )
                        ">

                            🛒 Agregar al carrito

                        </button>

                    </div>

                </div>

            `;

            dots.innerHTML += `
                <span class="${i === 0 ? "active" : ""}"></span>
            `;

        });

        iniciarCarrusel();

    }

    // =========================
    // INICIAR CARRUSEL
    // =========================

    function iniciarCarrusel() {

        clearInterval(intervalo);

        intervalo = setInterval(() => {

            const cards =
            document.querySelectorAll(".card");

            if (!cards.length) return;

            index++;

            if (index >= cards.length) {

                index = 0;

            }

            const width =
            cards[0].offsetWidth + 20;

            slider.scrollTo({

                left: index * width,
                behavior: "smooth"

            });

        }, 2000);

    }

    // =========================
    // PAUSAR SLIDER
    // =========================

    slider.addEventListener("mouseenter", () => {

        clearInterval(intervalo);

    });

    // =========================
    // REANUDAR SLIDER
    // =========================

    slider.addEventListener("mouseleave", () => {

        iniciarCarrusel();

    });

    // =========================
    // BUSCADOR
    // =========================

    function activarBuscador() {

        const buscador =
        document.getElementById("buscador");

        if (!buscador) return;

        buscador.addEventListener("input", () => {

            const texto =
            buscador.value.toLowerCase().trim();

            if (texto === "") {

                mostrarSecciones(productosGlobal);
                render(productosGlobal);

                return;
            }

            const filtrados =
            productosGlobal.filter(p =>

                p.nombre?.toLowerCase()
                .includes(texto)

                ||

                p.categoria?.toLowerCase()
                .includes(texto)

            );

            mostrarSecciones(filtrados);
            render(filtrados);

        });

    }

});

// =========================
// COLOR SELECCIONADO
// =========================

function seleccionarColor(color, el){

    const card =
    el.closest(".producto")
    ||
    el.closest(".card");

    if(!card) return;

    card.dataset.color = color;

    card.querySelectorAll(".color")
    .forEach(c =>
        c.classList.remove("activo")
    );

    el.classList.add("activo");

}

// =========================
// ABRIR MODAL POR ID
// =========================

function abrirModalProductoPorId(id){

    const producto =
    window.productosGlobalData
    .find(p => p.id == id);

    if(!producto) return;

    abrirModalProducto(producto);

}

// =========================
// MODAL PRODUCTO
// =========================

function abrirModalProducto(producto){

    document.getElementById("modalProducto")
    .classList.add("active");

    document.getElementById("modalImagen")
    .src = producto.imagen;

    document.getElementById("modalNombre")
    .innerText = producto.nombre;

    document.getElementById("modalDescripcion")
    .innerText = producto.descripcion;

    document.getElementById("modalPrecio")
    .innerText =
    "$ " +
    Number(producto.precio)
    .toLocaleString();

    document.getElementById("modalCategoria")
    .innerText = producto.categoria;

    document.getElementById("btnAgregarModal")
    .onclick = function () {

        agregarAlCarrito(
            this,
            producto.id,
            producto.nombre,
            producto.precio,
            producto.imagen,
            {
                talla: document.querySelector("#modalProducto .select-talla")?.value || '',
                color: document.querySelector("#modalProducto")?.dataset.color || ''
            }
        );

        cerrarModalProducto();

    }

}

// =========================
// CERRAR MODAL
// =========================

function cerrarModalProducto(){

    document.getElementById("modalProducto")
    .classList.remove("active");

}

// =========================
// FILTRAR CATEGORIA
// =========================

function filtrarCategoria(categoria){

    const titulo =
    document.getElementById("tituloCategoria");

    if(categoria === "todos"){

        titulo.innerText =
        "🔥 Todos los productos";

        mostrarSecciones(
            window.productosGlobalData
        );

        return;
    }

    const filtrados =
    window.productosGlobalData.filter(p =>

        p.categoria &&
        p.categoria.toLowerCase().trim() ===
        categoria.toLowerCase().trim()

    );

    titulo.innerText =
    categoria.charAt(0).toUpperCase() +
    categoria.slice(1);

    mostrarSecciones(filtrados);

}

// =========================
// MOSTRAR PRODUCTOS
// =========================

function mostrarSecciones(productos) {

    const destacados =
    document.getElementById("destacados");

    if (!destacados) return;

    destacados.innerHTML = "";

    productos.forEach(p => {

        const card = `

            <div class="producto">

                <img
                class="img-producto"
                src="${p.imagen || './img/error.png'}"
                alt="${p.nombre}"
                onclick="abrirModalProductoPorId(${p.id})">

                <h3>${p.nombre}</h3>

                <p class="precio">
                    $${Number(p.precio).toLocaleString()}
                </p>

                <div class="selector-opciones">

                    <label>Talla:</label>

                    <select class="select-talla">

                        <option value="">
                            Seleccionar
                        </option>

                        ${p.talla?.map(t => `

                            <option value="${t}">
                                ${t}
                            </option>

                        `).join("") || ""}

                    </select>

                </div>

                <div class="selector-opciones">

                    <label>Color:</label>

                    <div class="colores">

                        ${p.colores?.map(color => `

                            <span
                            class="color ${color.toLowerCase()}"
                            onclick="seleccionarColor('${color}', this)"
                            title="${color}">
                            </span>

                        `).join("") || ""}

                    </div>

                </div>

                <button
                onclick="abrirModalProductoPorId(${p.id})">

                    👁 Ver rápido

                </button>

                <button onclick="
                    agregarAlCarrito(
                        this,
                        '${p.id}',
                        '${p.nombre}',
                        '${p.precio}',
                        '${p.imagen}',
                        {
                            talla: this.closest('.producto')?.querySelector('.select-talla')?.value || '',
                            color: this.closest('.producto')?.dataset.color || ''
                        }
                    )
                ">

                    🛒 Agregar al carrito

                </button>

            </div>

        `;

        destacados.innerHTML += card;

    });

}


// =========================
// CARRITO GLOBAL
// =========================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// AGREGAR AL CARRITO
// =========================

function agregarAlCarrito(btn, id, nombre, precio, imagen, extra = {}) {

    const card =
        btn?.closest(".producto") ||
        btn?.closest(".card");

    const talla =
        extra.talla ||
        card?.querySelector(".select-talla")?.value;

    const color =
        extra.color ||
        card?.dataset.color;

    if (!talla) {
        mostrarNotificacion("⚠️ Selecciona una talla");
        return;
    }

    if (!color) {
        mostrarNotificacion("⚠️ Selecciona un color");
        return;
    }

    const producto = {
        id,
        nombre,
        precio: Number(precio),
        imagen,
        talla,
        color,
        cantidad: 1
    };

    const existente = carrito.find(item =>
        item.id == id &&
        item.talla == talla &&
        item.color == color
    );

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push(producto);
    }

    guardarCarrito();
    actualizarCarrito();

    mostrarNotificacion("✅ Producto agregado");
}

// =========================
// GUARDAR
// =========================

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
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

    carrito.forEach((item, index) => {

        totalFinal += item.precio * item.cantidad;

        items.innerHTML += `

        <div class="item-carrito">

            <img src="${item.imagen}">

            <div class="item-info">

                <h4>${item.nombre}</h4>

                <p>$${Number(item.precio).toLocaleString()}</p>

                <p>Talla: ${item.talla}</p>

                <p>Color: ${item.color}</p>

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

    contador.innerText = carrito.reduce((acc, item) => {
        return acc + item.cantidad;
    }, 0);

}

// =========================
// CAMBIAR CANTIDAD
// =========================

function cambiarCantidad(index, cambio) {

    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    actualizarCarrito();

}

// =========================
// ELIMINAR PRODUCTO
// =========================

function eliminarProducto(index) {

    carrito.splice(index, 1);

    guardarCarrito();
    actualizarCarrito();

}

// =========================
// TOGGLE CARRITO
// =========================

function toggleCarrito() {

    document.getElementById("carrito")
    ?.classList.toggle("active");

}

function cerrarCarrito() {

    document.getElementById("carrito")
    ?.classList.remove("active");

}

// =========================
// NOTIFICACION
// =========================

function mostrarNotificacion(texto) {

    const noti =
    document.getElementById("notificacion");

    if (!noti) return;

    noti.innerText = texto;

    noti.classList.add("active");

    setTimeout(() => {

        noti.classList.remove("active");

    }, 2500);

}

// INICIAR
actualizarCarrito();

```

