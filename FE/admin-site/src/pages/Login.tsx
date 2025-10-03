import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginRequest } from '../types';
import { login as loginApi } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { login } = useAuth();

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    
    try {
      const auth = await loginApi(values);

      // Lưu thêm toàn bộ profile để dùng sau
      login(
        auth.user,
        auth.token,
        {
          username: auth.user.username,
          token: auth.token,
          fullName: auth.profile?.fullName,
          email: auth.profile?.email,
          role: auth.profile?.role,
        }
      );

      messageApi.success('Đăng nhập thành công!');

      setTimeout(() => {
        
        return navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      messageApi.error(error?.message || 'Có lỗi xảy ra khi đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {contextHolder}
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Đăng nhập
          </Title>
          <Text className="text-gray-600">
            Đăng nhập vào hệ thống quản lý sách
          </Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text className="text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Đăng ký ngay
            </Link>
          </Text>
        </div>

        
      </Card>
    </div>
  );
};

export default Login;
