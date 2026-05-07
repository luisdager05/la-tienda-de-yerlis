async function guardarProducto() {

    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;

    if (!nombre || !precio || !categoria || !imagen) {
        alert("Completa todos los campos");
        return;
    }

    console.log("Enviando datos...");

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

        console.log("MENSAJE:", error.message);
        console.log("DETAILS:", error.details);
        console.log("HINT:", error.hint);

        return;
    }

    document.getElementById("mensaje").innerHTML =
        "✅ Producto guardado correctamente";

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("imagen").value = "";
}
