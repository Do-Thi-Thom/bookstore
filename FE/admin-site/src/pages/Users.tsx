import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Switch,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Modal,
  Descriptions,
  Avatar,
  Pagination,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { getUsers, toggleUserStatus, type User } from '../services/users';

const { Search } = Input;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [activeAccounts, setActiveAccounts] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers(pageIndex, pageSize);
      setUsers(response.items);
      setTotalItems(response.totalItems);
      setActiveAccounts(response.activeAccounts || 0);
      setAdminCount(response.adminCount || 0);
      setCustomerCount(response.customerCount || 0);
    } catch (error: any) {
      message.error(error.message || 'Lấy danh sách người dùng thất bại');
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleStatus = async (userId: string) => {
    try {
      const updatedUser = await toggleUserStatus(userId);
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      
      // Reload statistics
      const response = await getUsers(pageIndex, pageSize);
      setActiveAccounts(response.activeAccounts || 0);
      setAdminCount(response.adminCount || 0);
      setCustomerCount(response.customerCount || 0);
      
      message.success(
        updatedUser.enabled ? 'Mở khóa tài khoản thành công' : 'Khóa tài khoản thành công'
      );
    } catch (error: any) {
      message.error(error.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const handleViewDetail = (record: User) => {
    setSelectedUser(record);
    setIsDetailModalVisible(true);
  };

  const handlePageChange = (page: number, size?: number) => {
    setPageIndex(page - 1); // API uses 0-based indexing
    if (size) setPageSize(size);
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase()) ||
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Thông tin',
      key: 'info',
      render: (record: User) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            icon={<UserOutlined />} 
            className={record.role === 'ADMIN' ? 'bg-red-500' : 'bg-blue-500'}
          />
          <div>
            <div className="font-medium">{record.fullName}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <span className="font-mono text-blue-600">{username}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span className="text-blue-600">{email}</span>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: User) => (
        <div className="flex items-center space-x-2">
          <Switch
            checked={enabled}
            onChange={() => handleToggleStatus(record.id)}
            checkedChildren={<UnlockOutlined />}
            unCheckedChildren={<LockOutlined />}
          />
          <Tag color={enabled ? 'green' : 'red'}>
            {enabled ? 'Hoạt động' : 'Đã khóa'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-gray-500">
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: User) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const totalUsers = totalItems;
  const activeUsers = activeAccounts;
  const adminUsers = adminCount;
  const customerUsers = customerCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          <p className="text-gray-600">Xem và quản lý tài khoản người dùng</p>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Tổng người dùng"
              value={totalUsers}
              prefix={<TeamOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Tài khoản hoạt động"
              value={activeUsers}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Quản trị viên"
              value={adminUsers}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Khách hàng"
              value={customerUsers}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Table */}
      <Card className="shadow-sm">
        <div className="mb-4">
          <Search
            placeholder="Tìm kiếm theo tên, email, username hoặc số điện thoại..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
        
        <div className="mt-4 flex justify-end">
          <Pagination
            current={pageIndex + 1}
            pageSize={pageSize}
            total={totalItems}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} của ${total} người dùng`
            }
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      </Card>

      {/* User Detail Modal */}
      <Modal
        title="Chi tiết người dùng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="text-center">
              <Avatar 
                size={80}
                icon={<UserOutlined />} 
                className={selectedUser.role === 'ADMIN' ? 'bg-red-500' : 'bg-blue-500'}
              />
              <h2 className="text-xl font-bold mt-4">{selectedUser.fullName}</h2>
              <Tag color={selectedUser.role === 'ADMIN' ? 'red' : 'blue'} className="mt-2">
                {selectedUser.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
              </Tag>
            </div>

            <Descriptions title="Thông tin chi tiết" bordered>
              <Descriptions.Item label="Tên đăng nhập" span={3}>
                <span className="font-mono">{selectedUser.username}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedUser.enabled ? 'green' : 'red'}>
                  {selectedUser.enabled ? 'Hoạt động' : 'Đã khóa'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo" span={2}>
                {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối" span={3}>
                {new Date(selectedUser.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            {/* Quick Actions */}
            <div className="text-center">
              <Space>
                <Button
                  type={selectedUser.enabled ? 'default' : 'primary'}
                  icon={selectedUser.enabled ? <LockOutlined /> : <UnlockOutlined />}
                  onClick={async () => {
                    await handleToggleStatus(selectedUser.id);
                    setIsDetailModalVisible(false);
                  }}
                >
                  {selectedUser.enabled ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
