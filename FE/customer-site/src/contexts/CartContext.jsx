import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const toast = useToast();
  const { addLoginCallback } = useAuth();

  // Load cart items from API on mount
  useEffect(() => {
    loadCartItems();
  }, []);

  // Register callback to reload cart when user logs in
  useEffect(() => {
    addLoginCallback(loadCartItems);
  }, [addLoginCallback]);

  const loadCartItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      setIsLoaded(true);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get('/customer/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Cart API response:', response);
      
      if (response.success) {
        // Map API response to cart items format
        const mappedCartItems = (response.data || []).map(item => ({
          id: item.bookId, // Use bookId as the main id
          cartItemId: item.id, // Use cart item id for operations
          title: item.bookTitle,
          author: item.bookAuthor,
          price: item.bookPrice,
          coverImage: item.bookCoverImage,
          quantity: item.quantity,
          stockQuantity: 999, // Default stock quantity
          category: 'Unknown' // Default category
        }));
        setCartItems(mappedCartItems);
      } else {
        console.warn('Cart API returned success: false:', response);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // If it's a JSON parsing error, try to get more details
      if (error.message.includes('JSON')) {
        console.error('JSON parsing error - raw response:', error.response?.data);
      }
      
      setCartItems([]);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return { success: false, message: 'Vui lòng đăng nhập' };
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`/customer/cart/add?bookId=${bookId}&quantity=${quantity}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        await loadCartItems(); // Reload cart items
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        return { success: true };
      } else {
        toast.error(response.message || 'Thêm vào giỏ hàng thất bại');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message?.includes('403')) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
      return { success: false, message: 'Có lỗi xảy ra' };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để cập nhật giỏ hàng');
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await apiClient.put(`/customer/cart/update/${cartItemId}?quantity=${quantity}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        await loadCartItems(); // Reload cart items
        toast.success('Đã cập nhật số lượng');
        return { success: true };
      } else {
        toast.error(response.message || 'Cập nhật thất bại');
        return { success: false };
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      if (error.message?.includes('403')) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xóa sản phẩm');
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await apiClient.delete(`/customer/cart/remove/${cartItemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        await loadCartItems(); // Reload cart items
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        return { success: true };
      } else {
        toast.error(response.message || 'Xóa thất bại');
        return { success: false };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (error.message?.includes('403')) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xóa giỏ hàng');
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await apiClient.delete('/customer/cart/clear', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        setCartItems([]);
        toast.success('Đã xóa toàn bộ giỏ hàng');
        return { success: true };
      } else {
        toast.error(response.message || 'Xóa giỏ hàng thất bại');
        return { success: false };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (error.message?.includes('403')) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    isLoaded,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    loadCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
