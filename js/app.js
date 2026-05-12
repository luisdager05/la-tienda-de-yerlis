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
                    src="${p.imagen || './img/error.png'}"
                    alt="${p.nombre}">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">

                            $${Number(p.precio).toLocaleString()}

                        </p>

                        <p class="cantidad">

                            ${p.categoria || "Sin categoría"}

                        </p>

                        <button onclick="
                        agregarAlCarrito(
                            '${p.id}',
                            '${p.nombre}',
                            '${p.precio}',
                            '${p.imagen}'
                        )
                        ">

                            🛒 Agregar

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

                    <p>

                        $${Number(producto.precio).toLocaleString()}

                    </p>

                    <button onclick="
                    agregarAlCarrito(
                        '${producto.id}',
                        '${producto.nombre}',
                        '${producto.precio}',
                        '${producto.imagen}'
                    )
                    ">

                        🛒 Agregar

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
