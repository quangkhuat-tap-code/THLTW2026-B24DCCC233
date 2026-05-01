import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, Form, InputNumber, DatePicker, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockHealthMetrics } from './mockData';
import moment from 'moment';

const NhatKyChiSoSucKhoe: React.FC = () => {
  const [data, setData] = useState(mockHealthMetrics);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      ngay: moment(record.ngay),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
    message.success('Đã xóa chỉ số sức khỏe!');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        ngay: values.ngay.format('YYYY-MM-DD'),
      };
      if (editingItem) {
        setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...formattedValues } : item)));
        message.success('Đã cập nhật chỉ số sức khỏe!');
      } else {
        setData([...data, { id: Date.now().toString(), ...formattedValues }]);
        message.success('Đã thêm chỉ số sức khỏe mới!');
      }
      setIsModalVisible(false);
    });
  };

  const getBMITagColor = (bmi: number) => {
    if (bmi < 18.5) return 'blue';
    if (bmi >= 18.5 && bmi <= 24.9) return 'green';
    if (bmi >= 25 && bmi <= 29.9) return 'gold';
    return 'red';
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'ngay', key: 'ngay', sorter: (a: any, b: any) => moment(a.ngay).unix() - moment(b.ngay).unix() },
    { title: 'Cân nặng (kg)', dataIndex: 'canNang', key: 'canNang' },
    { title: 'Chiều cao (cm)', dataIndex: 'chieuCao', key: 'chieuCao' },
    {
      title: 'BMI',
      key: 'bmi',
      render: (_: any, record: any) => {
        const heightInMeters = record.chieuCao / 100;
        const bmi = (record.canNang / (heightInMeters * heightInMeters)).toFixed(1);
        return <Tag color={getBMITagColor(parseFloat(bmi))}>{bmi}</Tag>;
      },
    },
    { title: 'Nhịp tim lúc nghỉ (bpm)', dataIndex: 'nhipTim', key: 'nhipTim' },
    { title: 'Giờ ngủ', dataIndex: 'gioNgu', key: 'gioNgu' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Nhật ký chỉ số sức khỏe">
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm chỉ số
          </Button>
        </div>
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 'max-content' }} />
      </Card>

      <Modal
        title={editingItem ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ngay" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="canNang" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}>
            <InputNumber min={1} style={{ width: '100%' }} step={0.1} />
          </Form.Item>
          <Form.Item name="chieuCao" label="Chiều cao (cm)" rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="nhipTim" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}>
            <InputNumber min={30} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="gioNgu" label="Giờ ngủ" rules={[{ required: true, message: 'Vui lòng nhập giờ ngủ' }]}>
            <InputNumber min={0} max={24} style={{ width: '100%' }} step={0.5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhatKyChiSoSucKhoe;
