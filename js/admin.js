document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});

document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});

async function guardarProducto() {

    const nombre =
        document.getElementById("nombre").value;

    const precio =
        document.getElementById("precio").value;

    const categoria =
        document.getElementById("categoria").value;

    const imagen =
        document.getElementById("imagen").value;

    console.log(nombre, precio, categoria, imagen);

    if (!nombre || !precio || !categoria || !imagen) {

        alert("Completa todos los campos");
        return;
    }

    const { data, error } =
        await window.supabaseClient
        .from("productos")
        .insert([
            {
                nombre: nombre,
                precio: Number(precio),
                categoria: categoria,
                imagen: imagen
            }
        ])
        .select();

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {

        alert("Error guardando");

        return;
    }

    alert("✅ Producto guardado");

    cargarProductos();
}
async function cargarProductos() {

    const { data, error } = await window.supabaseClient
        .from("productos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    const lista = document.getElementById("listaProductos");

    lista.innerHTML = "";

    data.forEach(producto => {

        lista.innerHTML += `
        
            <div class="producto-admin">

                <img src="${producto.imagen}">

                <div>

                    <h3>${producto.nombre}</h3>

                    <p>$${Number(producto.precio).toLocaleString()}</p>

                    <p>${producto.categoria}</p>

                    <button onclick="eliminarProducto(${producto.id})">
                        🗑 Eliminar
                    </button>

                </div>

            </div>

        `;
    });
}

async function eliminarProducto(id) {

    const confirmar = confirm("¿Eliminar producto?");

    if (!confirmar) return;

    const { error } = await window.supabaseClient
        .from("productos")
        .delete()
        .eq("id", id);

    if (error) {
        console.log(error);
        return;
    }

    cargarProductos();
}

function limpiarFormulario() {

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("imagen").value = "";
}
async function cargarProductos() {

    const { data, error } = await window.supabaseClient
        .from("productos")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.log(error);
        return;
    }

    const lista = document.getElementById("listaProductos");

    lista.innerHTML = "";

    data.forEach(producto => {

        lista.innerHTML += `
        
            <div class="producto-admin">

                <img src="${producto.imagen}">

                <div>

                    <h3>${producto.nombre}</h3>

                    <p>$${Number(producto.precio).toLocaleString()}</p>

                    <p>${producto.categoria}</p>

                    <button onclick="eliminarProducto(${producto.id})">
                        🗑 Eliminar
                    </button>

                </div>

            </div>

        `;
    });
}

async function eliminarProducto(id) {

    const confirmar = confirm("¿Eliminar producto?");

    if (!confirmar) return;

    const { error } = await window.supabaseClient
        .from("productos")
        .delete()
        .eq("id", id);

    if (error) {
        console.log(error);
        return;
    }

    cargarProductos();
}

function limpiarFormulario() {

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("imagen").value = "";
}
