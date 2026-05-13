console.log("SUPABASE:", window.supabaseClient);

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    let index = 0;
    let intervalo;
    let productosGlobal = [];

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

        const { data, error } =
        await window.supabaseClient
            .from("productos")
            .select("*");

        if (error || !data) {
            slider.innerHTML = "<h2>Error cargando productos</h2>";
            return;
        }

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
onclick='abrirModalProducto(${JSON.stringify(p)})'>

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">
                            $${Number(p.precio).toLocaleString()}
                        </p>

                        <!-- TALLA -->
                        <div class="selector-opciones">
                            <label>Talla:</label>
                            <select class="select-talla">
                                <option value="">Seleccionar</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>

                        <!-- COLORES -->
                        <div class="selector-opciones">
                            <label>Color:</label>

                            <div class="colores">

                                <span class="color negro"
                                onclick="seleccionarColor('Negro', this)"></span>

                                <span class="color blanco"
                                onclick="seleccionarColor('Blanco', this)"></span>

                                <span class="color rosado"
                                onclick="seleccionarColor('Rosado', this)"></span>

                                <span class="color azul"
                                onclick="seleccionarColor('Azul', this)"></span>

                            </div>
                        </div>

                        <!-- BOTONES -->
                        <button onclick="
                        abrirModal(
                            '${p.nombre}',
                            '${p.precio}',
                            '${p.imagen}'
                        )">
                            👁 Ver rápido
                        </button>

                        <button onclick="
                        agregarAlCarrito(
                            this,
                            '${p.id}',
                            '${p.nombre}',
                            '${p.precio}',
                            '${p.imagen}'
                        )">
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

        }, 2500);

    }

    
    function activarBuscador() {

        const buscador = document.getElementById("buscador");
        if (!buscador) return;

        buscador.addEventListener("input", () => {

            const texto = buscador.value.toLowerCase().trim();

            if (texto === "") {
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
// COLOR SELECCIONADO (CORREGIDO)
// =========================

function seleccionarColor(color, el){

    const card = el.closest(".producto") || el.closest(".card");

    if(!card) return;

    card.dataset.color = color;

    card.querySelectorAll(".color")
        .forEach(c => c.classList.remove("activo"));

    el.classList.add("activo");

}

// =========================
// MODAL
// =========================

function abrirModal(nombre, precio, imagen){

    const modal = document.getElementById("modal");
    if(!modal) return;

    modal.style.display = "flex";

    document.getElementById("modal-img").src = imagen || "./img/error.png";
    document.getElementById("modal-title").innerText = nombre;
    document.getElementById("modal-price").innerText =
        "$" + Number(precio).toLocaleString();

}

function cerrarModal(){

    const modal = document.getElementById("modal");
    if(modal) modal.style.display = "none";

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
    "$ " + Number(producto.precio)
    .toLocaleString();

    document.getElementById("modalCategoria")
    .innerText = producto.categoria;

    // BOTON CARRITO
    document.getElementById("btnAgregarModal")
    .onclick = () => {

        agregarAlCarrito(producto);

        cerrarModalProducto();
    }
}

function cerrarModalProducto(){

    document.getElementById("modalProducto")
    .classList.remove("active");
}

// =========================
// FILTRAR CATEGORIAS
// =========================

function filtrarCategoria(categoria){

    if(categoria === "todos"){

        mostrarSecciones(window.productosGlobalData);

        return;
    }

    const filtrados =
    window.productosGlobalData.filter(p =>

        p.categoria &&
        p.categoria.toLowerCase() === categoria

    );

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

                <button onclick="
                agregarAlCarrito(
                    this,
                    '${p.id}',
                    '${p.nombre}',
                    '${p.precio}',
                    '${p.imagen}'
                )">

                    🛒 Agregar al carrito

                </button>

            </div>

        `;

        destacados.innerHTML += card;

    });

}
