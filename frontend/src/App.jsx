import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// Configure Axios Base URL
axios.defaults.baseURL = 'http://localhost:8080';

function App() {
  // State
  const [checkSku, setCheckSku] = useState('');
  const [inventoryResult, setInventoryResult] = useState(null);

  const [reserveSku, setReserveSku] = useState('');
  const [reserveQty, setReserveQty] = useState(1);
  const [reservationResult, setReservationResult] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const [checkoutId, setCheckoutId] = useState('');
  const [checkoutResult, setCheckoutResult] = useState(null);

  // Countdown Logic
  useEffect(() => {
    let interval;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setReservationResult((prev) => ({ ...prev, expired: true }));
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Handlers
  const handleCheckInventory = async () => {
    try {
      const res = await axios.get(`/inventory/${checkSku}`);
      setInventoryResult(res.data);
      // Auto-fill Reserve SKU if product found
      if (res.data && res.data.sku) {
        setReserveSku(res.data.sku);
      }
    } catch (err) {
      setInventoryResult({ error: 'Product not found or error occurred.' });
    }
  };

  const handleReserve = async () => {
    try {
      // Backend expects @RequestBody Map
      const res = await axios.post('/inventory/reserve', {
        sku: reserveSku,
        quantity: parseInt(reserveQty)
      });
      setReservationResult(res.data);
      // Auto-fill Checkout ID if reservation successful
      if (res.data && res.data.id) {
        setCheckoutId(res.data.id);
      }
      // Start 5 min countdown (300 seconds)
      setCountdown(300);
    } catch (err) {
      setReservationResult({ error: err.response?.data?.error || 'Reservation failed.' });
    }
  };

  const handleCheckout = async (action) => {
    try {
      const endpoint = action === 'confirm' ? '/checkout/confirm' : '/checkout/cancel';
      // Backend expects @RequestBody Map
      const res = await axios.post(endpoint, {
        reservationId: checkoutId
      });
      setCheckoutResult({ message: res.data.message || 'Success', type: 'success' });
      // If confirmed or cancelled, update reservation result if visible
      if (res.data.status || action === 'cancel') {
        // Stop the countdown
        setCountdown(null);
        // Update local status
        setReservationResult((prev) => ({
          ...prev,
          status: action === 'confirm' ? 'CONFIRMED' : 'CANCELLED',
          expired: false
        }));
      }
    } catch (err) {
      setCheckoutResult({ message: err.response?.data?.error || 'Operation failed.', type: 'error' });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <h1>SmartInventory</h1>
        </div>
        <p className="subtitle">Real-time Inventory Reservation & Management</p>
      </header>

      <main>
        {/* Check Inventory */}
        <section className="card-glass">
          <h2><i className="fa-solid fa-magnifying-glass"></i> Check Inventory</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Product SKU (e.g. IPHONE15)"
              value={checkSku}
              onChange={(e) => setCheckSku(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleCheckInventory}>Check Available</button>
          </div>
          {inventoryResult && (
            <div className="result-box">
              {inventoryResult.error ? (
                <p style={{ color: 'var(--danger-color)' }}>{inventoryResult.error}</p>
              ) : (
                <>
                  <div className="stat-row">
                    <span className="label">Total Qty</span>
                    <span className="val">{inventoryResult.total}</span>
                  </div>
                  <div className="stat-row">
                    <span className="label">Reserved</span>
                    <span className="val">{inventoryResult.reserved}</span>
                  </div>
                  <div className="stat-row">
                    <span className="label">Available</span>
                    <span className="val" style={{ color: 'var(--success-color)' }}>
                      {inventoryResult.available}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="label">Sold</span>
                    <span className="val" style={{ color: 'var(--accent-color)' }}>{inventoryResult.sold || 0}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <div className="grid-2">
          {/* Reserve Item */}
          <section className="card-glass">
            <h2><i className="fa-regular fa-bookmark"></i> Reserve Item</h2>
            <div className="form-group">
              <label>Product SKU</label>
              <input
                type="text"
                placeholder="SKU"
                value={reserveSku}
                onChange={(e) => setReserveSku(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={reserveQty}
                onChange={(e) => setReserveQty(e.target.value)}
              />
            </div>
            <button className="btn btn-accent" onClick={handleReserve}>Reserve Now</button>

            {reservationResult && (
              <div className="result-box">
                {reservationResult.error ? (
                  <p style={{ color: 'var(--danger-color)' }}>{reservationResult.error}</p>
                ) : (
                  <>
                    <div className="stat-row">
                      <span className="label">Reservation ID</span>
                      <span className="val" style={{ color: 'var(--accent-color)' }}>{reservationResult.id}</span>
                    </div>
                    <div className="stat-row">
                      <span className="label">Status</span>
                      <span className="val">{reservationResult.status}</span>
                    </div>
                    {!reservationResult.expired && countdown !== null && (
                      <div className="stat-row">
                        <span className="label">Expires In</span>
                        <span className="val" style={{ color: 'var(--danger-color)' }}>
                          {formatTime(countdown)}
                        </span>
                      </div>
                    )}
                    {reservationResult.expired && (
                      <p style={{ color: 'var(--danger-color)', marginTop: '0.5rem' }}>Reservation Expired</p>
                    )}
                  </>
                )}
              </div>
            )}
          </section>

          {/* Manage Checkout */}
          <section className="card-glass">
            <h2><i className="fa-solid fa-cart-shopping"></i> Manage Checkout</h2>
            <div className="form-group">
              <label>Reservation ID</label>
              <input
                type="text"
                placeholder="Enter ID"
                value={checkoutId}
                onChange={(e) => setCheckoutId(e.target.value)}
              />
            </div>
            <div className="action-buttons">
              <button className="btn btn-success" onClick={() => handleCheckout('confirm')}>Confirm</button>
              <button className="btn btn-danger" onClick={() => handleCheckout('cancel')}>Cancel</button>
            </div>

            {checkoutResult && (
              <div className="result-box">
                <p style={{ color: checkoutResult.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                  {checkoutResult.message}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* FontAwesome Cdn handled in index.html or npm. For now sticking to index.html approach or manual import. 
          React recommends installing icons, but for simplicity I will add the CDN to index.html */}
    </div>
  );
}

export default App;
