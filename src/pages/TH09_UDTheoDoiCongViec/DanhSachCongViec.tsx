import React, { useState } from 'react';
import { Table, Button, Input, Select, Tag, Modal, Form, DatePicker, Space, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useCongViec } from './useCongViec';
import { CongViec, TRANG_THAI, MUC_DO_UU_TIEN } from './types';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const DanhSachCongViec: React.FC = () => {
  const { danhSachCongViec, themCongViec, suaCongViec, xoaCongViec } = useCongViec();
  const [form] = Form.useForm();
  
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleOpenModal = (record?: CongViec) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        deadline: moment(record.deadline),
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleFinish = (values: any) => {
    const formattedData = {
      ...values,
      deadline: values.deadline.format('YYYY-MM-DD'),
    };

    if (editingId) {
      suaCongViec(editingId, formattedData);
    } else {
      themCongViec({
        ...formattedData,
        id: Date.now().toString(),
        trangThai: values.trangThai || 'Cần làm',
      });
    }
    handleCancelModal();
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'Cao') return 'red';
    if (priority === 'Trung bình') return 'orange';
    return 'green';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Hoàn thành') return 'green';
    if (status === 'Đang làm') return 'blue';
    return 'default';
  };

  const filteredData = danhSachCongViec.filter((item) => {
    const matchName = item.tenCongViec.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'Tất cả' || item.trangThai === statusFilter;
    return matchName && matchStatus;
  });

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'tenCongViec',
      key: 'tenCongViec',
      render: (text: string, record: CongViec) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.moTa}</div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'mucDoUuTien',
      key: 'mucDoUuTien',
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
        </>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a: CongViec, b: CongViec) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
      render: (text: string) => moment(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: CongViec) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenModal(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa công việc này?"
            onConfirm={() => xoaCongViec(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2>Danh sách công việc</h2>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
            Thêm công việc
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Tìm kiếm công việc..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            style={{ width: '100%' }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="Tất cả">Tất cả trạng thái</Option>
            {TRANG_THAI.map(status => <Option key={status} value={status}>{status}</Option>)}
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
        visible={isModalVisible}
        onCancel={handleCancelModal}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="tenCongViec"
            label="Tên công việc"
            rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
          >
            <Input placeholder="Nhập tên công việc" />
          </Form.Item>
          
          <Form.Item
            name="moTa"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deadline"
                label="Deadline"
                rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mucDoUuTien"
                label="Mức độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên!' }]}
                initialValue="Trung bình"
              >
                <Select>
                  {MUC_DO_UU_TIEN.map(p => <Option key={p} value={p}>{p}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="trangThai"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                initialValue="Cần làm"
              >
                <Select>
                  {TRANG_THAI.map(s => <Option key={s} value={s}>{s}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="Tags"
              >
                <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm tags" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default DanhSachCongViec;
