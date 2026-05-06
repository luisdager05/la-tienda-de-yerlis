document.addEventListener("DOMContentLoaded", () => {

    const slider = document.getElementById("slider");
    const dots = document.getElementById("dots");
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");

    let productos = [
        { id: 1, img: "img/imagen1.png" },
        { id: 2, img: "img/imagen2.png" },
        { id: 3, img: "img/imagen3.png" },
        { id: 4, img: "img/imagen4.png" },
        { id: 5, img: "img/imagen5.png" },
        { id: 6, img: "img/imagen1.png" },
        { id: 7, img: "img/imagen2.png" },
        { id: 8, img: "img/imagen3.png" },
        { id: 9, img: "img/imagen4.png" },
        { id: 10, img: "img/imagen5.png" },
        { id: 11, img: "img/imagen1.png" },
        { id: 12, img: "img/imagen5.png" },
        { id: 13, img: "img/imagen3.png" },
        { id: 14, img: "img/imagen3.png" },
        { id: 15, img: "img/imagen3.png" },
        { id: 16, img: "img/imagen3.png" },
        { id: 17, img: "img/imagen3.png" },
        { id: 18, img: "img/imagen3.png" },
        { id: 19, img: "img/imagen3.png" }
    ];

    let index = 0;
    let autoplay;

    // =========================
    // RENDER
    // =========================
    function renderSlider() {
        slider.innerHTML = "";
        dots.innerHTML = "";

        productos.forEach((p, i) => {
            slider.innerHTML += `
                <div class="card ${i === 0 ? "active" : ""}">
                    <img src="${p.img}">
                </div>
            `;
            dots.innerHTML += `<span class="${i === 0 ? "active" : ""}"></span>`;
        });
    }

    // =========================
    // MOVER
    // =========================
    function mover(dir) {

        const cards = document.querySelectorAll(".card");
        const puntos = document.querySelectorAll(".dots span");

        if (!cards.length) return;

        index += dir;

        const cardWidth = cards[0].offsetWidth + 15;

        // 🔥 CONTROL DE LÍMITES
        if (index >= productos.length) {
            index = 0;
            slider.scrollLeft = 0;
        }

        if (index < 0) {
            index = productos.length - 1;
            slider.scrollLeft = index * cardWidth;
        }

        cards.forEach(c => c.classList.remove("active"));
        puntos.forEach(p => p.classList.remove("active"));

        cards[index].classList.add("active");
        puntos[index].classList.add("active");

        slider.scrollTo({
            left: index * cardWidth,
            behavior: "smooth"
        });
    }

    // =========================
    // BOTONES
    // =========================
    next.onclick = () => mover(1);
    prev.onclick = () => mover(-1);

    // =========================
    // INIT
    // =========================
    renderSlider();

    // 🔥 INICIO RÁPIDO (SIN ESPERAR IMÁGENES)
    setTimeout(() => {
        iniciarCarrusel();
    }, 100);

    function iniciarCarrusel() {
        mover(0);

        autoplay = setInterval(() => {
            mover(1);
        }, 2500); // 🔥 velocidad ideal
    }

});



