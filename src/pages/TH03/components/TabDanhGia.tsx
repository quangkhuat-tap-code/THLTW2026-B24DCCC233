import React, { useState } from 'react';
import { Table, Button, Card, Rate, Tag, Modal, Form, Input, message } from 'antd';

const TabDanhGia: React.FC<any> = ({ employees, appointments, reviews, setReviews }) => {
  const [isModalReview, setIsModalReview] = useState(false);
  const [isModalReply, setIsModalReply] = useState(false);
  const [currentAppt, setCurrentAppt] = useState<any>(null);
  const [currentReview, setCurrentReview] = useState<any>(null);

  const [formReview] = Form.useForm();
  const [formReply] = Form.useForm();

  const handleSaveReview = (values: any) => {
    setReviews([...reviews, { ...values, id: Date.now().toString(), appointmentId: currentAppt.id, employeeId: currentAppt.employeeId }]);
    setIsModalReview(false);
    formReview.resetFields();
    message.success('Cảm ơn bạn đã đánh giá!');
  };

  const handleSaveReply = (values: any) => {
    setReviews(reviews.map((r: any) => r.id === currentReview.id ? { ...r, reply: values.reply } : r));
    setIsModalReply(false);
    formReply.resetFields();
    message.success('Đã phản hồi đánh giá!');
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <b>Chọn lịch hẹn đã hoàn thành để đánh giá:</b>
        <Table 
          dataSource={appointments.filter((a: any) => a.status === 'Hoàn thành' && !reviews.find((r: any) => r.appointmentId === a.id))} 
          rowKey="id" pagination={{ pageSize: 3 }}
          columns={[
            { title: 'Khách hàng', dataIndex: 'customerName' },
            { title: 'Ngày', dataIndex: 'date' },
            { title: 'Hành động', render: (_: any, r: any) => <Button type="primary" size="small" onClick={() => { setCurrentAppt(r); setIsModalReview(true); }}>Viết đánh giá</Button> }
          ]} 
        />
      </div>
      <Card title="Danh sách đánh giá">
        <Table dataSource={reviews} rowKey="id" columns={[
          { title: 'Nhân viên', render: (_: any, r: any) => employees.find((e: any) => e.id === r.employeeId)?.name },
          { title: 'Điểm', render: (_: any, r: any) => <Rate disabled defaultValue={r.rating} /> },
          { title: 'Nhận xét', dataIndex: 'comment' },
          { title: 'NV Phản hồi', render: (_: any, r: any) => r.reply ? <Tag color="geekblue">{r.reply}</Tag> : <Button type="dashed" size="small" onClick={() => { setCurrentReview(r); setIsModalReply(true); }}>Phản hồi</Button> }
        ]} />
      </Card>

      <Modal title="Đánh giá dịch vụ" visible={isModalReview} onCancel={() => setIsModalReview(false)} onOk={() => formReview.submit()}>
        <Form form={formReview} layout="vertical" onFinish={handleSaveReview}>
          <Form.Item name="rating" label="Điểm đánh giá" rules={[{ required: true }]}><Rate /></Form.Item>
          <Form.Item name="comment" label="Nhận xét của bạn" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Phản hồi đánh giá" visible={isModalReply} onCancel={() => setIsModalReply(false)} onOk={() => formReply.submit()}>
        <Form form={formReply} layout="vertical" onFinish={handleSaveReply}>
          <Form.Item name="reply" label="Nội dung phản hồi" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TabDanhGia;