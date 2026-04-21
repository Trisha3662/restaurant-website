if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}
document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const loginBtn = document.querySelector('.login-btn');

  
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("userName");

    if (isLoggedIn === "true" && storedName) {
        showAlreadyLoggedInUI(storedName);
        return;
    }

    nameInput.addEventListener('keypress', function (e) {
        const char = String.fromCharCode(e.keyCode);
        if (!/^[A-Za-z\s]$/.test(char)) {
            e.preventDefault();
        }
    });

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;

            this.innerHTML = type === 'password'
                ? '<i class="fas fa-eye"></i>'
                : '<i class="fas fa-eye-slash"></i>';
        });
    });


    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];

const name = nameInput.value.trim();
const email = emailInput.value.trim();
const password = passwordInput.value;

const existingUser = users.find(user => user.email === email);

if (existingUser) {

    if (existingUser.password === password) {

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", existingUser.name);

        showSuccessModal(existingUser.name);

    } else {
        alert("Incorrect password!");
        loginBtn.innerText = "Login";
        loginBtn.disabled = false;
    }

} else {

    users.push({
        name: name,
        email: email,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);

    alert("Account created successfully!");

    showSuccessModal(name);
}
    });
    function validateName() {
        const value = nameInput.value.trim();
        const regex = /^[A-Za-z\s]{5,}$/;

        if (!regex.test(value)) {
            showError(nameInput, "Name must be at least 5 letters");
            return false;
        }

        removeError(nameInput);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(value)) {
            showError(emailInput, "Enter valid email");
            return false;
        }

        removeError(emailInput);
        return true;
    }

    function validatePassword() {
        if (passwordInput.value.length < 6) {
            showError(passwordInput, "Min 6 characters required");
            return false;
        }

        removeError(passwordInput);
        return true;
    }

    function validateConfirmPassword() {
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordInput, "Passwords do not match");
            return false;
        }

        removeError(confirmPasswordInput);
        return true;
    }

    function showError(input, message) {
        const errorDiv = getErrorDiv(input);
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
        input.style.borderColor = "#ff4d4d";
    }

    function removeError(input) {
        const errorDiv = getErrorDiv(input);
        errorDiv.style.display = "none";
        input.style.borderColor = "#FFC107";
    }

    function getErrorDiv(input) {
        let next = input.nextElementSibling;

        if (next && next.classList.contains('toggle-password')) {
            return next.nextElementSibling;
        }

        return next;
    }

});
function showSuccessModal(name) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <h2>Login Successful</h2>
            <p>Welcome, <b>${name}</b></p>
            <button class="ok-btn">Continue</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".ok-btn").addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

function showAlreadyLoggedInUI(name) {
    const container = document.querySelector(".login-form");

    container.innerHTML = `
        <h2>Already Logged In</h2>
        <p>Welcome back, <b>${name}</b></p>
        <button onclick="logout()" class="logout-btn">Logout</button>
    `;
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    location.reload();
}