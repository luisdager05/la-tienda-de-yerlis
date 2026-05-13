function iniciarSesion() {

    const usuario =
    document.getElementById("usuario").value;

    const password =
    document.getElementById("password").value;

    // DATOS ADMIN
    const adminUsuario = "admin";
    const adminPassword = "12345";

    if(usuario === adminUsuario &&
       password === adminPassword){

        localStorage.setItem(
            "adminLogueado",
            "true"
        );

        // ENTRAR AL PANEL
         window.location.href =
        "admin.html";

    } else {

        document.getElementById("mensaje")
        .innerText =
        "Usuario o contraseña incorrectos";
    }
}
