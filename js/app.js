document.addEventListener("DOMContentLoaded", async () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    let index = 0;

    async function cargarProductos() {

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

    function render(productos) {

        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {

            slider.innerHTML += `
                <div class="card">

                    <img src="${p.imagen}" alt="producto">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">$${p.precio}</p>

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

    function iniciarCarrusel() {

        setInterval(() => {

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
