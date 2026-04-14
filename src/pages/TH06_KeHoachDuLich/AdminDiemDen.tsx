import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export default function AdminDiemDen() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const data = localStorage.getItem('th06_destinations');
    if (data) {
      setDestinations(JSON.parse(data));
    }
  }, []);

  const saveToLocal = (data: any[]) => {
    setDestinations(data);
    localStorage.setItem('th06_destinations', JSON.stringify(data));
  };

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const newData = destinations.filter((item) => item.id !== id);
    saveToLocal(newData);
    message.success('Đã xóa điểm đến');
  };

  const onFinish = (values: any) => {
    let newData = [...destinations];
    if (editingId) {
      newData = newData.map((item) => (item.id === editingId ? { ...item, ...values } : item));
      message.success('Cập nhật thành công');
    } else {
      const newId = new Date().getTime();
      newData.push({ id: newId, ...values });
      message.success('Thêm mới thành công');
    }
    saveToLocal(newData);
    setIsModalOpen(false);
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
    { title: 'Loại hình', dataIndex: 'type', key: 'type' },
    { title: 'Giá (VNĐ)', dataIndex: 'price', key: 'price', render: (val: number) => val.toLocaleString() },
    { title: 'Khoảng thời gian (h)', dataIndex: 'timeToVisit', key: 'timeToVisit' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Quản lý điểm đến</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm điểm đến
        </Button>
      </div>

      <Table dataSource={destinations} columns={columns} rowKey="id" />

      <Modal
        title={editingId ? 'Sửa điểm đến' : 'Thêm điểm đến'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="location" label="Địa điểm" style={{ flex: 1 }} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Loại hình" style={{ flex: 1 }} rules={[{ required: true }]}>
              <Select>
                <Option value="biển">Biển</Option>
                <Option value="núi">Núi</Option>
                <Option value="thành phố">Thành phố</Option>
              </Select>
            </Form.Item>
            <Form.Item name="rating" label="Rating" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="price" label="Giá cơ bản" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="foodCost" label="Phí ăn uống" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="stayCost" label="Phí lưu trú" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="travelCost" label="Phí di chuyển" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="timeToVisit" label="Thời gian tham quan (h)" style={{ flex: 1 }} rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="image" label="URL Hình ảnh" style={{ flex: 2 }} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
