import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterRequest } from '../types';
import { registerAdmin } from '../services/auth';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);

    try {
      await registerAdmin(values);

      messageApi.success('Đăng ký thành công! Hãy đăng nhập.');

      setTimeout(() => {
        
        return navigate('/login');
      }, 700);
    } catch (error: any) {
      messageApi.error(error?.message || 'Có lỗi xảy ra khi đăng ký!');

      return;
    } finally {
      setLoading(false);

      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      {contextHolder}
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <Title level={2} className="text-gray-800 mb-2">
            Đăng ký
          </Title>
          <Text className="text-gray-600">
            Tạo tài khoản mới cho hệ thống quản lý sách
          </Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { max: 100, message: 'Họ và tên không được quá 100 ký tự!' },
            ]}
          >
            <Input
              placeholder="Nhập họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              placeholder="Nhập email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^\+?\d{9,15}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ!' },
              { max: 255, message: 'Địa chỉ không được quá 255 ký tự!' },
            ]}
          >
            <Input
              placeholder="Nhập địa chỉ"
            />
          </Form.Item>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' },
              { max: 20, message: 'Tên đăng nhập không được quá 20 ký tự!' },
              { 
                pattern: /^[a-zA-Z0-9_]+$/, 
                message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!' 
              },
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
              { max: 50, message: 'Mật khẩu không được quá 50 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white border-0"
              ghost={false}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Text className="text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Đăng nhập ngay
            </Link>
          </Text>
        </div>

      </Card>
    </div>
  );
};

export default Register;
