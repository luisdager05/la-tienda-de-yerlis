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

                <div class="selector-opciones">

                    <label>Talla:</label>

                    <select class="select-talla">

                        <option value="">
                            Seleccionar
                        </option>

                        ${p.talla?.map(t => `

                            <option value="${t}">
                                ${t}
                            </option>

                        `).join("") || ""}

                    </select>

                </div>

                <div class="selector-opciones">

                    <label>Color:</label>

                    <div class="colores">

                        ${p.colores?.map(color => `

                            <span
                            class="color ${color.toLowerCase()}"
          

