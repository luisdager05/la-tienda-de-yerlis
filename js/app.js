document.addEventListener("DOMContentLoaded", async () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    let index = 0;
    let intervalo;

    // 🔥 ESPERAR SUPABASE LISTO
    const waitSupabase = () => {
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (window.supabaseClient) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    };

    await waitSupabase();

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

        render(data);
    }

    function render(productos) {

        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {

            slider.innerHTML += `
                <div class="card">

                    <img src="${p.imagen}" onerror="this.src='./img/error.png'">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">$${Number(p.precio).toLocaleString()}</p>

                        <p class="cantidad">Categoría: ${p.categoria || ""}</p>

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

    cargarProductos();
});
