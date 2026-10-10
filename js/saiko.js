// SAIKO — shared script for every page: products, cart, modals, and the twitchy effects.

const WHATSAPP_NUMBER = '2348162921153'; // wa.me needs digits only: country code + number
const CONTACT_EMAIL = 'boy-add-your-email@gmail.com'; // TODO: replace with the real inbox

// ---------- products ----------
// Single source of truth for the store: the card, the cart and the WhatsApp order all read from here.
// price is in naira; null means "price on request". id must stay stable — saved carts refer to it.
const CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const products = [
    { id: 'tshirt-1', name: 'T SHIRT', price: 8000, image: 'img/tshirt.jpeg', sizes: CLOTHING_SIZES, soldOut: true },
    { id: 'hoodie-set', name: 'SIGNATURE HOODIE SET', price: 18000, image: 'img/hoody.jpeg', sizes: CLOTHING_SIZES },
    { id: 'bucket-hat', name: 'BUCKET HAT', price: 8500, image: 'img/bucket hat.jpeg' },
    { id: 'tshirt-2', name: 'T SHIRT', price: 8000, image: 'img/ttshirt2.jpeg', sizes: CLOTHING_SIZES },
    { id: 'joggers', name: 'JOGGERS', price: 15700, image: 'img/pants.jpeg', sizes: CLOTHING_SIZES },
    { id: 'print-hollow-howl', name: 'LIMITED ART PRINT — HOLLOW HOWL', price: 65000, image: 'img/Hollow howl.jpeg' },
    { id: 'quarter-zip', name: 'QUARTER ZIP', price: 16000, image: 'img/quarter zip.jpeg', sizes: CLOTHING_SIZES },
    { id: 'jorts', name: 'SIGNATURE JORTS', price: 16000, image: 'img/JJ.jpeg', sizes: CLOTHING_SIZES },
    { id: 'print-jesus-portrait', name: 'LIMITED ART PRINT — JESUS PORTRAIT', price: 68000, image: 'img/Jesus portrait.jpeg' },
    { id: 'baseball-cap', name: 'SAIKO BASEBALL CAP', price: 8500, image: 'img/cap.jpeg' },
    { id: 'tank-white', name: 'WHITE SAIKO TANK TOP', price: 14000, image: 'img/sleeevve.jpeg', sizes: CLOTHING_SIZES },
    { id: 'dread-hat', name: 'DREAD HAT', price: 11500, image: 'img/dread hat.jpeg' },
    { id: 'crop-hoodie', name: 'CROP HOODIE', price: 14000, image: 'img/crop hoodie.jpeg', sizes: CLOTHING_SIZES },
    { id: 'jersey-white', name: 'WHITE SAIKO BASEBALL JERSEY', price: 7000, image: 'img/Jersey2.jpeg', sizes: CLOTHING_SIZES },
    { id: 'skull-jacket', name: 'BLANK SAIKO SKULL LEATHER JACKET', price: null, image: 'img/Jacket1.jpeg', sizes: CLOTHING_SIZES }
];

const productById = Object.fromEntries(products.map(product => [product.id, product]));

function formatNaira(amount) {
    return amount == null ? 'Price on request' : '₦' + amount.toLocaleString('en-NG');
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map((product, index) => {
        const sizes = product.sizes && !product.soldOut ? `
            <fieldset class="size-chips" id="sizes-${product.id}">
                <legend>Size</legend>
                ${product.sizes.map(size => `
                    <label><input type="radio" name="size-${product.id}" value="${size}"><span>${size}</span></label>
                `).join('')}
            </fieldset>` : '';

        return `
            <article class="product-card${product.soldOut ? ' is-sold-out' : ''}">
                <button class="product-image" onclick="zoomImage('${product.image}')" aria-label="Zoom in on ${product.name}">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </button>
                <span class="product-tag">ITEM #${String(index + 1).padStart(3, '0')}</span>
                ${product.soldOut ? '<span class="stamp product-stamp">CONFISCATED</span>' : ''}
                <h3>${product.name}</h3>
                <p class="product-price">${formatNaira(product.price)}</p>
                ${sizes}
                <button class="btn" ${product.soldOut ? 'disabled' : `onclick="addToCart('${product.id}', this)"`}>
                    ${product.soldOut ? 'Sold out' : 'Add to cart'}
                </button>
            </article>
        `;
    }).join('');
}

// ---------- cart (kept in localStorage so it follows you between pages) ----------
const CART_KEY = 'saiko-cart';

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        if (!Array.isArray(saved)) return [];
        return saved.filter(item => productById[item.productId] && Number.isInteger(item.qty) && item.qty > 0);
    } catch {
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
        // storage blocked (private mode etc.) — the cart still works for this page
    }
}

let cart = loadCart(); // [{ productId, size, qty }]

function itemLabel(item) {
    const product = productById[item.productId];
    return item.size ? `${product.name} (Size ${item.size})` : product.name;
}

function lineTotal(item) {
    const price = productById[item.productId].price;
    return price == null ? null : price * item.qty;
}

function cartTotals() {
    let total = 0;
    let hasPriceOnRequest = false;
    cart.forEach(item => {
        const line = lineTotal(item);
        if (line == null) hasPriceOnRequest = true;
        else total += line;
    });
    return { total, hasPriceOnRequest };
}

function updateCartUI() {
    saveCart();

    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cartCount').textContent = itemCount;
    document.querySelector('.cart-icon').classList.toggle('visible', itemCount > 0);

    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Nothing in custody yet.</p>';
        cartTotal.textContent = 'Total: ₦0';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img class="cart-item-image" src="${productById[item.productId].image}" alt="" onclick="zoomImage(this.src)">
            <div class="cart-item-info">
                <strong>${itemLabel(item)}</strong><br>
                <span>${formatNaira(lineTotal(item))}</span>
            </div>
            <div class="cart-qty">
                <button onclick="changeQty(${index}, -1)" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)" aria-label="Increase quantity">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
        </div>
    `).join('');

    const { total, hasPriceOnRequest } = cartTotals();
    cartTotal.textContent = `Total: ${formatNaira(total)}`;
    if (hasPriceOnRequest) {
        cartItems.insertAdjacentHTML('beforeend', '<p class="cart-note">+ items priced on request — we\'ll confirm on WhatsApp</p>');
    }
}

function addToCart(productId, button) {
    const product = productById[productId];
    let size = null;

    if (product.sizes) {
        const chips = document.getElementById(`sizes-${productId}`);
        const picked = chips.querySelector('input:checked');
        chips.classList.remove('needs-size');
        if (!picked) {
            void chips.offsetWidth; // restart the shake animation
            chips.classList.add('needs-size');
            chips.querySelector('legend').textContent = 'Pick a size first';
            chips.querySelector('input').focus();
            return;
        }
        chips.querySelector('legend').textContent = 'Size';
        size = picked.value;
    }

    const existing = cart.find(item => item.productId === productId && item.size === size);
    if (existing) existing.qty++;
    else cart.push({ productId, size, qty: 1 });

    updateCartUI();

    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.remove('bump');
    void cartIcon.offsetWidth;
    cartIcon.classList.add('bump');

    button.textContent = 'Added ✓';
    setTimeout(() => { button.textContent = 'Add to cart'; }, 1200);
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart.splice(index, 1);
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart(open) {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('open', open ?? !modal.classList.contains('open'));
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    let message = '🛍️ *New Order from EY3S le ART*\n\n';

    cart.forEach((item, index) => {
        message += `${index + 1}. ${itemLabel(item)} x${item.qty} - ${formatNaira(lineTotal(item))}\n`;
    });

    const { total, hasPriceOnRequest } = cartTotals();
    message += `\n*Total: ${formatNaira(total)}*`;
    if (hasPriceOnRequest) message += ' + items priced on request';
    message += '\n\nPlease confirm your order and provide shipping details.';

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ---------- image zoom ----------
function zoomImage(imageSrc) {
    document.getElementById('zoomedImage').src = imageSrc;
    document.getElementById('imageZoomModal').classList.add('open');
}

function closeZoom() {
    document.getElementById('imageZoomModal').classList.remove('open');
}

// Cart button, cart drawer and zoom overlay are the same on every page, so they're injected here.
function injectChrome() {
    document.body.insertAdjacentHTML('beforeend', `
        <button class="cart-icon" onclick="toggleCart(true)" aria-label="Open cart">
            CART
            <span class="cart-count" id="cartCount">0</span>
        </button>

        <div class="cart-modal" id="cartModal" onclick="if (event.target === this) toggleCart(false)">
            <div class="cart-content" role="dialog" aria-label="Your cart">
                <button class="close-cart" onclick="toggleCart(false)" aria-label="Close cart">×</button>
                <h2>EVIDENCE LOCKER</h2>
                <p class="cart-sub">Your cart · checkout happens on WhatsApp</p>
                <div id="cartItems"></div>
                <div class="cart-total" id="cartTotal">Total: ₦0</div>
                <button class="btn btn-whatsapp checkout-btn" onclick="checkoutWhatsApp()">Checkout via WhatsApp</button>
            </div>
        </div>

        <div class="image-zoom-modal" id="imageZoomModal" onclick="closeZoom()">
            <img id="zoomedImage" src="" alt="Zoomed image">
        </div>
    `);

    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        closeZoom();
        toggleCart(false);
    });
}

// ---------- contact form ----------
function sendEmail(event) {
    event.preventDefault();

    const form = event.target;
    const data = Object.fromEntries(new FormData(form));
    const messageDiv = document.getElementById('formMessage');

    const emailBody = `Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailBody)}`;

    messageDiv.className = 'form-message success';
    messageDiv.textContent = 'Your email app has been opened. Hit send there to complete your message.';
    form.reset();
    setTimeout(() => { messageDiv.className = 'form-message'; }, 6000);
}

// ---------- effects ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const GLYPHS = '!<>-_\\/[]{}=+*^?#ЖΔ§¥@%&';

// Letters scramble into noise, then settle back into the real word.
function scramble(label) {
    if (reduceMotion) return;
    const finalText = label.dataset.label;
    let frame = 0;
    clearInterval(label._timer);
    label._timer = setInterval(() => {
        label.textContent = finalText.split('').map((char, i) =>
            char === ' ' || i < frame / 2 ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ).join('');
        if (++frame > finalText.length * 2) {
            clearInterval(label._timer);
            label.textContent = finalText;
        }
    }, 30);
}

function initEffects() {
    document.querySelectorAll('a b[data-label]').forEach(label => {
        const link = label.closest('a');
        link.addEventListener('mouseenter', () => scramble(label));
        link.addEventListener('focus', () => scramble(label));
    });

    // Fill the warning tapes so the loop never shows a gap on wide screens.
    document.querySelectorAll('.tape-track').forEach(track => { track.innerHTML += track.innerHTML; });

    // Every so often the page has an episode.
    const main = document.querySelector('main');
    if (main && !reduceMotion) {
        (function scheduleFlicker() {
            setTimeout(() => {
                main.classList.add('sk-flicker');
                setTimeout(() => main.classList.remove('sk-flicker'), 110);
                scheduleFlicker();
            }, 5000 + Math.random() * 6000);
        })();
    }
}

function updateTimestamp() {
    const text = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.querySelectorAll('.js-time').forEach(el => { el.textContent = text; });
}

injectChrome();
renderProducts();
updateCartUI();
initEffects();
updateTimestamp();
setInterval(updateTimestamp, 60000);
