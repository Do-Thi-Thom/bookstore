import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  InputNumber, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Empty, 
  Divider,
  Image,
  message,
  Tag
} from 'antd';
import { 
  DeleteOutlined, 
  ShoppingOutlined, 
  ArrowLeftOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateCartItem, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = async (cartItemId, quantity) => {
    await updateCartItem(cartItemId, quantity);
  };

  const handleRemoveItem = async (cartItemId) => {
    await removeFromCart(cartItemId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning('Giỏ hàng trống');
      return;
    }
    
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    if (!token || !user) {
      toast.warning('Bạn cần đăng nhập để tiếp tục thanh toán');
      navigate('/login?redirect=/cart');
      return;
    }
    
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace(/\s/g, '');
  };

  const renderCartItem = (item) => (
    <Card 
      key={item.id} 
      style={{ 
        marginBottom: '16px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0'
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={6} md={4}>
          <div style={{ textAlign: 'center' }}>
            <Image
              src={item.image || (item.coverImage && item.coverImage.startsWith('data:image') ? item.coverImage : `data:image/jpeg;base64,${item.coverImage}`)}
              alt={item.title}
              style={{ 
                width: '100%', 
                maxWidth: '120px', 
                height: 'auto',
                borderRadius: '8px'
              }}
              preview={false}
              fallback={
                <div style={{
                  width: '120px',
                  height: '160px',
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  border: '2px dashed #d9d9d9'
                }}>
                  <ShoppingCartOutlined style={{ fontSize: '32px', color: '#d9d9d9' }} />
                </div>
              }
            />
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={7}>
          <div>
            <Title level={5} style={{ marginBottom: '8px', color: '#1a1a1a' }}>
              {item.title}
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Tác giả: {item.author}
            </Text>
            {item.category && (
              <div style={{ marginTop: '8px' }}>
                <Tag color="blue" style={{ fontSize: '12px' }}>
                  {typeof item.category === 'string' ? item.category : item.category.name}
                </Tag>
              </div>
            )}
          </div>
        </Col>
        
        <Col xs={12} sm={6} md={4}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Đơn giá
            </div>
            <Text strong style={{ 
              color: '#f5222d', 
              fontSize: '16px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              {formatPrice(item.price)}
            </Text>
          </div>
        </Col>
        
        <Col xs={12} sm={6} md={4}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Số lượng
            </div>
            <InputNumber
              min={1}
              max={item.stock || item.stockQuantity || 999}
              value={item.quantity}
                              onChange={(value) => handleQuantityChange(item.cartItemId || item.id, value)}
              size="middle"
              style={{ width: '100px' }}
            />
          </div>
        </Col>
        
        <Col xs={12} sm={6} md={3}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              Thành tiền
            </div>
            <Text strong style={{ fontSize: '16px', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
              {formatPrice(item.price * item.quantity)}
            </Text>
          </div>
        </Col>
        
        <Col xs={12} sm={6} md={2}>
          <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveItem(item.cartItemId || item.id)}
              size="middle"
              style={{ borderRadius: '6px' }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderCartSummary = () => (
    <Card 
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          <ShoppingCartOutlined style={{ color: '#667eea' }} />
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Text style={{ fontSize: '14px', color: '#666' }}>Tổng sản phẩm:</Text>
                     <Text strong style={{ fontSize: '14px', color: '#1a1a1a' }}>
             {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm
           </Text>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '12px 0'
        }}>
          <Text style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '600' }}>
            Tổng tiền:
          </Text>
                     <Text strong style={{ 
             fontSize: '20px', 
             color: '#f5222d',
             fontWeight: 'bold',
             whiteSpace: 'nowrap'
           }}>
             {formatPrice(getCartTotal())}
           </Text>
        </div>
        
        <Divider style={{ margin: '16px 0' }} />
        
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button
            type="primary"
            size="large"
            icon={<ShoppingOutlined />}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            style={{ 
              width: '100%',
              height: '48px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            Tiến hành thanh toán
          </Button>
          
          <Button
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ 
              width: '100%',
              height: '48px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '2px solid #d9d9d9',
              color: '#666'
            }}
          >
            Tiếp tục mua sắm
          </Button>
          
          {cartItems.length > 0 && (
            <Button
              danger
              onClick={handleClearCart}
              style={{ 
                width: '100%',
                height: '48px',
                fontSize: '16px',
                borderRadius: '8px'
              }}
            >
              Xóa giỏ hàng
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div style={{ fontSize: '16px', color: '#666', marginTop: '16px' }}>
                Giỏ hàng trống
              </div>
            }
          >
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/')}
              style={{ 
                marginTop: '16px',
                height: '48px',
                fontSize: '16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              Mua sắm ngay
            </Button>
          </Empty>
        </div>
      </div>
    );
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
          <ShoppingCartOutlined style={{ color: '#667eea' }} />
                     Giỏ hàng ({cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm)
        </Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <div>
              {cartItems.map(renderCartItem)}
            </div>
          </Col>
          
          <Col xs={24} lg={6}>
            {renderCartSummary()}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CartPage;
