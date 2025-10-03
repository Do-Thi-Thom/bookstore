import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Select,
  Tag,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { Book, Category } from '../types';
import { getBooks, createBook, updateBook, deleteBook } from '../services/books';
import { getAllCategories } from '../services/categories';
import ConfirmModal from '../components/ConfirmModal';

const { TextArea } = Input;
const { Option } = Select;

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [uploadedFileList, setUploadedFileList] = useState<any[]>([]);

  // Pagination state
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Statistics state
  const [lowStockBooks, setLowStockBooks] = useState<number>(0);
  const [totalInventoryValue, setTotalInventoryValue] = useState<number>(0);

  // Delete confirmation modal state
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  // Image preview modal state
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Load books with pagination
  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBooks(pageIndex, pageSize);
      
      setBooks(data.items);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
      
      // Update statistics from API
      setLowStockBooks(data.lowStockBooks);
      setTotalInventoryValue(data.totalInventoryValue);
    } catch (error: any) {
      messageApi.error(error?.message || 'Không thể tải danh sách sách');
    } finally {
      setLoading(false);
    }
  }, [messageApi, pageIndex, pageSize]);

  // Load categories for dropdown
  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error: any) {
      messageApi.error(error?.message || 'Không thể tải danh sách danh mục');
    } finally {
      setCategoriesLoading(false);
    }
  }, [messageApi]);

  // Load data on mount
  useEffect(() => {
    loadBooks();
    loadCategories();
  }, [loadBooks, loadCategories]);

  // Load books when pageIndex changes
  useEffect(() => {
    loadBooks();
  }, [pageIndex, pageSize, loadBooks]);

  // Cleanup object URLs when component unmounts or fileList changes
  useEffect(() => {
    return () => {
      uploadedFileList.forEach(file => {
        if (file.url && file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [uploadedFileList]);

  const handleAdd = () => {
    setEditingBook(null);
    setUploadedFileList([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Book) => {
    setEditingBook(record);
    // Set fileList for existing image
    if (record.coverImage) {
      setUploadedFileList([
        {
          uid: '-1',
          name: 'cover-image.jpg',
          status: 'done',
          url: record.coverImage,
        },
      ]);
    } else {
      setUploadedFileList([]);
    }
    form.setFieldsValue({
      ...record,
      coverImageFile: undefined, // Reset file input
    });
    setIsModalVisible(true);
  };

  const handleDelete = (record: Book) => {
    setDeletingBook(record);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBook) return;

    try {
      await deleteBook(deletingBook.id);
             messageApi.success('Xóa sách thành công');
      // Reload books from first page
      setPageIndex(0);
      setPageSize(10);
      // Force reload list immediately
      try {
        setLoading(true);
        const data = await getBooks(0, pageSize);
        setBooks(data.items);
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);
        setLowStockBooks(data.lowStockBooks);
        setTotalInventoryValue(data.totalInventoryValue);
      } catch (err: any) {
        messageApi.error(err?.message || 'Không thể tải lại danh sách sách');
      } finally {
        setLoading(false);
      }
    } catch (error: any) {
      messageApi.error(error?.message || 'Xóa sách thất bại');
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingBook(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingBook(null);
  };

  const handleImagePreview = (image: string) => {
    setPreviewImage(image);
    setIsImagePreviewVisible(true);
  };

  const handleImagePreviewCancel = () => {
    setIsImagePreviewVisible(false);
    setPreviewImage('');
  };

    const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Get file from form
      const coverImageFile = form.getFieldValue('coverImageFile');
      
      if (editingBook) {
        // If no new image is selected, don't send coverImage field
        const updateData = { ...values };
        if (coverImageFile) {
          updateData.coverImage = coverImageFile;
        }
        
        await updateBook(editingBook.id, updateData);
        messageApi.success('Cập nhật sách thành công');
      } else {
        await createBook({
          ...values,
          coverImage: coverImageFile,
        });
        messageApi.success('Thêm sách thành công');
      }
      
      setIsModalVisible(false);
      setUploadedFileList([]);
      form.resetFields();
      
      // Reload books from first page
      setPageIndex(0);
      setPageSize(10);
      
      // Force reload books immediately
      try {
        setLoading(true);
        const data = await getBooks(0, pageSize);
        setBooks(data.items);
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);
        setLowStockBooks(data.lowStockBooks);
        setTotalInventoryValue(data.totalInventoryValue);
      } catch (error: any) {
        messageApi.error(error?.message || 'Không thể tải lại danh sách sách');
      } finally {
        setLoading(false);
      }
    } catch (error: any) {
      messageApi.error((error as any)?.message || 'Có lỗi xảy ra');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setUploadedFileList([]);
    form.resetFields();
  };

  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return 'Unknown';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const filteredBooks = books.filter(book =>
    (book.title || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (book.author || '').toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
         {
       title: 'Ảnh bìa',
       dataIndex: 'coverImage',
       key: 'coverImage',
       width: 80,
       render: (image: string) => (
         image ? (
           <img 
             src={image} 
             alt="Cover" 
             className="w-12 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
             onClick={() => handleImagePreview(image)}
             title="Click để xem chi tiết"
           />
         ) : (
           <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
             No Image
           </div>
         )
       ),
     },
         {
       title: 'Tên sách',
       dataIndex: 'title',
       key: 'title',
       sorter: (a: Book, b: Book) => (a.title || '').localeCompare(b.title || ''),
     },
         {
       title: 'Tác giả',
       dataIndex: 'author',
       key: 'author',
       sorter: (a: Book, b: Book) => (a.author || '').localeCompare(b.author || ''),
     },
         {
       title: 'Danh mục',
       dataIndex: 'categoryId',
       key: 'categoryId',
       render: (categoryId: string) => (
         <Tag color="blue">{getCategoryName(categoryId || '')}</Tag>
       ),
     },
         {
       title: 'Giá (₫)',
       dataIndex: 'price',
       key: 'price',
       sorter: (a: Book, b: Book) => (a.price || 0) - (b.price || 0),
       render: (price: number) => (
         <span className="font-semibold text-green-600">
           {(price || 0).toLocaleString('vi-VN')}
         </span>
       ),
     },
         {
       title: 'Số lượng tồn',
       dataIndex: 'stockQuantity',
       key: 'stockQuantity',
       sorter: (a: Book, b: Book) => (a.stockQuantity || 0) - (b.stockQuantity || 0),
       render: (quantity: number) => (
         <Tag color={(quantity || 0) <= 10 ? 'red' : (quantity || 0) <= 20 ? 'orange' : 'green'}>
           {quantity || 0}
         </Tag>
       ),
     },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Book) => (
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

  const totalBooks = totalItems;

  return (
    <div className="space-y-6">
      {contextHolder}
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sách</h1>
          <p className="text-gray-600">Thêm, sửa, xóa và quản lý thông tin sách</p>
        </div>
        
        <Button
          type="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAdd}
        >
          Thêm sách mới
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title="Tổng số sách"
              value={totalBooks}
              prefix={<BookOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
                 <Col xs={24} sm={8}>
           <Card className="shadow-sm">
             <Statistic
               title="Sách sắp hết hàng (số lượng < 5)"
               value={lowStockBooks}
               valueStyle={{ color: '#cf1322' }}
             />
           </Card>
         </Col>
         <Col xs={24} sm={8}>
           <Card className="shadow-sm">
             <Statistic
               title="Tổng giá trị kho"
               value={totalInventoryValue}
               suffix="₫"
               valueStyle={{ color: '#722ed1' }}
             />
           </Card>
         </Col>
      </Row>

      {/* Search and Table */}
      <Card className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="space-y-4">
                     <Table
             columns={columns}
             dataSource={filteredBooks}
             rowKey="id"
             loading={loading}
             pagination={{
               current: pageIndex + 1,
               pageSize: pageSize,
               total: totalItems,
               showSizeChanger: true,
               showQuickJumper: true,
               showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sách`,
               onChange: (page, size) => {
                 setPageIndex(page - 1);
                 setPageSize(size);
               },
             }}
           />
           
           {books.length === 0 && !loading && (
             <div className="text-center py-8 text-gray-500">
               Không có sách nào
             </div>
           )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingBook ? 'Sửa sách' : 'Thêm sách mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={editingBook ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 text-white border-0' }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ stockQuantity: 1, price: 0 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tên sách"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên sách!' },
                  { min: 1, message: 'Tên sách không được để trống!' }
                ]}
              >
                <Input placeholder="Nhập tên sách" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="author"
                label="Tác giả"
                rules={[
                  { required: true, message: 'Vui lòng nhập tác giả!' },
                  { min: 1, message: 'Tác giả không được để trống!' }
                ]}
              >
                <Input placeholder="Nhập tác giả" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá (₫)"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá!' },
                  { type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' }
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá"
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="stockQuantity"
                label="Số lượng tồn"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng!' },
                  { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
                ]}
              >
                <InputNumber
                  placeholder="Nhập số lượng"
                  min={1}
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[
              { required: true, message: 'Vui lòng chọn danh mục!' }
            ]}
          >
            <Select 
              placeholder="Chọn danh mục"
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
              loading={categoriesLoading}
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

                     <Form.Item
             name="coverImageFile"
             label="Ảnh bìa"
           >
                           <Upload
                name="coverImageFile"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={true}
                beforeUpload={() => false}
                fileList={uploadedFileList}
                onPreview={(file) => {
                  if (file.url) {
                    handleImagePreview(file.url);
                  }
                }}
               onChange={(info) => {
                 // Create preview URL for new files
                 const fileList = info.fileList.map(file => {
                   if (file.originFileObj) {
                     return {
                       ...file,
                       url: URL.createObjectURL(file.originFileObj),
                     };
                   }
                   return file;
                 });
                 
                 setUploadedFileList(fileList);
                 if (info.fileList.length > 0) {
                   form.setFieldsValue({ coverImageFile: info.fileList[0].originFileObj });
                 } else {
                   form.setFieldsValue({ coverImageFile: undefined });
                 }
               }}
               onRemove={(file) => {
                 // Cleanup blob URL if exists
                 if (file.url && file.url.startsWith('blob:')) {
                   URL.revokeObjectURL(file.url);
                 }
                 setUploadedFileList([]);
                 form.setFieldsValue({ coverImageFile: undefined });
                 // Clear the fileList by updating editingBook
                 if (editingBook) {
                   setEditingBook({
                     ...editingBook,
                     coverImage: '',
                   });
                 }
               }}
             >
               <div>
                 <UploadOutlined />
                 <div style={{ marginTop: 8 }}>Tải ảnh</div>
               </div>
             </Upload>
           </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả sách..."
            />
          </Form.Item>
        </Form>
      </Modal>

             {/* Delete Confirmation Modal */}
       <ConfirmModal
         open={isDeleteModalVisible}
         title="Xóa sách"
                  message={
           <div>
             <p>Bạn có chắc chắn muốn xóa sách <strong>"{deletingBook?.title || 'Unknown'}"</strong>?</p>
             <p className="text-red-600 mt-2">Hành động này không thể hoàn tác.</p>
           </div>
         }
         onConfirm={handleConfirmDelete}
         onCancel={handleCancelDelete}
         confirmText="Xóa"
         cancelText="Hủy"
         type="danger"
       />

               {/* Image Preview Modal */}
        <Modal
          open={isImagePreviewVisible}
          onCancel={handleImagePreviewCancel}
          footer={null}
          width="auto"
          centered
          className="image-preview-modal"
          style={{ zIndex: 1001 }}
          maskStyle={{ zIndex: 1000 }}
        >
          <div className="text-center">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[80vh] object-contain"
              style={{ maxWidth: '90vw' }}
            />
          </div>
        </Modal>
    </div>
  );
};

export default Books;
