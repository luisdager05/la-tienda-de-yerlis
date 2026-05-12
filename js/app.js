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

        const { data, error } = await window.supabaseClient
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
src="${producto.imagen || './img/error.png'}"
alt="${producto.nombre}">

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

                            <select
class="select-color"
onchange="cambiarColorImagen(this)">

                                <option value="">Seleccionar</option>

                                <option value="Negro">Negro</option>

                                <option value="Blanco">Blanco</option>

                                <option value="Rosado">Rosado</option>

                                <option value="Azul">Azul</option>

                            </select>

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

            const cards = document.querySelectorAll(".card");

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

        }, 2500);

    }

    // =========================
    // MOSTRAR SECCIONES
    // =========================

    function mostrarSecciones(productos) {

        const mujer =
        document.getElementById("mujer");

        const hombre =
        document.getElementById("hombre");

        const accesorios =
        document.getElementById("accesorios");

        const destacados =
        document.getElementById("destacados");

        const vendidos =
        document.getElementById("vendidos");

        if (
            !mujer ||
            !hombre ||
            !accesorios ||
            !destacados ||
            !vendidos
        ) return;

        mujer.innerHTML = "";
        hombre.innerHTML = "";
        accesorios.innerHTML = "";
        destacados.innerHTML = "";
        vendidos.innerHTML = "";

        productos.forEach(producto => {

            const card = `

                <div class="producto">

                    <img
                    src="${producto.imagen || './img/error.png'}"
                    alt="${producto.nombre}">

                    <h3>${producto.nombre}</h3>

                    <p class="precio">

                        $${Number(producto.precio).toLocaleString()}

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

                        <select class="select-color">

                            <option value="">Seleccionar</option>

                            <option value="Negro">Negro</option>

                            <option value="Blanco">Blanco</option>

                            <option value="Rosado">Rosado</option>

                            <option value="Azul">Azul</option>

                        </select>

                    </div>

                    <button onclick="
                    agregarAlCarrito(
                        this,
                        '${producto.id}',
                        '${producto.nombre}',
                        '${producto.precio}',
                        '${producto.imagen}'
                    )
                    ">

                        🛒 Agregar al carrito

                    </button>

                </div>

            `;

            destacados.innerHTML += card;

            vendidos.innerHTML += card;

            if (producto.categoria === "mujer") {

                mujer.innerHTML += card;

            }

            if (producto.categoria === "hombre") {

                hombre.innerHTML += card;

            }

            if (producto.categoria === "accesorios") {

                accesorios.innerHTML += card;

            }

        });

    }

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
            productosGlobal.filter(p => {

                return (

                    p.nombre
                    ?.toLowerCase()
                    .includes(texto)

                    ||

                    p.categoria
                    ?.toLowerCase()
                    .includes(texto)

                );

            });

            mostrarSecciones(filtrados);

            render(filtrados);

        });

    }

});


// =========================
// CAMBIAR COLOR IMAGEN
// =========================

function cambiarColorImagen(select){

    const card =
    select.closest(".producto") ||
    select.closest(".card");

    const img =
    card.querySelector(".img-producto");

    const color = select.value;

    img.style.filter = "none";

    switch(color){

        case "Negro":

            img.style.filter =
            "brightness(0.4)";

        break;

        case "Blanco":

            img.style.filter =
            "brightness(1.2) saturate(0.2)";

        break;

        case "Rosado":

            img.style.filter =
            "hue-rotate(-20deg) saturate(1.5)";

        break;

        case "Azul":

            img.style.filter =
            "hue-rotate(180deg) saturate(1.4)";

        break;

        case "Rojo":

            img.style.filter =
            "hue-rotate(320deg) saturate(1.7)";

        break;

        case "Verde":

            img.style.filter =
            "hue-rotate(90deg) saturate(1.5)";

        break;

        default:

            img.style.filter = "none";

    }

}
