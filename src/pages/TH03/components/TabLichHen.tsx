import React, { useState } from 'react';
import { Button, Table, Tag, Select, Modal, Form, Input, DatePicker, TimePicker, Space, message } from 'antd';

const TabLichHen: React.FC<any> = ({ services, employees, appointments, setAppointments }) => {
  const [isModalAppointment, setIsModalAppointment] = useState(false);
  const [formAppointment] = Form.useForm();

  const handleBookAppointment = (values: any) => {
    const { customerName, employeeId, serviceId, date, time } = values;
    const dateStr = date.format('YYYY-MM-DD');
    const timeStr = time.format('HH:mm');
    const dayOfWeek = date.day().toString();
    const emp = employees.find((e: any) => e.id === employeeId);
    
    if (!emp.workDays.includes(dayOfWeek)) {
      return message.error('Nhân viên không làm việc vào ngày này!');
    }

    if (timeStr < emp.workStart || timeStr > emp.workEnd) {
      return message.error(`Nhân viên chỉ làm việc từ ${emp.workStart} đến ${emp.workEnd}`);
    }

    const empApptsToday = appointments.filter((a: any) => a.employeeId === employeeId && a.date === dateStr && a.status !== 'Hủy');
    if (empApptsToday.length >= emp.dailyLimit) {
      return message.error('Nhân viên này đã đạt giới hạn phục vụ trong ngày!');
    }

    const isConflict = empApptsToday.some((a: any) => a.time === timeStr);
    if (isConflict) {
      return message.error('Đã có lịch, vui lòng chọn giờ khác');
    }

    setAppointments([...appointments, {
      id: Date.now().toString(), customerName, employeeId, serviceId, date: dateStr, time: timeStr, status: 'Chờ duyệt'
    }]);
    setIsModalAppointment(false);
    formAppointment.resetFields();
    message.success('Đặt lịch thành công!');
  };

  const updateApptStatus = (id: string, newStatus: string) => {
    setAppointments(appointments.map((a: any) => a.id === id ? { ...a, status: newStatus } : a));
    message.success(`Đã cập nhật trạng thái thành: ${newStatus}`);
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalAppointment(true)} style={{ marginBottom: 16 }}>+ Đặt lịch mới</Button>
      <Table dataSource={appointments} rowKey="id" columns={[
        { title: 'Khách hàng', dataIndex: 'customerName' },
        { title: 'Dịch vụ', render: (_: any, r: any) => services.find((s: any) => s.id === r.serviceId)?.name },
        { title: 'Nhân viên', render: (_: any, r: any) => employees.find((e: any) => e.id === r.employeeId)?.name },
        { title: 'Thời gian', render: (_: any, r: any) => `${r.time} | ${r.date}` },
        { title: 'Trạng thái', render: (_: any, r: any) => (
            <Tag color={r.status === 'Hoàn thành' ? 'green' : r.status === 'Hủy' ? 'red' : r.status === 'Xác nhận' ? 'blue' : 'orange'}>
              {r.status}
            </Tag>
          ) 
        },
        { title: 'Hành động', render: (_: any, r: any) => (
            <Select value={r.status} style={{ width: 130 }} onChange={(val) => updateApptStatus(r.id, val)}>
              <Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
              <Select.Option value="Xác nhận">Xác nhận</Select.Option>
              <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
              <Select.Option value="Hủy">Hủy</Select.Option>
            </Select>
          )
        }
      ]} />

      <Modal title="Đặt lịch hẹn" visible={isModalAppointment} onCancel={() => setIsModalAppointment(false)} onOk={() => formAppointment.submit()}>
        <Form form={formAppointment} layout="vertical" onFinish={handleBookAppointment}>
          <Form.Item name="customerName" label="Tên Khách hàng" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}>
            <Select options={services.map((s: any) => ({ label: s.name, value: s.id }))} />
          </Form.Item>
          <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true }]}>
            <Select options={employees.map((e: any) => ({ label: `${e.name} (Max: ${e.dailyLimit}/ngày)`, value: e.id }))} />
          </Form.Item>
          <Space>
            <Form.Item name="date" label="Ngày hẹn" rules={[{ required: true }]}><DatePicker format="YYYY-MM-DD" /></Form.Item>
            <Form.Item name="time" label="Giờ hẹn" rules={[{ required: true }]}><TimePicker format="HH:mm" /></Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default TabLichHen;