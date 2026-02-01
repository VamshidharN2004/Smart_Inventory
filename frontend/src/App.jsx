import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Shop from './components/Shop';
import ReservationPage from './components/ReservationPage';
import Contact from './components/Contact';
import Cart from './components/Cart';
import OrderSuccess from './components/OrderSuccess';
import CheckoutSummary from './components/CheckoutSummary';
import MyOrders from './components/MyOrders';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import './index.css';

// Configure Axios Base URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Protected Route Wrapper
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <div className="container" style={{ padding: '4rem' }}>Authenticating...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired && (Array.isArray(roleRequired) ? !roleRequired.includes(user.role) : user.role !== roleRequired)) {
    return <div className="card-glass" style={{ textAlign: 'center' }}><h2>Access Denied</h2><p>You need {roleRequired} privileges.</p></div>;
  }

  return children;
};

// Navigation Component
const NavBar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const val = searchQuery.trim();
      if (val) {
        navigate(`/shop?search=${val}`);
        setSearchQuery('');
      }
    }
  };

  return (
    <>
      <div className="top-bar">
        FRESH FROM FARM TO TABLE | 100% ORGANIC & NATURAL
      </div>
      <header>
        <div className="container-full" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/logo-orange.png" alt="Smart Inventory Logo" style={{ height: '65px', width: 'auto' }} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#F58220', margin: 0, lineHeight: '1', letterSpacing: '0.5px', whiteSpace: 'nowrap', fontFamily: "'Outfit', sans-serif" }}>
                  SMART INVENTORY
                </h1>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#F58220', letterSpacing: '3px', marginTop: '4px', fontFamily: "'Outfit', sans-serif" }}>
                  ORGANIC PRODUCTS
                </span>
              </div>
            </div>
          </div>

          <nav style={{ padding: 0 }}>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/shop" className="nav-link">Shop All</Link>
              <Link to="/orders" className="nav-link">My Orders</Link>
              <Link to="/contact" className="nav-link">Contact Us</Link>
            </div>
          </nav>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '30px',
                  border: '1px solid #eee',
                  background: '#f9f9f9',
                  outline: 'none',
                  fontSize: '0.9rem',
                  width: '180px',
                  transition: 'all 0.3s'
                }}
                onKeyDown={handleSearch}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = '#eee'}
              />
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' }}></i>
            </div>

            {/* Manage & User Section */}
            {!user ? (
              <Link to="/login" className="nav-link" style={{ fontSize: '1.1rem' }}>
                <i className="fa-regular fa-user"></i>
              </Link>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                {(user.role === 'ROLE_ADMIN' || user.role === 'ROLE_CO_ADMIN') && (
                  <Link to="/admin" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa-solid fa-screwdriver-wrench"></i> Manage
                  </Link>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={logout}>
                  <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user.username}</span>
                  <i className="fa-solid fa-right-from-bracket" style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}></i>
                </div>
              </div>
            )}

            {/* Cart Icon */}
            <div style={{ position: 'relative', cursor: 'pointer', padding: '5px' }} onClick={() => navigate('/cart')}>
              <i className="fa-solid fa-cart-shopping" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}></i>
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--accent-color)',
                color: 'white',
                borderRadius: '50%',
                minWidth: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {cartCount}
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// Axios Interceptor Wrapper
const AxiosInterceptor = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor removed (Handled in AuthContext to avoid race conditions)

    // Response interceptor to handle 401/403 errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn("Unauthorized/Forbidden access, logging out...");
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logout, navigate]);

  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AxiosInterceptor>
            <NavBar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/checkout/:orderId" element={<ProtectedRoute><CheckoutSummary /></ProtectedRoute>} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/reserve/:sku" element={<ReservationPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roleRequired={["ROLE_ADMIN", "ROLE_CO_ADMIN"]}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </AxiosInterceptor>
        </Router>
      </CartProvider>
    </AuthProvider >
  );
}

export default App;
