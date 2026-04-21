document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;
    cart.forEach(item => total += item.quantity);

    const countElement = document.getElementById("cart-count");

    if (countElement) {
        countElement.innerText = total;
    }
}
function addToCart(button) {
    const item = button.closest(".item");

    const name = item.querySelector("h3").innerText;
    const priceText = item.querySelector(".price").innerText;
    const price = Number(priceText.replace(/[^0-9.]/g, ""));
    const image = item.querySelector("img").getAttribute("src");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(i => i.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(name);
    updateCartCount();
}

function showToast(name) {
    const toast = document.createElement("div");
    toast.style.borderRadius = "12px";
toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
    toast.innerHTML = `
        🛒 ${name} added!
        <br>
        <button class="toast-btn" onclick="window.location.href='cart.html'">
            Go to Cart
        </button>
    `;
    toast.style.zIndex = "9999";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px";
    toast.style.borderRadius = "8px";

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

function filterMenu(category) {
    const items = document.querySelectorAll(".menu .item");

    items.forEach(item => {
        if (category === "all" || item.classList.contains(category)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}