import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Admin() {
    const { user } = useAuth();

    // Product State
    const [sku, setSku] = useState('');
    const [totalQuantity, setTotalQuantity] = useState('');
    const [newProduct, setNewProduct] = useState({ imageUrl: '', price: '', unit: 'Piece' });
    const [result, setResult] = useState(null);

    // Manager Config State
    const [newAdminUser, setNewAdminUser] = useState('');
    const [newAdminPass, setNewAdminPass] = useState('');
    const [adminResult, setAdminResult] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]); // New: All Orders state
    const [isEditing, setIsEditing] = useState(false);
    const [newManagerRole, setNewManagerRole] = useState('ROLE_CO_ADMIN'); // New: Role selection

    // Fetch products on load
    useEffect(() => {
        fetchProducts();
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get('/orders/all');
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch all orders");
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/inventory/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products");
        }
    };

    const handleDeleteProduct = async (productSku) => {
        if (!window.confirm(`Are you sure you want to delete ${productSku}?`)) return;

        try {
            await axios.delete(`/inventory/product/${productSku}`);
            setResult({ message: `Product ${productSku} deleted.`, type: 'success' });
            fetchProducts(); // Refresh list
        } catch (err) {
            setResult({ error: err.response?.data?.error || 'Failed to delete product.' });
        }
    };

    const handleCreateProduct = async () => {
        if (!sku || !totalQuantity) {
            setResult({ error: 'Please fill in all fields' });
            return;
        }

        try {
            const res = await axios.post('/inventory/product', {
                sku: sku,
                totalQuantity: parseInt(totalQuantity),
                imageUrl: newProduct.imageUrl,
                price: parseFloat(newProduct.price),
                unit: newProduct.unit
            });
            setResult({ message: `Product ${res.data.sku} created successfully!`, type: 'success' });
            resetForm();
        } catch (err) {
            setResult({ error: err.response?.data?.error || 'Failed to create product.' });
        }
    };

    const handleEdit = (product) => {
        setSku(product.sku);
        setTotalQuantity(product.totalQuantity);
        setNewProduct({
            imageUrl: product.imageUrl || '',
            price: product.price || '',
            unit: product.unit || 'Piece'
        });
        setIsEditing(true);
        window.scrollTo(0, 0); // Scroll to form
    };

    const handleUpdateProduct = async () => {
        try {
            const res = await axios.put(`/inventory/product/${sku}`, {
                totalQuantity: parseInt(totalQuantity),
                imageUrl: newProduct.imageUrl,
                price: parseFloat(newProduct.price),
                unit: newProduct.unit
            });
            setResult({ message: `Product ${res.data.sku} updated!`, type: 'success' });
            fetchProducts();
            resetForm();
        } catch (err) {
            setResult({ error: err.response?.data?.error || 'Failed to update product.' });
        }
    };

    const resetForm = () => {
        setSku('');
        setTotalQuantity('');
        setNewProduct({ imageUrl: '', price: '', unit: 'Piece' });
        setIsEditing(false);
    };

    const handleRegisterAdmin = async () => {
        if (!newAdminUser || !newAdminPass) {
            setAdminResult({ error: 'Please fill in all fields' });
            return;
        }

        try {
            const res = await axios.post('/auth/admin/register', {
                username: newAdminUser,
                password: newAdminPass,
                role: newManagerRole
            });
            setAdminResult({ message: `Manager ${newAdminUser} created successfully!`, type: 'success' });
            setNewAdminUser('');
            setNewAdminPass('');
        } catch (err) {
            setAdminResult({ error: err.response?.data?.error || 'Failed to create admin.' });
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Product Creation Section */}
            <section className="card-glass content-center">
                <h2><i className={`fa-solid ${isEditing ? 'fa-pen-to-square' : 'fa-plus-circle'}`}></i> {isEditing ? 'Update Product' : 'Add New Product'}</h2>
                <div className="form-group">
                    <label>Product SKU</label>
                    <input
                        type="text"
                        placeholder="e.g. DESI-GHEE"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        disabled={isEditing}
                        style={isEditing ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                    />
                </div>

                <div className="form-group">
                    <label>Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const res = await axios.post('/upload', formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' }
                                });
                                setNewProduct({ ...newProduct, imageUrl: res.data.imageUrl });
                            } catch (err) {
                                setResult({ error: 'Image upload failed' });
                            }
                        }}
                    />
                    {newProduct.imageUrl && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--success-color)', marginTop: '0.5rem' }}>
                            Image Uploaded!
                        </p>
                    )}
                </div>

                <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                        type="number"
                        placeholder="e.g. 500"
                        value={newProduct.price}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Unit</label>
                    <select
                        value={newProduct.unit}
                        onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="Piece">Piece</option>
                        <option value="Liter">Liter</option>
                        <option value="Kg">Kg</option>
                        <option value="Gram">Gram</option>
                        <option value="Dozen">Dozen</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Total Quantity</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="e.g. 50"
                        value={totalQuantity}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => setTotalQuantity(e.target.value)}
                    />
                </div>
                {isEditing ? (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={handleUpdateProduct}>Update Product</button>
                        <button className="btn" style={{ background: 'var(--text-secondary)' }} onClick={resetForm}>Cancel</button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={handleCreateProduct}>Create Product</button>
                )}

                {result && (
                    <div className="result-box" style={{ marginTop: '1rem' }}>
                        {result.error ? (
                            <p style={{ color: 'var(--danger-color)' }}>{result.error}</p>
                        ) : (
                            <p style={{ color: 'var(--success-color)' }}>{result.message}</p>
                        )}
                    </div>
                )}
            </section>

            {/* Manage Products Section */}
            <section className="card-glass content-center">
                <h2><i className="fa-solid fa-list-check"></i> Manage Products</h2>
                <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}>
                    {products.length === 0 ? (
                        <p className="text-center">No products found.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>SKU</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Available Stock</th>
                                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.sku} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.5rem' }}>{p.sku}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <span style={{ color: (p.totalQuantity - p.reservedQuantity) > 0 ? 'var(--success-color)' : 'red', fontWeight: 'bold' }}>
                                                {p.totalQuantity - p.reservedQuantity}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right', padding: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                className="btn"
                                                style={{ background: 'var(--accent-color)', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                                                onClick={() => handleEdit(p)}
                                            >
                                                Edit
                                            </button>
                                            {user.role === 'ROLE_ADMIN' && (
                                                <button
                                                    className="btn"
                                                    style={{ background: 'var(--danger-color)', padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                                                    onClick={() => handleDeleteProduct(p.sku)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
            {/* All Orders Section */}
            <section className="card-glass content-center">
                <h2><i className="fa-solid fa-cart-flatbed"></i> All Orders Summary</h2>
                <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}>
                    {orders.length === 0 ? (
                        <p className="text-center">No orders placed yet.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>User</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Total</th>
                                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => {
                                    const isTimeExpired = o.status === 'PENDING' && new Date() > new Date(o.expiresAt);
                                    const displayStatus = isTimeExpired ? 'TIME EXPIRED' : o.status;

                                    return (
                                        <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                                            <td style={{ padding: '0.5rem' }}>#{o.id}</td>
                                            <td style={{ padding: '0.5rem' }}>{o.user?.username}</td>
                                            <td style={{ padding: '0.5rem' }}>₹{o.totalAmount.toFixed(2)}</td>
                                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    background: o.status === 'COMPLETED' ? 'var(--success-color)22' :
                                                        (o.status === 'CANCELLED' || o.status === 'EXPIRED' || isTimeExpired) ? 'var(--danger-color)22' : 'var(--accent-color)22',
                                                    color: o.status === 'COMPLETED' ? 'var(--success-color)' :
                                                        (o.status === 'CANCELLED' || o.status === 'EXPIRED' || isTimeExpired) ? 'var(--danger-color)' : 'var(--accent-color)'
                                                }}>
                                                    {displayStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            {/* Manager Configuration Section - ONLY FOR ROOT MANAGER */}
            {user && user.username === 'admin' && (
                <section className="card-glass content-center" style={{ borderColor: 'var(--accent-color)' }}>
                    <h2 style={{ color: 'var(--accent-color)' }}><i className="fa-solid fa-user-shield"></i> Register New Manager</h2>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Only you (Root Manager) can see this section. Use it to promote other users.
                    </p>
                    <div className="form-group">
                        <label>New Manager Username</label>
                        <input
                            type="text"
                            placeholder="e.g. manager"
                            value={newAdminUser}
                            onChange={(e) => setNewAdminUser(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="******"
                            value={newAdminPass}
                            onChange={(e) => setNewAdminPass(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            value={newManagerRole}
                            onChange={(e) => setNewManagerRole(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                        >
                            <option value="ROLE_CO_ADMIN">Co-Admin (Can Update/View)</option>
                            <option value="ROLE_ADMIN">Admin (Full Control + Delete)</option>
                        </select>
                    </div>
                    <button className="btn btn-accent" onClick={handleRegisterAdmin}>Create Manager</button>

                    {adminResult && (
                        <div className="result-box" style={{ marginTop: '1rem' }}>
                            {adminResult.error ? (
                                <p style={{ color: 'var(--danger-color)' }}>{adminResult.error}</p>
                            ) : (
                                <p style={{ color: 'var(--success-color)' }}>{adminResult.message}</p>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

export default Admin;
