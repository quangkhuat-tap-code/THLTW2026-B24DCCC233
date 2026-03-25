import React, { useState } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormVanBang from './components/FormVanBang';

const ThongTinVanBang: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const [dataSource, setDataSource] = useState<any[]>([
    { 
      id: '1', 
      so_hieu_van_bang: 'VN0001', 
      so_vao_so: '2026-01', 
      ma_sinh_vien: 'B24DCCC233', 
      ho_ten: 'Khuất Tiến Quang', 
      ngay_sinh: '2006-01-01' 
    }
  ]);

  const columns: ProColumns[] = [
    { title: 'Số hiệu VB', dataIndex: 'so_hieu_van_bang' },
    { title: 'Số vào sổ', dataIndex: 'so_vao_so' },
    { title: 'Mã SV', dataIndex: 'ma_sinh_vien' },
    { title: 'Họ và tên', dataIndex: 'ho_ten' },
    { title: 'Ngày sinh', dataIndex: 'ngay_sinh', valueType: 'date' },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        cardBordered
        rowKey="id"
        options={false}
        search={false}
        headerTitle="Danh sách văn bằng tốt nghiệp"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            Cấp văn bằng mới
          </Button>
        ]}
      />
      <FormVanBang 
        visible={modalVisible} 
        setVisible={setModalVisible} 
        onFinish={(values: any) => {
          const newData = {
            id: Date.now().toString(),
            so_vao_so: `2026-${dataSource.length + 1 < 10 ? '0' : ''}${dataSource.length + 1}`,
            ...values
          };
          setDataSource([newData, ...dataSource]);
          setModalVisible(false);
        }} 
      />
    </>
  );
};

export default ThongTinVanBang;