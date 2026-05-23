document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();

});

let editandoId = null;

// =========================
// GUARDAR PRODUCTO
// =========================

window.guardarProducto = async function () {

    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const descripcion = document.getElementById("descripcion").value;
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;
    const talla = document.getElementById("talla").value;
    const colores = document.getElementById("colores").value;
    const tallasArray =
talla.split(",").map(t => t.trim());

const coloresArray =
colores.split(",").map(c => c.trim().toLowerCase());
    const stock =
document.getElementById("stock").value;

const valor_unitario =
document.getElementById("valor_unitario").value;

// const ganancia =
// document.getElementById("ganancia").value;
    const ganancia =
Number(precio) -
Number(valor_unitario);

    if (!nombre || !precio || !descripcion || !categoria || !imagen) {
        alert("Completa todos los campos");
        return;
    }

    console.log("EDITANDO ID:", editandoId); // 🔥 DEBUG

    // =========================
    // EDITAR
    // =========================
    if (editandoId) {

        const { data, error } = await window.supabaseClient
            .from("productos")
            .update({
                nombre,
                precio: Number(precio),
                descripcion,
                categoria,
                imagen,
                talla: tallasArray,
                colores: coloresArray,
stock: Number(stock),
valor_unitario: Number(valor_unitario),
ganancia: Number(ganancia)
            })
            .eq("id", editandoId)
            .select(); // 🔥 IMPORTANTE

        console.log("UPDATE DATA:", data);
        console.log("UPDATE ERROR:", error);

        if (error) {
            alert("Error actualizando producto");
            return;
        }

        alert("✅ Producto actualizado");

        editandoId = null;
    }

    // =========================
    // NUEVO
    // =========================
    else {

        const { data, error } = await window.supabaseClient
            .from("productos")
            .insert([{

    nombre,
    precio: Number(precio),
    descripcion,
    categoria,
    imagen,
    talla: tallasArray,
    colores: coloresArray,
stock: Number(stock),
valor_unitario: Number(valor_unitario),
ganancia: Number(ganancia)

}])
            .select();

        console.log("INSERT DATA:", data);
        console.log("INSERT ERROR:", error);

        if (error) {
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


// =========================
// CERRAR SESION
// =========================

function cerrarSesion(){

    localStorage.removeItem("adminLogueado");

    window.location.href =
    "./login.html";
}

// =========================
// INVENTARIO
// =========================

async function cargarInventario(){

    const tabla =
    document.getElementById(
        "tablaInventario"
    );

    if(!tabla) return;

    const { data, error } =
    await window.supabaseClient
    .from("productos")
    .select("*")
    .order("stock", {
        ascending:true
    });

    if(error){

        console.log(error);
        return;

    }

    tabla.innerHTML = "";

    data.forEach(p => {

        let estado =
        "✅ Disponible";

        if(p.stock <= 0){

            estado =
            "❌ Agotado";

        }
        else if(p.stock <= 3){

            estado =
            "⚠️ Poco stock";

        }

        tabla.innerHTML += `

        <tr>

            <td>${p.nombre}</td>

            <td>
                $${Number(p.precio)
                .toLocaleString()}
            </td>

            <td>${p.stock}</td>

            <td>${estado}</td>

            <td>
    $${Number(
        p.valor_unitario || 0
    ).toLocaleString()}
</td>

<td>
    $${Number(
        p.ganancia || 0
    ).toLocaleString()}
</td>

        </tr>

        `;

    });

}

// =========================
// REPORTE VENTAS
// =========================

async function cargarVentas(){

    const contenedor =
    document.getElementById(
        "reporteVentas"
    );

    if(!contenedor) return;

    const { data, error } =
    await window.supabaseClient
    .from("ventas")
    .select("*")
    .order("fecha", {
        ascending:false
    });

    if(error){

        console.log(error);
        return;

    }

    contenedor.innerHTML = "";

    data.forEach(v => {

        contenedor.innerHTML += `

        <div class="venta-box">

            <h3>
                👤 ${v.cliente}
            </h3>

            <p>
                📱 ${v.telefono}
            </p>

            <p>
                📍 ${v.direccion}
            </p>

            <p>
    💰
    $${Number(v.total)
    .toLocaleString()}
</p>

<div class="productos-vendidos">

    <h4>🛒 Productos:</h4>

    ${v.productos?.map(p => `

        <div class="producto-vendido">

            <p>
                📦 ${p.nombre}
            </p>

            <p>
                🔢 Cantidad:
                ${p.cantidad}
            </p>

            <p>
                📏 ${p.talla}
            </p>

            <p>
                🎨 ${p.color}
            </p>

        </div>

    `).join("")}

</div>

<p>
    📅
    ${new Date(v.fecha)
    .toLocaleString()}
</p>

        </div>

        `;

    });

}

// =========================
// INICIAR
// =========================

cargarInventario();
cargarVentas();
