import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import Chart from 'react-apexcharts';
import { getClubs, getApps } from './mockData';

const ThongKe: React.FC = () => {
  const clubs = getClubs();
  const apps = getApps();

  const totalPending = apps.filter((a: any) => a.trang_thai === 'Pending').length;
  const totalApproved = apps.filter((a: any) => a.trang_thai === 'Approved').length;
  const totalRejected = apps.filter((a: any) => a.trang_thai === 'Rejected').length;

  // Xử lý dữ liệu cho biểu đồ cột
  const clubNames = clubs.map((c: any) => c.ten_clb);
  const dataPending = clubs.map((c: any) => apps.filter((a: any) => a.clb_id === c.id && a.trang_thai === 'Pending').length);
  const dataApproved = clubs.map((c: any) => apps.filter((a: any) => a.clb_id === c.id && a.trang_thai === 'Approved').length);
  const dataRejected = clubs.map((c: any) => apps.filter((a: any) => a.clb_id === c.id && a.trang_thai === 'Rejected').length);

  const chartOptions = {
    chart: { type: 'bar', stacked: false },
    xaxis: { categories: clubNames },
    colors: ['#faad14', '#52c41a', '#ff4d4f'],
    plotOptions: { bar: { columnWidth: '50%' } }
  };

  const chartSeries = [
    { name: 'Pending', data: dataPending },
    { name: 'Approved', data: dataApproved },
    { name: 'Rejected', data: dataRejected },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="Tổng số Câu lạc bộ" value={clubs.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="Đơn chờ duyệt" value={totalPending} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="Đơn đã duyệt" value={totalApproved} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="Đơn từ chối" value={totalRejected} valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      <Card title="Biểu đồ số lượng đơn đăng ký theo từng Câu lạc bộ">
        {/* @ts-ignore - Ignore type error from apexcharts if any */}
        <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </Card>
    </div>
  );
};
export default ThongKe;