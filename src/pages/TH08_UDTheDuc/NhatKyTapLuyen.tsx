import React, { useState } from 'react';
import { Card, Table, Button, Input, Select, DatePicker, Space, Modal, Form, InputNumber, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { mockWorkouts } from './mockData';
import moment from 'moment';

const { RangePicker } = DatePicker;

const NhatKyTapLuyen: React.FC = () => {
  const [data, setData] = useState(mockWorkouts);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<any[]>([]);
  
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
    message.success('Đã xóa buổi tập!');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        ngay: values.ngay.format('YYYY-MM-DD'),
      };
      if (editingItem) {
        setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...formattedValues } : item)));
        message.success('Đã cập nhật buổi tập!');
      } else {
        setData([...data, { id: Date.now().toString(), ...formattedValues }]);
        message.success('Đã thêm buổi tập mới!');
      }
      setIsModalVisible(false);
    });
  };

  const filteredData = data.filter((item) => {
    const matchSearch = item.loaiBaiTap.toLowerCase().includes(searchText.toLowerCase()) || item.ghiChu.toLowerCase().includes(searchText.toLowerCase());
    const matchType = filterType ? item.loaiBaiTap === filterType : true;
    let matchDate = true;
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      const itemDate = moment(item.ngay);
      matchDate = itemDate.isSameOrAfter(dateRange[0], 'day') && itemDate.isSameOrBefore(dateRange[1], 'day');
    }
    return matchSearch && matchType && matchDate;
  });

  const columns = [
    { title: 'Ngày', dataIndex: 'ngay', key: 'ngay', sorter: (a: any, b: any) => moment(a.ngay).unix() - moment(b.ngay).unix() },
    { title: 'Loại bài tập', dataIndex: 'loaiBaiTap', key: 'loaiBaiTap' },
    { title: 'Thời lượng (phút)', dataIndex: 'thoiLuong', key: 'thoiLuong', sorter: (a: any, b: any) => a.thoiLuong - b.thoiLuong },
    { title: 'Calo đốt', dataIndex: 'caloDot', key: 'caloDot', sorter: (a: any, b: any) => a.caloDot - b.caloDot },
    { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu' },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={status === 'Hoàn thành' ? 'success' : 'error'}>{status}</Tag>
      ),
    },
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
      <Card title="Nhật ký tập luyện">
        <Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Loại bài tập"
            allowClear
            style={{ width: 150 }}
            onChange={(val) => setFilterType(val)}
          >
            <Select.Option value="Cardio">Cardio</Select.Option>
            <Select.Option value="Strength">Strength</Select.Option>
            <Select.Option value="Yoga">Yoga</Select.Option>
            <Select.Option value="HIIT">HIIT</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
          <RangePicker onChange={(dates) => setDateRange(dates as any)} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm buổi tập
          </Button>
        </Space>

        <Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 'max-content' }} />
      </Card>

      <Modal
        title={editingItem ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ngay" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="loaiBaiTap" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}>
            <Select>
              <Select.Option value="Cardio">Cardio</Select.Option>
              <Select.Option value="Strength">Strength</Select.Option>
              <Select.Option value="Yoga">Yoga</Select.Option>
              <Select.Option value="HIIT">HIIT</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="thoiLuong" label="Thời lượng (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="caloDot" label="Calo đốt" rules={[{ required: true, message: 'Vui lòng nhập lượng calo' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]} initialValue="Hoàn thành">
            <Select>
              <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
              <Select.Option value="Bỏ lỡ">Bỏ lỡ</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhatKyTapLuyen;
