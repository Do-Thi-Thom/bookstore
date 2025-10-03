import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, message, Row, Col, Descriptions, Tag } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [profile, setProfile] = useState<{
    fullName: string;
    email: string;
    username: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const raw = localStorage.getItem('auth_profile');
      if (raw) {
        const profileData = JSON.parse(raw);
        setProfile(profileData);
        form.setFieldsValue(profileData);
      }
    } catch (error) {
      message.error('Không thể tải thông tin hồ sơ');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(profile);
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Implement API call to update profile
      // For now, just update local storage
      const updatedProfile = { ...profile, ...values };
      localStorage.setItem('auth_profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setIsEditing(false);
      message.success('Cập nhật hồ sơ thành công!');
    } catch (error: any) {
      message.error(error.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'USER':
        return 'Khách hàng';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'red';
      case 'USER':
        return 'blue';
      default:
        return 'default';
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Đang tải thông tin hồ sơ...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hồ sơ cá nhân</h1>
        <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} lg={16}>
          <Card 
            title="Thông tin hồ sơ" 
            className="shadow-sm"
            extra={
              !isEditing ? (
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button 
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={() => form.submit()}
                  >
                    Lưu
                  </Button>
                </div>
              )
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              disabled={!isEditing}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      { required: true, message: 'Vui lòng nhập họ và tên' },
                      { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tên đăng nhập"
                    name="username"
                  >
                    <Input placeholder="Tên đăng nhập" disabled />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Vai trò"
                    name="role"
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Profile Summary */}
        <Col xs={24} lg={8}>
          <Card title="Tóm tắt" className="shadow-sm">
            <div className="text-center mb-6">
              <Avatar 
                size={80}
                icon={<UserOutlined />} 
                className="bg-blue-500 mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {profile.fullName}
              </h3>
              <Tag color={getRoleColor(profile.role)} className="mb-4">
                {getRoleText(profile.role)}
              </Tag>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Tên đăng nhập">
                <span className="font-mono text-blue-600">{profile.username}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <span className="text-blue-600">{profile.email}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color={getRoleColor(profile.role)}>
                  {getRoleText(profile.role)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;

