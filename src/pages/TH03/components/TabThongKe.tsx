import React from 'react';
import { Row, Col, Card, Statistic, Table } from 'antd';
import moment from 'moment';

const TabThongKe: React.FC<any> = ({ services, employees, appointments }) => {
  const completedAppointments = appointments.filter((a: any) => a.status === 'Hoàn thành');

  const totalRevenue = completedAppointments.reduce((sum: number, a: any) => {
    const srv = services.find((s: any) => s.id === a.serviceId);
    return sum + (srv ? srv.price : 0);
  }, 0);

  const completedCount = completedAppointments.length;

  const revenueByDate = Object.entries(completedAppointments.reduce((acc: any, a: any) => {
    const srv = services.find((s: any) => s.id === a.serviceId);
    acc[a.date] = (acc[a.date] || 0) + (srv ? srv.price : 0);
    return acc;
  }, {})).map(([date, total]) => ({ date, total }));

  const revenueByMonth = Object.entries(completedAppointments.reduce((acc: any, a: any) => {
    const month = moment(a.date).format('MM/YYYY');
    const srv = services.find((s: any) => s.id === a.serviceId);
    acc[month] = (acc[month] || 0) + (srv ? srv.price : 0);
    return acc;
  }, {})).map(([month, total]) => ({ month, total }));

  const revenueByService = Object.entries(completedAppointments.reduce((acc: any, a: any) => {
    const srv = services.find((s: any) => s.id === a.serviceId);
    if (srv) acc[srv.name] = (acc[srv.name] || 0) + srv.price;
    return acc;
  }, {})).map(([name, total]) => ({ name, total }));

  const revenueByEmployee = Object.entries(completedAppointments.reduce((acc: any, a: any) => {
    const emp = employees.find((e: any) => e.id === a.employeeId);
    const srv = services.find((s: any) => s.id === a.serviceId);
    if (emp && srv) acc[emp.name] = (acc[emp.name] || 0) + srv.price;
    return acc;
  }, {})).map(([name, total]) => ({ name, total }));

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="Tổng số lịch hẹn đã tạo" value={appointments.length} suffix="lịch" /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Lịch hẹn Hoàn thành" value={completedCount} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Tổng Doanh thu" value={totalRevenue} suffix="VNĐ" valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Doanh thu theo Ngày" style={{ marginBottom: 16 }}>
            <Table dataSource={revenueByDate} rowKey="date" pagination={{ pageSize: 5 }} size="small" columns={[
              { title: 'Ngày', dataIndex: 'date' },
              { title: 'Doanh thu', dataIndex: 'total', render: (val: any) => val.toLocaleString() + ' VNĐ' }
            ]} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo Tháng" style={{ marginBottom: 16 }}>
            <Table dataSource={revenueByMonth} rowKey="month" pagination={{ pageSize: 5 }} size="small" columns={[
              { title: 'Tháng', dataIndex: 'month' },
              { title: 'Doanh thu', dataIndex: 'total', render: (val: any) => val.toLocaleString() + ' VNĐ' }
            ]} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Doanh thu theo Dịch vụ">
            <Table dataSource={revenueByService} rowKey="name" pagination={{ pageSize: 5 }} size="small" columns={[
              { title: 'Dịch vụ', dataIndex: 'name' },
              { title: 'Doanh thu', dataIndex: 'total', render: (val: any) => val.toLocaleString() + ' VNĐ' }
            ]} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo Nhân viên">
            <Table dataSource={revenueByEmployee} rowKey="name" pagination={{ pageSize: 5 }} size="small" columns={[
              { title: 'Nhân viên', dataIndex: 'name' },
              { title: 'Doanh thu', dataIndex: 'total', render: (val: any) => val.toLocaleString() + ' VNĐ' }
            ]} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default TabThongKe;