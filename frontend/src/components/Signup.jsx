import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        retypePassword: ''
    });
    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.retypePassword) {
            setResult({ error: 'Passwords do not match!' });
            return;
        }

        try {
            await axios.post('/auth/register', {
                username: formData.username,
                password: formData.password,
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile
            });
            setResult({ message: 'Account created! Redirecting to login...', type: 'success' });
            setTimeout(() => navigate('/login', { state: location.state }), 2000);
        } catch (err) {
            setResult({ error: err.response?.data?.error || 'Registration failed.' });
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100vw',
            overflowX: 'hidden',
            background: '#f8f9fa'
        }}>
            {/* Left Side - Scrollable Form */}
            <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                background: '#fff',
                minHeight: '100vh',
                overflowY: 'auto'
            }}>
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <i className="fa-solid fa-seedling" style={{ fontSize: '2.5rem', color: 'var(--success-color)', marginBottom: '1rem' }}></i>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>Start Growing</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Create your account and join the harvest.</p>
                    </div>

                    <form onSubmit={handleSignup}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', transition: 'all 0.3s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--success-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe123"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', transition: 'all 0.3s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--success-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fa-solid fa-envelope" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}></i>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 45px', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', transition: 'all 0.3s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--success-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Mobile Number</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fa-solid fa-phone" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}></i>
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="9876543210"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 45px', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', transition: 'all 0.3s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--success-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', transition: 'all 0.3s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--success-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    name="retypePassword"
                                    placeholder="••••••••"
                                    value={formData.retypePassword}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', transition: 'all 0.3s' }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--success-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                        </div>

                        {result && (
                            <div style={{
                                padding: '1rem',
                                background: result.type === 'success' ? '#dcfce7' : '#fee2e2',
                                color: result.type === 'success' ? '#166534' : '#ef4444',
                                borderRadius: '10px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <i className={`fa-solid ${result.type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'}`}></i>
                                {result.message || result.error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary" // Changed to primary green for Signup to differ from Accent orange? Or keep accent? Let's use Primary Green for "Start Growing" feel.
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                boxShadow: '0 10px 25px rgba(46, 125, 50, 0.2)'
                            }}
                        >
                            Create Account
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Already have an account? <Link to="/login" state={location.state} style={{ color: 'var(--success-color)', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Image */}
            <div style={{
                flex: '1',
                position: 'relative',
                display: { xs: 'none', md: 'block' },
                // Make it sticky
                height: '100vh',
                position: 'sticky',
                top: 0
            }}>
                <img
                    src="/signup-bg.png"
                    alt="Organic Farm Field"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                {/* Text removed as requested */}
            </div>
        </div >
    );
}

export default Signup;
