import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Badge, Avatar, Dropdown, Space } from 'antd';
import {
  HomeOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  SearchOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const toast = useToast();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: (
        <Badge count={cartItemCount} size="small">
          Giỏ hàng
        </Badge>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'orders',
      icon: <OrderedListOutlined />,
      label: 'Lịch sử đơn hàng',
      onClick: () => navigate('/orders'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        const result = logout();
        if (result.success) {
          toast.success(result.message);
        }
        navigate('/');
      },
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <>
      <AntHeader 
        style={{ 
          background: 'white', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1890ff', 
              marginRight: '48px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <BookOutlined style={{ marginRight: '8px' }} />
            BookStore
          </div>
          
          {/* Desktop Menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ 
              border: 'none', 
              background: 'transparent',
              display: !isMobile ? 'flex' : 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* User Menu */}
          {user ? (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ display: !isMobile ? 'inline' : 'none' }}>
                  {user.fullName || user.username}
                </span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text" onClick={() => navigate('/login')}>
                Đăng nhập
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                Đăng ký
              </Button>
            </Space>
          )}

          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
            style={{ display: isMobile ? 'flex' : 'none' }}
          />
        </div>
      </AntHeader>

      {/* Mobile Menu */}
      {mobileMenuVisible && (
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid #f0f0f0',
          display: isMobile ? 'block' : 'none',
          width: '100%'
        }}>
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none' }}
          />
        </div>
      )}
    </>
  );
};

export default Header;
