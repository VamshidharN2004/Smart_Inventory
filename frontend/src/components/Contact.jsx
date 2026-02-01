import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        try {
            await axios.post('/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again later.');
        }
    };

    return (
        <div style={{ background: '#F9F7F2', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', padding: '1rem 0' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h6 style={{ color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold', fontSize: '0.75rem' }}>Contact Us</h6>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.5rem 0' }}>Get In Touch</h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem' }}>
                        Have questions? Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
                    {/* Left Column: Form Card */}
                    <div className="card-glass" style={{ flex: '1.5', minWidth: '350px', padding: '1.8rem', background: '#fff', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.05)' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem', display: 'block', fontWeight: '700' }}>Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                    style={{
                                        background: '#f9f9f9', border: '2px solid #eee', padding: '0.7rem', borderRadius: '10px', width: '100%', outline: 'none', fontSize: '0.95rem', transition: 'all 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem', display: 'block', fontWeight: '700' }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                    style={{
                                        background: '#f9f9f9', border: '2px solid #eee', padding: '0.7rem', borderRadius: '10px', width: '100%', outline: 'none', fontSize: '0.95rem', transition: 'all 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                />
                            </div>

                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem', display: 'block', fontWeight: '700' }}>Your Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    rows="4"
                                    required
                                    style={{
                                        background: '#f9f9f9', border: '2px solid #eee', padding: '0.7rem', borderRadius: '10px', width: '100%',
                                        fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', resize: 'none', transition: 'all 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                    onBlur={(e) => e.target.style.borderColor = '#eee'}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="btn btn-primary"
                                style={{
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    fontSize: '0.95rem',
                                    fontWeight: '800',
                                    marginTop: '0.5rem',
                                    boxShadow: '0 8px 15px rgba(47, 27, 16, 0.1)'
                                }}>
                                {status === 'sending' ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> SENDING...</>
                                ) : (
                                    <><i className="fa-solid fa-paper-plane"></i> SEND MESSAGE</>
                                )}
                            </button>

                            {status === 'success' && (
                                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem' }}>
                                    <i className="fa-solid fa-circle-check"></i> Message sent!
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Column: Support Info */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {[
                                { title: 'Phone Support', text: '+91 93477 24211', icon: 'fa-phone-volume', color: '#E3F2FD', iconColor: '#2196F3' },
                                { title: 'Email Us', text: 'vamshidhar@gmail.com', icon: 'fa-envelope-open-text', color: '#FFF3E0', iconColor: '#FF9800' },
                                { title: 'Our Location', text: 'Bayyaram, Mahabubabad', icon: 'fa-location-dot', color: '#E8F5E9', iconColor: '#4CAF50' }
                            ].map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '55px',
                                        height: '55px',
                                        background: item.color,
                                        borderRadius: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        fontSize: '1.4rem',
                                        color: item.iconColor
                                    }}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.1rem', color: 'var(--text-primary)' }}>{item.title}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Support Card */}
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--primary-color)', borderRadius: '20px', color: 'white' }}>
                            <h4 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>We're here to help!</h4>
                            <p style={{ opacity: 0.8, fontSize: '0.85rem', lineHeight: '1.4' }}>
                                Our support team is available Mon-Sat to assist you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
