import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('/auth/login', { username, password });

            login({
                username: res.data.username,
                role: res.data.role,
                token: res.data.token
            });

            const from = location.state?.from || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError('Invalid Username or Password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            background: '#f8f9fa'
        }}>
            {/* Left Side - Image */}
            <div className="mobile-hidden" style={{
                flex: '1',
                position: 'relative',
                // display logic moved to CSS class
            }}>
                <img
                    src="/login-bg.png" // The image we copied
                    alt="Fresh organic produce"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                {/* Text removed as requested */}
            </div>

            {/* Right Side - Login Form */}
            <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                background: '#fff'
            }}>
                <div style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <i className="fa-solid fa-leaf" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fa-solid fa-user" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}></i>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 45px',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        background: '#f9f9f9',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s'
                                    }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--primary-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '2rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#ccc' }}></i>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem 1rem 1rem 45px',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        background: '#f9f9f9',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s'
                                    }}
                                    onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--primary-color)'; }}
                                    onBlur={(e) => { e.target.style.background = '#f9f9f9'; e.target.style.borderColor = '#eee'; }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                padding: '1rem',
                                background: '#fee2e2',
                                color: '#ef4444',
                                borderRadius: '10px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <i className="fa-solid fa-circle-exclamation"></i>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                boxShadow: '0 10px 25px rgba(46, 125, 50, 0.2)',
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? (
                                <span><i className="fa-solid fa-spinner fa-spin"></i> Signing In...</span>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'none' }}>Create Free Account</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
