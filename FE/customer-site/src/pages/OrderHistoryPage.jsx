import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Empty,
  List,
  Avatar,
  Divider,
  Input,
  Pagination,
  Spin,
  Alert,
  Badge,
  Image
} from 'antd';
import { 
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  HistoryOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const { Title, Text } = Typography;
const { Search } = Input;

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { user, isTokenValid } = useAuth();
  const toast = useToast();
  
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Check authentication on mount
  useEffect(() => {
    if (!user || !isTokenValid()) {
      navigate('/login?redirect=/orders');
      return;
    }
  }, [user, isTokenValid]);

  // Load orders on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const [allOrders, setAllOrders] = useState([]); // Store all orders for client-side search

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Always fetch all orders (no search parameter)
      const response = await apiClient.get(
        `/customer/orders?pageIndex=0&pageSize=1000` // Get all orders
      );

      console.log('Orders API response:', response);

      if (response && response.success) {
        const fetchedOrders = response.data?.items || [];
        console.log('Fetched orders structure:', fetchedOrders);
        if (fetchedOrders.length > 0 && fetchedOrders[0].orderItems) {
          console.log('First order items structure:', fetchedOrders[0].orderItems);
        }
        setAllOrders(fetchedOrders);
        
        // Apply client-side search and pagination
        applySearchAndPagination(fetchedOrders);
      } else {
        toast.error(response?.message || 'Không tải được lịch sử đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.message?.includes('Authentication failed') || error.message?.includes('403')) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        navigate('/login?redirect=/orders');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  const applySearchAndPagination = (ordersToFilter) => {
    let filteredOrders = ordersToFilter;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredOrders = ordersToFilter.filter(order => {
        // Search in order number
        if (order.orderNumber?.toLowerCase().includes(query)) return true;
        
        // Search in recipient name
        if (order.recipientName?.toLowerCase().includes(query)) return true;
        
        // Search in recipient phone
        if (order.recipientPhone?.toLowerCase().includes(query)) return true;
        
        // Search in order items (book titles, authors)
        if (order.orderItems?.some(item => 
          item.bookTitle?.toLowerCase().includes(query) ||
          item.bookAuthor?.toLowerCase().includes(query) ||
          item.title?.toLowerCase().includes(query) ||
          item.author?.toLowerCase().includes(query) ||
          item.book?.title?.toLowerCase().includes(query) ||
          item.book?.author?.toLowerCase().includes(query)
        )) return true;
        
        return false;
      });
    }

    // Apply pagination
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    setOrders(paginatedOrders);
    setTotalItems(filteredOrders.length);
    setTotalPages(Math.ceil(filteredOrders.length / pageSize));
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'green';
      case 'PROCESSING':
        return 'orange';
      case 'PENDING':
        return 'blue';
      case 'CANCELLED':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'PROCESSING':
        return 'Đang giao';
      case 'PENDING':
        return 'Đang xử lý';
      case 'CANCELLED':
        return 'Hủy';
      default:
        return status || 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircleOutlined />;
      case 'PROCESSING':
        return <ShoppingOutlined />;
      case 'PENDING':
        return <ClockCircleOutlined />;
      case 'CANCELLED':
        return <CloseCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getBase64ImageSrc = (base64String) => {
    if (!base64String) return '';
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:image/jpeg;base64,${base64String}`;
  };

  const handleSearch = (value) => {
    console.log('Search query:', value);
    setSearchQuery(value);
    setPageIndex(0); // Reset to first page when searching
  };

  // Debounced search effect - apply client-side search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (allOrders.length > 0) {
        applySearchAndPagination(allOrders);
      }
    }, 300); // 300ms delay for client-side search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, pageIndex, allOrders]);

  const handlePageChange = (page) => {
    setPageIndex(page - 1); // API uses 0-based indexing
  };

  const renderOrderItem = (order) => (
    <Card 
      key={order.id} 
      style={{ 
        marginBottom: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0'
      }}
    >
      {/* Order Header */}
      <div style={{ marginBottom: '20px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size="small">
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                <HistoryOutlined style={{ marginRight: '8px' }} />
                Đơn hàng #{order.orderNumber}
              </Title>
              <Text type="secondary">
                <CalendarOutlined style={{ marginRight: '4px' }} />
                Đặt ngày: {formatDate(order.createdAt)}
              </Text>
            </Space>
          </Col>
          <Col>
            <Badge 
              status={getStatusColor(order.status)} 
              text={
                <Tag 
                  color={getStatusColor(order.status)} 
                  icon={getStatusIcon(order.status)}
                  size="large"
                  style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                  {getStatusText(order.status)}
                </Tag>
              }
            />
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Recipient Information */}
      <Row gutter={[24, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} md={8}>
          <Space direction="vertical" size="small">
            <Text strong>
              <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Người nhận: {order.recipientName}
            </Text>
            <Text type="secondary">
              <PhoneOutlined style={{ marginRight: '8px' }} />
              {order.recipientPhone}
            </Text>
          </Space>
        </Col>
        <Col xs={24} md={16}>
          <Space direction="vertical" size="small">
            <Text strong>
              <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Địa chỉ giao hàng:
            </Text>
            <Text type="secondary">{order.recipientAddress}</Text>
          </Space>
        </Col>
      </Row>

             {/* Order Items */}
       <div style={{ marginBottom: '20px' }}>
         <Text strong style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }}>
           Sản phẩm đã đặt ({order.orderItems?.reduce((total, item) => total + (item.quantity || 0), 0) || 0} sản phẩm):
         </Text>
        <List
          itemLayout="horizontal"
          dataSource={order.orderItems || []}
          renderItem={item => (
            <List.Item
              style={{ 
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    size={64}
                    shape="square"
                    src={
                      item.bookCoverImage 
                        ? getBase64ImageSrc(item.bookCoverImage)
                        : item.book?.coverImage 
                        ? getBase64ImageSrc(item.book.coverImage)
                        : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop'
                    }
                    icon={<ShoppingOutlined />}
                    style={{ 
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                }
                                 title={
                   <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                     {item.bookTitle || item.title || item.book?.title || 'Sách không có tiêu đề'}
                   </Text>
                 }
                 description={
                   <Space direction="vertical" size="small">
                     <Text type="secondary" style={{ fontSize: '13px' }}>
                       <strong>Tác giả:</strong> {item.bookAuthor || item.author || item.book?.author || 'Chưa có thông tin'}
                     </Text>
                     <Text type="secondary" style={{ fontSize: '13px' }}>
                       <strong>Số lượng:</strong> {item.quantity}
                     </Text>
                     <Text type="secondary" style={{ fontSize: '13px' }}>
                       <strong>Đơn giá:</strong> {formatPrice(item.price)}
                     </Text>
                   </Space>
                 }
              />
                             <div style={{ textAlign: 'right' }}>
                 <Text strong style={{ fontSize: '16px', color: '#f5222d' }}>
                   {formatPrice(item.price * item.quantity)}
                 </Text>
                 <br />
                 <Text type="secondary" style={{ fontSize: '12px' }}>
                   {formatPrice(item.price)} x {item.quantity}
                 </Text>
               </div>
            </List.Item>
          )}
        />
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Order Summary */}
      <Row justify="space-between" align="middle">
        <Col>
          {order.notes && (
            <div style={{ marginBottom: '8px' }}>
              <Text type="secondary">
                <strong>Ghi chú:</strong> {order.notes}
              </Text>
            </div>
          )}
        </Col>
                 <Col>
           <Text strong style={{ fontSize: '18px', color: '#f5222d' }}>
             <DollarOutlined style={{ marginRight: '8px' }} />
             Tổng tiền: {formatPrice(order.totalAmount)}
           </Text>
         </Col>
      </Row>
    </Card>
  );

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Vui lòng đăng nhập để xem lịch sử đơn hàng"
          >
            <Button type="primary" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '24px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <Title level={2} style={{ margin: 0 }}>
            <HistoryOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            Lịch sử đơn hàng
          </Title>
          <Button 
            type="primary" 
            onClick={() => navigate('/')}
            style={{ borderRadius: '8px' }}
          >
            Tiếp tục mua sắm
          </Button>
        </div>

                 {/* Search Bar */}
         <Card style={{ 
           marginBottom: '24px',
           borderRadius: '12px',
           boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
         }}>
           <Search
             placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm, người nhận..."
             allowClear
             enterButton={<SearchOutlined />}
             size="large"
             onSearch={handleSearch}
             onChange={(e) => setSearchQuery(e.target.value)}
             value={searchQuery}
             loading={loading}
             style={{ 
               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
               borderRadius: '8px'
             }}
           />
                       {searchQuery && (
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary">
                  Tìm kiếm: "{searchQuery}" - {totalItems} đơn hàng phù hợp
                </Text>
              </div>
            )}
         </Card>

        {/* Content */}
        <Spin spinning={loading}>
          {orders.length === 0 && !loading ? (
            <Card style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchQuery 
                    ? "Không tìm thấy đơn hàng phù hợp" 
                    : "Bạn chưa có đơn hàng nào"
                }
              >
                <Button 
                  type="primary" 
                  onClick={() => navigate('/')}
                  style={{ borderRadius: '8px' }}
                >
                  Mua sắm ngay
                </Button>
              </Empty>
            </Card>
          ) : (
            <div>
              {/* Orders List */}
              {orders.map(renderOrderItem)}

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginTop: '32px' 
                }}>
                  <Pagination
                    current={pageIndex + 1}
                    total={totalItems}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} của ${total} đơn hàng`
                    }
                    onChange={handlePageChange}
                    style={{ borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
