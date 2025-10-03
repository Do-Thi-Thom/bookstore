import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  InputNumber, 
  Rate, 
  Tag, 
  Typography, 
  Divider, 
  Space, 
  Image,
  message,
  Breadcrumb,
  Spin,
  Empty,
  Skeleton
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HomeOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { apiClient } from '../services/apiClient';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/customer/books/${id}`);
      
      if (response && response.success) {
        const bookData = response.data;
        setBook({
          ...bookData,
          coverImage: getBase64ImageSrc(bookData.coverImage)
        });
      } else {
        toast.error(response?.message || 'Không tìm thấy sách');
        navigate('/');
      }
    } catch (error) {
      toast.error('Có lỗi khi tải thông tin sách');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getBase64ImageSrc = (base64String) => {
    if (!base64String) return '';
    if (base64String.startsWith('data:')) return base64String;
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      toast.warning('Vui lòng chọn số lượng');
      return;
    }

    if (quantity > book.stockQuantity) {
      toast.warning('Số lượng vượt quá tồn kho');
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart(book.id, quantity);
      if (result.success) {
        setQuantity(1);
      } else if (result.message === 'Vui lòng đăng nhập') {
        // Redirect to login with return URL
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

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
      day: 'numeric'
    });
  };

  const breadcrumbItems = [
    {
      title: <HomeOutlined />,
      onClick: () => navigate('/')
    },
    {
      title: <BookOutlined />,
      onClick: () => navigate('/')
    },
    {
      title: book?.title || 'Chi tiết sách'
    }
  ];

  if (loading) {
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
          <Skeleton active paragraph={{ rows: 1 }} style={{ marginBottom: '24px' }} />
          <Card style={{ borderRadius: '12px' }}>
            <Row gutter={[48, 24]}>
              <Col xs={24} md={12} lg={10}>
                <Skeleton.Image active style={{ width: '100%', height: '500px' }} />
              </Col>
              <Col xs={24} md={12} lg={14}>
                <Skeleton active paragraph={{ rows: 8 }} />
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Empty 
          description="Không tìm thấy sách" 
          style={{ padding: '48px 0' }}
        />
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
        {/* Breadcrumb */}
        <div style={{ 
          background: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          border: '1px solid #f0f0f0'
        }}>
          <Breadcrumb 
            items={breadcrumbItems.map((item, index) => ({
              ...item,
              title: (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  cursor: item.onClick ? 'pointer' : 'default',
                  color: index === breadcrumbItems.length - 1 ? '#1890ff' : '#666',
                  fontWeight: index === breadcrumbItems.length - 1 ? '600' : '400',
                  background: index === breadcrumbItems.length - 1 ? '#f0f8ff' : 'transparent',
                  border: index === breadcrumbItems.length - 1 ? '1px solid #d6e4ff' : 'none'
                }}
                onClick={item.onClick}
                onMouseEnter={item.onClick ? (e) => {
                  e.target.style.background = '#f5f5f5';
                  e.target.style.color = '#1890ff';
                } : undefined}
                onMouseLeave={item.onClick ? (e) => {
                  e.target.style.background = index === breadcrumbItems.length - 1 ? '#f0f8ff' : 'transparent';
                  e.target.style.color = index === breadcrumbItems.length - 1 ? '#1890ff' : '#666';
                } : undefined}
                >
                  {item.title}
                </div>
              )
            }))}
            separator={
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                color: '#d9d9d9',
                fontSize: '12px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.707 18.707l6-6a.999.999 0 000-1.414l-6-6a.999.999 0 10-1.414 1.414L13.586 12l-5.293 5.293a.999.999 0 101.414 1.414z"/>
                </svg>
              </div>
            }
            style={{
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          />
        </div>
        
        {/* Main Product Card */}
        <Card style={{ 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: 'none',
          overflow: 'hidden'
        }}>
          <Row gutter={[48, 24]}>
            {/* Product Images */}
            <Col xs={24} md={12} lg={10}>
              <div style={{ 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: '12px',
                padding: '24px',
                position: 'relative'
              }}>
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    style={{ 
                      maxHeight: '500px', 
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                    preview={{
                      mask: (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          <EyeOutlined />
                          Xem ảnh
                        </div>
                      )
                    }}
                  />
                ) : (
                  <div style={{
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fafafa',
                    borderRadius: '8px',
                    border: '2px dashed #d9d9d9'
                  }}>
                    <BookOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                  </div>
                )}
              </div>
            </Col>

            {/* Product Info */}
            <Col xs={24} md={12} lg={14}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Title and Author */}
                <div style={{ marginBottom: '24px' }}>
                  <Title level={1} style={{ 
                    marginBottom: '12px',
                    color: '#1a1a1a',
                    fontSize: '32px',
                    lineHeight: '1.2',
                    fontWeight: '700'
                  }}>
                    {book.title}
                  </Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <UserOutlined style={{ color: '#666', fontSize: '16px' }} />
                    <Text style={{ 
                      fontSize: '18px', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      {book.author}
                    </Text>
                  </div>
                </div>

                {/* Price Section */}
                <div style={{ 
                  marginBottom: '32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  color: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Text strong style={{ 
                        color: 'white',
                        fontSize: '32px',
                        fontWeight: 'bold'
                      }}>
                        {formatPrice(book.price)}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Stock and Category */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px 16px',
                      background: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <Text strong style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>
                        Tình trạng:
                      </Text>
                      <Tag 
                        color={book.stockQuantity > 0 ? "green" : "red"} 
                        style={{ 
                          fontSize: '14px', 
                          margin: 0,
                          padding: '4px 12px',
                          borderRadius: '6px'
                        }}
                      >
                        {book.stockQuantity > 0 ? `Còn ${book.stockQuantity} cuốn` : 'Hết hàng'}
                      </Tag>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px 16px',
                      background: '#f8f9fa',
                      borderRadius: '8px'
                    }}>
                      <Text strong style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>
                        Danh mục:
                      </Text>
                      <Tag 
                        color="blue" 
                        style={{ 
                          fontSize: '14px', 
                          margin: 0,
                          padding: '4px 12px',
                          borderRadius: '6px'
                        }}
                      >
                        {book.category?.name || 'Không phân loại'}
                      </Tag>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <Text strong style={{ fontSize: '14px', color: '#333', minWidth: '80px' }}>
                      Số lượng:
                    </Text>
                    <InputNumber
                      min={1}
                      max={book.stockQuantity}
                      value={quantity}
                      onChange={setQuantity}
                      style={{ 
                        width: '120px',
                        borderRadius: '8px'
                      }}
                      size="large"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={book.stockQuantity === 0 || addingToCart}
                    loading={addingToCart}
                    style={{ 
                      width: '100%',
                      height: '52px',
                      fontSize: '16px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <Divider style={{ margin: '48px 0' }} />

        {/* Product Description */}
        <Card 
          title={
            <Title level={3} style={{ 
              margin: 0, 
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <BookOutlined style={{ color: '#667eea' }} />
              Mô tả sản phẩm
            </Title>
          }
          style={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: 'none'
          }}
        >
          <Paragraph style={{ 
            fontSize: '16px', 
            lineHeight: '1.8',
            color: '#333',
            margin: 0,
            textAlign: 'justify'
          }}>
            {book.description || 'Chưa có mô tả cho sản phẩm này.'}
          </Paragraph>
        </Card>

        {/* Additional Information */}
        <Card 
          title={
            <Title level={3} style={{ 
              margin: 0, 
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <TagOutlined style={{ color: '#667eea' }} />
              Thông tin bổ sung
            </Title>
          }
          style={{ 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: 'none',
            marginTop: '24px'
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px 16px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <CalendarOutlined style={{ color: '#667eea', fontSize: '16px' }} />
                <div>
                  <Text strong style={{ fontSize: '14px', color: '#333' }}>
                    Ngày tạo:
                  </Text>
                  <br />
                  <Text style={{ fontSize: '14px', color: '#666' }}>
                    {formatDate(book.createdAt)}
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '12px 16px',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <CalendarOutlined style={{ color: '#667eea', fontSize: '16px' }} />
                <div>
                  <Text strong style={{ fontSize: '14px', color: '#333' }}>
                    Cập nhật lần cuối:
                  </Text>
                  <br />
                  <Text style={{ fontSize: '14px', color: '#666' }}>
                    {formatDate(book.updatedAt)}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
