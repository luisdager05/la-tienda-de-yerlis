document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    let productos = [
        {
            id: 1,
            nombre: "Vestido Elegante",
            precio: 85000,
            cantidad: 10,
            img: "img/imagen1.png"
        },
        {
            id: 2,
            nombre: "Blusa Moderna",
            precio: 55000,
            cantidad: 8,
            img: "img/imagen2.png"
        },
        {
            id: 3,
            nombre: "Falda Larga",
            precio: 70000,
            cantidad: 5,
            img: "img/imagen3.png"
        },
        {
            id: 4,
            nombre: "Crop Top",
            precio: 40000,
            cantidad: 12,
            img: "img/imagen4.png"
        },
        {
            id: 5,
            nombre: "Jean Dama",
            precio: 95000,
            cantidad: 6,
            img: "img/imagen5.png"
        }
    ];

    let index = 0;

    // =========================
    // RENDER
    // =========================
    function renderSlider() {

        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {

            slider.innerHTML += `
                <div class="card">

                    <img src="${p.img}" alt="${p.nombre}">

                    <div class="info">

                        <h3>${p.nombre}</h3>

                        <p class="precio">
                            $${p.precio.toLocaleString()}
                        </p>

                        <p class="cantidad">
                            Disponibles: ${p.cantidad}
                        </p>

                        <button class="btn-carrito">
                            🛒 Agregar
                        </button>

                    </div>

                </div>
            `;

            dots.innerHTML += `
                <span class="${i === 0 ? "active" : ""}"></span>
            `;
        });
    }

    // =========================
    // MOVER
    // =========================
    function mover(dir) {

        const cards = document.querySelectorAll(".card");
        const puntos = document.querySelectorAll("#dots span");

        if (!cards.length) return;

        index += dir;

        if (index >= productos.length) {
            index = 0;
        }

        if (index < 0) {
            index = productos.length - 1;
        }

        const cardWidth = cards[0].offsetWidth + 20;

        puntos.forEach(p => p.classList.remove("active"));

        puntos[index].classList.add("active");

        slider.scrollTo({
            left: index * cardWidth,
            behavior: "smooth"
        });
    }

    // =========================
    // BOTONES
    // =========================
    next.addEventListener("click", () => {
        mover(1);
    });

    prev.addEventListener("click", () => {
        mover(-1);
    });

    // =========================
    // INICIAR
    // =========================
    renderSlider();

    setInterval(() => {
        mover(1);
    }, 3000);

});

