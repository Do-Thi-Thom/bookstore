import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Checkbox
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Lấy redirect URL từ query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const result = await login(values.username, values.password);

      if (result.success) {
        toast.success('Đăng nhập thành công!');
        navigate(redirectTo);
      } else {
        toast.error(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    message.info('Tính năng đăng nhập Google đang phát triển');
  };

  const handleFacebookLogin = () => {
    message.info('Tính năng đăng nhập Facebook đang phát triển');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-lg" style={{ marginLeft: '400px', marginRight: '400px' }}>
          <div className="text-center mb-6">
            <Title level={2} className="mb-2">Đăng nhập</Title>
            <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              remember: true
            }}
          >
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nhập tên đăng nhập"
                size="large"
              />
            </Form.Item>

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

            <Form.Item>
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                  Quên mật khẩu?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          

          <div className="text-center mt-6">
            <Text type="secondary">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Đăng ký ngay
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
