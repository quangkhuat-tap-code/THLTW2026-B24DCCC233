import React, { useState } from 'react';
import { Card, Row, Col, Progress, Button, Input, DatePicker, Select, Drawer, Form, InputNumber, Segmented, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { mockGoals } from './mockData';
import moment from 'moment';

const QuanLyMucTieu: React.FC = () => {
  const [data, setData] = useState(mockGoals);
  const [filterStatus, setFilterStatus] = useState<string | number>('Tất cả');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentVal, setCurrentVal] = useState<number | null>(null);

  const handleAdd = () => {
    form.resetFields();
    setIsDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id));
    message.success('Đã xóa mục tiêu!');
  };

  const handleDrawerOk = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD'),
        giaTriHienTai: 0, 
      };
      setData([...data, { id: Date.now().toString(), ...formattedValues }]);
      message.success('Đã thêm mục tiêu mới!');
      setIsDrawerVisible(false);
    });
  };

  const handleUpdateCurrentValue = (id: string, maxValue: number) => {
    if (currentVal === null) {
      setUpdatingId(null);
      return;
    }
    setData(data.map((item) => {
      if (item.id === id) {
        const newValue = currentVal > maxValue ? maxValue : currentVal;
        let newStatus = item.trangThai;
        if (newValue >= maxValue) {
          newStatus = 'Đã đạt';
        } else if (item.trangThai === 'Đã đạt' && newValue < maxValue) {
          newStatus = 'Đang thực hiện';
        }
        return { ...item, giaTriHienTai: newValue, trangThai: newStatus };
      }
      return item;
    }));
    message.success('Đã cập nhật tiến độ!');
    setUpdatingId(null);
    setCurrentVal(null);
  };

  const filteredData = data.filter((item) => {
    if (filterStatus === 'Tất cả') return true;
    return item.trangThai === filterStatus;
  });

  return (
    <div style={{ padding: 24 }}>
      <Card title="Quản lý mục tiêu">
        <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Segmented
            options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']}
            value={filterStatus}
            onChange={setFilterStatus}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mục tiêu
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          {filteredData.map((item) => {
            const percent = Math.round((item.giaTriHienTai / item.giaTriMucTieu) * 100);
            return (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <Card
                  title={item.tenMucTieu}
                  extra={
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(item.id)}>
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  }
                  hoverable
                >
                  <p><strong>Loại:</strong> {item.loai}</p>
                  <p><strong>Deadline:</strong> {item.deadline}</p>
                  <p><strong>Trạng thái:</strong> {item.trangThai}</p>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Tiến độ:</strong> {item.giaTriHienTai} / {item.giaTriMucTieu}
                    {updatingId === item.id ? (
                      <Space style={{ marginTop: 8 }}>
                        <InputNumber
                          min={0}
                          value={currentVal !== null ? currentVal : item.giaTriHienTai}
                          onChange={(val) => setCurrentVal(val)}
                        />
                        <Button type="primary" icon={<CheckOutlined />} onClick={() => handleUpdateCurrentValue(item.id, item.giaTriMucTieu)} />
                      </Space>
                    ) : (
                      <Button type="link" size="small" onClick={() => { setUpdatingId(item.id); setCurrentVal(item.giaTriHienTai); }}>
                        Cập nhật
                      </Button>
                    )}
                  </div>
                  <Progress percent={percent > 100 ? 100 : percent} status={item.trangThai === 'Đã đạt' ? 'success' : 'active'} />
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      <Drawer
        title="Thêm mục tiêu mới"
        width={400}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerVisible(false)}>Hủy</Button>
            <Button onClick={handleDrawerOk} type="primary">
              Lưu
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenMucTieu" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="loai" label="Loại mục tiêu" rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu' }]}>
            <Select>
              <Select.Option value="Giảm cân">Giảm cân</Select.Option>
              <Select.Option value="Tăng cơ">Tăng cơ</Select.Option>
              <Select.Option value="Cải thiện sức bền">Cải thiện sức bền</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="giaTriMucTieu" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}>
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]} initialValue="Đang thực hiện">
            <Select>
              <Select.Option value="Đang thực hiện">Đang thực hiện</Select.Option>
              <Select.Option value="Đã đạt">Đã đạt</Select.Option>
              <Select.Option value="Đã hủy">Đã hủy</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default QuanLyMucTieu;
