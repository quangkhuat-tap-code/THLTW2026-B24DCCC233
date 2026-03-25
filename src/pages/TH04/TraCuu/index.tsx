import React, { useState } from 'react';
import { ProForm, ProFormText, ProFormDatePicker } from '@ant-design/pro-components';
import { Card, message, Descriptions } from 'antd';

const TraCuuVanBang: React.FC = () => {
  const [ketQua, setKetQua] = useState<any>(null);

  const handleSearch = async (values: any) => {
    let activeParamsCount = 0;
    const keys = Object.keys(values);
    
    for (let i = 0; i < keys.length; i++) {
      const val = values[keys[i]];
      if (val !== undefined && val !== null && val !== '') {
        activeParamsCount++;
      }
    }

    if (activeParamsCount < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số để tra cứu thông tin!');
      return;
    }
    
    message.loading({ content: 'Đang tra cứu hệ thống...', key: 'search' });
    
    setTimeout(() => {
      setKetQua({
        so_hieu_van_bang: values.so_hieu_van_bang || 'VN0001',
        so_vao_so: values.so_vao_so || '2026-01',
        ma_sinh_vien: values.ma_sinh_vien || 'B24DCCC233',
        ho_ten: values.ho_ten || 'Khuất Tiến Quang',
        quyet_dinh: '123/QĐ-PTIT',
        tong_luot_tra_cuu_qd: 143 
      });

      message.success({ 
        content: 'Tìm thấy văn bằng! Đã ghi nhận thêm 1 lượt tra cứu cho Quyết định tốt nghiệp này.', 
        key: 'search',
        duration: 4
      });
    }, 1000);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="Tra cứu văn bằng tốt nghiệp">
        <ProForm submitter={{ searchConfig: { submitText: 'Tra cứu', resetText: 'Làm lại' } }} onFinish={handleSearch}>
          <ProForm.Group>
            <ProFormText width="md" name="so_hieu_van_bang" label="Số hiệu văn bằng" />
            <ProFormText width="md" name="so_vao_so" label="Số vào sổ" />
            <ProFormText width="md" name="ma_sinh_vien" label="Mã sinh viên" />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText width="md" name="ho_ten" label="Họ tên" />
            <ProFormDatePicker width="md" name="ngay_sinh" label="Ngày sinh" />
          </ProForm.Group>
        </ProForm>
      </Card>

      {ketQua && (
        <Card style={{ marginTop: 24 }} title="Kết quả tra cứu">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Số hiệu">{ketQua.so_hieu_van_bang}</Descriptions.Item>
            <Descriptions.Item label="Số vào sổ">{ketQua.so_vao_so}</Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{ketQua.ma_sinh_vien}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{ketQua.ho_ten}</Descriptions.Item>
            <Descriptions.Item label="Quyết định">{ketQua.quyet_dinh}</Descriptions.Item>
            <Descriptions.Item label="Tổng lượt tra cứu QĐ">
              <span style={{ color: 'red', fontWeight: 'bold' }}>{ketQua.tong_luot_tra_cuu_qd} lượt</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
};

export default TraCuuVanBang;