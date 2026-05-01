import React from 'react';
import { Card, Row, Col, Statistic, Timeline } from 'antd';
import { Column, Line } from '@ant-design/plots';
import { FireOutlined, CalendarOutlined, TrophyOutlined, AimOutlined } from '@ant-design/icons';
import { mockWorkouts, mockHealthMetrics, mockGoals } from './mockData';

const TrangChu: React.FC = () => {
  const workoutData = [
    { week: 'Tuần 1', value: 3 },
    { week: 'Tuần 2', value: 5 },
    { week: 'Tuần 3', value: 4 },
    { week: 'Tuần 4', value: 6 },
  ];

  const columnConfig = {
    data: workoutData,
    xField: 'week',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      week: { alias: 'Tuần' },
      value: { alias: 'Số buổi tập' },
    },
  };

  const lineConfig = {
    data: mockHealthMetrics,
    padding: 'auto',
    xField: 'ngay',
    yField: 'canNang',
    xAxis: {
      tickCount: 5,
    },
    smooth: true,
  };

  const tongBuoiTap = mockWorkouts.length;
  const tongCalo = mockWorkouts.reduce((acc, curr) => acc + curr.caloDot, 0);
  const streak = 3;
  const mucTieuHoanThanh = mockGoals.filter((g) => g.trangThai === 'Đã đạt').length;
  const phanTramHoanThanh = mockGoals.length > 0 ? Math.round((mucTieuHoanThanh / mockGoals.length) * 100) : 0;

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng buổi tập (Tháng)" value={tongBuoiTap} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng calo đốt (kcal)" value={tongCalo} prefix={<FireOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Streak (Ngày liên tiếp)" value={streak} prefix={<TrophyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Mục tiêu hoàn thành (%)" value={phanTramHoanThanh} prefix={<AimOutlined />} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Số buổi tập theo tuần">
            <Column {...(columnConfig as any)} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Sự thay đổi cân nặng">
            <Line {...(lineConfig as any)} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="5 buổi tập gần nhất">
            <Timeline>
              {mockWorkouts.slice(0, 5).map((workout) => (
                <Timeline.Item key={workout.id} color={workout.trangThai === 'Hoàn thành' ? 'green' : 'red'}>
                  <p>
                    <strong>{workout.ngay}</strong> - {workout.loaiBaiTap} ({workout.thoiLuong} phút)
                  </p>
                  <p>Calo: {workout.caloDot} kcal | Ghi chú: {workout.ghiChu}</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrangChu;
