document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});

let editandoId = null;

// =========================
// GUARDAR PRODUCTO
// =========================

window.guardarProducto = async function () {

    const nombre =
        document.getElementById("nombre").value;

    const precio =
        document.getElementById("precio").value;

    const descripcion =
        document.getElementById("descripcion").value;

    const categoria =
        document.getElementById("categoria").value;

    const imagen =
        document.getElementById("imagen").value;

    // VALIDAR
    if (
        !nombre ||
        !precio ||
        !descripcion ||
        !categoria ||
        !imagen
    ) {

        alert("Completa todos los campos");

        return;
    }

    // =========================
    // EDITAR
    // =========================

    if (editandoId) {

        const { error } =
            await window.supabaseClient
            .from("productos")
            .update({
                nombre: nombre,
                precio: Number(precio),
                descripcion: descripcion,
                categoria: categoria,
                imagen: imagen
            })
            .eq("id", editandoId);

        if (error) {

            console.log(error);

            alert("Error actualizando");

            return;
        }

        alert("✅ Producto actualizado");

        editandoId = null;
    }

    // =========================
    // NUEVO PRODUCTO
    // =========================

    else {

        const { error } =
            await window.supabaseClient
            .from("productos")
            .insert([
                {
                    nombre: nombre,
                    precio: Number(precio),
                    descripcion: descripcion,
                    categoria: categoria,
                    imagen: imagen
                }
            ]);

        if (error) {

            console.log(error);

            alert("Error guardando producto");

            return;
        }

        alert("✅ Producto guardado");
    }

    limpiarFormulario();

    cargarProductos();
};

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
                        💲 ${Number(producto.precio).toLocaleString()}
                    </p>

                    <p>
                        📦 ${producto.categoria}
                    </p>

                    <p>
                        📝 ${producto.descripcion || ""}
                    </p>

                    <button onclick="editarProducto(${producto.id})">
                        ✏️ Editar
                    </button>

                    <button onclick="eliminarProducto(${producto.id})">
                        🗑 Eliminar
                    </button>

                </div>

            </div>

        `;
    });
}

// =========================
// EDITAR
// =========================

window.editarProducto = async function (id) {

    const { data, error } =
        await window.supabaseClient
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        console.log(error);

        return;
    }

    document.getElementById("nombre").value =
        data.nombre;

    document.getElementById("precio").value =
        data.precio;

    document.getElementById("descripcion").value =
        data.descripcion;

    document.getElementById("categoria").value =
        data.categoria;

    document.getElementById("imagen").value =
        data.imagen;

    editandoId = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

// =========================
// ELIMINAR
// =========================

window.eliminarProducto = async function (id) {

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
};

// =========================
// LIMPIAR
// =========================

function limpiarFormulario() {

    document.getElementById("nombre").value = "";

    document.getElementById("precio").value = "";

    document.getElementById("descripcion").value = "";

    document.getElementById("categoria").value = "";

    document.getElementById("imagen").value = "";
}
