import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantityModal from './QuantityModal';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFaq, setActiveFaq] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/inventory/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch products");
            setLoading(false);
        }
    };


    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
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
        <div>

            {/* 2. Hero Section */}
            <section style={{
                position: 'relative',
                height: '800px', /* Even taller */
                backgroundColor: '#2F1B10',
                backgroundImage: 'url("/hero.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                marginTop: '2rem'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}></div>
                <div className="container" style={{ position: 'relative', zIndex: 1, paddingLeft: '2rem' }}>
                    <div className="fade-in-left">
                        <h1 style={{ marginBottom: '2rem', maxWidth: '1000px', lineHeight: '1', textShadow: '2px 2px 10px rgba(0,0,0,0.2)' }}>
                            <span style={{ fontSize: '6.5rem', fontWeight: '900', color: '#fff', fontFamily: "'Playfair Display', serif", display: 'block', marginBottom: '0.5rem' }}>
                                Organic Farming
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '-0.5rem' }}>
                                <span style={{ fontSize: '1.4rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '8px', opacity: 0.8, fontWeight: '600' }}>is our</span>
                                <span style={{ fontSize: '5.5rem', color: 'var(--accent-color)', fontFamily: "'Dancing Script', cursive" }}>Main Ingredient</span>
                            </span>
                        </h1>
                        <p style={{ maxWidth: '600px', fontSize: '1.4rem', marginBottom: '2.5rem', opacity: 0.95, lineHeight: '1.6' }}>
                            Rooted in love, grown without compromise. We bring the honest purity of our local fields straight to your heart and home.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <button className="btn btn-accent" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '50px' }} onClick={() => document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' })}>
                                Start Shopping
                            </button>
                            <button className="btn btn-outline" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '50px', borderColor: '#fff', color: '#fff' }} onClick={() => navigate('/shop')}>
                                View All
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.5 Trending Categories */}
            <section className="container" style={{ padding: '5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h6 style={{ color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Explore</h6>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Trending Categories</h2>
                    </div>
                    <button className="btn btn-outline-dark" onClick={() => navigate('/shop')}>View All Categories</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { name: 'Fresh Vegetables', icon: 'fa-carrot', count: '120+ Items', color: '#E8F5E9' },
                        { name: 'Organic Fruits', icon: 'fa-apple-whole', count: '80+ Items', color: '#FFF3E0' },
                        { name: 'Natural Grains', icon: 'fa-wheat-awn', count: '45+ Items', color: '#F3E5F5' },
                        { name: 'Cold Pressed Oils', icon: 'fa-droplet', count: '20+ Items', color: '#E1F5FE' },
                        { name: 'Farm Milk', icon: 'fa-cow', count: '15+ Items', color: '#FFFDE7' }
                    ].map((cat) => (
                        <div key={cat.name} className="category-card" style={{
                            background: cat.color,
                            padding: '2.5rem 1.5rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }} onClick={() => navigate(`/shop?search=${cat.name.split(' ')[1]}`)}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                background: '#fff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                            }}>
                                <i className={`fa-solid ${cat.icon}`} style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}></i>
                            </div>
                            <h4 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{cat.name}</h4>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{cat.count}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Why Choose Us - SIGNATURE BOUTIQUE GALLERY (100% PHOTO VISIBILITY) */}
            <section style={{ backgroundColor: '#F9F8F3', padding: '6rem 0' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h6 style={{ color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '900', marginBottom: '1.5rem' }}>The Essence of Purity</h6>
                        <h2 style={{ fontSize: '4.2rem', fontWeight: '900', color: 'var(--primary-color)', lineHeight: '1.1' }}>
                            Quality You Can <span style={{ color: 'var(--accent-color)', position: 'relative' }}>
                                Truly See
                                <svg style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '12px' }} viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0,10 Q50,0 100,10" stroke="var(--accent-color)" strokeWidth="4" fill="none" opacity="0.3" />
                                </svg>
                            </span>
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {[
                            {
                                num: '01',
                                title: 'Chemical-Free Harvest',
                                desc: 'Every grain and leaf is grown in untainted soil, free from pesticides. Pure energy, straight from the earth.',
                                image: '/pure_ingredients_v4.png'
                            },
                            {
                                num: '02',
                                title: 'Dawn-to-Door Delivery',
                                desc: 'Harvested at the first light and delivered to you within hours. Experience flavor at its absolute peak.',
                                image: '/farm_freshness_v4.png'
                            },
                            {
                                num: '03',
                                title: 'Vitality-Dense Products',
                                desc: 'Packed with bio-available nutrients that nourish your cells and energize your daily life.',
                                image: '/nutritional_excellence.png'
                            }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: 'transparent' }} className="hover-lift">
                                {/* IMAGE SECTION - 100% VISIBLE */}
                                <div style={{
                                    position: 'relative',
                                    height: '450px',
                                    borderRadius: '40px 40px 0 120px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                    {/* Small Minimalist Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '25px',
                                        right: '25px',
                                        background: 'rgba(255,255,255,0.95)',
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                    }}>
                                        <i className="fa-solid fa-certificate" style={{ color: 'var(--accent-color)', fontSize: '1.2rem' }}></i>
                                    </div>
                                </div>

                                {/* TEXT SECTION - BELOW PHOTO */}
                                <div style={{ padding: '0 1rem', position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute',
                                        top: '-40px',
                                        right: '0',
                                        fontSize: '5rem',
                                        fontWeight: '900',
                                        color: 'var(--primary-color)',
                                        opacity: 0.04,
                                        fontFamily: 'serif'
                                    }}>
                                        {item.num}
                                    </span>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '1.2rem' }}>{item.title}</h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '3px', height: '40px', background: 'var(--accent-color)', flexShrink: 0, marginTop: '5px' }}></div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', margin: 0 }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Best Sellers (Product Grid) */}
            <section id="shop-section" style={{ backgroundColor: '#fff', padding: '6rem 0' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h6 style={{ color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Our Best</h6>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>Featured Products</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Handpicked fresh items that our customers love the most.</p>
                    </div>

                    <div className="features-grid">
                        {loading ? (
                            <p className="text-center">Loading fresh products...</p>
                        ) : (
                            products.map((p) => {
                                const available = p.totalQuantity - p.reservedQuantity;
                                return (
                                    <div key={p.sku} className="card-glass" style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        padding: '1rem',
                                        border: '1px solid #f0f0f0'
                                    }} onClick={() => navigate(`/reserve/${p.sku}`)}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px)';
                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        }}
                                    >
                                        <div style={{ position: 'relative', height: '280px', borderRadius: '15px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                            <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'var(--accent-color)', color: 'white', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.75rem', zIndex: 2, fontWeight: '700' }}>
                                                <i className="fa-solid fa-bolt"></i> HOT
                                            </span>
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.sku} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className="fa-solid fa-image" style={{ fontSize: '3rem', color: '#ddd' }}></i>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'left', padding: '0.5rem' }}>
                                            <div style={{ color: '#FFB800', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                                                <span style={{ color: '#aaa', marginLeft: '5px' }}>(4.9)</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{p.sku.replace(/-/g, ' ')}</h3>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                                <p style={{ fontWeight: '800', color: 'var(--primary-color)', fontSize: '1.4rem' }}>
                                                    ₹{p.price || 0}
                                                </p>
                                                <button className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }} onClick={(e) => handleAddToCartClick(e, p)}>
                                                    <i className="fa-solid fa-cart-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* 5. FAQs */}
            <section className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Frequently Asked Questions</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Everything you need to know about our service.</p>
                </div>
                {[
                    {
                        q: 'How much time does it take for shipping?',
                        a: 'It takes around 10-20 MINS for your order to get delivered to your doorstep.'
                    },
                    {
                        q: 'Do you accept returns and refunds?',
                        a: 'No, we do not accept returns and refunds due to the fresh and perishable nature of our organic products.'
                    },
                    {
                        q: 'What payment gateways do you accept?',
                        a: 'At the moment, we offer Offline modes of payment to ensure a smooth and personalized experience.'
                    }
                ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                        <div
                            onClick={() => toggleFaq(i)}
                            style={{
                                background: 'var(--primary-color)',
                                color: 'white',
                                padding: '1.2rem 1.8rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease',
                                boxShadow: activeFaq === i ? '0 10px 20px rgba(85, 107, 47, 0.2)' : 'none'
                            }}
                        >
                            <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{item.q}</span>
                            <i className={`fa-solid ${activeFaq === i ? 'fa-minus' : 'fa-plus'}`} style={{ fontSize: '1.2rem' }}></i>
                        </div>
                        {activeFaq === i && (
                            <div style={{
                                padding: '1.8rem',
                                background: '#fff',
                                border: '1px solid #eee',
                                borderTop: 'none',
                                borderBottomLeftRadius: '12px',
                                borderBottomRightRadius: '12px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.6',
                                fontSize: '1.05rem',
                                animation: 'fadeInDown 0.4s ease-out'
                            }}>
                                {item.a}
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* 6. Footer Features */}
            <section style={{ backgroundColor: '#2F1B10', padding: '3rem 0', color: 'white' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: 'fa-truck-fast', title: 'Fast Delivery', desc: 'Order delivered in 10-20 mins' },
                        { icon: 'fa-headset', title: 'Customer Support', desc: '24/7 dedicated support' },
                        { icon: 'fa-wallet', title: 'Offline Payments', desc: 'Only Offline modes accepted' },
                        { icon: 'fa-circle-xmark', title: 'No Returns', desc: 'Freshness policy, no refunds' }
                    ].map((f) => (
                        <div key={f.title} style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                            <i className={`fa-solid ${f.icon}`} style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-color)' }}></i>
                            <h4 style={{ marginBottom: '0.5rem' }}>{f.title}</h4>
                            <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <QuantityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmAddToCart}
                productName={selectedProduct?.sku}
            />
        </div>
    );
}

export default Home;
