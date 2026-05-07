async function guardarProducto() {

    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;

    if (!nombre || !precio || !categoria || !imagen) {
        alert("Completa todos los campos");
        return;
    }

    const { error } = await window.supabaseClient
        .from("productos")
        .insert([
            {
                nombre,
                precio,
                categoria,
                imagen
            }
        ]);

    if (error) {
        console.log(error);
        alert("Error guardando");
        return;
    }

    document.getElementById("mensaje").innerHTML =
        "✅ Producto guardado correctamente";

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("imagen").value = "";
}
