document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});

// =========================
// GUARDAR PRODUCTO
// =========================

async function guardarProducto() {

    const nombre =
        document.getElementById("nombre").value;

    const precio =
        document.getElementById("precio").value;

    const categoria =
        document.getElementById("categoria").value;

    const inputImagen =
    document.getElementById("imagen");

if (!inputImagen.files.length) {

    alert("Selecciona una imagen");

    return;
}

const archivo = inputImagen.files[0];

if (!nombre || !precio || !categoria) {

    alert("Completa todos los campos");

    return;
}

    // =========================
    // NOMBRE IMAGEN
    // =========================

    const nombreArchivo =
        Date.now() + "_" + archivo.name;

    // =========================
    // SUBIR STORAGE
    // =========================

    const { error: errorUpload } =
        await window.supabaseClient.storage
        .from("productos")
        .upload(nombreArchivo, archivo);

    if (errorUpload) {

        console.log(errorUpload);

        alert("Error subiendo imagen");

        return;
    }

    // =========================
    // URL PUBLICA
    // =========================

    const {
        data: { publicUrl }
    } = window.supabaseClient.storage
        .from("productos")
        .getPublicUrl(nombreArchivo);

    // =========================
    // GUARDAR DB
    // =========================

    const { error } =
        await window.supabaseClient
        .from("productos")
        .insert([
            {
                nombre,
                precio: Number(precio),
                categoria,
                imagen: publicUrl
            }
        ]);

    if (error) {

        console.log(error);

        alert("Error guardando producto");

        return;
    }

    alert("✅ Producto guardado");

    limpiarFormulario();

    cargarProductos();
}

// =========================
// CARGAR PRODUCTOS
// =========================

async function cargarProductos() {

    const { data, error } =
        await window.supabaseClient
        .from("productos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.log(error);

        return;
    }

    const lista =
        document.getElementById("listaProductos");

    lista.innerHTML = "";

    data.forEach(producto => {

        lista.innerHTML += `
        
            <div class="producto-admin">

                <img src="${producto.imagen}">

                <div>

                    <h3>${producto.nombre}</h3>

                    <p>
                        $${Number(producto.precio).toLocaleString()}
                    </p>

                    <p>${producto.categoria}</p>

                    <button onclick="eliminarProducto(${producto.id})">
                        🗑 Eliminar
                    </button>

                </div>

            </div>

        `;
    });
}

// =========================
// ELIMINAR
// =========================

async function eliminarProducto(id) {

    const confirmar =
        confirm("¿Eliminar producto?");

    if (!confirmar) return;

    const { error } =
        await window.supabaseClient
        .from("productos")
        .delete()
        .eq("id", id);

    if (error) {

        console.log(error);

        return;
    }

    cargarProductos();
}

// =========================
// LIMPIAR
// =========================

function limpiarFormulario() {

    document.getElementById("nombre").value = "";

    document.getElementById("precio").value = "";

    document.getElementById("categoria").value = "";

    document.getElementById("imagen").value = "";
}
