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

        // GUARDAR GLOBALMENTE
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

                        <!-- TALLA -->
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
// BOTONES SLIDER
// =========================

const btnPrev =
document.getElementById("prev");

const btnNext =
document.getElementById("next");

btnNext?.addEventListener("click", () => {

    const cards =
    document.querySelectorAll(".card");

    if (!cards.length) return;

    const width =
    cards[0].offsetWidth + 20;

    index++;

    if (index >= cards.length) {

        index = 0;

    }

    slider.scrollTo({

        left: index * width,
        behavior: "smooth"

    });

});

btnPrev?.addEventListener("click", () => {

    const cards =
    document.querySelectorAll(".card");

    if (!cards.length) return;

    const width =
    cards[0].offsetWidth + 20;

    index--;

    if (index < 0) {

        index = cards.length - 1;

    }

    slider.scrollTo({

        left: index * width,
        behavior: "smooth"

    });

});

    // =========================
// PAUSAR SLIDER CON HOVER
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

// slider.addEventListener("mouseenter", () => {

//     clearInterval(intervalo);

// });

// // REANUDAR
// slider.addEventListener("mouseleave", () => {

//     intervalo = setInterval(() => {

//         moverSlider();

//     }, 2000);

// });

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

            // MOSTRAR TODO
            if (texto === "") {

                mostrarSecciones(productosGlobal);
                render(productosGlobal);

                return;
            }

            // FILTRAR
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
    .forEach(c => {

        c.classList.remove("activo");

    });

    el.classList.add("activo");

}
/* =========================
   CARRITO
========================= */

let carrito = [];

/* =========================
   AGREGAR AL CARRITO
========================= */

function agregarAlCarrito(
    btn,
    id,
    nombre,
    precio,
    imagen,
    opciones = {}
){

    /* VALIDAR TALLA */

    if(!opciones.talla){

        alert("⚠️ Por favor seleccione una talla");

        return;
    }

    /* VALIDAR COLOR */

    if(!opciones.color){

        alert("⚠️ Por favor seleccione un color");

        return;
    }

    /* AGREGAR */

    carrito.push({

        id,
        nombre,
        precio,
        imagen,

        talla: opciones.talla,

        color: opciones.color,

        cantidad:1

    });

    /* MENSAJE */

    alert("✅ Producto agregado al carrito exitosamente");

    actualizarCarrito();

}

/* =========================
   FINALIZAR COMPRA
========================= */

function finalizarCompra(){

    const nombre =
    document.getElementById("clienteNombre")
    .value.trim();

    const telefono =
    document.getElementById("clienteTelefono")
    .value.trim();

    const direccion =
    document.getElementById("clienteDireccion")
    .value.trim();

    /* CARRITO VACIO */

    if(carrito.length === 0){

        alert("⚠️ Tu carrito está vacío");

        return;

    }

    /* NOMBRE */

    if(nombre === ""){

        alert("⚠️ El nombre es obligatorio");

        return;

    }

    /* TELEFONO */

    if(telefono === ""){

        alert("⚠️ El teléfono es obligatorio");

        return;

    }

    /* DIRECCION */

    if(direccion === ""){

        alert("⚠️ La dirección es obligatoria");

        return;

    }

    /* EXITO */

    alert("✅ Pedido realizado exitosamente");

}
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

    // BOTON AGREGAR
    document.getElementById("btnAgregarModal")
    .onclick = function () {

        agregarAlCarrito(
            this,
            producto.id,
            producto.nombre,
            producto.precio,
            producto.imagen
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

    // TODOS
    if(categoria === "todos"){

        titulo.innerText =
        "🔥 Todos los productos";

        mostrarSecciones(
            window.productosGlobalData
        );

        return;
    }

    // FILTRAR
    const filtrados =
    window.productosGlobalData.filter(p =>

        p.categoria &&
        p.categoria.toLowerCase().trim() ===
        categoria.toLowerCase().trim()

    );

    // TITULO
    titulo.innerText =
    categoria.charAt(0).toUpperCase() +
    categoria.slice(1);

    // MOSTRAR
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

    <!-- IMAGEN -->
    <img
    class="img-producto"
    src="${p.imagen || './img/error.png'}"
    alt="${p.nombre}"
    onclick="abrirModalProductoPorId(${p.id})">

    <!-- INFO -->
    <div class="info">

        <!-- TITULO -->
        <h3>${p.nombre}</h3>

        <!-- PRECIO -->
        <p class="precio">
            $${Number(p.precio).toLocaleString()}
        </p>

        <!-- TALLA -->
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
        class="btn-ver"
        onclick="abrirModalProductoPorId(${p.id})">

            👁 Ver rápido

        </button>

        <!-- BOTON CARRITO -->
        <button
        class="btn-agregar"
        onclick="
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

</div>

`;

        destacados.innerHTML += card;

    });

}
function seleccionarColor(color, el){

   ...
}


