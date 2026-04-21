let selectedPayment = null;
if (localStorage.getItem("isLoggedIn") !== "true") {
    alert("Please login first!");
    window.location.href = "login.html";
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

document.querySelectorAll(".payment-option").forEach(btn => {
    btn.addEventListener("click", function () {
        selectedPayment = this.innerText;
    });
});
function loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;
    const deliveryFee = 40.00;

    const emptyCartMessage = document.getElementById("empty-cart");
    const cartFooter = document.querySelector(".cart-footer");

    if (cart.length === 0) {
        emptyCartMessage.style.display = "block";
        cartItemsContainer.style.display = "none";
        cartFooter.style.display = "none";
        return;
    } else {
        emptyCartMessage.style.display = "none";
        cartItemsContainer.style.display = "block";
        cartFooter.style.display = "block";
    }

    cartItemsContainer.innerHTML = "";

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>₹${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${index})" class="remove-btn">
                <i class="ri-delete-bin-line"></i>
            </button>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("total-price").textContent = (subtotal + deliveryFee).toFixed(2);
}

function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const finalBillContainer = document.getElementById("final-bill");
    let finalTotal = 0;
    const deliveryFee = 40.00;

    finalBillContainer.innerHTML = "";

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        finalTotal += itemTotal;

        const itemElement = document.createElement("div");
        itemElement.classList.add("bill-item");

        itemElement.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${itemTotal.toFixed(2)}</span>
        `;

        finalBillContainer.appendChild(itemElement);
    });

    finalTotal += deliveryFee;

    finalBillContainer.innerHTML += `
        <div class="bill-item">
            <span>Delivery Fee</span>
            <span>₹${deliveryFee.toFixed(2)}</span>
        </div>
        <div class="bill-item total">
            <span>Total Amount</span>
            <span>₹${finalTotal.toFixed(2)}</span>
        </div>
    `;

    document.getElementById("checkout-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("checkout-modal").style.display = "none";
}

function placeOrder() {
    const username = localStorage.getItem("userName") || "Customer";

    const addressInput = document.getElementById("address");
    const address = addressInput ? addressInput.value.trim() : "";


    if (!address) {
        alert("Please enter delivery address!");
        return;
    }


    if (!selectedPayment) {
        alert("Please select payment method!");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const order = {
        name: username,
        items: cart,
        address: address,
        payment: selectedPayment,
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));


    document.getElementById("checkout-modal").style.display = "none";


    localStorage.removeItem("cart");
    const successModal = document.getElementById("success-modal");
    const message = document.getElementById("user-message");

    message.innerHTML = `
        Thank you, <b>${username}</b> 🎉<br>
        📍 ${address}<br>
        💳 ${selectedPayment}<br>
        Your order is confirmed
    `;

    successModal.style.display = "flex";
}
function goHome() {
    window.location.href = "index.html";
}