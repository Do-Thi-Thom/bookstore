import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, message } from 'antd';
import {
  BookOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, type DashboardStats, type LowStockBook } from '../services/dashboard';
import type { Order } from '../services/orders';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error: any) {
      message.error(error.message || 'Lấy thống kê dashboard thất bại');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status];
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'Đang xử lý',
      processing: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Hủy',
    };
    return texts[status];
  };

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span className="font-semibold text-green-600">
          {amount.toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
  ];

  const bookColumns = [
    {
      title: 'Tên sách',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (quantity: number) => (
        <Tag color={quantity <= 5 ? 'red' : 'green'}>
          {quantity}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống quản lý sách</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Tổng số sách"
              value={stats?.bookStats.totalBooks || 0}
              prefix={<BookOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div className="flex items-center mt-2">
              {stats?.bookStats.increase ? (
                <RiseOutlined className="text-green-500 mr-1" />
              ) : (
                <FallOutlined className="text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats?.bookStats.increase ? 'text-green-500' : 'text-red-500'}`}>
                {(stats?.bookStats.growthRate || 0) > 0 ? '+' : ''}{stats?.bookStats.growthRate || 0}% so với tháng trước
              </span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Đơn hàng mới"
              value={stats?.orderStats.newOrders || 0}
              prefix={<ShoppingCartOutlined className="text-orange-500" />}
              valueStyle={{ color: '#cf1322' }}
            />
            <div className="flex items-center mt-2">
              {stats?.orderStats.increase ? (
                <RiseOutlined className="text-green-500 mr-1" />
              ) : (
                <FallOutlined className="text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats?.orderStats.increase ? 'text-green-500' : 'text-red-500'}`}>
                {(stats?.orderStats.growthRate || 0) > 0 ? '+' : ''}{stats?.orderStats.growthRate || 0}% so với tuần trước
              </span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Khách hàng"
              value={stats?.customerStats.totalCustomers || 0}
              prefix={<UserOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div className="flex items-center mt-2">
              {stats?.customerStats.increase ? (
                <RiseOutlined className="text-green-500 mr-1" />
              ) : (
                <FallOutlined className="text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats?.customerStats.increase ? 'text-green-500' : 'text-red-500'}`}>
                {(stats?.customerStats.growthRate || 0) > 0 ? '+' : ''}{stats?.customerStats.growthRate || 0}% so với tháng trước
              </span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Doanh thu tháng"
              value={stats?.revenueStats.monthlyRevenue || 0}
              prefix={<DollarOutlined className="text-green-500" />}
              valueStyle={{ color: '#3f8600' }}
              suffix="₫"
            />
            <div className="flex items-center mt-2">
              {stats?.revenueStats.increase ? (
                <RiseOutlined className="text-green-500 mr-1" />
              ) : (
                <FallOutlined className="text-red-500 mr-1" />
              )}
              <span className={`text-sm ${stats?.revenueStats.increase ? 'text-green-500' : 'text-red-500'}`}>
                {(stats?.revenueStats.growthRate || 0) > 0 ? '+' : ''}{stats?.revenueStats.growthRate || 0}% so với tháng trước
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders and Low Stock Books */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Đơn hàng gần đây" 
            className="shadow-sm"
            extra={<button onClick={() => navigate('/orders')} className="text-blue-500 hover:text-blue-700">Xem tất cả</button>}
          >
            <Table
              dataSource={stats?.recentOrders || []}
              columns={orderColumns}
              pagination={false}
              size="small"
              rowKey="id"
              loading={loading}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Sách sắp hết hàng" 
            className="shadow-sm"
            extra={<button onClick={() => navigate('/books')} className="text-blue-500 hover:text-blue-700">Xem tất cả</button>}
          >
            <Table
              dataSource={stats?.lowStockBooks || []}
              columns={bookColumns}
              pagination={false}
              size="small"
              rowKey="id"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Thao tác nhanh" className="shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/books')}
                className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <BookOutlined className="text-2xl text-blue-500 mb-2" />
                <div className="text-sm font-medium text-blue-700">Thêm sách mới</div>
              </button>
              
              <button 
                onClick={() => navigate('/orders')}
                className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              >
                <ShoppingCartOutlined className="text-2xl text-green-500 mb-2" />
                <div className="text-sm font-medium text-green-700">Xem đơn hàng</div>
              </button>
              
              <button 
                onClick={() => navigate('/users')}
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
              >
                <UserOutlined className="text-2xl text-purple-500 mb-2" />
                <div className="text-sm font-medium text-purple-700">Quản lý người dùng</div>
              </button>
              
              <button 
                onClick={() => navigate('/categories')}
                className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
              >
                <BookOutlined className="text-2xl text-orange-500 mb-2" />
                <div className="text-sm font-medium text-orange-700">Quản lý danh mục</div>
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
