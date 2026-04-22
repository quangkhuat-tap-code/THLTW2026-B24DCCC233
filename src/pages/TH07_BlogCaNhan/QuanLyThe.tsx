import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Typography, Modal, Form, Popconfirm, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag as TagType, Post } from './types';
import { defaultTags, getLocalData, setLocalData } from './mockData';

const { Title } = Typography;

export default function QuanLyThe() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Luôn luôn tính toán lại số lượng bài viết đang dùng thẻ này từ mockData
    const savedTags = getLocalData<TagType[]>('th07_tags', defaultTags);
    const savedPosts = getLocalData<Post[]>('th07_posts', []);
    
    const recalculatedTags = savedTags.map(tag => {
        const count = savedPosts.filter(p => p.tags.includes(tag.name)).length;
        return { ...tag, count };
    });
    
    setTags(recalculatedTags);
    setLocalData('th07_tags', recalculatedTags);
  };

  const showModal = (tag?: TagType) => {
    if (tag) {
      setEditingTag(tag);
      form.setFieldsValue({ name: tag.name });
    } else {
      setEditingTag(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = (values: any) => {
    let updatedTags = [...tags];

    if (editingTag) {
      // Cập nhật tên thẻ - Cần cẩn thận nếu user sửa tên thẻ đang được dùng
      const oldName = editingTag.name;
      const newName = values.name.trim();

      if (updatedTags.some(t => t.name.toLowerCase() === newName.toLowerCase() && t.id !== editingTag.id)) {
        message.error('Tên thẻ đã tồn tại!');
        return;
      }

      updatedTags = updatedTags.map(t => 
        t.id === editingTag.id ? { ...t, name: newName } : t
      );
      
      // Update in posts as well
      const savedPosts = getLocalData<Post[]>('th07_posts', []);
      const updatedPosts = savedPosts.map(p => {
          if (p.tags.includes(oldName)) {
              return {
                  ...p,
                  tags: p.tags.map(t => t === oldName ? newName : t)
              };
          }
          return p;
      });
      setLocalData('th07_posts', updatedPosts);
      
      message.success('Cập nhật thẻ thành công');
    } else {
      // Thêm mới
      const newName = values.name.trim();

      if (updatedTags.some(t => t.name.toLowerCase() === newName.toLowerCase())) {
        message.error('Tên thẻ đã tồn tại!');
        return;
      }

      const newTag: TagType = {
        id: Date.now().toString(),
        name: newName,
        count: 0
      };
      updatedTags = [...updatedTags, newTag];
      message.success('Thêm thẻ mới thành công');
    }

    setTags(updatedTags);
    setLocalData('th07_tags', updatedTags);
    setIsModalVisible(false);
  };

  const handleDelete = (tag: TagType) => {
    if (tag.count > 0) {
      message.error(`Không thể xóa thẻ "${tag.name}" vì đang có ${tag.count} bài viết sử dụng!`);
      return;
    }

    const updatedTags = tags.filter(t => t.id !== tag.id);
    setTags(updatedTags);
    setLocalData('th07_tags', updatedTags);
    message.success('Xóa thẻ thành công');
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số bài viết sử dụng',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: TagType, b: TagType) => a.count - b.count,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: TagType) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showModal(record)} size="small">
            Sửa
          </Button>
          
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thẻ này?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
            disabled={record.count > 0}
          >
            <Button danger icon={<DeleteOutlined />} size="small" disabled={record.count > 0}>
               Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh', maxWidth: 800, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Quản lý thẻ</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm thẻ mới
        </Button>
      </Row>

      <Table 
        columns={columns} 
        dataSource={tags} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTag ? "Sửa thẻ" : "Thêm thẻ mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item 
            name="name" 
            label="Tên thẻ" 
            rules={[
                { required: true, message: 'Vui lòng nhập tên thẻ' },
                { whitespace: true, message: 'Tên thẻ không được chứa khoảng trắng' }
            ]}
          >
            <Input placeholder="Ví dụ: React, TypeScript..." autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
