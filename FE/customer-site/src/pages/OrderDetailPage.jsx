import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Steps,
  List,
  Avatar,
  Divider,
  Descriptions,
  message
} from 'antd';
import { 
  ArrowLeftOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { orders } from '../services/mockData';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = () => {
      const foundOrder = orders.find(o => o.id === parseInt(id) && o.userId === user?.id);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        message.error('Không tìm thấy đơn hàng');
        navigate('/orders');
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id, user, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'processing':
        return 'blue';
      case 'shipping':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getCurrentStep = (status) => {
    switch (status) {
      case 'completed':
        return 3;
      case 'shipping':
        return 2;
      case 'processing':
        return 1;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const steps = [
    {
      title: 'Đặt hàng',
      description: 'Đơn hàng đã được đặt',
      icon: <ShoppingOutlined />
    },
    {
      title: 'Xử lý',
      description: 'Đang xử lý đơn hàng',
      icon: <ClockCircleOutlined />
    },
    {
      title: 'Giao hàng',
      description: 'Đang giao hàng',
      icon: <ShoppingOutlined />
    },
    {
      title: 'Hoàn thành',
      description: 'Đã giao hàng thành công',
      icon: <CheckCircleOutlined />
    }
  ];

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/orders')}
            className="mr-4"
          >
            Quay lại
          </Button>
          <Title level={2} className="mb-0">
            Chi tiết đơn hàng #{order.id}
          </Title>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* Order Status */}
            <Card title="Trạng thái đơn hàng" className="mb-6">
              <Steps current={getCurrentStep(order.status)} items={steps} />
              
              <div className="mt-6 text-center">
                <Tag 
                  color={getStatusColor(order.status)} 
                  size="large"
                  style={{ fontSize: '16px', padding: '8px 16px' }}
                >
                  {getStatusText(order.status)}
                </Tag>
              </div>
            </Card>

            {/* Order Items */}
            <Card title="Sản phẩm đã đặt" className="mb-6">
              <List
                itemLayout="horizontal"
                dataSource={order.items}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" size={64} />}
                      title={item.title}
                      description={`Số lượng: ${item.quantity}`}
                    />
                    <div className="text-right">
                      <Text strong className="text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {formatPrice(item.price)} x {item.quantity}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* Order Information */}
            <Card title="Thông tin đơn hàng">
              <Descriptions column={{ xs: 1, md: 2 }} bordered>
                <Descriptions.Item label="Mã đơn hàng">
                  #{order.id}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày đặt">
                  {formatDate(order.orderDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {order.paymentMethod}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Tag>
                </Descriptions.Item>
                {order.deliveryDate && (
                  <Descriptions.Item label="Ngày giao hàng">
                    {formatDate(order.deliveryDate)}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* Order Summary */}
            <Card title="Tóm tắt đơn hàng" className="mb-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Text>Tạm tính:</Text>
                  <Text>{formatPrice(order.total)}</Text>
                </div>
                
                <div className="flex justify-between">
                  <Text>Phí vận chuyển:</Text>
                  <Text>Miễn phí</Text>
                </div>
                
                <Divider />
                
                <div className="flex justify-between">
                  <Text strong className="text-lg">Tổng cộng:</Text>
                  <Text strong className="text-lg text-red-500">
                    {formatPrice(order.total)}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Shipping Information */}
            <Card title="Thông tin giao hàng">
              <div className="space-y-4">
                <div>
                  <Text strong>Địa chỉ giao hàng:</Text>
                  <br />
                  <Text>{order.shippingAddress}</Text>
                </div>
                
                <div>
                  <Text strong>Phương thức thanh toán:</Text>
                  <br />
                  <Text>{order.paymentMethod}</Text>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card className="mt-6">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  block
                  onClick={() => navigate('/')}
                >
                  Tiếp tục mua sắm
                </Button>
                
                {order.status === 'processing' && (
                  <Button 
                    danger 
                    block
                  >
                    Hủy đơn hàng
                  </Button>
                )}
                
                <Button 
                  block
                  onClick={() => navigate('/orders')}
                >
                  Xem tất cả đơn hàng
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderDetailPage;
