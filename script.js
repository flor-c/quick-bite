

const menuItems = [
  { name: "Burger", price: 12, image: "img/burger.jpg" },
  { name: "Pizza", price: 15, image: "img/pizza.jpg" },
  { name: "Salad", price: 9, image: "img/salad.jpg" },
  { name: "Fries", price: 6, image: "img/fries.jpg" },
  { name: "Tacos", price: 12, image: "img/tacos.jpg" },
  { name: "Milkshake", price: 6, image: "img/milkshake.jpg" },
  { name: "Pad Thai", price: 10, image: "img/padthai.jpg" }
];

const menu = document.getElementById("menu");
const cartItems = document.getElementById("cart-items");
const total = document.getElementById("total");

const checkoutButton = document.getElementById("checkout");
const checkoutModal = document.getElementById("checkout-modal");
const closeModalButton = document.getElementById("close-modal");
const checkoutForm = document.getElementById("checkout-form");
const checkoutMessage = document.getElementById("checkout-message");

const customerName = document.getElementById("customer-name");
const customerAddress = document.getElementById("customer-address");
const customerPhone = document.getElementById("customer-phone");

const toastContainer = document.getElementById("toast-container");
const clearCartButton = document.getElementById("clear-cart");

const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartCount = document.getElementById("cart-count");
const closeCartButton = document.getElementById("close-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let toastTimeout;


function addToCart(index) {

  const item = menuItems[index];
  const existing = cart.find(cartItem => cartItem.name === item.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name: item.name,
      price: item.price,
      qty: 1
    });
  }

  renderCart();
}

function increaseQty(index) {
  cart[index].qty += 1;
  renderCart();
}

function decreaseQty(index) {
  cart[index].qty -= 1;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

function renderCart() {

  cartItems.innerHTML = "";

  let sum = 0;
  let itemCount = 0;

  cart.forEach((item, i) => {

    const li = document.createElement("li");

    li.innerHTML = `
      <span class="item-name">${item.name}</span>

      <div class="qty-controls">
        <button class="qty-btn minus">-</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-btn plus">+</button>
      </div>
      <span class="item-price">$${item.price * item.qty}</span>
      `;

    const minusBtn = li.querySelector(".minus");
    const plusBtn = li.querySelector(".plus");

    minusBtn.addEventListener("click", () => decreaseQty(i));
    plusBtn.addEventListener("click", () => increaseQty(i));

    cartItems.appendChild(li);

    sum += item.price * item.qty;

    itemCount += item.qty;
  });

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your cart is empty.</li>";
  }

  checkoutButton.disabled = cart.length === 0;

  total.textContent = sum;

  localStorage.setItem("cart", JSON.stringify(cart));

  cartCount.textContent = itemCount;
  cartCount.style.display = itemCount === 0 ? "none" : "flex";

}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  //allow the browser to render first, then animate in
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  //start hidding after 1.5s
  setTimeout(() => {
    toast.classList.remove("show");

    //remove from DOM after animation
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 1500);
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.remove("hidden");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.add("hidden");
}

function toggleCart() {
  cartPanel.classList.toggle("open");
  cartOverlay.classList.toggle("hidden");
}

menuItems.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="image-container">
      <img src="${item.image}" class="food-img" alt="${item.name}" />
    </div>
    <h3>${item.name}</h3>
    <p>$${item.price}</p>
    <button class="add-btn">Add</button>
    `;

  const button = card.querySelector(".add-btn");

  button.addEventListener("click", () => {
    addToCart(index);
    //openCart(); show cart after adding item - disabled for better UX, can be re-enabled if desired


    //feedback
    button.textContent = "Added!";
    button.disabled = true;

    showToast(`${item.name} added to cart!`);

    setTimeout(() => {
      button.textContent = "Add";
      button.disabled = false;
    }, 1000);

  });

  menu.appendChild(card);

});

cartToggle.addEventListener("click", toggleCart);
cartOverlay.addEventListener("click", closeCart);
closeCartButton.addEventListener("click", closeCart);

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  closeCart();
  checkoutMessage.textContent = "";
  checkoutModal.classList.remove("hidden");

});

clearCartButton.addEventListener("click", () => {
  cart = [];
  renderCart();
  localStorage.removeItem("cart");

  showToast("Cart cleared!");
});

closeModalButton.addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
})

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    checkoutModal.classList.add("hidden");
  }
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = customerName.value.trim();
  const address = customerAddress.value.trim();
  const phone = customerPhone.value.trim();

  if (!name || !address || !phone) {
    checkoutMessage.textContent = "Please fill in all fields.";
    return;
  }

  checkoutMessage.textContent = `thanks ${name} your order has been placed!`;
  cart = [];
  renderCart();
  localStorage.removeItem("cart");
  checkoutForm.reset();

  setTimeout(() => {
    checkoutModal.classList.add("hidden");
    checkoutMessage.textContent = "";
  }, 1500);

  closeCart();
});
renderCart();