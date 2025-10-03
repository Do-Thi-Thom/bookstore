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
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PrivacyPage = () => {
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
            <SafetyOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            Chính sách bảo mật
          </Title>
        </div>

        <Card>
          <div style={{ lineHeight: '1.8' }}>
            <Title level={3}>1. Giới thiệu</Title>
            <Paragraph>
              BookStore cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. 
              Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
            </Paragraph>

            <Divider />

            <Title level={3}>2. Thông tin chúng tôi thu thập</Title>
            <Paragraph>
              <Text strong>Thông tin cá nhân:</Text>
              <ul>
                <li>Họ tên, địa chỉ email, số điện thoại</li>
                <li>Địa chỉ giao hàng và thông tin thanh toán</li>
                <li>Lịch sử mua hàng và sở thích</li>
                <li>Thông tin tài khoản và mật khẩu</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <Text strong>Thông tin tự động:</Text>
              <ul>
                <li>Địa chỉ IP và thông tin trình duyệt</li>
                <li>Cookie và công nghệ theo dõi</li>
                <li>Dữ liệu sử dụng website</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>3. Cách chúng tôi sử dụng thông tin</Title>
            <Paragraph>
              <ul>
                <li>Xử lý đơn hàng và giao hàng</li>
                <li>Cung cấp dịch vụ khách hàng</li>
                <li>Gửi thông tin khuyến mãi và cập nhật</li>
                <li>Cải thiện trải nghiệm người dùng</li>
                <li>Phân tích và thống kê</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>4. Chia sẻ thông tin</Title>
            <Paragraph>
              Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, 
              trừ khi:
            </Paragraph>
            <Paragraph>
              <ul>
                <li>Có sự đồng ý của bạn</li>
                <li>Cần thiết để hoàn thành đơn hàng</li>
                <li>Tuân thủ yêu cầu pháp lý</li>
                <li>Bảo vệ quyền lợi và an toàn của chúng tôi</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>5. Bảo mật thông tin</Title>
            <Paragraph>
              Chúng tôi áp dụng các biện pháp bảo mật phù hợp để bảo vệ thông tin của bạn:
            </Paragraph>
            <Paragraph>
              <ul>
                <li>Mã hóa dữ liệu nhạy cảm</li>
                <li>Giới hạn quyền truy cập thông tin</li>
                <li>Giám sát hệ thống thường xuyên</li>
                <li>Cập nhật bảo mật định kỳ</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>6. Cookie và công nghệ theo dõi</Title>
            <Paragraph>
              Chúng tôi sử dụng cookie để:
            </Paragraph>
            <Paragraph>
              <ul>
                <li>Ghi nhớ sở thích và cài đặt</li>
                <li>Phân tích lưu lượng truy cập</li>
                <li>Cải thiện hiệu suất website</li>
                <li>Cung cấp nội dung phù hợp</li>
              </ul>
            </Paragraph>
            <Paragraph>
              Bạn có thể tắt cookie trong trình duyệt, nhưng điều này có thể ảnh hưởng đến trải nghiệm sử dụng.
            </Paragraph>

            <Divider />

            <Title level={3}>7. Quyền của bạn</Title>
            <Paragraph>
              Bạn có quyền:
            </Paragraph>
            <Paragraph>
              <ul>
                <li>Truy cập và xem thông tin cá nhân</li>
                <li>Yêu cầu cập nhật hoặc sửa đổi thông tin</li>
                <li>Yêu cầu xóa thông tin cá nhân</li>
                <li>Từ chối nhận email marketing</li>
                <li>Rút lại sự đồng ý bất cứ lúc nào</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>8. Lưu trữ thông tin</Title>
            <Paragraph>
              Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để:
            </Paragraph>
            <Paragraph>
              <ul>
                <li>Cung cấp dịch vụ cho bạn</li>
                <li>Tuân thủ nghĩa vụ pháp lý</li>
                <li>Giải quyết tranh chấp</li>
                <li>Thực thi thỏa thuận</li>
              </ul>
            </Paragraph>

            <Divider />

            <Title level={3}>9. Thay đổi chính sách</Title>
            <Paragraph>
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. 
              Những thay đổi sẽ được đăng trên trang này và có hiệu lực ngay lập tức.
            </Paragraph>

            <Divider />

            <Title level={3}>10. Liên hệ</Title>
            <Paragraph>
              Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ với chúng tôi:
            </Paragraph>
            <Paragraph>
              <strong>Email:</strong> privacy@bookstore.com<br />
              <strong>Điện thoại:</strong> 1900-xxxx<br />
              <strong>Địa chỉ:</strong> Mỹ Đình, Hà Nội
            </Paragraph>

            <Divider />

            <Title level={3}>11. Ngày hiệu lực</Title>
            <Paragraph>
              Chính sách bảo mật này có hiệu lực từ ngày 01/01/2024 và được cập nhật lần cuối vào ngày 01/01/2024.
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
