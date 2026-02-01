import { Link } from 'react-router-dom';

function Landing() {
    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <section className="hero">
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '0 4px 20px rgba(59, 130, 246, 0.5)' }}>
                    Welcome to <span style={{ color: 'var(--accent-color)' }}>SmartInventory</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                    Experience the next generation of high-concurrency inventory management.
                    Real-time reservations, race-condition prevention, and seamless user experience.
                </p>

                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-accent" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        Sign Up
                    </Link>
                </div>
            </section>

            <div className="features-grid-landing" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '5rem', textAlign: 'left' }}>
                <div className="card-glass">
                    <h3>🚀 Real-Time</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Instant stock updates and reservation timers.</p>
                </div>
                <div className="card-glass">
                    <h3>🔒 Secure</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Robust backend locking to prevent overselling.</p>
                </div>
                <div className="card-glass">
                    <h3>⚡ Fast</h3>
                    <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Optimized for high traffic flash sales.</p>
                </div>
            </div>
        </div>
    );
}

export default Landing;
