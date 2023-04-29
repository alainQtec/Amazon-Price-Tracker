/**
 * Contain javascript code that is injected into amazon product pages to add the price tracker button and interact with the pages's DOM.
 */
function getPrice() {
    const priceEl = document.getElementById("priceblock_ourprice");
    if (priceEl) {
        return priceEl.textContent.replace(/[^0-9.]/g, "");
    }
    return null;
}

function addPriceTracker() {
    const price = getPrice();
    if (price) {
        const asin = window.location.pathname.split("/")[3];
        const product = {
            id: asin,
            name: document.title,
            image: document.getElementById("landingImage").src,
            price,
            desiredPrice: "",
            interval: 60,
        };
        chrome.runtime.sendMessage(
            { action: "addProduct", product },
            (response) => {
                if (response.message) {
                    alert(response.message);
                }
            }
        );
    }
}

const observer = new MutationObserver(() => {
    if (document.getElementById("priceblock_ourprice")) {
        const priceTrackerBtn = document.createElement("button");
        priceTrackerBtn.classList.add("price-tracker-btn");
        priceTrackerBtn.textContent = "Track Price";
        priceTrackerBtn.addEventListener("click", addPriceTracker);

        const addToCartBtn = document.getElementById("add-to-cart-button");
        addToCartBtn.parentNode.insertBefore(priceTrackerBtn, addToCartBtn);
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });