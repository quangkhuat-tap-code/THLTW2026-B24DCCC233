import { Post, Tag, Author } from './types';

export const defaultAuthor: Author = {
  name: 'Nguyễn Văn A',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  bio: 'Một lập trình viên yêu thích việc chia sẻ kiến thức về lập trình, công nghệ và cuộc sống.',
  skills: ['ReactJS', 'TypeScript', 'NodeJS', 'Ant Design', 'UI/UX'],
  socials: {
    facebook: 'https://facebook.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  }
};

export const defaultTags: Tag[] = [
  { id: '1', name: 'React', count: 3 },
  { id: '2', name: 'TypeScript', count: 2 },
  { id: '3', name: 'Ant Design', count: 1 },
  { id: '4', name: 'JavaScript', count: 4 },
  { id: '5', name: 'Kiến thức', count: 2 },
];

export const defaultPosts: Post[] = [
  {
    id: '1',
    title: 'Giới thiệu về ReactJS cho người mới bắt đầu',
    slug: 'gioi-thieu-ve-reactjs',
    excerpt: 'Tìm hiểu về thư viện ReactJS, cấu trúc component và cách thức hoạt động của Virtual DOM.',
    content: '<h2>ReactJS là gì?</h2><p>React là một thư viện JavaScript mã nguồn mở dùng để xây dựng giao diện người dùng...</p><br/><p>Được tạo ra bởi Facebook, React đã trở thành một trong những công cụ phổ biến nhất hiện nay.</p>',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'JavaScript'],
    status: 'published',
    views: 1540,
    createdAt: '2023-10-01T10:00:00Z',
    author: defaultAuthor
  },
  {
    id: '2',
    title: 'Tại sao nên dùng TypeScript?',
    slug: 'tai-sao-nen-dung-typescript',
    excerpt: 'TypeScript đang dần thay thế JavaScript trong các dự án lớn. Bài viết này sẽ phân tích các ưu điểm của nó.',
    content: '<h2>TypeScript là gì?</h2><p>TypeScript là một siêu tập hợp của JavaScript, bổ sung thêm kiểu dữ liệu tĩnh (static typing).</p><p>Tại sao lại cần kiểu dữ liệu? Bởi vì có nó thì code sẽ an toàn và dễ bảo trì hơn rất nhiều.</p>',
    coverImage: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['TypeScript', 'JavaScript', 'Kiến thức'],
    status: 'published',
    views: 842,
    createdAt: '2023-10-05T08:30:00Z',
    author: defaultAuthor
  },
  {
    id: '3',
    title: 'Phát triển UI nhanh chóng với Ant Design',
    slug: 'thu-vien-ant-design',
    excerpt: 'Hướng dẫn sử dụng các component của Ant Design để xây dựng giao diện Dashboard chuyên nghiệp.',
    content: '<h2>Ant Design</h2><p>Đây là một hệ thống thiết kế giao diện dành cho các ứng dụng doanh nghiệp.</p><p>Sở hữu kho component đồ sộ, Ant Design giúp các lập trình viên tiết kiệm được rất nhiều thời gian.</p>',
    coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Ant Design', 'UI/UX'],
    status: 'published',
    views: 520,
    createdAt: '2023-10-10T15:20:00Z',
    author: defaultAuthor
  },
  {
    id: '4',
    title: 'Bài viết nháp chưa hoàn thiện',
    slug: 'bai-nhap-chua-hoan-thien',
    excerpt: 'Đây là bài viết đang được viết dở, chưa công khai cho người đọc.',
    content: '<p>Nội dung đang được cập nhật...</p>',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Kiến thức'],
    status: 'draft',
    views: 12,
    createdAt: '2023-10-15T09:00:00Z',
    author: defaultAuthor
  },
  {
    id: '5',
    title: 'Hiểu rõ về Event Loop trong JavaScript',
    slug: 'hieu-ro-event-loop-js',
    excerpt: 'JavaScript là ngôn ngữ đơn luồng nhưng lại có thể xử lý bất đồng bộ nhờ vào Event Loop. Cùng tìm hiểu nhé.',
    content: '<h2>Event Loop</h2><p>Event Loop là cốt lõi của việc thực thi bất đồng bộ trong JavaScript. Nó liên tục kiểm tra Call Stack và Callaue để đẩy hàm vào thực thi.</p>',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['JavaScript'],
    status: 'published',
    views: 3105,
    createdAt: '2023-11-01T14:00:00Z',
    author: defaultAuthor
  },
];

for (let i = 6; i <= 15; i++) {
  defaultPosts.push({
    id: i.toString(),
    title: `Bài viết mẫu để test phân trang - Số ${i}`,
    slug: `bai-viet-mau-phan-trang-${i}`,
    excerpt: `Đây là bài viết được tạo tự động nhằm mục đích test chức năng phân trang hiển thị 9 bài mỗi trang. Bài số ${i}.`,
    content: `<p>Nội dung chi tiết cho bài viết mẫu số ${i}</p>`,
    coverImage: `https://picsum.photos/seed/${i}/800/400`,
    tags: i % 2 === 0 ? ['React', 'TypeScript'] : ['JavaScript', 'Kiến thức'],
    status: 'published',
    views: Math.floor(Math.random() * 1000),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    author: defaultAuthor
  });
}

export const getLocalData = <T>(key: string, defaultData: T): T => {
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

export const setLocalData = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};
