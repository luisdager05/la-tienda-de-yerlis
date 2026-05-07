document.addEventListener("DOMContentLoaded", async () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    if (!slider || !dots) {
        console.error("Faltan elementos HTML");
        return;
    }

    let index = 0;
    let intervalo;

    // =========================
    // CARGAR PRODUCTOS
    // =========================
    async function cargarProductos() {

        if (!window.supabaseClient) {
            console.error("Supabase no está inicializado");
            return;
        }

        const { data, error } = await supabaseClient
            .from("productos")
            .select("*");

        if (error) {
            console.log("Error Supabase:", error);
            return;
        }

        if (!data || data.length === 0) {
            slider.innerHTML = "<h2>No hay productos</h2>";
            return;
        }

        render(data);
    }

    // =========================
    // RENDER
    // =========================
    function render(productos) {

        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {

            slider.innerHTML += `
                <div class="card">

                    <img src="${p.imagen}" onerror="this.src='./img/error.png'">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">$${p.precio.toLocaleString()}</p>

                        <p class="cantidad">Stock: ${p.cantidad}</p>

                        <button onclick="agregarCarrito('${p.nombre}', ${p.precio})">
                            🛒 Agregar
                        </button>

                    </div>

                </div>
            `;

            dots.innerHTML += `<span class="${i === 0 ? "active" : ""}"></span>`;
        });

        iniciarCarrusel();
    }

    // =========================
    // CARRUSEL SEGURO
    // =========================
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

        }, 3000);
    }

    // =========================
    // INICIO
    // =========================
    cargarProductos();

});
