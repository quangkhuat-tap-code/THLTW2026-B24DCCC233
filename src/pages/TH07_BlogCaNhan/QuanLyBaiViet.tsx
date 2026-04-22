import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Tag, Modal, Form, Select, Typography, Popconfirm, message, Tooltip, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Post, Tag as TagType } from './types';
import { defaultPosts, defaultTags, defaultAuthor, getLocalData, setLocalData } from './mockData';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function QuanLyBaiViet() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedPosts = getLocalData<Post[]>('th07_posts', defaultPosts);
    const savedTags = getLocalData<TagType[]>('th07_tags', defaultTags);
    // Sort new -> old
    setPosts(savedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setTags(savedTags);
  };

  const showModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      form.setFieldsValue({
        ...post
      });
    } else {
      setEditingPost(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = (values: any) => {
    let updatedPosts = [...posts];

    if (editingPost) {
      // Cập nhật
      updatedPosts = updatedPosts.map(p => 
        p.id === editingPost.id ? { ...p, ...values } : p
      );
      message.success('Cập nhật bài viết thành công');
    } else {
      // Thêm mới
      const newPost: Post = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        views: 0,
        author: defaultAuthor,
        ...values
      };
      updatedPosts = [newPost, ...updatedPosts];
      message.success('Thêm bài viết mới thành công');
    }

    setPosts(updatedPosts);
    setLocalData('th07_posts', updatedPosts);
    
    // Cập nhật count cho Tag (Giả lập đơn giản: xóa count hết rồi đếm lại)
    const newTags = tags.map(tag => {
      const count = updatedPosts.filter(p => p.tags.includes(tag.name)).length;
      return { ...tag, count };
    });
    setLocalData('th07_tags', newTags);

    setIsModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const updatedPosts = posts.filter(p => p.id !== id);
    setPosts(updatedPosts);
    setLocalData('th07_posts', updatedPosts);
    message.success('Đã xóa bài viết');

    // Update tags count again
    const newTags = tags.map(tag => {
      const count = updatedPosts.filter(p => p.tags.includes(tag.name)).length;
      return { ...tag, count };
    });
    setLocalData('th07_tags', newTags);
  };

  const filteredPosts = posts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text: string, record: Post) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#888' }}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? 'Đã đăng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (postTags: string[]) => (
        <Space wrap>
          {postTags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a: Post, b: Post) => a.views - b.views,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a: Post, b: Post) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Post) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showModal(record)} size="small" />
          </Tooltip>
          
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
               <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Quản lý bài viết</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm bài viết mới
        </Button>
      </Row>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tiêu đề..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 150 }}>
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="published">Đã đăng</Option>
          <Option value="draft">Nháp</Option>
        </Select>
      </Space>

      <Table 
        columns={columns} 
        dataSource={filteredPosts} 
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingPost ? "Sửa bài viết" : "Thêm bài viết mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="slug" label="URL Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
                <Input placeholder="nguoi-dung-nhap-slug" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="coverImage" label="Ảnh đại diện (URL)" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}>
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item name="excerpt" label="Tóm tắt" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="content" label="Nội dung (HTML/Markdown)" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <TextArea rows={8} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tags" label="Thẻ" rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 thẻ' }]}>
                <Select mode="multiple" placeholder="Chọn thẻ">
                  {tags.map(tag => (
                    <Option key={tag.name} value={tag.name}>{tag.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select>
                  <Option value="draft">Nháp</Option>
                  <Option value="published">Đã đăng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
