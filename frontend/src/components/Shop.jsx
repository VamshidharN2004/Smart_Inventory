import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantityModal from './QuantityModal';

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();
    const query = searchParams.get('search') || '';

    useEffect(() => {
        fetchProducts();
    }, [query]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/inventory/products');
            let data = res.data;
            if (query) {
                data = data.filter(p => p.sku.toLowerCase().includes(query.toLowerCase()));
            }
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch products");
            setLoading(false);
        }
    };

    const handleAddToCartClick = (e, product) => {
        e.stopPropagation();
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleConfirmAddToCart = (quantity) => {
        if (selectedProduct) {
            addToCart(selectedProduct, quantity);
            setIsModalOpen(false);
            setSelectedProduct(null);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 className="text-center" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
                {query ? `Results for "${query}"` : 'Shop All Products'}
            </h2>

            <div className="features-grid">
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1.5rem' }}></i>
                        <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Gathering fresh harvest...</p>
                        <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '0.5rem' }}>(This may take up to 60s if the cloud server is waking up)</p>
                    </div>
                ) : (
                    products.length === 0 ? (
                        <p className="text-center">No products available.</p>
                    ) : (
                        products.map((p) => {
                            const available = p.totalQuantity - p.reservedQuantity;
                            const isOutOfStock = available <= 0;
                            return (
                                <div key={p.sku} className="card-glass" style={{
                                    cursor: isOutOfStock ? 'default' : 'pointer',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    position: 'relative',
                                    padding: '1rem',
                                    border: '1px solid #f0f0f0',
                                    background: '#fff'
                                }}
                                    onClick={() => !isOutOfStock && navigate(`/reserve/${p.sku}`)}
                                    onMouseOver={(e) => {
                                        if (!isOutOfStock) {
                                            e.currentTarget.style.transform = 'translateY(-10px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isOutOfStock) {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        }
                                    }}
                                >
                                    <div style={{ position: 'relative', height: '280px', borderRadius: '15px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.sku} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isOutOfStock ? 'grayscale(100%)' : 'none', opacity: isOutOfStock ? 0.7 : 1 }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa-solid fa-image" style={{ fontSize: '3rem', color: '#ddd' }}></i>
                                            </div>
                                        )}
                                        {isOutOfStock && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%) rotate(-15deg)',
                                                background: 'rgba(211, 47, 47, 0.9)',
                                                color: 'white',
                                                padding: '0.5rem 1.5rem',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                border: '2px solid white',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                                zIndex: 10,
                                                whiteSpace: 'nowrap',
                                                pointerEvents: 'none'
                                            }}>
                                                OUT OF STOCK
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'left', padding: '0.5rem' }}>
                                        <div style={{ color: '#FFB800', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                                            <span style={{ color: '#aaa', marginLeft: '5px' }}>(4.9)</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700', color: isOutOfStock ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                            {p.sku.replace(/-/g, ' ')}
                                        </h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                            <p style={{ fontWeight: '800', color: isOutOfStock ? 'var(--text-secondary)' : 'var(--primary-color)', fontSize: '1.4rem' }}>
                                                ₹{p.price || 0}
                                                <span style={{ fontWeight: 'normal', fontSize: '0.8rem', color: '#999', marginLeft: '5px' }}>/ {p.unit || 'Unit'}</span>
                                            </p>
                                            <button
                                                className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-accent'}`}
                                                style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                                                onClick={(e) => !isOutOfStock && handleAddToCartClick(e, p)}
                                                disabled={isOutOfStock}
                                            >
                                                {isOutOfStock ? <i className="fa-solid fa-ban"></i> : <i className="fa-solid fa-cart-plus"></i>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                )}
            </div>
            <QuantityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmAddToCart}
                productName={selectedProduct?.sku}
            />
        </div>
    );
}

export default Shop;
