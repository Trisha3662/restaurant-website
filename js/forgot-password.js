document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();


        if (!validateEmail(email)) {
            showError("Please enter a valid email address");
            return;
        }

      
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            showError("Email not registered!");
            return;
        }

        simulateReset(email);
    });

});


function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showError(message) {
    removeExistingMessage();

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerText = message;

    const form = document.querySelector("form");
    form.appendChild(errorDiv);
}

function simulateReset(email) {

    removeExistingMessage();

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";

    successDiv.innerHTML = `
        <p>📧 Reset link sent to <b>${email}</b></p>
        <p>Please check your inbox</p>
    `;

    const form = document.querySelector("form");
    form.appendChild(successDiv);

    localStorage.setItem("resetEmail", email);

    setTimeout(() => {
        window.location.href = "login.html";
    }, 2500);
}


function removeExistingMessage() {
    const oldError = document.querySelector(".error-message");
    const oldSuccess = document.querySelector(".success-message");

    if (oldError) oldError.remove();
    if (oldSuccess) oldSuccess.remove();
}