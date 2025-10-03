import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Tag,
  message,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import type { Category } from '../types';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../services/categories';
import ConfirmModal from '../components/ConfirmModal';

const { TextArea } = Input;

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const [pageIndex, setPageIndex] = useState<number>(0); // 0-based for backend
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [emptyCategoryCount, setEmptyCategoryCount] = useState<number>(0);
  const [notEmptyCategoryCount, setNotEmptyCategoryCount] = useState<number>(0);

  // Delete confirmation modal state
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Load categories on component mount and when pagination changes
  const loadCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCategories(pageIndex, pageSize);
      setCategories(data.items);
      setTotalItems(data.totalItems);
      setEmptyCategoryCount(data.emptyCategory ?? 0);
      setNotEmptyCategoryCount(data.notEmptyCategory ?? 0);
      // Sync effective page/pageSize from API (already 0-based)
      setPageIndex(data.pageIndex ?? pageIndex);
      setPageSize(data.pageSize ?? pageSize);
    } catch (error: any) {
      messageApi.error(error?.message || 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  }, [messageApi, pageIndex, pageSize]);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name, description: record.description });
    setIsModalVisible(true);
  };

  const handleDelete = (record: Category) => {
    setDeletingCategory(record);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id);
      messageApi.success('Xóa danh mục thành công');
      await loadCategories(); // Reload the list
    } catch (error: any) {
      messageApi.error(error?.message || 'Xóa danh mục thất bại');
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingCategory(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingCategory(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: values.name,
          description: values.description,
        });
        messageApi.success('Cập nhật danh mục thành công');
        await loadCategories();
      } else {
        await createCategory({
          name: values.name,
          description: values.description,
        });
        messageApi.success('Thêm danh mục thành công');
        
        // Reload current page to reflect server state
        await loadCategories();
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      messageApi.error((error as any)?.message || 'Có lỗi xảy ra');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <span className="font-medium text-gray-800">{name}</span>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <span className="text-gray-600">
          {description || 'Không có mô tả'}
        </span>
      ),
    },
         {
      title: 'Số sách',
      dataIndex: 'bookTotal',
      key: 'bookTotal',
      render: (_: number, record: Category) => (
        <Tag color={(((record as any).bookTotal ?? (record as any).bookCount ?? 0) > 0) ? 'blue' : 'default'}>{(record as any).bookTotal ?? (record as any).bookCount ?? 0}</Tag>
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
      width: 150,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const totalCategories = totalItems;

  return (
    <div className="space-y-6">
      {contextHolder}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
          <p className="text-gray-600">Thêm, sửa, xóa và quản lý danh mục sách</p>
        </div>
        
        <Button
          type="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAdd}
        >
          Thêm danh mục mới
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Tổng số danh mục"
              value={totalCategories}
              prefix={<FolderOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Danh mục có sách"
              value={notEmptyCategoryCount}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Danh mục trống"
              value={emptyCategoryCount}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Table */}
      <Card className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm theo tên danh mục hoặc mô tả..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>
        
                 <Table
          columns={columns}
          dataSource={filteredCategories}
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
              `${range[0]}-${range[1]} của ${total} danh mục`,
          }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={500}
        okText={editingCategory ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 text-white border-0' }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục!' },
              { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 200, message: 'Mô tả không được quá 200 ký tự!' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả danh mục (không bắt buộc)..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={isDeleteModalVisible}
        title="Xóa danh mục"
        message={
          <div>
            <p>Bạn có chắc chắn muốn xóa danh mục <strong>"{deletingCategory?.name}"</strong>?</p>
            <p className="text-red-600 mt-2">Hành động này không thể hoàn tác.</p>
          </div>
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default Categories;
