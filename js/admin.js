async function guardarProducto() {

    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;

    console.log(nombre, precio, categoria, imagen);

    const { data, error } = await window.supabaseClient
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

    alert("✅ Producto guardado correctamente");
}
