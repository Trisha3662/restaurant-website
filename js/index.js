function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    const countElement = document.getElementById("cart-count");

    if (countElement) {
        countElement.innerText = total;
    }
}

document.addEventListener("DOMContentLoaded", updateCartCount);