import { useNavigate } from 'react-router-dom';

function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
            <div className="card-glass" style={{ display: 'inline-block', padding: '3rem', maxWidth: '500px' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: '#4CAF50', marginBottom: '1rem' }}></i>
                <h1 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Order Confirmed!</h1>
                <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    Thank you for your purchase. Your order has been successfully placed.
                </p>
                <button className="btn btn-accent" onClick={() => navigate('/shop')}>Continue Shopping</button>
            </div>
        </div>
    );
}

export default OrderSuccess;
