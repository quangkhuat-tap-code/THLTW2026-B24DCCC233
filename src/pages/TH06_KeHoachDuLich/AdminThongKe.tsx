import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Typography, Statistic, Table } from 'antd';
import { Column, Bar } from '@ant-design/plots';

const { Title } = Typography;

export default function AdminThongKe() {
  const [itineraries, setItineraries] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('th06_itineraries');
    if (data) {
      setItineraries(JSON.parse(data));
    }
  }, []);

  const { totalItineraries, totalRevenue, popularDestinations, itemsByCategory } = useMemo(() => {
    let revenue = 0;
    const destCount: any = {};
    const categories = {
      'Ăn uống': 0,
      'Lưu trú': 0,
      'Di chuyển': 0,
      'Chi phí cơ bản': 0,
    };

    itineraries.forEach(itin => {
      revenue += itin.totalCost || 0;
      itin.items?.forEach((item: any) => {
        if (!destCount[item.name]) destCount[item.name] = 0;
        destCount[item.name] += 1;

        categories['Ăn uống'] += item.foodCost || 0;
        categories['Lưu trú'] += item.stayCost || 0;
        categories['Di chuyển'] += item.travelCost || 0;
        categories['Chi phí cơ bản'] += item.price || 0;
      });
    });

    const popular = Object.keys(destCount).map(key => ({ name: key, count: destCount[key] })).sort((a, b) => b.count - a.count);

    return {
      totalItineraries: itineraries.length,
      totalRevenue: revenue,
      popularDestinations: popular,
      itemsByCategory: categories
    };
  }, [itineraries]);

  // Mocking data for monthly since everything might be created today
  const monthlyData = [
    { month: 'T1', count: Math.floor(Math.random() * 10) + 1 },
    { month: 'T2', count: Math.floor(Math.random() * 10) + 1 },
    { month: 'T3', count: Math.floor(Math.random() * 10) + 1 },
    { month: 'T4', count: totalItineraries }, // current month
  ];

  const barConfig = {
    data: popularDestinations.slice(0, 5),
    xField: 'count',
    yField: 'name',
    seriesField: 'name',
    legend: { position: 'top-left' as any },
  };

  const columnConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'count',
    label: {
      position: 'middle',
      style: { fill: '#FFFFFF', opacity: 0.6 },
    },
  };

  const categoryData = Object.keys(itemsByCategory).map(k => ({
    category: k,
    amount: itemsByCategory[k as keyof typeof itemsByCategory]
  }));

  const columns = [
    { title: 'Hạng mục', dataIndex: 'category', key: 'category' },
    { title: 'Tổng chi tiêu (VNĐ)', dataIndex: 'amount', key: 'amount', render: (v: number) => <span style={{ fontWeight: 'bold' }}>{v.toLocaleString()} đ</span> }
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      <Title level={2}>Thống kê & Báo cáo</Title>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng số lịch trình đã tạo" value={totalItineraries} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng doanh thu/chi tiêu" value={totalRevenue} suffix="VNĐ" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Điểm đến phổ biến nhất" value={popularDestinations.length > 0 ? popularDestinations[0].name : 'N/A'} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Trung bình/chuyến" value={totalItineraries > 0 ? Math.round(totalRevenue / totalItineraries) : 0} suffix="VNĐ" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Số lượng lịch trình theo tháng (Minh họa)">
            <Column {...(columnConfig as any)} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top 5 Điểm đến phổ biến">
            {popularDestinations.length > 0 ? <Bar {...(barConfig as any)} height={300} /> : <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chưa có dữ liệu</div>}
          </Card>
        </Col>
      </Row>

      <Card title="Chi tiết chi tiêu theo hạng mục" style={{ marginTop: 24 }}>
        <Table dataSource={categoryData} columns={columns} pagination={false} rowKey="category" />
      </Card>
    </div>
  );
}
