document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    if (!slider) {
        console.error("No existe #slider en el HTML");
        return;
    }

    let productos = [
        { nombre: "Vestido Elegante", precio: 85000, cantidad: 10, img: "img/imagen1.png" },
        { nombre: "Blusa Moderna", precio: 55000, cantidad: 8, img: "img/imagen2.png" },
        { nombre: "Falda Larga", precio: 70000, cantidad: 5, img: "img/imagen3.png" },
        { nombre: "Crop Top", precio: 40000, cantidad: 12, img: "img/imagen4.png" },
        { nombre: "Jean Dama", precio: 95000, cantidad: 6, img: "img/imagen5.png" }
    ];

    let index = 0;

    function render() {

        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {

            slider.innerHTML += `
                <div class="card">

                    <img src="${p.img}" onerror="this.src='img/error.png'">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">$${p.precio.toLocaleString()}</p>

                        <p class="cantidad">Stock: ${p.cantidad}</p>

                        <button>🛒 Agregar</button>

                    </div>

                </div>
            `;

            dots.innerHTML += `<span class="${i === 0 ? "active" : ""}"></span>`;
        });
    }

    

   let index = 0;
let intervalo;

function mover(dir = 1) {

    const cards = document.querySelectorAll(".card");

    if (!cards.length) return;

    index += dir;

    if (index >= cards.length) index = 0;
    if (index < 0) index = cards.length - 1;

    const width = cards[0].offsetWidth + 20;

    slider.scrollTo({
        left: index * width,
        behavior: "smooth"
    });

    document.querySelectorAll("#dots span")
        .forEach(d => d.classList.remove("active"));

    document.querySelectorAll("#dots span")[index]
        ?.classList.add("active");
}

// 🔥 autoplay
function iniciarCarrusel() {
    intervalo = setInterval(() => {
        mover(1);
    }, 2500);
}

// pausar al mover mouse
slider.addEventListener("mouseenter", () => clearInterval(intervalo));
slider.addEventListener("mouseleave", iniciarCarrusel);

    render();
iniciarCarrusel();

    const carrito = document.getElementById("carrito");
const carritoBtn = document.getElementById("carritoBtn");

carritoBtn?.addEventListener("click", () => {
    carrito.classList.add("active");
});

function cerrarCarrito(){
    carrito.classList.remove("active");
}

