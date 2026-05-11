
console.log("SUPABASE:", window.supabaseClient);
document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");

    let index = 0;
    let intervalo;

    // 🔥 Esperar Supabase
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

});
// =========================
// PRODUCTOS DE EJEMPLO
// =========================

const productos = [

{
    nombre: "Crop Top",
    precio: "$40.000",
    imagen: "./img/imagen1.png",
    categoria: "mujer"
},

{
    nombre: "Camisa Oversize",
    precio: "$65.000",
    imagen: "./img/imagen2.png",
    categoria: "hombre"
},

{
    nombre: "Bolso Elegante",
    precio: "$55.000",
    imagen: "./img/imagen3.png",
    categoria: "accesorios"
},

{
    nombre: "Vestido Largo",
    precio: "$90.000",
    imagen: "./img/imagen4.png",
    categoria: "mujer"
}

];


// =========================
// MOSTRAR PRODUCTOS
// =========================

function mostrarProductos() {

    const mujer = document.getElementById("mujer");
    const hombre = document.getElementById("hombre");
    const accesorios = document.getElementById("accesorios");
    const destacados = document.getElementById("destacados");
    const vendidos = document.getElementById("vendidos");

    productos.forEach(producto => {

        const card = `
        
        <div class="producto">

            <img src="${producto.imagen}">

            <h3>${producto.nombre}</h3>

            <p>${producto.precio}</p>

            <button>Agregar al carrito</button>

        </div>

        `;

        // DESTACADOS
        destacados.innerHTML += card;

        // MÁS VENDIDOS
        vendidos.innerHTML += card;

        // CATEGORÍAS
        if(producto.categoria === "mujer"){
            mujer.innerHTML += card;
        }

        if(producto.categoria === "hombre"){
            hombre.innerHTML += card;
        }

        if(producto.categoria === "accesorios"){
            accesorios.innerHTML += card;
        }

    });

}

mostrarProductos();
