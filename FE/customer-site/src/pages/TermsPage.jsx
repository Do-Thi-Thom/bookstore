import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Button, 
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '24px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '24px',
          gap: '16px'
        }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            style={{ fontSize: '16px' }}
          >
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            <FileTextOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            Điều khoản sử dụng
          </Title>
        </div>

        <Card>
          <div style={{ lineHeight: '1.8' }}>
            <Title level={3}>1. Giới thiệu</Title>
            <Paragraph>
              Chào mừng bạn đến với BookStore. Bằng việc truy cập và sử dụng website này, 
              bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng sau đây.
            </Paragraph>

            <Divider />

            <Title level={3}>2. Đăng ký tài khoản</Title>
            <Paragraph>
              <Text strong>Yêu cầu đăng ký:</Text>
              <ul>
                <li>Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản</li>
                <li>Bạn chịu trách nhiệm bảo mật mật khẩu và tài khoản của mình</li>
                <li>Bạn phải đủ 18 tuổi hoặc có sự đồng ý của cha mẹ/người giám hộ</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>3. Đặt hàng và thanh toán</Title>
            <Paragraph>
              <Text strong>Đặt hàng:</Text>
              <ul>
                <li>Đơn hàng chỉ được xác nhận khi chúng tôi gửi email xác nhận</li>
                <li>Chúng tôi có quyền từ chối hoặc hủy bỏ đơn hàng vì bất kỳ lý do gì</li>
                <li>Thanh toán phải được hoàn thành trước khi đơn hàng được xử lý</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>4. Vận chuyển và giao hàng</Title>
            <Paragraph>
              <ul>
                <li>Thời gian giao hàng dự kiến sẽ được hiển thị khi đặt hàng</li>
                <li>Phí vận chuyển sẽ được tính dựa trên địa chỉ giao hàng</li>
                <li>Thời gian giao hàng có thể thay đổi do các yếu tố khách quan</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>5. Đổi trả và hoàn tiền</Title>
            <Paragraph>
              <Text strong>Điều kiện đổi trả:</Text>
              <ul>
                <li>Sản phẩm phải còn nguyên vẹn, chưa sử dụng</li>
                <li>Yêu cầu đổi trả trong vòng 30 ngày kể từ ngày nhận hàng</li>
                <li>Hoàn tiền sẽ được thực hiện trong vòng 7-14 ngày làm việc</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>6. Bảo mật và quyền riêng tư</Title>
            <Paragraph>
              Việc sử dụng website của chúng tôi tuân theo Chính sách bảo mật. 
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn.
            </Paragraph>

            <Divider />

            <Title level={3}>7. Giới hạn trách nhiệm</Title>
            <Paragraph>
              BookStore sẽ không chịu trách nhiệm về bất kỳ thiệt hại trực tiếp, gián tiếp, 
              ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ việc sử dụng dịch vụ.
            </Paragraph>

            <Divider />

            <Title level={3}>8. Thay đổi điều khoản</Title>
            <Paragraph>
              Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. 
              Những thay đổi sẽ có hiệu lực ngay khi được đăng trên website.
            </Paragraph>

            <Divider />

            <Title level={3}>9. Thông tin liên hệ</Title>
            <Paragraph>
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi:
            </Paragraph>
            <Paragraph>
              <strong>Email:</strong> contact@bookstore.com<br />
              <strong>Điện thoại:</strong> 1900-xxxx<br />
              <strong>Địa chỉ:</strong> Mỹ Đình, Hà Nội
            </Paragraph>

            <Divider />

            <Title level={3}>10. Ngày hiệu lực</Title>
            <Paragraph>
              Các điều khoản này có hiệu lực từ ngày 01/01/2024 và sẽ tiếp tục có hiệu lực 
              cho đến khi được thay đổi hoặc chấm dứt.
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
