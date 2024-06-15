document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.querySelector('.order .count'); 
    const cartItemsContainer = document.getElementById('order-container');
    const totalPriceElement = document.querySelector('.order-footer p:last-child');
    const clearOrderButton = document.querySelector('.clear-order');
    const pizzaItems = document.querySelectorAll('.pizza-item'); 

    function updateCartCount() {
        cartCountElement.textContent = cart.length;
    }

    function updateTotalPrice() {
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalPriceElement.textContent = `${totalPrice} грн`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('order-item');
            cartItemElement.innerHTML = `
                <div class="pizza-info">
                    <p class="col">${item.name} (${item.size})</p>
                    <p>${item.size} <img src="im/po.png" alt="грами" class="photo"> ${item.weight}</p>
                    <p>${item.price * item.quantity} грн
                        <button class="round minus-button">-</button>
                        <span>${item.quantity}</span>
                        <button class="round plus-button">+</button>
                        <button class="round delete-button">×</button>
                    </p>
                </div>
                <img src="${item.image}" alt="${item.name} (${item.size})" class="pizza-image">
            `;
            cartItemElement.querySelector('.plus-button').addEventListener('click', () => {
                item.quantity++;
                renderCartItems();
                saveCart();
                updateTotalPrice();
                updateCartCount();
            });
            cartItemElement.querySelector('.minus-button').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    const index = cart.indexOf(item);
                    cart.splice(index, 1);
                }
                renderCartItems();
                saveCart();
                updateTotalPrice();
                updateCartCount();
            });
            cartItemElement.querySelector('.delete-button').addEventListener('click', () => {
                const index = cart.indexOf(item);
                cart.splice(index, 1);
                renderCartItems();
                saveCart();
                updateTotalPrice();
                updateCartCount();
            });
            cartItemsContainer.appendChild(cartItemElement);
        });
        updateCartCount();
    }

    function updatePizzaCount() {
        const visiblePizzaItems = document.querySelectorAll('.pizza-item:not([style*="display: none"])');
        document.querySelector('.centered .count').textContent = visiblePizzaItems.length;
    }

    document.querySelectorAll('.ball').forEach(button => {
        button.addEventListener('click', () => {
            const pizzaItem = button.closest('.pizza-item');
            const name = pizzaItem.querySelector('h3').textContent;
            const sizeOption = button.closest('.size-option');
            const size = sizeOption.querySelector('.bl').textContent.trim();
            const weight = sizeOption.querySelector('img').nextSibling.textContent.trim();
            const price = parseInt(sizeOption.querySelector('.siza').textContent);

            let image;
            if (name === 'Імпреза') {
                image = 'im/1h.png';
            } else if (name === 'BBQ') {
                image = 'im/2h.png';
            } else if (name === 'Міксовий поло') {
                image = 'im/3h.png';
            } else if (name === 'Дольче Маре') {
                image = 'im/4h.png';
            } else if (name === 'Россо Густо') {
                image = 'im/5h.png';
            }

            const existingItem = cart.find(item => item.name === name && item.size === size);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, size, weight, price, quantity: 1, image });
            }

            renderCartItems();
            saveCart();
            updateTotalPrice();
            updatePizzaCount();
        });
    });

    clearOrderButton.addEventListener('click', () => {
        cart.length = 0;
        renderCartItems();
        saveCart();
        updateTotalPrice();
        updateCartCount();
        updatePizzaCount();
    });

    document.querySelectorAll('.form').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            pizzaItems.forEach(item => {
                const name = item.querySelector('h3').textContent;
                const isMeat = item.querySelector('.gr') && item.querySelector('.gr').textContent.includes('М\'ясна піца');
                const isPineapple = name === 'Імпреза' || name === 'Міксовий поло';
                const isMushrooms = name === 'BBQ';
                const isSeafood = item.querySelector('.gr') && item.querySelector('.gr').textContent.includes('Морська піца');
                const isVega = name === 'Россо Густо';

                if (filter === 'all') {
                    item.style.display = '';
                } else if (filter === 'meat' && isMeat) {
                    item.style.display = '';
                } else if (filter === 'pineapple' && isPineapple) {
                    item.style.display = '';
                } else if (filter === 'mushrooms' && isMushrooms) {
                    item.style.display = '';
                } else if (filter === 'seafood' && isSeafood) {
                    item.style.display = '';
                } else if (filter === 'vega' && isVega) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
            updatePizzaCount();
        });
    });

    renderCartItems();
    updateTotalPrice();
    updatePizzaCount();
});
