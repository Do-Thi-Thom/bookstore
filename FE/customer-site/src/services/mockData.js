// Mock data cho ứng dụng BookStore

export const categories = [
  { id: 1, name: 'Văn học', slug: 'van-hoc' },
  { id: 2, name: 'Kinh tế', slug: 'kinh-te' },
  { id: 3, name: 'Khoa học', slug: 'khoa-hoc' },
  { id: 4, name: 'Công nghệ', slug: 'cong-nghe' },
  { id: 5, name: 'Tâm lý', slug: 'tam-ly-ky-nang-song' },
  { id: 6, name: 'Thiếu nhi', slug: 'thieu-nhi' }
];

export const books = [
  {
    id: 1,
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    price: 89000,
    originalPrice: 120000,
    description: 'Cuốn sách kinh điển về nghệ thuật đối nhân xử thế.',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop',
    category: 'Tâm lý',
    categoryId: 5,
    stock: 50,
    rating: 4.8,
    reviews: 1250
  },
  {
    id: 2,
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    price: 75000,
    originalPrice: 95000,
    description: 'Câu chuyện về hành trình tìm kiếm kho báu.',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=500&fit=crop',
    category: 'Văn học',
    categoryId: 1,
    stock: 35,
    rating: 4.6,
    reviews: 890
  },
  {
    id: 3,
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    price: 120000,
    originalPrice: 150000,
    description: 'Cuốn sách về tư duy tài chính.',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=500&fit=crop',
    category: 'Kinh tế',
    categoryId: 2,
    stock: 25,
    rating: 4.5,
    reviews: 650
  }
];

export const orders = [
  {
    id: 1,
    userId: 1,
    items: [
      { 
        id: 1, 
        title: 'Đắc Nhân Tâm', 
        author: 'Dale Carnegie',
        quantity: 2, 
        price: 200000,
        bookCoverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop'
      },
      { 
        id: 3, 
        title: 'Rich Dad Poor Dad', 
        author: 'Robert T. Kiyosaki',
        quantity: 2, 
        price: 130000,
        bookCoverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=500&fit=crop'
      }
    ],
    total: 660000,
    status: 'processing',
    orderDate: '2025-08-27T23:34:00',
    deliveryDate: null,
    shippingAddress: 'CT8A, Đại Thanh, Thanh Trì, Hà Nội',
    paymentMethod: 'COD',
    recipientName: 'Nguyễn Văn Tùng',
    recipientPhone: '0966712135'
  },
  {
    id: 2,
    userId: 1,
    items: [
      { 
        id: 2, 
        title: 'Nhà Giả Kim', 
        author: 'Paulo Coelho',
        quantity: 1, 
        price: 75000,
        bookCoverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=500&fit=crop'
      }
    ],
    total: 75000,
    status: 'completed',
    orderDate: '2024-01-20',
    deliveryDate: '2024-01-23',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    paymentMethod: 'Bank Transfer',
    recipientName: 'Nguyễn Văn Tùng',
    recipientPhone: '0966712135'
  }
];

// Helper functions
export const getBooksByCategory = (categoryId) => {
  return books.filter(book => book.categoryId === categoryId);
};

export const searchBooks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return books.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery)
  );
};

export const getBookById = (id) => {
  return books.find(book => book.id === parseInt(id));
};

export const getCategoryById = (id) => {
  return categories.find(category => category.id === parseInt(id));
};
