import React, { useState } from 'react';
import { Row, Col, Card, Button, Table, Space, Popconfirm, Modal, Form, Input, InputNumber, Select, TimePicker, message } from 'antd';
import moment from 'moment';

const dayOptions = [
  { label: 'Chủ nhật', value: '0' },
  { label: 'Thứ 2', value: '1' },
  { label: 'Thứ 3', value: '2' },
  { label: 'Thứ 4', value: '3' },
  { label: 'Thứ 5', value: '4' },
  { label: 'Thứ 6', value: '5' },
  { label: 'Thứ 7', value: '6' },
];

const TabNhanSuDichVu: React.FC<any> = ({ services, setServices, employees, setEmployees, reviews }) => {
  const [isModalService, setIsModalService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isModalEmployee, setIsModalEmployee] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  const [formService] = Form.useForm();
  const [formEmployee] = Form.useForm();

  const openAddService = () => {
    setEditingServiceId(null);
    formService.resetFields();
    setIsModalService(true);
  };

  const openEditService = (record: any) => {
    setEditingServiceId(record.id);
    formService.setFieldsValue(record);
    setIsModalService(true);
  };

  const handleSaveService = (values: any) => {
    if (editingServiceId) {
      setServices(services.map((s: any) => s.id === editingServiceId ? { ...s, ...values } : s));
      message.success('Cập nhật dịch vụ thành công!');
    } else {
      setServices([...services, { ...values, id: Date.now().toString() }]);
      message.success('Thêm dịch vụ thành công!');
    }
    setIsModalService(false);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s: any) => s.id !== id));
    message.success('Đã xóa dịch vụ!');
  };

  const openAddEmployee = () => {
    setEditingEmployeeId(null);
    formEmployee.resetFields();
    setIsModalEmployee(true);
  };

  const openEditEmployee = (record: any) => {
    setEditingEmployeeId(record.id);
    formEmployee.setFieldsValue({
      ...record,
      workStart: moment(record.workStart, 'HH:mm'),
      workEnd: moment(record.workEnd, 'HH:mm'),
    });
    setIsModalEmployee(true);
  };

  const handleSaveEmployee = (values: any) => {
    const empData = {
      ...values,
      workStart: values.workStart.format('HH:mm'),
      workEnd: values.workEnd.format('HH:mm')
    };
    
    if (editingEmployeeId) {
      setEmployees(employees.map((e: any) => e.id === editingEmployeeId ? { ...e, ...empData } : e));
      message.success('Cập nhật nhân viên thành công!');
    } else {
      setEmployees([...employees, { ...empData, id: Date.now().toString() }]);
      message.success('Thêm nhân viên thành công!');
    }
    setIsModalEmployee(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((e: any) => e.id !== id));
    message.success('Đã xóa nhân viên!');
  };

  const getEmployeeAverageRating = (empId: string) => {
    const empReviews = reviews.filter((r: any) => r.employeeId === empId);
    if (empReviews.length === 0) return 'Chưa có ĐG';
    const sum = empReviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    return (sum / empReviews.length).toFixed(1) + ' ⭐';
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={10}>
          <Card title="Dịch vụ" extra={<Button type="primary" onClick={openAddService}>Thêm Dịch vụ</Button>}>
            <Table dataSource={services} rowKey="id" pagination={{ pageSize: 5 }} columns={[
              { title: 'Tên DV', dataIndex: 'name' },
              { title: 'Thời gian (phút)', dataIndex: 'duration' },
              { title: 'Giá (VNĐ)', dataIndex: 'price', render: (val) => val.toLocaleString() },
              { 
                title: 'Hành động', 
                render: (_: any, r: any) => (
                  <Space>
                    <Button type="link" onClick={() => openEditService(r)}>Sửa</Button>
                    <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDeleteService(r.id)}>
                      <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                  </Space>
                ) 
              }
            ]} />
          </Card>
        </Col>
        <Col span={14}>
          <Card title="Nhân viên" extra={<Button type="primary" onClick={openAddEmployee}>Thêm NV</Button>}>
            <Table dataSource={employees} rowKey="id" pagination={{ pageSize: 5 }} columns={[
              { title: 'Tên NV', dataIndex: 'name' },
              { title: 'Ngày làm', render: (_: any, r: any) => r.workDays?.map((d:string) => dayOptions.find(opt => opt.value === d)?.label).join(', ') },
              { title: 'Giờ làm', render: (_: any, r: any) => `${r.workStart} - ${r.workEnd}` },
              { title: 'Giới hạn/ngày', dataIndex: 'dailyLimit' },
              { title: 'Đánh giá', render: (_: any, r: any) => getEmployeeAverageRating(r.id) },
              { 
                title: 'Hành động', 
                render: (_: any, r: any) => (
                  <Space>
                    <Button type="link" onClick={() => openEditEmployee(r)}>Sửa</Button>
                    <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDeleteEmployee(r.id)}>
                      <Button type="link" danger>Xóa</Button>
                    </Popconfirm>
                  </Space>
                ) 
              }
            ]} />
          </Card>
        </Col>
      </Row>

      <Modal title={editingServiceId ? "Chỉnh sửa Dịch vụ" : "Thêm Dịch vụ"} visible={isModalService} onCancel={() => setIsModalService(false)} onOk={() => formService.submit()}>
        <Form form={formService} layout="vertical" onFinish={handleSaveService}>
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="duration" label="Thời gian thực hiện (phút)" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }}/></Form.Item>
          <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }}/></Form.Item>
        </Form>
      </Modal>

      <Modal title={editingEmployeeId ? "Chỉnh sửa Nhân viên" : "Thêm Nhân viên"} visible={isModalEmployee} onCancel={() => setIsModalEmployee(false)} onOk={() => formEmployee.submit()}>
        <Form form={formEmployee} layout="vertical" onFinish={handleSaveEmployee}>
          <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="workDays" label="Ngày làm việc" rules={[{ required: true }]}>
            <Select mode="multiple" options={dayOptions} placeholder="Chọn các ngày làm việc" />
          </Form.Item>
          <Form.Item name="dailyLimit" label="Số khách tối đa/ngày" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }}/></Form.Item>
          <Space>
            <Form.Item name="workStart" label="Giờ bắt đầu" rules={[{ required: true }]}><TimePicker format="HH:mm" /></Form.Item>
            <Form.Item name="workEnd" label="Giờ kết thúc" rules={[{ required: true }]}><TimePicker format="HH:mm" /></Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default TabNhanSuDichVu;