import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Carousel, 
  Card, 
  Button, 
  Input, 
  Row, 
  Col, 
  Tag, 
  Rate, 
  Space,
  Typography,
  Divider,
  Empty
} from 'antd';
import { 
  SearchOutlined, 
  ShoppingCartOutlined, 
  EyeOutlined,
  FireOutlined,
  BookOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

import { apiClient } from '../services/apiClient';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';

const { Title, Text } = Typography;
const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryPageIndex, setCategoryPageIndex] = useState(0);
  const [categoryPageSize] = useState(6);
  const [categoryTotalPages, setCategoryTotalPages] = useState(1);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [newestBooks, setNewestBooks] = useState([]);
  const [newestPageIndex, setNewestPageIndex] = useState(0);
  const [newestPageSize] = useState(6);
  const [newestTotalPages, setNewestTotalPages] = useState(0);
  const [newestLoading, setNewestLoading] = useState(false);

  // Featured books state
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredCategoryId, setFeaturedCategoryId] = useState(-1);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    fetchCategories(0);
    fetchFeaturedBooks(-1);
  }, []);

  // Load all books by default when component mounts
  useEffect(() => {
    setSelectedCategoryId(-1);
    setFeaturedCategoryId(-1);
    resetAndFetchNewest(-1);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');

    if (categoryFromUrl) {
      const categoryId = Number(categoryFromUrl);
      setSelectedCategoryId(categoryId);
      setFeaturedCategoryId(categoryId);
      resetAndFetchNewest(categoryId);
      fetchFeaturedBooks(categoryId);
    } else {
      // Reset to all books when no category in URL
      setSelectedCategoryId(-1);
      setFeaturedCategoryId(-1);
      resetAndFetchNewest(-1);
      fetchFeaturedBooks(-1);
    }
  }, [location.search]);

  const fetchCategories = async (page) => {
    setCategoryLoading(true);

    try {
      const response = await apiClient.get(`/customer/categories?pageIndex=${page}&pageSize=${categoryPageSize}`);

      if (response && response.success) {
        const items = response.data?.items || [];
        const totalPages = response.data?.totalPages || 1;

        setCategoryItems(prev => page === 0 ? items : [...prev, ...items]);
        setCategoryPageIndex(page);
        setCategoryTotalPages(totalPages);

        return { success: true };
      }

      toast.error(response?.message || 'Không tải được danh mục');

      return { success: false };
    } catch (error) {
      toast.error('Có lỗi khi tải danh mục');

      return { success: false };
    } finally {
      setCategoryLoading(false);
    }
  };

  const getBase64ImageSrc = (base64String) => {
    if (!base64String) {
      return '';
    }

    if (base64String.startsWith('data:')) {
      return base64String;
    }

    return `data:image/jpeg;base64,${base64String}`;
  };

  const fetchFeaturedBooks = async (categoryId = -1) => {
    setFeaturedLoading(true);
    try {
      const response = await apiClient.get(`/customer/books/featured?pageIndex=0&pageSize=6&categoryId=${categoryId}`);

      if (response && response.success) {
        const items = (response.data?.items || []).map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          coverImage: getBase64ImageSrc(book.coverImage),
          stockQuantity: book.stockQuantity,
          category: book.category?.name || 'Không phân loại',
          description: book.description,
          originalPrice: book.price, // No discount for featured books
          rating: 4.5, // Default rating
          reviews: 10, // Default reviews
          stock: book.stockQuantity,
          image: getBase64ImageSrc(book.coverImage)
        }));
                 setFeaturedBooks(items);
      } else {
        toast.error(response?.message || 'Không tải được sách nổi bật');
      }
    } catch (error) {
      toast.error('Có lỗi khi tải sách nổi bật');
    } finally {
      setFeaturedLoading(false);
    }
  };

  const resetAndFetchNewest = async (categoryId) => {
    setNewestBooks([]);
    setNewestPageIndex(0);
    setNewestTotalPages(0);

    await fetchNewestBooks(categoryId, 0);
  };

  const fetchNewestBooks = async (categoryId, page) => {
    if (categoryId === null || categoryId === undefined) {

      return { success: false };
    }

    setNewestLoading(true);

    try {
      const response = await apiClient.get(`/customer/books/latest?pageIndex=${page}&pageSize=${newestPageSize}&categoryId=${categoryId}`);

      if (response && response.success) {
        const items = (response.data?.items || []).map(b => ({
          id: b.id,
          title: b.title,
          author: b.author,
          price: b.price,
          coverImage: getBase64ImageSrc(b.coverImage),
          stockQuantity: b.stockQuantity,
          category: b.category?.name || 'Không phân loại',
          description: b.description,
          originalPrice: b.price, // No discount for newest books
          rating: 4.5, // Default rating
          reviews: 10, // Default reviews
          stock: b.stockQuantity,
          image: getBase64ImageSrc(b.coverImage)
        }));

        const totalPages = response.data?.totalPages || 0;

                 setNewestBooks(prev => page === 0 ? items : [...prev, ...items]);
         setNewestPageIndex(page);
         setNewestTotalPages(totalPages);

        return { success: true };
      }

      toast.error(response?.message || 'Không tải được sách mới nhất');

      return { success: false };
    } catch (error) {
      toast.error('Có lỗi khi tải sách mới nhất');

      return { success: false };
    } finally {
      setNewestLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      // Search in featured books and newest books only
      const featuredResults = featuredBooks.filter(book => 
        book.title.toLowerCase().includes(value.toLowerCase()) ||
        book.author.toLowerCase().includes(value.toLowerCase())
      );
      const newestResults = newestBooks.filter(book => 
        book.title.toLowerCase().includes(value.toLowerCase()) ||
        book.author.toLowerCase().includes(value.toLowerCase())
      );
      
      // Combine results and remove duplicates based on book ID
      const combinedResults = [...featuredResults, ...newestResults];
      const uniqueResults = combinedResults.filter((book, index, self) => 
        index === self.findIndex(b => b.id === book.id)
      );
      
      setFilteredBooks(uniqueResults);
    } else {
      // When no search query, show all books (featured + newest)
      const allBooks = [...featuredBooks, ...newestBooks];
      const uniqueAllBooks = allBooks.filter((book, index, self) => 
        index === self.findIndex(b => b.id === book.id)
      );
      setFilteredBooks(uniqueAllBooks);
    }
  };

  const handleAddToCart = (book) => {
    addToCart(book.id, 1);
  };

  const handleViewProduct = (bookId) => {
    navigate(`/product/${bookId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const bannerItems = [
    {
      key: 1,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop',
      title: 'Khám phá thế giới sách mới',
      description: 'Hàng ngàn cuốn sách hay đang chờ bạn khám phá'
    },
    {
      key: 2,
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop',
      title: 'Không gian đọc truyền cảm hứng',
      description: 'Những cuốn sách giúp bạn thay đổi tư duy mỗi ngày'
    },
    {
      key: 3,
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=400&fit=crop',
      title: 'Bộ sưu tập bán chạy',
      description: 'Cập nhật liên tục những tựa sách được yêu thích nhất'
    }
  ];

  const renderBanner = () => (
    <div style={{ marginBottom: '48px', width: '100%' }}>
      <Carousel autoplay>
        {bannerItems.map(item => (
          <div key={item.key}>
            <div 
              style={{
                height: isMobile ? '300px' : '400px',
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                width: '100%'
              }}
            >
              <div>
                <Title 
                  level={1} 
                  style={{ 
                    color: 'white', 
                    marginBottom: '16px',
                    fontSize: isMobile ? '32px' : '48px'
                  }}
                >
                  {item.title}
                </Title>
                <Text style={{ 
                  fontSize: isMobile ? '16px' : '20px', 
                  color: 'white' 
                }}>
                  {item.description}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );

  const renderSearch = () => (
    <div style={{ 
      marginBottom: '48px',
      maxWidth: '600px',
      margin: '0 auto 48px auto',
      padding: '0 24px',
      width: '100%'
    }}>
      <Search
        placeholder="Tìm kiếm sách theo tên, tác giả..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={handleSearch}
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
        style={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      />
    </div>
  );

  const renderCategories = () => (
    <div style={{ 
      marginBottom: '48px',
      padding: '0 24px',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        <Title level={2} style={{ 
          marginBottom: '32px',
          textAlign: 'center',
          fontSize: isMobile ? '24px' : '32px'
        }}>
          <BookOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          Danh mục sách
        </Title>
        
        {/* All Books Category */}
        <Row gutter={[24, 24]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card 
              hoverable 
              style={{ 
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '12px',
                boxShadow: selectedCategoryId === -1 ? '0 4px 16px rgba(24, 144, 255, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                minHeight: '160px',
                border: selectedCategoryId === -1 ? '2px solid #1890ff' : '1px solid #f0f0f0'
              }}
              bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 12px'
              }}
              onClick={() => navigate('/')}
            >
              <AppstoreOutlined style={{ 
                fontSize: '48px', 
                color: selectedCategoryId === -1 ? '#1890ff' : '#52c41a', 
                marginBottom: '16px' 
              }} />
              <div style={{ 
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: 1.3,
                height: '44px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                color: selectedCategoryId === -1 ? '#1890ff' : '#333'
              }} title="Tất cả sách">
                Tất cả sách
              </div>
              <div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
                Xem tất cả
              </div>
            </Card>
          </Col>
          
          {/* Other Categories */}
          {categoryItems.map(category => (
            <Col xs={12} sm={8} md={6} lg={4} key={category.id}>
              <Card 
                hoverable 
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  boxShadow: selectedCategoryId === category.id ? '0 4px 16px rgba(24, 144, 255, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  minHeight: '160px',
                  border: selectedCategoryId === category.id ? '2px solid #1890ff' : '1px solid #f0f0f0'
                }}
                bodyStyle={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 12px'
                }}
                onClick={() => navigate(`/?category=${category.id}`)}
              >
                <BookOutlined style={{ 
                  fontSize: '48px', 
                  color: selectedCategoryId === category.id ? '#1890ff' : '#1890ff', 
                  marginBottom: '16px' 
                }} />
                <div style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  lineHeight: 1.3,
                  height: '44px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  color: selectedCategoryId === category.id ? '#1890ff' : '#333'
                }} title={category.name}>
                  {category.name}
                </div>
                {Array.isArray(category.books) && (
                  <div style={{ color: '#999', fontSize: '12px', marginTop: '8px' }}>
                    {category.books.length} sách
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          {categoryPageIndex + 1 < categoryTotalPages && (
            <Button 
              size="large" 
              loading={categoryLoading}
              onClick={() => fetchCategories(categoryPageIndex + 1)}
            >
              Xem thêm
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderBookCard = (book) => (
    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={book.id}>
      <Card
        hoverable
        style={{
          height: '100%',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        cover={
          <div style={{ 
            height: '320px', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img
              alt={book.title}
              src={book.image}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              -{Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}%
            </div>
          </div>
        }
        actions={[
          <EyeOutlined 
            key="view" 
            onClick={() => handleViewProduct(book.id)}
            style={{ fontSize: '18px' }}
          />,
          <ShoppingCartOutlined 
            key="cart" 
            onClick={() => handleAddToCart(book)}
            style={{ fontSize: '18px' }}
          />
        ]}
        bodyStyle={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px'
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Title */}
          <div style={{ 
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px',
            lineHeight: '1.4',
            height: '44px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: '#333'
          }}>
            {book.title}
          </div>

          {/* Author */}
          <div style={{ 
            color: '#666', 
            marginBottom: '12px',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            {book.author}
          </div>

          {/* Rating */}
          <div style={{ marginBottom: '16px' }}>
            <Rate disabled defaultValue={book.rating} size="small" />
            <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
              ({book.reviews})
            </Text>
          </div>

          {/* Price and Stock - Fixed at bottom */}
          <div style={{ 
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Price Section */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text strong style={{ 
                  color: '#f5222d',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  {formatPrice(book.price)}
                </Text>
                {book.originalPrice > book.price && (
                  <Text delete style={{ 
                    color: '#999',
                    fontSize: '14px'
                  }}>
                    {formatPrice(book.originalPrice)}
                  </Text>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '4px'
            }}>
              <Tag 
                color={book.stock > 0 ? "green" : "red"} 
                style={{ fontSize: '12px', margin: 0 }}
              >
                {book.stock > 0 ? `Còn ${book.stock}` : 'Hết hàng'}
              </Tag>
              
              {/* Category - Shortened name */}
              <Tag 
                color="blue" 
                style={{ 
                  fontSize: '11px', 
                  margin: 0,
                  maxWidth: '80px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={book.category} // Show full name on hover
              >
                {book.category.length > 8 ? book.category.substring(0, 8) + '...' : book.category}
              </Tag>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );

  const renderBooks = () => (
    <div style={{ 
      padding: '0 24px',
      marginBottom: '48px',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '16px' : '0'
        }}>
          <Title level={2} style={{
            fontSize: isMobile ? '24px' : '32px',
            margin: 0,
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <FireOutlined style={{ 
              marginRight: '12px', 
              color: '#f5222d' 
            }} />
            {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Sách nổi bật'}
          </Title>
          {!searchQuery && (
            <Button 
              type="link" 
              onClick={() => navigate('/')}
              style={{ fontSize: '16px' }}
            >
              Xem tất cả
            </Button>
          )}
        </div>
        
                 {featuredLoading ? (
           <div style={{ textAlign: 'center', padding: '48px 0' }}>
             <div style={{ fontSize: '16px', color: '#666' }}>Đang tải sách nổi bật...</div>
           </div>
         ) : searchQuery ? (
           // When searching, show filtered results
           filteredBooks.length > 0 ? (
             <Row gutter={[24, 24]}>
               {filteredBooks.map(renderBookCard)}
             </Row>
           ) : (
             <Empty 
               description="Không tìm thấy sách phù hợp" 
               style={{ padding: '48px 0' }}
             />
           )
         ) : (
           // When not searching, show only featured books
           featuredBooks.length > 0 ? (
             <Row gutter={[24, 24]}>
               {featuredBooks.map(renderBookCard)}
             </Row>
           ) : (
             <Empty 
               description="Không có sách nổi bật" 
               style={{ padding: '48px 0' }}
             />
           )
         )}
      </div>
    </div>
  );

    const renderNewestBooks = () => (
    <div style={{ 
      padding: '0 24px',
      marginBottom: '48px',
      width: '100%'
    }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '32px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '0'
          }}>
                                                   <Title level={2} style={{
              fontSize: isMobile ? '24px' : '32px',
              margin: 0,
              textAlign: isMobile ? 'center' : 'left'
            }}>
              {searchQuery ? (
                <>
                  <BookOutlined style={{ 
                    marginRight: '12px', 
                    color: '#1890ff' 
                  }} />
                  Kết quả tìm kiếm: "{searchQuery}"
                </>
                             ) : selectedCategoryId === -1 ? (
                 <>
                   <BookOutlined style={{ 
                     marginRight: '12px', 
                     color: '#52c41a' 
                   }} />
                   Sách mới nhất
                 </>
               ) : (
                <>
                  <BookOutlined style={{ 
                    marginRight: '12px', 
                    color: 'green' 
                  }} />
                  Sách mới nhất
                  {categoryItems.find(cat => cat.id === selectedCategoryId) && (
                    <span style={{ fontSize: '20px', color: '#666', marginLeft: '8px' }}>
                      - {categoryItems.find(cat => cat.id === selectedCategoryId).name}
                    </span>
                  )}
                </>
              )}
            </Title>
                          <div style={{ display: 'flex', gap: '12px' }}>
                {!searchQuery && (
                  <Button 
                    type="link" 
                    onClick={() => resetAndFetchNewest(selectedCategoryId)}
                    disabled={newestLoading}
                    style={{ fontSize: '16px' }}
                  >
                    Tải lại
                  </Button>
                )}
                {selectedCategoryId !== -1 && !searchQuery && (
                  <Button 
                    type="link" 
                    onClick={() => navigate('/')}
                    style={{ fontSize: '16px', color: '#1890ff' }}
                  >
                    Xem tất cả
                  </Button>
                )}
              </div>
          </div>

          {(() => {
            // Filter newest books based on search query
            const filteredNewestBooks = searchQuery.trim() 
              ? newestBooks.filter(book => 
                  book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  book.author.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : newestBooks;

                        return filteredNewestBooks.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredNewestBooks.map(book => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={4} key={book.id}>
                    <Card
                      hoverable
                      style={{
                        height: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      cover={
                        <div style={{ 
                          height: '240px', 
                          overflow: 'hidden',
                          position: 'relative',
                          background: '#fafafa'
                        }}>
                          {book.coverImage ? (
                            <img
                              alt={book.title}
                              src={book.coverImage}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#bbb'
                            }}>
                              <BookOutlined style={{ fontSize: '48px' }} />
                            </div>
                          )}
                        </div>
                      }
                      actions={[
                        <EyeOutlined 
                          key="view" 
                          onClick={() => handleViewProduct(book.id)}
                          style={{ fontSize: '18px' }}
                        />,
                        <ShoppingCartOutlined 
                          key="cart" 
                          onClick={() => handleAddToCart(book)}
                          style={{ fontSize: '18px' }}
                        />
                      ]}
                      bodyStyle={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '16px'
                      }}
                    >
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ 
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                          lineHeight: '1.4',
                          height: '44px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          color: '#333'
                        }}>
                          {book.title}
                        </div>
                        <div style={{ 
                          color: '#666', 
                          marginBottom: '12px',
                          fontSize: '14px',
                          fontStyle: 'italic'
                        }}>
                          {book.author}
                        </div>
                        <div style={{ 
                          marginTop: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <Text strong style={{ 
                            color: '#f5222d',
                            fontSize: '18px',
                            fontWeight: 'bold'
                          }}>
                            {formatPrice(book.price)}
                          </Text>
                          <Tag 
                            color={book.stockQuantity > 0 ? 'green' : 'red'}
                            style={{ fontSize: '12px', margin: 0 }}
                          >
                            {book.stockQuantity > 0 ? `Còn ${book.stockQuantity}` : 'Hết hàng'}
                          </Tag>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty 
                description="Không có sách nào" 
                style={{ padding: '48px 0' }}
              />
            );
          })()}

          {!searchQuery && newestBooks.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              {newestPageIndex + 1 < newestTotalPages && (
                <Button 
                  size="large" 
                  loading={newestLoading}
                  onClick={() => fetchNewestBooks(selectedCategoryId, newestPageIndex + 1)}
                >
                  Xem thêm
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      {renderBanner()}
      {renderSearch()}
      {renderCategories()}
      {renderBooks()}
      {renderNewestBooks()}
    </div>
  );
};

export default HomePage;
