import React, { useState } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, Space, message } from 'antd';
import {
  BookOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const profile = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('auth_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [user]);
  const displayName = profile?.fullName || user?.username || 'Admin';
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/books',
      icon: <BookOutlined />,
      label: 'Quản lý sách',
    },
    {
      key: '/categories',
      icon: <FolderOutlined />,
      label: 'Quản lý danh mục',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Quản lý đơn hàng',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
      message.success('Đăng xuất thành công!');
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="shadow-lg"
        style={{
          background: colorBgContainer,
        }}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className={`text-xl font-bold text-gray-800 transition-all duration-300 ${
            collapsed ? 'text-center' : 'text-left'
          }`}>
            {collapsed ? 'AS' : 'Admin Site'}
          </h1>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
          style={{
            background: colorBgContainer,
          }}
        />
      </Sider>
      
      <Layout>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 text-lg border-0 bg-transparent cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800 m-0">
                {menuItems.find(item => item.key === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Dropdown 
              menu={{ 
                items: userMenuItems, 
                onClick: handleUserMenuClick 
              }} 
              placement="bottomRight"
            >
              <Space className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <Avatar 
                  icon={<UserOutlined />} 
                  className="bg-blue-500"
                />
                <span className="text-gray-700 font-medium">{displayName}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
          className="shadow-sm"
        >
          <Outlet />
        </Content>
        
        <Footer style={{ textAlign: 'center', background: colorBgContainer }}>
          <div className="text-gray-600">
            © 2024 Admin Site. All rights reserved.
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
