function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  // LOGIN BÁSICO (luego lo pasamos a PHP)
  if (user === "admin" && pass === "1234") {
    localStorage.setItem("admin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Datos incorrectos");
  }
}