import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { user, authLoading } = useAuth();
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (!authLoading && user && user.token && !fetched) {
            fetchOrders();
            setFetched(true);
        }
    }, [user, authLoading, fetched]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/orders/my-orders');
            setOrders(res.data);
            setError(null); // Clear error on success!
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data || "Failed to fetch your orders.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status, isTimeExpired) => {
        if (isTimeExpired) return 'var(--danger-color)';
        switch (status) {
            case 'COMPLETED': return 'var(--success-color)';
            case 'CANCELLED': return 'var(--danger-color)';
            case 'EXPIRED': return 'var(--danger-color)';
            case 'PENDING': return '#f57c00';
            default: return 'var(--text-secondary)';
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading your orders...</div>;
    if (error) return <div className="container" style={{ padding: '4rem', color: 'red' }}>{error}</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h2 style={{ marginBottom: '2rem' }}>My Orders</h2>

            {orders.length === 0 ? (
                <div className="card-glass" style={{ textAlign: 'center', padding: '3rem' }}>
                    <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
                    <p>You haven't placed any orders yet.</p>
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/shop')}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {orders.map(order => {
                        // Check for client-side expiry to handle scheduler lag
                        const isTimeExpired = order.status === 'PENDING' && new Date() > new Date(order.expiresAt);
                        const displayStatus = isTimeExpired ? 'TIME EXPIRED' : order.status;

                        return (
                            <div key={order.id} className="card-glass" style={{
                                padding: '2.5rem',
                                borderRadius: '24px',
                                border: '1px solid #f0f0f0',
                                background: '#fff',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.06)'}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>Order #{order.id}</h4>
                                            <div style={{
                                                padding: '0.4rem 1rem',
                                                borderRadius: '50px',
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px',
                                                backgroundColor: getStatusColor(order.status, isTimeExpired) + '15',
                                                color: getStatusColor(order.status, isTimeExpired),
                                                border: `1px solid ${getStatusColor(order.status, isTimeExpired)}33`
                                            }}>
                                                {displayStatus}
                                            </div>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#999' }}>
                                            <i className="fa-regular fa-calendar" style={{ marginRight: '5px' }}></i>
                                            {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} at {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ color: '#999', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Total Amount</p>
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary-color)' }}>
                                            ₹{order.totalAmount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: '#fcfcfc', padding: '1.5rem', borderRadius: '15px' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#aaa', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Items Summary</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        {order.items.map(item => (
                                            <div key={item.id} style={{
                                                background: '#fff',
                                                padding: '0.8rem 1.2rem',
                                                borderRadius: '12px',
                                                border: '1px solid #eee',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.8rem'
                                            }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#f9f9f9' }}>
                                                    {item.product.imageUrl ? (
                                                        <img src={item.product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <i className="fa-solid fa-leaf" style={{ fontSize: '1rem', color: '#ccc' }}></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: '700', color: 'var(--text-primary)', textTransform: 'capitalize' }}>{item.product.sku.replace(/-/g, ' ')}</span>
                                                    <span style={{ marginLeft: '8px', color: '#999', fontSize: '0.9rem' }}>×{item.quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {order.status === 'PENDING' && !isTimeExpired && (
                                    <button
                                        className="btn btn-accent"
                                        style={{
                                            marginTop: '1.5rem',
                                            width: '100%',
                                            padding: '1rem',
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            borderRadius: '12px',
                                            boxShadow: '0 5px 15px rgba(210, 105, 30, 0.1)'
                                        }}
                                        onClick={() => navigate(`/checkout/${order.id}`)}
                                    >
                                        <i className="fa-solid fa-circle-right"></i> Complete Your Purchase
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
