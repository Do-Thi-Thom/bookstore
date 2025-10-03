import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button } from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <AntFooter style={{ 
      background: '#001529', 
      color: 'white', 
      padding: '48px 0 24px 0',
      marginTop: 'auto',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px'
      }}>
        {/* Footer Content */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: 'white'
            }}>
              Về BookStore
            </h3>
            <p style={{ 
              color: '#bfbfbf', 
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              BookStore - Nơi bạn tìm thấy những cuốn sách hay nhất với giá tốt nhất. 
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất.
            </p>

          </div>

          {/* Services */}
          <div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: 'white'
            }}>
              Dịch vụ
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              color: '#bfbfbf'
            }}>
              <li style={{ marginBottom: '8px' }}>Mua sách online</li>
              <li style={{ marginBottom: '8px' }}>Giao hàng tận nơi</li>
              <li style={{ marginBottom: '8px' }}>Đổi trả miễn phí</li>
              <li style={{ marginBottom: '8px' }}>Hỗ trợ 24/7</li>
              <li style={{ marginBottom: '8px' }}>Khuyến mãi thường xuyên</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: 'white'
            }}>
              Liên hệ
            </h3>
            <div style={{ color: '#bfbfbf' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <PhoneOutlined style={{ marginRight: '8px' }} />
                <span>Hotline: 1900-xxxx</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <MailOutlined style={{ marginRight: '8px' }} />
                <span>Email: contact@bookstore.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <EnvironmentOutlined style={{ marginRight: '8px' }} />
                <span>Địa chỉ: Mỹ Đình, Hà Nội</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: 'white'
            }}>
              Theo dõi
            </h3>
            <p style={{ 
              color: '#bfbfbf', 
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Đăng ký nhận thông tin về sách mới và khuyến mãi đặc biệt.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Nhập email của bạn"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #434343',
                  borderRadius: '6px',
                  background: '#141414',
                  color: 'white'
                }}
              />
              <Button type="primary">Đăng ký</Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{ 
          borderTop: '1px solid #434343', 
          paddingTop: '24px',
          textAlign: 'center',
          color: '#8c8c8c'
        }}>
          <p style={{ margin: 0 }}>
            © 2024 BookStore. Tất cả quyền được bảo lưu. | 
            <a 
              onClick={() => navigate('/privacy')} 
              style={{ color: '#8c8c8c', marginLeft: '8px', cursor: 'pointer' }}
            >
              Chính sách bảo mật
            </a> | 
            <a 
              onClick={() => navigate('/terms')} 
              style={{ color: '#8c8c8c', marginLeft: '8px', cursor: 'pointer' }}
            >
              Điều khoản sử dụng
            </a>
          </p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
