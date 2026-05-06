import { useState, useEffect } from 'react';
import { CongViec } from './types';
import moment from 'moment';

const LOCAL_STORAGE_KEY = 'TH09_CONG_VIEC_DATA';

export const useCongViec = () => {
  const [danhSachCongViec, setDanhSachCongViec] = useState<CongViec[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      try {
        setDanhSachCongViec(JSON.parse(data));
      } catch (e) {
        console.error('Error parsing data', e);
      }
    } else {
      const mockData: CongViec[] = [
        {
          id: '1',
          tenCongViec: 'Thiết kế giao diện',
          moTa: 'Hoàn thiện giao diện Figma cho ứng dụng',
          deadline: moment().add(2, 'days').format('YYYY-MM-DD'),
          mucDoUuTien: 'Cao',
          trangThai: 'Cần làm',
          tags: ['Design', 'Figma'],
        },
        {
          id: '2',
          tenCongViec: 'Viết API đăng nhập',
          moTa: 'Tạo API authentication bằng JWT',
          deadline: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          mucDoUuTien: 'Cao',
          trangThai: 'Đang làm',
          tags: ['Backend', 'Auth'],
        },
        {
          id: '3',
          tenCongViec: 'Cài đặt CSDL',
          moTa: 'Setup MongoDB và các collection cơ bản',
          deadline: moment().subtract(5, 'days').format('YYYY-MM-DD'),
          mucDoUuTien: 'Trung bình',
          trangThai: 'Hoàn thành',
          tags: ['Database', 'MongoDB'],
        },
      ];
      setDanhSachCongViec(mockData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockData));
    }
  }, []);

  const saveDanhSachCongViec = (newDanhSach: CongViec[]) => {
    setDanhSachCongViec(newDanhSach);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDanhSach));
  };

  const themCongViec = (congViec: CongViec) => {
    const updatedList = [...danhSachCongViec, congViec];
    saveDanhSachCongViec(updatedList);
  };

  const suaCongViec = (id: string, updatedData: Partial<CongViec>) => {
    const updatedList = danhSachCongViec.map(cv => (cv.id === id ? { ...cv, ...updatedData } : cv));
    saveDanhSachCongViec(updatedList);
  };

  const xoaCongViec = (id: string) => {
    const updatedList = danhSachCongViec.filter(cv => cv.id !== id);
    saveDanhSachCongViec(updatedList);
  };

  const capNhatTrangThai = (id: string, trangThaiMoi: 'Cần làm' | 'Đang làm' | 'Hoàn thành') => {
    suaCongViec(id, { trangThai: trangThaiMoi });
  };

  return {
    danhSachCongViec,
    themCongViec,
    suaCongViec,
    xoaCongViec,
    capNhatTrangThai,
    saveDanhSachCongViec
  };
};
