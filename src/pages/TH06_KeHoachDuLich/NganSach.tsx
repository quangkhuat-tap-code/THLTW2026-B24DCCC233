import React, { useState, useEffect, useMemo } from 'react';
import { Card, Select, Alert, Row, Col, Typography, Statistic, Empty } from 'antd';
import { Pie } from '@ant-design/plots';

const { Option } = Select;
const { Title, Text } = Typography;

export default function NganSach() {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const data = localStorage.getItem('th06_itineraries');
    if (data) {
      const parsed = JSON.parse(data);
      setItineraries(parsed);
      if (parsed.length > 0) {
        setSelectedId(parsed[0].id);
      }
    }
  }, []);

  const selectedItinerary = useMemo(() => {
    return itineraries.find(i => i.id === selectedId);
  }, [itineraries, selectedId]);

  const { totalCost, budget, chartData } = useMemo(() => {
    if (!selectedItinerary) return { totalCost: 0, budget: 0, chartData: [] };

    let food = 0;
    let stay = 0;
    let travel = 0;
    let base = 0;

    selectedItinerary.items?.forEach((item: any) => {
      food += item.foodCost || 0;
      stay += item.stayCost || 0;
      travel += item.travelCost || 0;
      base += item.price || 0;
    });

    const total = food + stay + travel + base;
    const data = [
      { type: 'Ăn uống', value: food },
      { type: 'Lưu trú', value: stay },
      { type: 'Di chuyển', value: travel },
      { type: 'Chi phí cơ bản', value: base },
    ].filter(i => i.value > 0);

    return { totalCost: total, budget: selectedItinerary.budget || 0, chartData: data };
  }, [selectedItinerary]);

  const config = {
    appendPadding: 10,
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <Title level={2}>Quản lý Ngân sách</Title>

      {itineraries.length === 0 ? (
        <Empty description="Chưa có lịch trình nào được lưu. Hãy tạo lịch trình mới!" />
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ marginRight: 16 }}>Chọn lịch trình:</Text>
            <Select style={{ width: 300 }} value={selectedId} onChange={setSelectedId}>
              {itineraries.map(i => (
                <Option key={i.id} value={i.id}>{i.name}</Option>
              ))}
            </Select>
          </div>

          {selectedItinerary && (
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={10}>
                <Card title="Phân bổ ngân sách" style={{ height: '100%' }}>
                  {chartData.length > 0 ? <Pie {...config} /> : <Empty description="Chưa có dữ liệu chi phí" />}
                </Card>
              </Col>
              
              <Col xs={24} lg={14}>
                <Card title="Cảnh báo & Thống kê chi tiết" style={{ height: '100%' }}>
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col span={12}>
                      <Statistic title="Ngân sách dự kiến" value={budget} suffix="VNĐ" />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Tổng chi phí thực tế" value={totalCost} suffix="VNĐ" valueStyle={{ color: totalCost > budget ? '#cf1322' : '#3f8600' }} />
                    </Col>
                  </Row>

                  {totalCost > budget ? (
                    <Alert
                      message="Cảnh báo: Vượt quá ngân sách!"
                      description={`Lịch trình này đã vượt quá ngân sách dự kiến ${(totalCost - budget).toLocaleString()} VNĐ. Hãy cân nhắc giảm bớt điểm đến hoặc tìm các phương án tiết kiệm hơn.`}
                      type="error"
                      showIcon
                      style={{ marginBottom: 24 }}
                    />
                  ) : (
                    <Alert
                      message="Trạng thái ngân sách: Tốt"
                      description={`Ngân sách của bạn nằm trong mức an toàn. Số dư còn lại: ${(budget - totalCost).toLocaleString()} VNĐ.`}
                      type="success"
                      showIcon
                      style={{ marginBottom: 24 }}
                    />
                  )}

                  <Title level={5}>Chi tiết theo hạng mục</Title>
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {chartData.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                        <Text>{item.type}</Text>
                        <Text strong>{item.value.toLocaleString()} VNĐ</Text>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
}
