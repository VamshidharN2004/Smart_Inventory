import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => acc + (item.product.price * (item.quantity || 0)), 0).toFixed(2);

    const handleCheckout = async () => {
        const items = cart.map(item => ({
            sku: item.product.sku,
            quantity: item.quantity
        }));

        try {
            const res = await axios.post('/orders/checkout', items);
            clearCart();
            navigate(`/checkout/${res.data.id}`);
        } catch (err) {
            console.error("Checkout failed", err);
            let errorMessage = "Checkout failed. Please try again.";
            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (typeof err.response.data === 'object') {
                    errorMessage = err.response.data.error || err.response.data.message || JSON.stringify(err.response.data);
                }
            }
            alert("Checkout Error: " + errorMessage);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Your Cart is Empty</h2>
                <p style={{ margin: '1rem 0' }}>Looks like you haven't added anything yet.</p>
                <button className="btn btn-accent" onClick={() => navigate('/shop')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ marginBottom: '2rem' }}>Shopping Cart</h2>
            <div className="card-glass" style={{ background: '#fff', color: '#333' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Product</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Quantity</th>
                            <th style={{ padding: '1rem' }}>Total</th>
                            <th style={{ padding: '1rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.product.sku} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {item.product.imageUrl && (
                                        <img src={item.product.imageUrl} alt={item.product.sku} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                    {item.product.sku}
                                </td>
                                <td style={{ padding: '1rem' }}>₹{item.product.price}</td>
                                <td style={{ padding: '1rem' }}>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity === 0 ? '' : item.quantity}
                                        onChange={(e) => updateQuantity(item.product.sku, e.target.value === '' ? 0 : parseInt(e.target.value))}
                                        onBlur={() => {
                                            if (item.quantity === 0 || !item.quantity) {
                                                updateQuantity(item.product.sku, 1);
                                            }
                                        }}
                                        style={{ width: '60px', padding: '0.3rem' }}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>₹{(item.product.price * (item.quantity || 0)).toFixed(2)}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn" style={{ background: 'var(--danger-color)', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => removeFromCart(item.product.sku)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: '2rem', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                    <h3>Total: ₹{total}</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn" style={{ background: '#ccc', color: '#333' }} onClick={clearCart}>Clear Cart</button>
                        <button className="btn btn-accent" onClick={handleCheckout}>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
