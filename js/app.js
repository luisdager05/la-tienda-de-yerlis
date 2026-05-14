console.log("SUPABASE:", window.supabaseClient);
        titulo.innerText =
        "🔥 Todos los productos";

        mostrarSecciones(
            window.productosGlobalData
        );

        return;
    }

    // FILTRAR
    const filtrados =
    window.productosGlobalData.filter(p =>

        p.categoria &&
        p.categoria.toLowerCase().trim() ===
        categoria.toLowerCase().trim()

    );

    // TITULO
    titulo.innerText =
    categoria.charAt(0).toUpperCase() +
    categoria.slice(1);

    // MOSTRAR
    mostrarSecciones(filtrados);

}

// =========================
// MOSTRAR PRODUCTOS
// =========================

function mostrarSecciones(productos) {

    const destacados =
    document.getElementById("destacados");

    if (!destacados) return;

    destacados.innerHTML = "";

    productos.forEach(p => {

        const card = `

            <div class="producto">

                <img
                class="img-producto"
                src="${p.imagen || './img/error.png'}"
                alt="${p.nombre}"
                onclick="abrirModalProductoPorId(${p.id})">

                <h3>${p.nombre}</h3>

                <p class="precio">
                    $${Number(p.precio).toLocaleString()}
                </p>

                <button onclick="
                agregarAlCarrito(
                    this,
                    '${p.id}',
                    '${p.nombre}',
                    '${p.precio}',
                    '${p.imagen}'
                )">

                    🛒 Agregar al carrito

                </button>

            </div>

        `;

        destacados.innerHTML += card;

    });

}
