import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ReservationPage() {
    const { sku } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [result, setResult] = useState(null);
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [sku]);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (countdown !== null && countdown > 0) {
            interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResult((prev) => ({ ...prev, expired: true }));
        }
        return () => clearInterval(interval);
    }, [countdown]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`/inventory/${sku}`);
            setProduct(res.data);
        } catch (err) {
            setResult({ error: 'Product not found' });
        }
    };

    const handleReserve = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            // Unify with ShopOrder flow
            const res = await axios.post('/orders/checkout', [
                {
                    sku: sku,
                    quantity: parseInt(qty)
                }
            ]);
            // Navigate to the shared checkout summary page
            navigate(`/checkout/${res.data.id}`);
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data || 'Reservation failed.';
            alert("Error: " + errorMessage);
        }
    };

    if (result?.error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <div style={{ color: '#e53935', fontSize: '1.5rem', marginBottom: '1rem' }}><i className="fa-solid fa-triangle-exclamation"></i> Product Not Found</div>
                <button className="btn btn-outline-dark" onClick={() => navigate('/shop')}>Back to Shop</button>
            </div>
        );
    }

    if (!product) return <div style={{ textAlign: 'center', marginTop: '4rem' }}><i className="fa-solid fa-spinner fa-spin"></i> Loading Product Details...</div>;

    const available = product.total - product.reserved;

    return (
        <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1rem' }}>
            {/* Attractive Back Button */}
            <button
                onClick={() => navigate('/shop')}
                className="btn"
                style={{
                    marginBottom: '2rem',
                    padding: '0.8rem 1.5rem',
                    background: '#fff',
                    color: 'var(--text-primary)',
                    borderRadius: '50px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(-5px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
            >
                <i className="fa-solid fa-arrow-left-long"></i>
                <span style={{ fontWeight: '600' }}>Back to Shop</span>
            </button>

            <section className="card-glass" style={{ padding: '0', overflow: 'hidden', border: 'none', background: '#fff' }}>
                {/* 100% Efficient Photo Section */}
                <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.sku} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-leaf" style={{ fontSize: '5rem', color: '#ccc' }}></i>
                        </div>
                    )}
                    {/* Floating Badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        background: 'rgba(255,255,255,0.9)',
                        padding: '0.5rem 1.2rem',
                        borderRadius: '50px',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backdropFilter: 'blur(5px)'
                    }}>
                        <i className="fa-solid fa-certificate" style={{ color: 'var(--accent-color)' }}></i>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>GUARANTEED FRESH</span>
                    </div>
                </div>

                {/* Details Section */}
                <div style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', textTransform: 'capitalize', fontWeight: '800', lineHeight: '1.1' }}>
                                {product.sku.replace(/-/g, ' ')}
                            </h2>
                            {available > 0 ? (
                                <p style={{ marginTop: '0.5rem', fontSize: '1.1rem', color: 'var(--success-color)', fontWeight: '600' }}>
                                    <i className="fa-solid fa-check-circle"></i> {available} {product.unit} Available in Stock
                                </p>
                            ) : (
                                <div style={{
                                    marginTop: '0.5rem',
                                    color: '#c62828',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}>
                                    <i className="fa-solid fa-circle-xmark"></i> Temporarily Out of Stock
                                </div>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)' }}>
                                ₹{product.price}
                            </p>
                            <p style={{ color: '#999', fontSize: '0.9rem' }}>per {product.unit || 'Unit'}</p>
                        </div>
                    </div>

                    <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '15px', marginTop: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
                            <div className="form-group" style={{ margin: 0, flex: 1 }}>
                                <label style={{ color: '#777', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Quantity</label>
                                <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                                    <input
                                        type="number"
                                        min="1"
                                        max={available}
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            border: '2px solid #eee',
                                            paddingRight: '3rem'
                                        }}
                                    />
                                    <span style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontWeight: 'bold' }}>{product.unit}</span>
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', flex: 1 }}>
                                <p style={{ color: '#777', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</p>
                                <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-color)', marginTop: '0.5rem' }}>
                                    ₹{(product.price * (qty || 0)).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <button
                            className="btn btn-accent"
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                fontSize: '1.1rem',
                                borderRadius: '10px',
                                marginTop: '2rem',
                                boxShadow: '0 10px 20px rgba(210, 105, 30, 0.2)'
                            }}
                            onClick={handleReserve}
                            disabled={available <= 0}
                        >
                            {available > 0 ? 'Place Your Order Now' : 'Notify Me When Available'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ReservationPage;
