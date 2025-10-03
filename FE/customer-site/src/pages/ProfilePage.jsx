import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Avatar, 
  Divider,
  message,
  Space,
  Spin
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { apiClient } from '../services/apiClient';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetchingProfile(true);
    try {
      const response = await apiClient.get('/customer/profile');
      
      if (response && response.success) {
        const profile = response.data;
        setProfileData(profile);
        
        form.setFieldsValue({
          fullName: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          username: profile.username || ''
        });
      } else {
        toast.error(response?.message || 'Không tải được thông tin hồ sơ');
      }
    } catch (error) {
      toast.error('Có lỗi khi tải thông tin hồ sơ');
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const response = await apiClient.put('/customer/profile', {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address
      });

      if (response && response.success) {
        // Update local user data
        const updatedUser = { ...user, ...values };
        updateProfile(updatedUser);
        
        // Refresh profile data
        await fetchProfile();
        
        toast.success('Cập nhật thông tin thành công');
        setIsEditing(false);
      } else {
        toast.error(response?.message || 'Có lỗi khi cập nhật thông tin');
      }
    } catch (error) {
      toast.error('Có lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      form.setFieldsValue({
        fullName: profileData.fullName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        username: profileData.username || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (fetchingProfile) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" />
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
            <UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            Hồ sơ cá nhân
          </Title>
        </div>

        <Row gutter={[24, 24]}>
          {/* Profile Info Card */}
          <Col xs={24} md={16}>
            <Card>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <Title level={3} style={{ margin: 0 }}>
                  Thông tin cá nhân
                </Title>
                {!isEditing && (
                  <Button 
                    type="primary" 
                    onClick={() => setIsEditing(true)}
                    icon={<UserOutlined />}
                  >
                    Chỉnh sửa
                  </Button>
                )}
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                disabled={!isEditing}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Tên đăng nhập"
                      name="username"
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Tên đăng nhập"
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="fullName"
                      rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên' }
                      ]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Họ và tên"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Email"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                    >
                      <Input 
                        prefix={<PhoneOutlined />} 
                        placeholder="Số điện thoại"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Địa chỉ"
                      name="address"
                      rules={[
                        { required: true, message: 'Vui lòng nhập địa chỉ' }
                      ]}
                    >
                      <Input.TextArea 
                        rows={3}
                        placeholder="Địa chỉ chi tiết"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {isEditing && (
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    justifyContent: 'flex-end',
                    marginTop: '24px'
                  }}>
                    <Button onClick={handleCancel}>
                      Hủy
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </Form>
            </Card>
          </Col>

          {/* Profile Summary Card */}
          <Col xs={24} md={8}>
            <Card>
                             <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                 <Avatar 
                   size={80} 
                   icon={<UserOutlined />} 
                   style={{ marginBottom: '16px' }}
                 />
                 <Title level={4} style={{ margin: '8px 0' }}>
                   {profileData?.fullName || profileData?.username}
                 </Title>
                 <Text type="secondary">
                   Thành viên từ {profileData?.memberSince ? new Date(profileData.memberSince).toLocaleDateString('vi-VN') : 'N/A'}
                 </Text>
               </div>

              <Divider />

                             <div style={{ marginBottom: '16px' }}>
                 <Text strong>Thông tin tài khoản:</Text>
                 <div style={{ marginTop: '8px' }}>
                   <div style={{ marginBottom: '4px' }}>
                     <Text type="secondary">Tên đăng nhập:</Text>
                     <Text style={{ marginLeft: '8px' }}>{profileData?.username}</Text>
                   </div>
                   <div style={{ marginBottom: '4px' }}>
                     <Text type="secondary">Email:</Text>
                     <Text style={{ marginLeft: '8px' }}>{profileData?.email}</Text>
                   </div>
                   <div style={{ marginBottom: '4px' }}>
                     <Text type="secondary">Số điện thoại:</Text>
                     <Text style={{ marginLeft: '8px' }}>{profileData?.phone || 'Chưa cập nhật'}</Text>
                   </div>
                   <div style={{ marginBottom: '4px' }}>
                     <Text type="secondary">Trạng thái:</Text>
                     <Text style={{ marginLeft: '8px', color: profileData?.enabled ? '#52c41a' : '#f5222d' }}>
                       {profileData?.enabled ? 'Hoạt động' : 'Bị khóa'}
                     </Text>
                   </div>
                 </div>
               </div>

              <Divider />

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="default" 
                  block 
                  onClick={() => navigate('/orders')}
                >
                  Xem lịch sử đơn hàng
                </Button>
                <Button 
                  type="default" 
                  block 
                  onClick={() => navigate('/cart')}
                >
                  Xem giỏ hàng
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProfilePage;
