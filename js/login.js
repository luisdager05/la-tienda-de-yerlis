function iniciarSesion() {

    const usuario =
    document.getElementById("usuario").value;

    const password =
    document.getElementById("password").value;

    const adminUsuario = "admin";
    const adminPassword = "12345";

    if(usuario === adminUsuario &&
       password === adminPassword){

        // GUARDAR LOGIN
        localStorage.setItem(
            "adminLogueado",
            "true"
        );

        // IR AL PANEL
        window.location.href =
        "./admin.html";

    } else {

        document.getElementById("mensaje")
        .innerText =
        "Usuario o contraseña incorrectos";
    }
}
