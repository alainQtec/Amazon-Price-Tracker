/**
 * This file contains the logic for communicating with the background script and updating the list of products being tracked.
 */
function renderProduct(product) {
    const productEl = document.createElement("div");
    productEl.classList.add("product");

    const imgEl = document.createElement("img");
    imgEl.src = product.image;
    imgEl.alt = product.name;
    productEl.appendChild(imgEl);

    const nameEl = document.createElement("div");
    nameEl.classList.add("name");
    nameEl.textContent = product.name;
    productEl.appendChild(nameEl);

    const priceEl = document.createElement("div");
    priceEl.classList.add("price");
    priceEl.textContent = `Current price: $${product.price}`;
    productEl.appendChild(priceEl);

    const desiredPriceEl = document.createElement("div");
    desiredPriceEl.classList.add("desired-price");
    desiredPriceEl.textContent = `Desired price: $${product.desiredPrice}`;
    productEl.appendChild(desiredPriceEl);

    const intervalEl = document.createElement("div");
    intervalEl.classList.add("interval");
    intervalEl.textContent = `Check interval: ${product.interval} minutes`;
    productEl.appendChild(intervalEl);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage(
            { action: "removeProduct", productId: product.id },
            (response) => {
                if (response.message) {
                    alert(response.message);
                }
            }
        );
        productEl.remove();
    });
    productEl.appendChild(removeBtn);

    return productEl;
}

function renderProductList(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach((product) => {
        productList.appendChild(renderProduct(product));
    });
}

chrome.runtime.sendMessage({ action: "getProducts" }, (response) => {
    renderProductList(response.products);
});