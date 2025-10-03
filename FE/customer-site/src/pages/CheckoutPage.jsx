import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Divider, 
  Radio, 
  Space,
  Steps,
  Image,
  Tag,
  Alert,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  BankOutlined,
  WalletOutlined,
  TruckOutlined
} from '@ant-design/icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiClient } from '../services/apiClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [form] = Form.useForm();

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [user, navigate, toast]);

  // Auto-fill form with user data
  useEffect(() => {
    if (user && isAuthenticated) {
      form.setFieldsValue({
        fullName: user.fullName || user.username || '',
        phone: user.phone || '',
        address: user.address || '',
        note: ''
      });
    }
  }, [user, isAuthenticated, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const orderData = {
        recipientName: values.fullName,
        recipientPhone: values.phone,
        recipientAddress: values.address,
        notes: values.note || ''
      };

      const response = await apiClient.post('/customer/orders/create', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.success) {
        toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        // API sẽ tự động clear cart sau khi tạo order thành công
        navigate('/orders');
      } else {
        toast.error(response.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.message?.includes('403')) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace(/\s/g, '');
  };

  const shippingFee = getCartTotal() > 200000 ? 0 : 30000;
  const totalAmount = getCartTotal() + shippingFee;

  const steps = [
    {
      title: 'Thông tin giao hàng',
      icon: <UserOutlined />
    },
    {
      title: 'Thanh toán',
      icon: <CreditCardOutlined />
    },
    {
      title: 'Hoàn thành',
      icon: <CheckCircleOutlined />
    }
  ];

  const renderOrderSummary = () => (
    <Card 
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          <ShoppingOutlined style={{ color: '#667eea' }} />
          Tóm tắt đơn hàng
        </div>
      }
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: 'none',
        position: 'sticky',
        top: '24px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Cart Items */}
        <div>
          <Text strong style={{ fontSize: '14px', color: '#1a1a1a' }}>
            Sản phẩm ({cartItems.reduce((total, item) => total + item.quantity, 0)}):
          </Text>
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <Image
                  src={item.image || (item.coverImage && item.coverImage.startsWith('data:image') ? item.coverImage : `data:image/jpeg;base64,${item.coverImage}`)}
                  alt={item.title}
                  style={{ 
                    width: '50px', 
                    height: '60px', 
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                  preview={false}
                  fallback={
                    <div style={{
                      width: '50px',
                      height: '60px',
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      border: '2px dashed #d9d9d9'
                    }}>
                      <ShoppingOutlined style={{ fontSize: '16px', color: '#d9d9d9' }} />
                    </div>
                  }
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: '13px', color: '#1a1a1a', display: 'block' }}>
                    {item.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    SL: {item.quantity} × {formatPrice(item.price)}
                  </Text>
                </div>
                <Text strong style={{ fontSize: '14px', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </div>
            ))}
          </div>
        </div>
        
        <Divider style={{ margin: '16px 0' }} />
        
        {/* Price Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: '14px', color: '#666' }}>Tạm tính:</Text>
            <Text style={{ fontSize: '14px', color: '#1a1a1a' }}>{formatPrice(getCartTotal())}</Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: '14px', color: '#666' }}>Phí vận chuyển:</Text>
            <Text style={{ fontSize: '14px', color: '#1a1a1a' }}>
              {shippingFee === 0 ? (
                <span style={{ color: '#52c41a' }}>Miễn phí</span>
              ) : (
                formatPrice(shippingFee)
              )}
            </Text>
          </div>
          
          <Divider style={{ margin: '12px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: '16px', color: '#1a1a1a' }}>Tổng cộng:</Text>
            <Text strong style={{ 
              fontSize: '18px', 
              color: '#f5222d',
              fontWeight: 'bold'
            }}>
              {formatPrice(totalAmount)}
            </Text>
          </div>
        </div>
        
        {shippingFee > 0 && (
          <Alert
            message={`Mua thêm ${formatPrice(200000 - getCartTotal())} để được miễn phí vận chuyển`}
            type="info"
            showIcon
            style={{ borderRadius: '8px' }}
          />
        )}
      </div>
    </Card>
  );

  const renderShippingForm = () => (
    <Card 
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          <UserOutlined style={{ color: '#667eea' }} />
          Thông tin giao hàng
        </div>
      }
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        marginBottom: '24px'
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
                 <Row gutter={[16, 0]}>
           <Col xs={24} md={12}>
             <Form.Item
               name="fullName"
               label="Tên người nhận"
               rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
             >
               <Input 
                 prefix={<UserOutlined style={{ color: '#d9d9d9' }} />} 
                 placeholder="Nhập tên người nhận"
                 size="large"
                 style={{ borderRadius: '8px' }}
               />
             </Form.Item>
           </Col>
           
           <Col xs={24} md={12}>
             <Form.Item
               name="phone"
               label="Số điện thoại người nhận"
               rules={[
                 { required: true, message: 'Vui lòng nhập số điện thoại' },
                 { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
               ]}
             >
               <Input 
                 prefix={<PhoneOutlined style={{ color: '#d9d9d9' }} />} 
                 placeholder="Nhập số điện thoại người nhận"
                 size="large"
                 style={{ borderRadius: '8px' }}
               />
             </Form.Item>
           </Col>
         </Row>

         <Row gutter={[16, 0]}>
           <Col xs={24}>
             <Form.Item
               name="address"
               label="Địa chỉ giao hàng"
               rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
             >
               <TextArea
                 prefix={<EnvironmentOutlined style={{ color: '#d9d9d9' }} />}
                 placeholder="Nhập địa chỉ giao hàng chi tiết"
                 rows={3}
                 style={{ borderRadius: '8px' }}
               />
             </Form.Item>
           </Col>
         </Row>

        <Form.Item name="note" label="Ghi chú">
          <TextArea 
            placeholder="Ghi chú thêm (không bắt buộc)" 
            rows={3}
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>
      </Form>
    </Card>
  );

  const renderPaymentForm = () => (
    <Card 
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          <CreditCardOutlined style={{ color: '#667eea' }} />
          Phương thức thanh toán
        </div>
      }
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        marginBottom: '24px'
      }}
    >
      <div style={{ width: '100%' }}>
        <div style={{ 
          padding: '20px', 
          border: '2px solid #52c41a', 
          borderRadius: '12px',
          width: '100%',
          background: '#f6ffed',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <TruckOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                Thanh toán khi nhận hàng (COD)
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Thanh toán bằng tiền mặt khi nhận hàng
              </Text>
            </div>
            <div style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px',
              background: '#52c41a',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Mặc định
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <Alert
            message="Các phương thức thanh toán khác đang được nâng cấp"
            description="Hiện tại chúng tôi chỉ hỗ trợ thanh toán khi nhận hàng (COD). Các phương thức thanh toán trực tuyến sẽ được cập nhật sớm."
            type="info"
            showIcon
            style={{ borderRadius: '8px' }}
          />
        </div>
      </div>
    </Card>
  );

  // Route protection
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '24px 0'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px'
      }}>
        <Title level={2} style={{ 
          marginBottom: '32px',
          color: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CreditCardOutlined style={{ color: '#667eea' }} />
          Thanh toán
        </Title>
        
        <Steps 
          current={0} 
          items={steps} 
          style={{ marginBottom: '32px' }}
          progressDot
        />
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div>
              {renderShippingForm()}
              {renderPaymentForm()}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                gap: '16px',
                marginTop: '24px'
              }}>
                <Button 
                  size="large" 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/cart')}
                  style={{ 
                    height: '48px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '2px solid #d9d9d9',
                    color: '#666'
                  }}
                >
                  Quay lại giỏ hàng
                </Button>
                
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={() => form.submit()}
                  style={{ 
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  Đặt hàng ngay
                </Button>
              </div>
            </div>
          </Col>
          
          <Col xs={24} lg={8}>
            {renderOrderSummary()}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage;
