const API_BASE = 'http://localhost:8080';

// Elements
const checkSkuInput = document.getElementById('checkSkuInput');
const checkInventoryBtn = document.getElementById('checkInventoryBtn');
const inventoryResult = document.getElementById('inventoryResult');

const reserveSkuInput = document.getElementById('reserveSkuInput');
const reserveQtyInput = document.getElementById('reserveQtyInput');
const reserveBtn = document.getElementById('reserveBtn');
const reserveResult = document.getElementById('reserveResult');

const reservationIdInput = document.getElementById('reservationIdInput');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const checkoutResult = document.getElementById('checkoutResult');

const toast = document.getElementById('toast');

// Global Timer Interval
let countdownInterval;

// Utils
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3000);
}

function displayJson(box, data) {
    box.classList.remove('hidden');
    box.innerHTML = `<pre style="font-size: 0.85rem; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>`;
}

function displayInventory(data) {
    inventoryResult.classList.remove('hidden');
    inventoryResult.innerHTML = `
        <div class="stat-row">
            <span class="label">SKU</span>
            <span class="val">${data.sku}</span>
        </div>
        <div class="stat-row">
            <span class="label">Available</span>
            <span class="val" style="color: ${data.available > 0 ? 'var(--success-color)' : 'var(--danger-color)'}">${data.available}</span>
        </div>
        <div class="stat-row">
            <span class="label">Total / Reserved</span>
            <span class="val">${data.total} / ${data.reserved}</span>
        </div>
    `;
}

function startCountdown(expiryTime, elementId) {
    if (countdownInterval) clearInterval(countdownInterval);

    const display = document.getElementById(elementId);
    const expiresAt = new Date(expiryTime).getTime();

    function update() {
        const now = new Date().getTime();
        const distance = expiresAt - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            display.innerHTML = `<span style="color: var(--danger-color)">EXPIRED</span>`;
            return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        display.innerHTML = `<span style="color: var(--accent-color)">${minutes}m ${seconds}s</span>`;
    }

    update(); // Run immediately
    countdownInterval = setInterval(update, 1000);
}

// 1. Check Inventory
checkInventoryBtn.addEventListener('click', async () => {
    const sku = checkSkuInput.value.trim();
    if (!sku) return showToast('Please enter a SKU', 'error');

    try {
        const res = await fetch(`${API_BASE}/inventory/${sku}`);
        if (!res.ok) throw new Error(res.status === 404 ? 'Product not found' : 'Error fetching data');
        const data = await res.json();

        displayInventory(data);

        // Auto-fill other fields for convenience
        reserveSkuInput.value = data.sku;

    } catch (err) {
        showToast(err.message, 'error');
        inventoryResult.classList.add('hidden');
    }
});

// 2. Reserve
reserveBtn.addEventListener('click', async () => {
    const sku = reserveSkuInput.value.trim();
    const qty = parseInt(reserveQtyInput.value);

    if (!sku || qty < 1) return showToast('Invalid SKU or Quantity', 'error');

    try {
        const res = await fetch(`${API_BASE}/inventory/reserve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sku, quantity: qty })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Reservation failed');

        showToast('Reservation Successful!', 'success');

        reserveResult.classList.remove('hidden');
        reserveResult.innerHTML = `
            <div style="color: var(--success-color); font-weight: bold; margin-bottom: 0.5rem;">Reserved!</div>
            <div class="stat-row"><span class="label">ID</span><span class="val">#${data.id}</span></div>
            <div class="stat-row"><span class="label">Status</span><span class="val">${data.status}</span></div>
            <div class="stat-row"><span class="label">Time Remaining</span><span id="timer-${data.id}" class="val">Calculating...</span></div>
        `;

        // Start Timer
        startCountdown(data.expiresAt, `timer-${data.id}`);

        // Auto-fill ID
        reservationIdInput.value = data.id;

    } catch (err) {
        showToast(err.message, 'error');
        displayJson(reserveResult, { error: err.message });
    }
});

// 3. Confirm
confirmBtn.addEventListener('click', async () => {
    const id = reservationIdInput.value.trim();
    if (!id) return showToast('Enter Reservation ID', 'error');

    await handleCheckout(`${API_BASE}/checkout/confirm`, id, 'Confirmed');
});

// 4. Cancel
cancelBtn.addEventListener('click', async () => {
    const id = reservationIdInput.value.trim();
    if (!id) return showToast('Enter Reservation ID', 'error');

    await handleCheckout(`${API_BASE}/checkout/cancel`, id, 'Cancelled');
});

async function handleCheckout(url, id, actionName) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservationId: id })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Action failed');

        showToast(`Order ${actionName}`, actionName === 'Confirmed' ? 'success' : 'info');

        checkoutResult.classList.remove('hidden');
        checkoutResult.innerHTML = `<span style="color: ${actionName === 'Confirmed' ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: bold;">Status: ${data.status || data.message || actionName}</span>`;

        // Stop timer if it's running
        if (countdownInterval) clearInterval(countdownInterval);

    } catch (err) {
        showToast(err.message, 'error');
        checkoutResult.innerHTML = `<span style="color: var(--danger-color)">Error: ${err.message}</span>`;
        checkoutResult.classList.remove('hidden');
    }
}
