function QuantityModal({ isOpen, onClose, onConfirm, productName }) {
    if (!isOpen) return null;

    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(parseInt(quantity));
        setQuantity(1); // Reset
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card-glass" style={{ background: '#fff', color: '#333', minWidth: '300px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Add to Cart</h3>
                <p style={{ marginBottom: '1rem' }}>How many <strong>{productName}</strong> would you like?</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '1.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn" style={{ background: '#ccc', color: '#333' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-accent">Add to Cart</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { useState } from 'react';
export default QuantityModal;
