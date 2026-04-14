import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Select, Button, Form, Input, InputNumber, List, Typography, Space, message } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

export default function LichTrinh() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [itineraryForm] = Form.useForm();
  
  const [selectedDest, setSelectedDest] = useState<number | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('th06_destinations');
    if (data) {
      setDestinations(JSON.parse(data));
    }
  }, []);

  const handleAddItem = () => {
    if (!selectedDest || !selectedDay) return;
    const dest = destinations.find(d => d.id === selectedDest);
    if (!dest) return;
    
    setItems([...items, { ...dest, day: selectedDay, itemId: new Date().getTime() }]);
    setSelectedDest(undefined);
  };

  const removeItem = (itemId: number) => {
    setItems(items.filter(i => i.itemId !== itemId));
  };

  const handleSaveItinerary = async () => {
    try {
      const values = await itineraryForm.validateFields();
      const currentSavesStr = localStorage.getItem('th06_itineraries');
      let currentSaves = currentSavesStr ? JSON.parse(currentSavesStr) : [];
      
      const newItinerary = {
        id: new Date().getTime(),
        ...values,
        items,
        totalCost: totalStats.totalCost,
        totalTime: totalStats.totalTime,
        dateCreated: new Date().toISOString()
      };
      
      currentSaves.push(newItinerary);
      localStorage.setItem('th06_itineraries', JSON.stringify(currentSaves));
      message.success('Lưu lịch trình thành công!');
      itineraryForm.resetFields();
      setItems([]);
    } catch (e) {
      // form validate failed
    }
  };

  const totalStats = useMemo(() => {
    let totalCost = 0;
    let totalFood = 0;
    let totalStay = 0;
    let totalTravelCost = 0;
    let totalTime = 0;

    items.forEach(item => {
      totalCost += item.price || 0;
      totalFood += item.foodCost || 0;
      totalStay += item.stayCost || 0;
      totalTravelCost += item.travelCost || 0;
      totalTime += item.timeToVisit || 0; // time in hours
    });

    return { 
      totalCost: totalCost + totalFood + totalStay + totalTravelCost, 
      totalTime 
    };
  }, [items]);

  // Group items by day
  const itemsByDay = items.reduce((acc, current) => {
    if (!acc[current.day]) acc[current.day] = [];
    acc[current.day].push(current);
    return acc;
  }, {});

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <Title level={2}>Tạo lịch trình chuyến đi</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Thông tin chung">
            <Form form={itineraryForm} layout="vertical">
              <Form.Item name="name" label="Tên chuyến đi" rules={[{ required: true }]}>
                <Input placeholder="Vd: Chuyến đi Phú Quốc hè 2026" />
              </Form.Item>
              <Form.Item name="budget" label="Ngân sách dự kiến (VNĐ)" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} step={1000000} />
              </Form.Item>
            </Form>

            <div style={{ marginTop: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <Title level={5}>Thống kê tổng quan</Title>
              <Row style={{ marginBottom: 8 }}>
                <Col span={12}><Text>Tổng chi phí:</Text></Col>
                <Col span={12} style={{ textAlign: 'right' }}><Text strong type="danger">{totalStats.totalCost.toLocaleString()} đ</Text></Col>
              </Row>
              <Row>
                <Col span={12}><Text>Tổng thời gian (ước tính):</Text></Col>
                <Col span={12} style={{ textAlign: 'right' }}><Text strong>{totalStats.totalTime} giờ</Text></Col>
              </Row>
            </div>

            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              size="large" 
              style={{ width: '100%', marginTop: 24 }}
              onClick={handleSaveItinerary}
              disabled={items.length === 0}
            >
              Lưu lịch trình
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Chi tiết lịch trình">
            <Space style={{ marginBottom: 24, display: 'flex' }}>
              <Select 
                showSearch
                style={{ width: 300 }} 
                placeholder="Chọn điểm đến" 
                value={selectedDest}
                onChange={setSelectedDest}
                optionFilterProp="children"
              >
                {destinations.map(d => (
                  <Option key={d.id} value={d.id}>{d.name} ({d.location})</Option>
                ))}
              </Select>
              <InputNumber 
                min={1} 
                max={30} 
                value={selectedDay} 
                onChange={(val) => setSelectedDay(val as number)} 
                addonBefore="Ngày thứ"
              />
              <Button type="primary" onClick={handleAddItem} disabled={!selectedDest}>Thêm vào lịch</Button>
            </Space>

            {Object.keys(itemsByDay).sort().map(day => (
              <div key={day} style={{ marginBottom: 24 }}>
                <Title level={4} style={{ borderBottom: '2px solid #1890ff', paddingBottom: 8, color: '#1890ff' }}>
                  Ngày {day}
                </Title>
                <List
                  dataSource={itemsByDay[day]}
                  renderItem={(item: any, index: number) => (
                    <List.Item
                      actions={[<Button danger icon={<DeleteOutlined />} onClick={() => removeItem(item.itemId)} type="text" />]}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={`Thời gian: ${item.timeToVisit}h | Địa điểm: ${item.location}`}
                      />
                      <div>
                        Trọn gói: <Text strong type="danger">{((item.price || 0) + (item.foodCost || 0) + (item.stayCost || 0) + (item.travelCost || 0)).toLocaleString()}đ</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            ))}
            
            {items.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>
                <p>Chưa có điểm đến nào trong lịch trình.</p>
                <p>Hãy chọn điểm đến và thêm vào các ngày ở phía trên.</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
