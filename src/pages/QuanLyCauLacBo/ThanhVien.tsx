import React, { useState } from 'react';
import { ProTable, ProColumns, ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { Button, message, Space, Alert } from 'antd';
import { getApps, setApps, getClubs } from './mockData';

const ThanhVien: React.FC = () => {
  const [data, setData] = useState(getApps().filter((item: any) => item.trang_thai === 'Approved'));
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [transferModal, setTransferModal] = useState(false);

  const clubs = getClubs();
  const clubEnum = clubs.reduce((acc: any, cur: any) => ({ ...acc, [cur.id]: cur.ten_clb }), {});
  const clubOptions = clubs.map((c: any) => ({ label: c.ten_clb, value: c.id }));

  const handleTransfer = (newClubId: string) => {
    const newData = data.map((item: any) => {
      if (selectedRowKeys.indexOf(item.id) !== -1) {
        return { ...item, clb_id: newClubId };
      }
      return item;
    });
    setData(newData);

    const allApps = getApps();
    const newAllApps = allApps.map((item: any) => {
      if (selectedRowKeys.indexOf(item.id) !== -1) {
        return { ...item, clb_id: newClubId };
      }
      return item;
    });
    setApps(newAllApps);

    message.success("Đã chuyển " + selectedRowKeys.length + " thành viên sang Câu lạc bộ mới");
    setTransferModal(false);
    setSelectedRowKeys([]);
  };

  const columns: ProColumns[] = [
    { title: 'Họ tên', dataIndex: 'ho_ten' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'sdt' },
    { title: 'Câu lạc bộ hiện tại', dataIndex: 'clb_id', valueType: 'select', valueEnum: clubEnum },
    { title: 'Sở trường', dataIndex: 'so_truong' },
  ];

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        options={false}
        search={false}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Button 
              type="primary" 
              disabled={selectedRowKeys.length === 0}
              onClick={() => setTransferModal(true)}
            >
              Đổi Câu lạc bộ
            </Button>
          </Space>
        )}
        headerTitle="Danh sách Thành viên Câu lạc bộ"
      />

      <ModalForm
        title="Đổi Câu lạc bộ cho thành viên"
        open={transferModal}
        onOpenChange={setTransferModal}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (values) => {
          handleTransfer(values.clb_id);
          return true;
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Alert 
            message={"Bạn đang thao tác chuyển Câu lạc bộ cho " + selectedRowKeys.length + " thành viên đã chọn."} 
            type="info" 
            showIcon 
          />
        </div>
        <ProFormSelect
          name="clb_id"
          label="Chọn Câu lạc bộ muốn chuyển đến"
          rules={[{ required: true, message: 'Vui lòng chọn Câu lạc bộ' }]}
          options={clubOptions}
        />
      </ModalForm>
    </>
  );
};

export default ThanhVien;