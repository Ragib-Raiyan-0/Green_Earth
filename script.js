const categoriesEl = document.getElementById("categories");
const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const spinner = document.getElementById("spinner");

let categories = [];
let plants = [];
let cart = [];

// Fetch Categories
async function fetchCategories() {
    spinner.style.display = "flex";
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    categories = data.categories;
    renderCategories();
    spinner.style.display = "none";
}

// Render Categories
function renderCategories() {
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.textContent = cat.category_name;
        li.addEventListener("click", () => loadCategory(cat.category_name, li));
        categoriesEl.appendChild(li);
    });
}

// Load category
async function loadCategory(name, li) {
    // active class
    categoriesEl.querySelectorAll("li").forEach(item => item.classList.remove("active"));
    li.classList.add("active");
    spinner.style.display = "flex";

    let url;
    if(name === "All Trees") url = "https://openapi.programming-hero.com/api/plants";
    else {
        const catObj = categories.find(c => c.category_name === name);
        url = `https://openapi.programming-hero.com/api/category/${catObj.id}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    plants = data.plants;
    renderPlants(plants);
    spinner.style.display = "none";
}

// Render Plants
function renderPlants(plantsList) {
    productsEl.innerHTML = "";
    plantsList.forEach(plant => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}" class="card-img">
            <div class="card-body">
            <h4 class="title" data-id="${plant.id}">${plant.name}</h4>
            <p class="desc">${plant.description.substring(0,80)}...</p>
            <div class="footer">
            <span class="tag">${plant.category}</span>
            <span class="price">${plant.price} tk</span>
                    </div>
                    <button class="btn add" data-id="${plant.id}">Add to Cart</button>
            </div>
        `;
        productsEl.appendChild(card);
    });
    attachCardEvents();
}

// Card events
function attachCardEvents() {
    document.querySelectorAll(".btn.add").forEach(btn => {
        btn.addEventListener("click", () => addToCart(btn.dataset.id));
    });
    document.querySelectorAll(".title").forEach(title => {
        title.addEventListener("click", () => openModal(title.dataset.id));
    });
}

// Cart Functions
function addToCart(id) {
    const plant = plants.find(p => p.id == id);
    cart.push(plant);
    renderCart();
}

function renderCart() {
    cartItemsEl.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price;
        const li = document.createElement("li");
        li.innerHTML = `${item.name} - ${item.price} tk<button class="remove" data-index="${idx}">x</button>`;
        cartItemsEl.appendChild(li);
    });
    cartTotalEl.textContent = `Total: ${total} tk`;
    document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", () => {
            cart.splice(btn.dataset.index, 1);
            renderCart();
        });
    });
}

// Modal Functions
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");
const closeModalBtn = document.getElementById("close-modal");

async function openModal(id) {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const plant = data.plant;
    modalImg.src = plant.image;
    modalTitle.textContent = plant.name;
    modalDesc.textContent = plant.description;
    modalCategory.textContent = plant.category;
    modalPrice.textContent = `${plant.price} tk`;
    modal.style.display = "flex";
}

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});
window.addEventListener("click", (e) => {
    if(e.target == modal) modal.style.display = "none";
});

// Initial Load
fetchCategories();
loadCategory("All Trees", categoriesEl.querySelector("li"));
