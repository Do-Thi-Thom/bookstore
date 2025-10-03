import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Header />
      
      <Content style={{ 
        flex: 1, 
        background: '#f5f5f5',
        width: '100%',
        margin: 0,
        padding: 0
      }}>
        <Outlet />
      </Content>
      
      <Footer />
    </Layout>
  );
};

export default MainLayout;
