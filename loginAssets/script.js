function showPassword() {
    var password = document.getElementById("password");
    var icon = document.querySelector(".password-container i");
    if (password.type === "password") {
        password.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}
function redirectToPage() {
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("Veuillez remplir tous les champs avant de vous connecter.");
        return;
    }
// Rediriger seulement si tous les champs sont remplis
    window.location.href = "homePageAssets/index.html"; // Remplace par l'URL de destination
}
