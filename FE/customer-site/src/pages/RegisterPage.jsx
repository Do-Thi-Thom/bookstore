import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Checkbox,
  Row,
  Col
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');

      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
      };

      const result = await register(payload);
      
      if (result.success) {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        navigate('/login');
      } else {
        toast.error(result.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <div className="text-center mb-6">
            <Title level={2} className="mb-2">Đăng ký tài khoản</Title>
            <Text type="secondary">Tạo tài khoản mới để bắt đầu mua sắm</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              agree: false
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: 'Vui lòng nhập họ tên' },
                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Nhập họ và tên"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="username"
                  label="Tên đăng nhập"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                    { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Nhập tên đăng nhập"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Nhập email"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="Nhập số điện thoại"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[
                    { required: true, message: 'Vui lòng nhập địa chỉ' }
                  ]}
                >
                  <Input 
                    prefix={<EnvironmentOutlined />} 
                    placeholder="Nhập địa chỉ"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập lại mật khẩu"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản sử dụng')),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                  Điều khoản sử dụng
                </Link>
                {' '}và{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                  Chính sách bảo mật
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          

          <div className="text-center mt-6">
            <Text type="secondary">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
