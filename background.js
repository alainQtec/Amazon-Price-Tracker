/**
 *  This file contains the logic for injecting the button into Amazon product pages and handling user input.
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ products: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addProduct") {
        chrome.storage.sync.get("products", (data) => {
            const products = data.products;
            products.push(request.product);
            chrome.storage.sync.set({ products }, () => {
                sendResponse({ message: "Product added successfully!" });
            });
        });
    } else if (request.action === "getProducts") {
        chrome.storage.sync.get("products", (data) => {
            sendResponse({ products: data.products });
        });
    } else if (request.action === "removeProduct") {
        chrome.storage.sync.get("products", (data) => {
            const products = data.products.filter(
                (product) => product.id !== request.productId
            );
            chrome.storage.sync.set({ products }, () => {
                sendResponse({ message: "Product removed successfully!" });
            });
        });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && /^https?:\/\/www\.amazon\..*/.test(tab.url)) {
        chrome.tabs.executeScript(tabId, { file: "content.js" });
    }
});