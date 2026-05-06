// document.addEventListener("DOMContentLoaded", () => {

//     const contenedor = document.getElementById("contenedor-mujer");
//     if (!contenedor) return;

//     let productos = JSON.parse(localStorage.getItem("productos")) || [];

//     let productosMujer = productos.filter(p => 
//         p.categoria && p.categoria.toLowerCase() === "mujer"
//     );

//     contenedor.innerHTML = "";

//     productosMujer.forEach(p => {
//         contenedor.innerHTML += `
//             <div class="producto">
//                 <a href="producto.html?id=${p.id}">
//                     <img src="${p.imagen}">
//                 </a>
//                 <h3>${p.nombre}</h3>
//                 <p>$${p.precio.toLocaleString()}</p>

//                 <button class="btn-agregar"
//                     data-id="${p.id}"
//                     data-nombre="${p.nombre}"
//                     data-precio="${p.precio}"
//                     data-imagen="${p.imagen}">
//                     Agregar al carrito
//                 </button>
//             </div>
//         `;
//     });

// });

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Conectando a Supabase...");

    const { data, error } = await supabase
        .from("productos")
        .select("*");

    if (error) {
        console.error("ERROR:", error);
    } else {
        console.log("PRODUCTOS:", data);
    }

});