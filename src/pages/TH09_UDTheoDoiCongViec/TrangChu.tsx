import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ProjectOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useCongViec } from './useCongViec';
import moment from 'moment';

const TrangChu: React.FC = () => {
  const { danhSachCongViec } = useCongViec();

  const tongSoTask = danhSachCongViec.length;
  const soTaskHoanThanh = danhSachCongViec.filter((cv) => cv.trangThai === 'Hoàn thành').length;
  
  const now = moment().startOf('day');
  const soTaskQuaHan = danhSachCongViec.filter((cv) => {
    return cv.trangThai !== 'Hoàn thành' && moment(cv.deadline).isBefore(now);
  }).length;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Dashboard Quản lý Công việc</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tổng số công việc"
              value={tongSoTask}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Số công việc hoàn thành"
              value={soTaskHoanThanh}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Số công việc quá hạn"
              value={soTaskQuaHan}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrangChu;
