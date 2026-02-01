import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Load user-specific cart when user logs in
    useEffect(() => {
        if (user) {
            const savedCart = localStorage.getItem(`cart_${user.username}`);
            setCart(savedCart ? JSON.parse(savedCart) : []);
        } else {
            setCart([]); // Clear cart state on logout
        }
    }, [user]);

    // Save cart to user-specific key whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`cart_${user.username}`, JSON.stringify(cart));
        }
    }, [cart, user]);

    const addToCart = (product, quantity) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.sku === product.sku);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.sku === product.sku
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { product, quantity }];
            }
        });
    };

    const removeFromCart = (sku) => {
        setCart(prevCart => prevCart.filter(item => item.product.sku !== sku));
    };

    const updateQuantity = (sku, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.product.sku === sku ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.length;

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
