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

        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (error || !data) {
            slider.innerHTML = "<h2>Error cargando productos</h2>";
            return;
        }

        if (data.length === 0) {
            slider.innerHTML = "<h2>No hay productos</h2>";
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
                    data-negro="${p.imagen_negro || p.imagen}"
                    data-blanco="${p.imagen_blanco || p.imagen}"
                    data-rosado="${p.imagen_rosado || p.imagen}"
                    data-azul="${p.imagen_azul || p.imagen}"
                    alt="${p.nombre}">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">
                            $${Number(p.precio).toLocaleString()}
                        </p>

                        <p class="cantidad">
                            ${p.categoria || "Sin categoría"}
                        </p>

                        <!-- TALLAS -->
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
                                onclick="cambiarColor('Negro', this)"></span>

                                <span class="color blanco"
                                onclick="cambiarColor('Blanco', this)"></span>

                                <span class="color rosado"
                                onclick="cambiarColor('Rosado', this)"></span>

                                <span class="color azul"
                                onclick="cambiarColor('Azul', this)"></span>

                            </div>

                        </div>

                        <button onclick="
                        agregarAlCarrito(
                            this,
                            '${p.id}',
                            '${p.nombre}',
                            '${p.precio}',
                            '${p.imagen}'
                        )
                        ">
                            🛒 Agregar al carrito
                        </button>

                        <button onclick="
                        abrirModal(
                            '${p.nombre}',
                            '${p.precio}',
                            '${p.imagen}'
                        )
                        ">
                            👁 Ver rápido
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
    // CARRUSEL
    // =========================

    function iniciarCarrusel() {

        clearInterval(intervalo);

        intervalo = setInterval(() => {

            const cards =
            document.querySelectorAll(".card");

            if (!cards.length) return;

            index++;

            if (index >= cards.length) index = 0;

            const width =
            cards[0].offsetWidth + 20;

            slider.scrollTo({
                left: index * width,
                behavior: "smooth"
            });

        }, 2500);

    }

    // =========================
    // MOSTRAR SECCIONES
    // =========================

    function mostrarSecciones(productos) {

        const mujer = document.getElementById("mujer");
        const hombre = document.getElementById("hombre");
        const accesorios = document.getElementById("accesorios");
        const destacados = document.getElementById("destacados");
        const vendidos = document.getElementById("vendidos");

        if (!mujer || !hombre || !accesorios || !destacados || !vendidos) return;

        mujer.innerHTML = "";
        hombre.innerHTML = "";
        accesorios.innerHTML = "";
        destacados.innerHTML = "";
        vendidos.innerHTML = "";

        productos.forEach(p => {

            const card = `

                <div class="producto">

                    <img
                    class="img-producto"
                    src="${p.imagen || './img/error.png'}"
                    data-negro="${p.imagen_negro || p.imagen}"
                    data-blanco="${p.imagen_blanco || p.imagen}"
                    data-rosado="${p.imagen_rosado || p.imagen}"
                    data-azul="${p.imagen_azul || p.imagen}"
                    alt="${p.nombre}">

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
                            onclick="cambiarColor('Negro', this)"></span>

                            <span class="color blanco"
                            onclick="cambiarColor('Blanco', this)"></span>

                            <span class="color rosado"
                            onclick="cambiarColor('Rosado', this)"></span>

                            <span class="color azul"
                            onclick="cambiarColor('Azul', this)"></span>

                        </div>

                    </div>

                    <button onclick="
                    agregarAlCarrito(
                        this,
                        '${p.id}',
                        '${p.nombre}',
                        '${p.precio}',
                        '${p.imagen}'
                    )
                    ">
                        🛒 Agregar al carrito
                    </button>

                </div>

            `;

            destacados.innerHTML += card;
            vendidos.innerHTML += card;

            if (p.categoria === "mujer") mujer.innerHTML += card;
            if (p.categoria === "hombre") hombre.innerHTML += card;
            if (p.categoria === "accesorios") accesorios.innerHTML += card;

        });

    }

    // =========================
    // BUSCADOR
    // =========================

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
// CAMBIAR COLOR REAL
// =========================

function cambiarColor(color, el){

    const card = el.closest(".producto") || el.closest(".card");
    const img = card.querySelector(".img-producto");

    switch(color){

        case "Negro":
            img.style.filter = "brightness(0.3)";
        break;

        case "Blanco":
            img.style.filter = "brightness(1.5) grayscale(100%)";
        break;

        case "Rosado":
            img.style.filter = "hue-rotate(-30deg) saturate(1.5)";
        break;

        case "Azul":
            img.style.filter = "hue-rotate(180deg) saturate(1.5)";
        break;

    }

}

// =========================
// MODAL
// =========================

function abrirModal(nombre, precio, imagen){

    const modal = document.getElementById("modal");
    if(!modal) return;

    modal.style.display = "flex";

    document.getElementById("modal-img").src = imagen;
    document.getElementById("modal-title").innerText = nombre;
    document.getElementById("modal-price").innerText = "$" + precio;

}

function cerrarModal(){

    const modal = document.getElementById("modal");
    if(!modal) return;

    modal.style.display = "none";

}
