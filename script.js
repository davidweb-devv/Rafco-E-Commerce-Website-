// 1. INITIALIZE: Load cart from LocalStorage or start empty
let cart = JSON.parse(localStorage.getItem('rafcoCart')) || [];

// 2. UI UPDATE FUNCTION: Refreshes the counter and the list at the bottom
function updateCartUI() {
    // Update the counter in the header
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }

    // Update the visual list at the bottom
    const listElement = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('total-items');

    if (listElement) {
        if (cart.length === 0) {
            listElement.innerHTML = "<p style='color: #888; text-align: center;'>Your bag is currently empty.</p>";
            if (totalElement) totalElement.innerText = "0";
        } else {
            // Generate HTML for every item in the cart array
            listElement.innerHTML = cart.map((item, index) => `
                <div class="cart-item-row" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #333;">${item.name}</span>
                    <span style="font-weight: bold; color: #D4AF37;">${item.price}</span>
                </div>
            `).join('');
            
            if (totalElement) totalElement.innerText = cart.length;
        }
    }
}

// 3. ADD TO CART LOGIC
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        // Find the specific card this button belongs to
        const productCard = button.closest('.product-card') || button.parentElement;
        const name = productCard.querySelector('h3').innerText;
        const price = productCard.querySelector('.price').innerText;

        // Add to our array
        cart.push({ name, price });

        // Save to browser memory (so it stays after refresh)
        localStorage.setItem('rafcoCart', JSON.stringify(cart));

        // Refresh the UI
        updateCartUI();
        
        // Quick feedback for the user
        showToast('Item added to cart!');
        
    });
});

// 4. EMPTY BAG LOGIC (Quiet version)
const clearBtn = document.getElementById('clear-cart-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        cart = []; // Empty the array
        localStorage.removeItem('rafcoCart'); // Wipe the memory
        updateCartUI(); // Reset the count and list
        
        // Show our smooth custom toast instead of a clunky alert
        showToast("Cart cleared! 🧹");
    });
}


// 5. RUN ON LOAD: Make sure the UI shows saved data when the page opens
document.addEventListener('DOMContentLoaded', updateCartUI);

// Add this at the very bottom of script.js
function showToast(message) {
    const toast = document.getElementById('custom-toast');
    if (toast) {
        toast.innerText = message;
        toast.classList.add('show');

        // Hide it after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// 6. WHATSAPP ORDER LOGIC
const whatsappBtn = document.getElementById('whatsapp-order-btn');

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Your bag is empty!");
            return;
        }

        // Replace this with your mom's actual WhatsApp number (e.g., 2348012345678)
        const phoneNumber = "2348038643463"; 

        // Build the message string
        let message = "Hello RAFCO! I would like to order the following:\n\n";
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.price}\n`;
        });

        message += `\n*Total Items:* ${cart.length}`;
        message += "\n\nPlease let me know when I can pick these up!";

        // Encode the message for a URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create the WhatsApp Link
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open WhatsApp in a new tab
        window.open(whatsappURL, '_blank');
    });
}
const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        // This looks at the product name inside your cards
        const productName = product.querySelector('h3').textContent.toLowerCase();
        
        if(productName.includes(term)) {
            product.style.display = 'block'; // or 'flex' if you use flexbox for cards
        } else {
            product.style.display = 'none';
        }
    });
});
