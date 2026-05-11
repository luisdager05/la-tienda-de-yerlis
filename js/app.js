console.log("SUPABASE:", window.supabaseClient);

document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    let index = 0;
    let intervalo;

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

        // SLIDER
        render(data);

        // SECCIONES
       /* mostrarSecciones(data);*/

activarBuscador(data);

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

                    <img src="${p.imagen || './img/error.png'}">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">
                            $${Number(p.precio).toLocaleString()}
                        </p>

                        <p class="cantidad">
                            ${p.categoria || "Sin categoría"}
                        </p>

                        <button onclick="agregarCarrito('${p.nombre}', ${p.precio})">
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
    // CARRUSEL AUTOMÁTICO
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

            const width = cards[0].offsetWidth + 20;

            slider.scrollTo({

                left: index * width,
                behavior: "smooth"

            });

        }, 3000);

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

        // LIMPIAR
        mujer.innerHTML = "";
        hombre.innerHTML = "";
        accesorios.innerHTML = "";
        destacados.innerHTML = "";
        vendidos.innerHTML = "";

        productos.forEach(producto => {

            const card = `
            
                <div class="producto">

                    <img src="${producto.imagen || './img/error.png'}">

                    <h3>${producto.nombre}</h3>

                    <p>
                        $${Number(producto.precio).toLocaleString()}
                    </p>

                    <button onclick="agregarCarrito('${producto.nombre}', ${producto.precio})">
                        🛒 Agregar
                    </button>

                </div>
            `;

            // DESTACADOS
            destacados.innerHTML += card;

            // MÁS VENDIDOS
            vendidos.innerHTML += card;

            // CATEGORÍAS
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

});

// =========================
// BUSCADOR
// =========================

function activarBuscador(productos) {

    const buscador = document.getElementById("buscador");

    buscador.addEventListener("keyup", () => {

        const texto = buscador.value.toLowerCase();

        const filtrados = productos.filter(producto => {

            return producto.nombre
                .toLowerCase()
                .includes(texto);

        });

        // ACTUALIZAR
        render(filtrados);

        mostrarSecciones(filtrados);

    });

}
