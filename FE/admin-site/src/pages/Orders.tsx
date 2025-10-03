import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Tag,
  Select,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
  List,
  Avatar,
  Divider,
  Input,
} from 'antd';
import {
  EyeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { OrderItem } from '../types';
import type { Order } from '../services/orders';
import { getOrders, updateOrderStatus } from '../services/orders';

const { Option } = Select;

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [processingOrders, setProcessingOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [messageApi, contextHolder] = message.useMessage();

  // Load orders on component mount and when pagination changes
  const loadOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrders(pageIndex, pageSize);
      setOrders(data.items);
      setTotalItems(data.totalItems);
      setPageIndex(data.pageIndex ?? pageIndex);
      setPageSize(data.pageSize ?? pageSize);
      setPendingOrders(data.pendingOrders ?? 0);
      setProcessingOrders(data.processingOrders ?? 0);
      setTotalRevenue(data.totalRevenue ?? 0);
    } catch (error: any) {
      messageApi.error(error?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [messageApi, pageIndex, pageSize]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'orange',
      processing: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status];
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'Đang xử lý',
      processing: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Hủy',
    };
    return texts[status];
  };

  const handleViewDetail = (record: Order) => {
    setSelectedOrder(record);
    setIsDetailModalVisible(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      messageApi.success('Cập nhật trạng thái thành công');
      await loadOrders(); // Reload the list
    } catch (error: any) {
      messageApi.error(error?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customerPhone.includes(searchText) ||
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 120,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: Order) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'customerAddress',
      key: 'customerAddress',
      ellipsis: true,
      render: (address: string) => (
        <span className="text-gray-600" title={address}>
          {address}
        </span>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
      render: (amount: number) => (
        <span className="font-semibold text-green-600">
          {amount.toLocaleString('vi-VN')} ₫
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status'], record: Order) => {
        const isDisabled = status === 'completed' || status === 'cancelled';
        
        return (
          <Select
            value={status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.id, value as Order['status'])}
            disabled={isDisabled}
          >
            <Option value="pending" disabled={isDisabled}>Đang xử lý</Option>
            <Option value="processing" disabled={isDisabled}>Đang giao</Option>
            <Option value="completed" disabled={isDisabled}>Hoàn thành</Option>
            <Option value="cancelled" disabled={isDisabled}>Hủy</Option>
          </Select>
        );
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div>
          <div>{new Date(date).toLocaleDateString('vi-VN')}</div>
          <div className="text-sm text-gray-500">
            {new Date(date).toLocaleTimeString('vi-VN')}
          </div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: Order) => (
        <Button
          type="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return (
    <div className="space-y-6">
      {contextHolder}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Xem và quản lý tất cả đơn hàng</p>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Tổng đơn hàng"
              value={orders.length}
              prefix={<ShoppingCartOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Đang xử lý"
              value={pendingOrders}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Đang giao"
              value={processingOrders}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm">
            <Statistic
              title="Doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined className="text-green-500" />}
              suffix="₫"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card className="shadow-sm">
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Tìm kiếm theo tên khách hàng, số điện thoại hoặc mã đơn hàng..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
          
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="all">Tất cả</Option>
                      <Option value="pending">Đang xử lý</Option>
          <Option value="processing">Đang giao</Option>
          <Option value="completed">Hoàn thành</Option>
          <Option value="cancelled">Hủy</Option>
          </Select>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pageIndex + 1, // UI is 1-based
            pageSize: pageSize,
            total: totalItems,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setPageIndex((page || 1) - 1); // convert to 0-based for backend
              setPageSize(size || 10);
            },
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
        />
      </Card>

      {/* Order Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <Descriptions title="Thông tin đơn hàng" bordered>
              <Descriptions.Item label="Mã đơn hàng" span={3}>
                {selectedOrder.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng" span={3}>
                {selectedOrder.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại" span={3}>
                {selectedOrder.customerPhone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={3}>
                {selectedOrder.customerAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <span className="font-semibold text-lg text-green-600">
                  {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt" span={3}>
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Chi tiết sản phẩm</h3>
              <List
                dataSource={selectedOrder.items}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        item.bookCoverImage ? (
                          <img 
                            src={item.bookCoverImage} 
                            alt={item.bookTitle}
                            className="w-12 h-16 object-cover rounded"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Avatar 
                            icon={<BookOutlined />} 
                            className="bg-blue-500"
                          />
                        )
                      }
                      title={item.bookTitle}
                      description={`Số lượng: ${item.quantity}`}
                    />
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {item.price.toLocaleString('vi-VN')} ₫ x {item.quantity}
                      </div>
                      <div className="font-semibold text-green-600">
                        {item.subtotal.toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <Divider />

            {/* Total */}
            <div className="text-right">
              <div className="text-lg">
                <span className="font-semibold">Tổng cộng: </span>
                <span className="font-bold text-xl text-green-600">
                  {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
