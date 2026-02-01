import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function CheckoutSummary() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user, authLoading } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null);
    const [error, setError] = useState(null);

    const [confirmed, setConfirmed] = useState(false);
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        if (!authLoading && user && user.token) {
            fetchOrder();
        }
    }, [orderId, authLoading, user]);

    useEffect(() => {
        let interval;
        if (countdown !== null && countdown > 0 && !confirmed && !cancelled) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0 && order?.status === 'PENDING' && !confirmed && !cancelled) {
            // Auto-cancel logic could go here or just show expired
            // For now, let's just show expired state
        }
        return () => clearInterval(interval);
    }, [countdown, confirmed, cancelled]);

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`/orders/${orderId}`);
            setOrder(res.data);

            if (res.data.status === 'PENDING') {
                const expiresAt = new Date(res.data.expiresAt).getTime();
                const now = new Date().getTime();
                const diff = Math.floor((expiresAt - now) / 1000);
                setCountdown(diff > 0 ? diff : 0);
            } else if (res.data.status === 'COMPLETED') {
                setConfirmed(true);
            } else if (res.data.status === 'CANCELLED') {
                setCancelled(true);
            }
        } catch (err) {
            const status = err.response?.status;
            const msg = err.response?.data?.error || err.response?.data || err.message;
            setError(`Failed to load order. (Status: ${status || 'Network Error'}) - ${msg}. | Try checking status at http://localhost:8080/auth/status`);
            console.error("AXIOS ERROR DETAILED:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        try {
            await axios.post(`/orders/confirm/${orderId}`);
            setConfirmed(true);
            setOrder(prev => ({ ...prev, status: 'COMPLETED' }));
        } catch (err) {
            alert("Confirmation failed: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    const handleCancel = async () => {
        try {
            await axios.post(`/orders/cancel/${orderId}`);
            setCancelled(true);
            setOrder(prev => ({ ...prev, status: 'CANCELLED' }));
        } catch (err) {
            alert("Cancellation failed.");
        }
    };

    const formatTime = (seconds) => {
        if (seconds < 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading...</div>;
    if (error) return <div className="container" style={{ padding: '4rem', color: 'red' }}>{error}</div>;

    if (confirmed || cancelled) {
        const isConfirmed = order?.status === 'COMPLETED' || confirmed;
        return (
            <div className="container" style={{ padding: '6rem 0', maxWidth: '600px', textAlign: 'center' }}>
                <div className="card-glass" style={{
                    background: '#fff',
                    padding: '4rem 3rem',
                    borderRadius: '30px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Background Element */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: isConfirmed ? 'rgba(46, 125, 50, 0.05)' : 'rgba(230, 81, 0, 0.05)',
                        zIndex: 0
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            background: isConfirmed ? 'var(--success-color)' : 'var(--danger-color)',
                            color: 'white',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            margin: '0 auto 2rem auto',
                            boxShadow: `0 15px 30px ${isConfirmed ? 'rgba(46, 125, 50, 0.2)' : 'rgba(230, 81, 0, 0.2)'}`
                        }}>
                            <i className={`fa-solid ${isConfirmed ? 'fa-check' : 'fa-xmark'}`}></i>
                        </div>

                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            color: 'var(--text-primary)',
                            marginBottom: '1rem',
                            lineHeight: '1.2'
                        }}>
                            {isConfirmed ? 'Order Confirmed!' : 'Reservation Cancelled'}
                        </h2>

                        <p style={{
                            fontSize: '1.1rem',
                            color: '#777',
                            marginBottom: '3rem',
                            maxWidth: '400px',
                            margin: '0 auto 3rem auto'
                        }}>
                            {isConfirmed
                                ? 'Your fresh harvest is being prepared for delivery. We will notify you once it’s on the way!'
                                : 'The reservation has been successfully removed. You can always go back and pick something else!'}
                        </p>

                        <button
                            className="btn btn-accent"
                            style={{
                                padding: '1.2rem 3rem',
                                fontSize: '1.1rem',
                                borderRadius: '50px',
                                fontWeight: '700',
                                width: '100%',
                                boxShadow: '0 10px 20px rgba(210, 105, 30, 0.2)'
                            }}
                            onClick={() => navigate('/shop')}
                        >
                            <i className="fa-solid fa-basket-shopping" style={{ marginRight: '10px' }}></i>
                            Continue Shopping
                        </button>

                        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                            <p style={{ fontSize: '0.85rem', color: '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-shield-halved"></i> 100% SECURE TRANSACTION
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '700px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h6 style={{ color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Final Step</h6>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Checkout Summary</h2>
            </div>

            <div className="card-glass" style={{ padding: '0', overflow: 'hidden', border: 'none', background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                {/* Timer Header Section */}
                {order.status === 'PENDING' && countdown > 0 ? (
                    <div style={{ background: 'var(--primary-color)', color: 'white', padding: '2.5rem', textAlign: 'center' }}>
                        <p style={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Items Reserved For</p>
                        <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff' }}>
                            {formatTime(countdown)}
                        </div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem' }}>
                            <i className="fa-solid fa-clock-rotate-left"></i> Complete purchase before the timer expires to secure your stock.
                        </p>
                    </div>
                ) : (
                    <div style={{ background: order.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--danger-color)', color: 'white', padding: '2rem', textAlign: 'center' }}>
                        <h3 style={{ margin: 0 }}>{order.status === 'COMPLETED' ? 'Order Successful' : 'Reservation Expired'}</h3>
                    </div>
                )}

                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                        <div>
                            <p style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase' }}>Order Reference</p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>#{order.id}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase' }}>Payment Method</p>
                            <p style={{ fontSize: '1rem', fontWeight: '600' }}><i className="fa-solid fa-wallet"></i> Pay on Delivery</p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h4 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Order Details</h4>
                        {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                                    {item.product.imageUrl ? (
                                        <img src={item.product.imageUrl} alt={item.product.sku} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-leaf" style={{ color: '#ccc' }}></i>
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '700', fontSize: '1.1rem', textTransform: 'capitalize' }}>{item.product.sku.replace(/-/g, ' ')}</p>
                                    <p style={{ color: '#777', fontSize: '0.9rem' }}>Qty: {item.quantity} {item.product.unit || 'Unit'}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Grand Total Card */}
                    <div style={{ background: '#F9F7F2', padding: '1.5rem 2rem', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Total Amount to Pay</span>
                        <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary-color)' }}>₹{order.totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Actions */}
                    {order.status === 'PENDING' && countdown > 0 && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <button
                                className="btn"
                                style={{
                                    flex: 1,
                                    background: '#fff',
                                    border: '2px solid #eee',
                                    color: '#777',
                                    padding: '1.2rem',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    transition: 'all 0.3s'
                                }}
                                onClick={handleCancel}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--danger-color)'; e.currentTarget.style.color = 'var(--danger-color)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.color = '#777'; }}
                            >
                                <i className="fa-solid fa-trash-can"></i> Cancel Plan
                            </button>
                            <button
                                className="btn btn-accent"
                                style={{
                                    flex: 1.5,
                                    padding: '1.2rem',
                                    borderRadius: '12px',
                                    fontWeight: '800',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 10px 20px rgba(210, 105, 30, 0.2)'
                                }}
                                onClick={handleConfirm}
                            >
                                <i className="fa-solid fa-circle-check"></i> Confirm Purchase
                            </button>
                        </div>
                    )}

                    {order.status !== 'PENDING' && (
                        <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '12px' }} onClick={() => navigate('/')}>
                            <i className="fa-solid fa-house"></i> Return to Homepage
                        </button>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#bbb' }}>
                            <i className="fa-solid fa-shield-halved"></i> SECURE END-TO-END RESERVATION
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutSummary;
