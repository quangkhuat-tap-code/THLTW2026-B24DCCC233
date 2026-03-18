import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import TabNhanSuDichVu from './components/TabNhanSuDichVu';
import TabLichHen from './components/TabLichHen';
import TabDanhGia from './components/TabDanhGia';
import TabThongKe from './components/TabThongKe';

const { TabPane } = Tabs;

const TH03: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const dS = localStorage.getItem('th03_services');
    const dE = localStorage.getItem('th03_employees');
    const dA = localStorage.getItem('th03_appointments');
    const dR = localStorage.getItem('th03_reviews');
    if (dS) setServices(JSON.parse(dS));
    if (dE) setEmployees(JSON.parse(dE));
    if (dA) setAppointments(JSON.parse(dA));
    if (dR) setReviews(JSON.parse(dR));
  }, []);

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const updateServices = (data: any[]) => {
    setServices(data);
    saveToStorage('th03_services', data);
  };

  const updateEmployees = (data: any[]) => {
    setEmployees(data);
    saveToStorage('th03_employees', data);
  };

  const updateAppointments = (data: any[]) => {
    setAppointments(data);
    saveToStorage('th03_appointments', data);
  };

  const updateReviews = (data: any[]) => {
    setReviews(data);
    saveToStorage('th03_reviews', data);
  };

  return (
    <Card title="TH03 - Hệ thống Quản lý Đặt lịch Dịch vụ">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý Nhân sự & Dịch vụ" key="1">
          <TabNhanSuDichVu 
            services={services} 
            setServices={updateServices} 
            employees={employees} 
            setEmployees={updateEmployees} 
            reviews={reviews} 
          />
        </TabPane>
        <TabPane tab="Quản lý Lịch hẹn" key="2">
          <TabLichHen 
            services={services} 
            employees={employees} 
            appointments={appointments} 
            setAppointments={updateAppointments} 
          />
        </TabPane>
        <TabPane tab="Đánh giá Dịch vụ" key="3">
          <TabDanhGia 
            employees={employees} 
            appointments={appointments} 
            reviews={reviews} 
            setReviews={updateReviews} 
          />
        </TabPane>
        <TabPane tab="Thống kê & Báo cáo" key="4">
          <TabThongKe 
            services={services} 
            employees={employees} 
            appointments={appointments} 
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TH03;