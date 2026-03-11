import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Drawer, Form, Input, InputNumber, 
  DatePicker, AutoComplete, Tag, Space, message, Progress, 
  Row, Col, Statistic, Popconfirm 
} from 'antd';
import moment from 'moment';

const Bai2: React.FC = () => {
  const [courseList, setCourseList] = useState<string[]>(['Toán Cao Cấp', 'Tiếng Anh', 'Vật Lý', 'Triết Học', 'Lập Trình']);
  const [logEntries, setLogEntries] = useState<any[]>([]);
  const [targetMinutes, setTargetMinutes] = useState<number>(600);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeRecordId, setActiveRecordId] = useState<number | null>(null);
  
  const [editTargetMode, setEditTargetMode] = useState(false);
  const [draftTarget, setDraftTarget] = useState<number>(600);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedLogs = localStorage.getItem('my_learning_logs');
    if (savedLogs) setLogEntries(JSON.parse(savedLogs));

    const savedCourses = localStorage.getItem('my_course_list');
    if (savedCourses) setCourseList(JSON.parse(savedCourses));

    const savedTarget = localStorage.getItem('my_monthly_target');
    if (savedTarget) {
      setTargetMinutes(Number(savedTarget));
      setDraftTarget(Number(savedTarget));
    }
  }, []);

  const updateMonthlyTarget = () => {
    setTargetMinutes(draftTarget);
    localStorage.setItem('my_monthly_target', draftTarget.toString());
    setEditTargetMode(false);
    message.success('Thiết lập mục tiêu thành công!');
  };

  const openForm = (record?: any) => {
    if (record && record.id) {
      setActiveRecordId(record.id);
      form.setFieldsValue({
        ...record,
        recordDate: moment(record.recordDate, 'YYYY-MM-DD HH:mm')
      });
    } else {
      setActiveRecordId(null);
      form.resetFields();
    }
    setDrawerVisible(true);
  };

  const onSubmitRecord = (values: any) => {
    const logData = { 
      ...values, 
      recordDate: values.recordDate.format('YYYY-MM-DD HH:mm'),
      monthKey: values.recordDate.format('YYYY-MM')
    };

    if (!courseList.includes(values.topic)) {
      const updatedCourses = [...courseList, values.topic];
      setCourseList(updatedCourses);
      localStorage.setItem('my_course_list', JSON.stringify(updatedCourses));
    }
    
    let newLogs;
    if (activeRecordId) {
      newLogs = logEntries.map(item => item.id === activeRecordId ? { ...item, ...logData } : item);
      message.success('Đã cập nhật bản ghi!');
    } else {
      newLogs = [{ ...logData, id: Date.now() }, ...logEntries];
      message.success('Ghi nhận tiến độ thành công!');
    }

    setLogEntries(newLogs);
    localStorage.setItem('my_learning_logs', JSON.stringify(newLogs));
    setDrawerVisible(false);
  };

  const removeLog = (id: number) => {
    const filtered = logEntries.filter(item => item.id !== id);
    setLogEntries(filtered);
    localStorage.setItem('my_learning_logs', JSON.stringify(filtered));
    message.info('Đã xóa dữ liệu.');
  };

  const currentMonthStr = moment().format('YYYY-MM');
  const timeSpentThisMonth = logEntries
    .filter(item => item.monthKey === currentMonthStr)
    .reduce((total, item) => total + (item.timeSpent || 0), 0);
  
  const isTargetAchieved = timeSpentThisMonth >= targetMinutes;
  const progressPercent = Math.min(Math.round((timeSpentThisMonth / targetMinutes) * 100), 100);

  const tableColumns = [
    { 
      title: 'Môn học', 
      dataIndex: 'topic', 
      render: (val: string) => <Tag color="geekblue">{val}</Tag> 
    },
    { title: 'Thời gian', dataIndex: 'recordDate' },
    { 
      title: 'Thời lượng', 
      dataIndex: 'timeSpent',
      render: (val: number) => <strong>{val} phút</strong>
    },
    { title: 'Nội dung', dataIndex: 'details' },
    { title: 'Ghi chú thêm', dataIndex: 'extraInfo' },
    { 
      title: 'Tùy chỉnh', 
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={() => openForm(record)}>Chỉnh sửa</a>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => removeLog(record.id)} okText="Có" cancelText="Không">
            <a style={{ color: '#ff4d4f' }}>Xóa bỏ</a>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <Card title="Quản lý Tiến độ Học tập Sinh viên" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ background: '#fafafa', padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col span={14}>
            <Statistic 
              title={`Tổng thời gian học tháng ${currentMonthStr}`} 
              value={timeSpentThisMonth} 
              suffix={`/ ${targetMinutes} phút`} 
              valueStyle={{ color: isTargetAchieved ? '#52c41a' : '#1890ff', fontWeight: 'bold' }}
            />
            <div style={{ marginTop: 10 }}>
              {isTargetAchieved ? 
                <Tag color="success">Tuyệt vời! Bạn đã vượt mục tiêu</Tag> : 
                <Tag color="processing">Cố gắng lên! Bạn đang bám sát mục tiêu</Tag>
              }
            </div>
          </Col>
          
          <Col span={10} style={{ textAlign: 'right' }}>
            {editTargetMode ? (
              <Space>
                <InputNumber min={1} value={draftTarget} onChange={(val) => setDraftTarget(val || 1)} />
                <Button type="primary" size="small" onClick={updateMonthlyTarget}>Xác nhận</Button>
                <Button size="small" onClick={() => setEditTargetMode(false)}>Hủy</Button>
              </Space>
            ) : (
              <Button type="link" onClick={() => { setEditTargetMode(true); setDraftTarget(targetMinutes); }}>
                Thay đổi mục tiêu
              </Button>
            )}
          </Col>
        </Row>
        
        <Progress 
          percent={progressPercent} 
          status={isTargetAchieved ? 'success' : 'active'} 
          strokeWidth={10}
          style={{ marginTop: 20 }}
        />
      </div>

      <Button type="primary" size="large" onClick={() => openForm()} style={{ marginBottom: 20 }}>
        + Khai báo buổi học
      </Button>
      
      <Table 
        dataSource={logEntries} 
        columns={tableColumns} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
      />

      <Drawer 
        title={activeRecordId ? "Cập nhật buổi học" : "Khai báo buổi học mới"} 
        width={450}
        onClose={() => setDrawerVisible(false)} 
        visible={drawerVisible}
        extra={
          <Button type="primary" onClick={() => form.submit()}>Lưu thông tin</Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={onSubmitRecord}>
          <Form.Item name="topic" label="Tên môn học" rules={[{ required: true, message: 'Bắt buộc nhập môn học!' }]}>
            <AutoComplete
              options={courseList.map(c => ({ value: c }))}
              placeholder="Gõ để thêm môn mới hoặc chọn từ danh sách"
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="recordDate" label="Ngày học" rules={[{ required: true, message: 'Chọn ngày!' }]}>
                <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item> name="timeSpent" label="Thời lượng (phút)" rules={[{ required: true, message: 'Nhập thời gian!' }]}
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="details" label="Nội dung tóm tắt" rules={[{ required: true, message: 'Nhập nội dung đã học!' }]}>
            <Input.TextArea rows={4} placeholder="Ghi lại kiến thức bạn vừa học..." />
          </Form.Item>

          <Form.Item name="extraInfo" label="Ghi chú & Tài liệu">
            <Input placeholder="Link bài giảng, tài liệu tham khảo..." />
          </Form.Item>
        </Form>
      </Drawer>
    </Card>
  );
};

export default Bai2;