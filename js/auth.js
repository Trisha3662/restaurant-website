document.addEventListener("DOMContentLoaded", function () {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const publicPages = ["login.html", "forgot-password.html", "index.html"];

    const currentPage = window.location.pathname.split("/").pop();

    if (!isLoggedIn && !publicPages.includes(currentPage)) {
        alert("Please login first!");
        window.location.href = "login.html";
    }

});