console.log("SUPABASE:", window.supabaseClient);

        return;
    }

    const filtrados =
    window.productosGlobalData.filter(p =>

        p.categoria &&
        p.categoria.toLowerCase().trim() ===
        categoria.toLowerCase().trim()

    );

    titulo.innerText =
    categoria.charAt(0).toUpperCase() +
    categoria.slice(1);

    mostrarSecciones(filtrados);

}

// =========================
// MOSTRAR PRODUCTOS
// =========================

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

                <!-- IMAGEN PRODUCTO -->
                <img
                class="img-producto"
                src="${p.imagen ? p.imagen : './img/error.png'}"
                alt="${p.nombre}"
                onclick="abrirModalProductoPorId(${p.id})">

                <!-- NOMBRE -->
                <h3>${p.nombre}</h3>

                <!-- PRECIO -->
                <p class="precio">
                    $${Number(p.precio).toLocaleString()}
                </p>

                <!-- TALLAS -->
                <div class="selector-opciones">

                    <label>Talla:</label>

                    <select class="select-talla">

                        <option value="">
                            Seleccionar
                        </option>

                        ${
                            Array.isArray(p.talla)
                            ? p.talla.map(t => `
                                <option value="${t}">
                                    ${t}
                                </option>
                            `).join("")
                            : ""
                        }

                    </select>

                </div>

                <!-- COLORES -->
                <div class="selector-opciones">

                    <label>Color:</label>

                    <div class="colores">

                        ${
                            Array.isArray(p.colores)
                            ? p.colores.map(color => `

                                <span
                                class="color"
                                title="${color}"
                                style="
                                    background:${color};
                                    display:inline-block;
                                    width:22px;
                                    height:22px;
                                    border-radius:50%;
                                    margin:3px;
                                    border:1px solid #ccc;
                                    cursor:pointer;
                                ">
                                </span>

                            `).join("")
                            : ""
                        }

                    </div>

                </div>

                <!-- BOTON -->
                <button
                class="btn-carrito"
                onclick="agregarAlCarrito(${p.id})">

                    Agregar al carrito

                </button>

            </div>

        `;

        destacados.innerHTML += card;

    });

}
