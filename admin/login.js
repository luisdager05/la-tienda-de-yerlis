function iniciarSesion() {

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    // DATOS DEL ADMIN
    const adminUsuario = "admin";
    const adminPassword = "12345";

    if(usuario === adminUsuario && password === adminPassword){

        localStorage.setItem("adminLogueado", "true");

        window.location.href = "../admin/admin.html";

    } else {

        document.getElementById("mensaje").innerText =
        "Usuario o contraseña incorrectos";

    }

}
