import React, { useState } from 'react';
import { ProTable, ProColumns, ModalForm, ProFormTextArea, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, message, Tag, Space, Drawer, List, Popconfirm, Descriptions, Modal } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { getApps, setApps, getClubs, addHistory, getHistory } from './mockData';

const DonDangKy: React.FC = () => {
  const [data, setData] = useState(getApps());
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [viewRecord, setViewRecord] = useState<any>(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);

  const clubs = getClubs();
  const clubEnum = clubs.reduce((acc: any, cur: any) => ({ ...acc, [cur.id]: cur.ten_clb }), {});

  const handleApprove = (keys: React.Key[]) => {
    const newData = data.map((item: any) => keys.indexOf(item.id) !== -1 ? { ...item, trang_thai: 'Approved' } : item);
    setData(newData);
    setApps(newData);
    addHistory("Admin đã DUYỆT " + keys.length + " đơn đăng ký");
    message.success("Đã duyệt " + keys.length + " đơn");
    setSelectedRowKeys([]);
  };

  const handleReject = (reason: string) => {
    const newData = data.map((item: any) => selectedRowKeys.indexOf(item.id) !== -1 ? { ...item, trang_thai: 'Rejected', ghi_chu: reason } : item);
    setData(newData);
    setApps(newData);
    addHistory("Admin đã TỪ CHỐI " + selectedRowKeys.length + " đơn với lý do: " + reason);
    message.success("Đã từ chối " + selectedRowKeys.length + " đơn");
    setRejectModalVisible(false);
    setSelectedRowKeys([]);
  };

  const columns: ProColumns[] = [
    { title: 'Họ tên', dataIndex: 'ho_ten' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'sdt' },
    { 
      title: 'Giới tính', 
      dataIndex: 'gioi_tinh', 
      valueType: 'select',
      valueEnum: { 'Nam': { text: 'Nam' }, 'Nữ': { text: 'Nữ' }, 'Khác': { text: 'Khác' } },
      hideInSearch: true
    },
    { title: 'Câu lạc bộ', dataIndex: 'clb_id', valueType: 'select', valueEnum: clubEnum },
    {
      title: 'Trạng thái', 
      dataIndex: 'trang_thai',
      render: (_, record) => {
        let color = 'gold';
        if (record.trang_thai === 'Approved') color = 'green';
        if (record.trang_thai === 'Rejected') color = 'red';
        return <Tag color={color}>{record.trang_thai}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (text, record) => [
        <a key="view" onClick={() => setViewRecord(record)}><EyeOutlined /> Xem</a>,
        <a key="edit" onClick={() => { setCurrentRow(record); setModalVisible(true); }}><EditOutlined /> Sửa</a>,
        <Popconfirm 
          key="delete" 
          title="Xóa đơn này?" 
          onConfirm={() => {
            const newData = data.filter((item: any) => item.id !== record.id);
            setData(newData);
            setApps(newData);
            message.success('Đã xóa đơn');
          }}
        >
          <a style={{ color: 'red' }}><DeleteOutlined /> Xóa</a>
        </Popconfirm>,
      ],
    },
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
            <Button type="primary" onClick={() => handleApprove(selectedRowKeys)}>Duyệt đơn đã chọn</Button>
            <Button danger onClick={() => setRejectModalVisible(true)}>Từ chối đơn đã chọn</Button>
          </Space>
        )}
        headerTitle="Danh sách Đơn đăng ký"
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRow(null);
              setModalVisible(true);
            }}
          >
            Thêm mới
          </Button>,
          <Button key="history" icon={<HistoryOutlined />} onClick={() => setHistoryVisible(true)}>Lịch sử duyệt</Button>
        ]}
      />

      <ModalForm
        title={currentRow ? "Chỉnh sửa Đơn đăng ký" : "Thêm mới Đơn đăng ký"}
        open={modalVisible}
        onOpenChange={setModalVisible}
        initialValues={currentRow || { gioi_tinh: 'Nam' }}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (values) => {
          const currentData = getApps();
          if (currentRow) {
            const newData = currentData.map((item: any) => item.id === currentRow.id ? { ...currentRow, ...values } : item);
            setData(newData);
            setApps(newData);
            message.success('Cập nhật thành công');
          } else {
            const newData = [{ id: Date.now().toString(), trang_thai: 'Pending', ...values }, ...currentData];
            setData(newData);
            setApps(newData);
            message.success('Thêm mới thành công');
          }
          return true;
        }}
      >
        <ProFormText name="ho_ten" label="Họ tên" rules={[{ required: true }]} />
        <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email' }]} />
        <ProFormText name="sdt" label="Số điện thoại" rules={[{ required: true }]} />
        <ProFormSelect name="gioi_tinh" label="Giới tính" options={['Nam', 'Nữ', 'Khác']} rules={[{ required: true }]} />
        <ProFormText name="dia_chi" label="Địa chỉ" />
        <ProFormSelect name="clb_id" label="Câu lạc bộ" valueEnum={clubEnum} rules={[{ required: true }]} />
        <ProFormText name="so_truong" label="Sở trường" />
        <ProFormTextArea name="ly_do" label="Lý do đăng ký" />
      </ModalForm>

      <Modal title="Chi tiết đơn đăng ký" visible={!!viewRecord} onCancel={() => setViewRecord(null)} footer={null} width={600}>
        {viewRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ tên">{viewRecord.ho_ten}</Descriptions.Item>
            <Descriptions.Item label="Email">{viewRecord.email}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{viewRecord.sdt}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{viewRecord.gioi_tinh}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{viewRecord.dia_chi}</Descriptions.Item>
            <Descriptions.Item label="Câu lạc bộ">{clubEnum[viewRecord.clb_id]}</Descriptions.Item>
            <Descriptions.Item label="Sở trường">{viewRecord.so_truong}</Descriptions.Item>
            <Descriptions.Item label="Lý do đăng ký">{viewRecord.ly_do}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{viewRecord.trang_thai}</Descriptions.Item>
            {viewRecord.ghi_chu && <Descriptions.Item label="Ghi chú từ chối">{viewRecord.ghi_chu}</Descriptions.Item>}
          </Descriptions>
        )}
      </Modal>

      <ModalForm title="Lý do từ chối" open={rejectModalVisible} onOpenChange={setRejectModalVisible} onFinish={async (values) => handleReject(values.ly_do)}>
        <ProFormTextArea name="ly_do" label="Nhập lý do từ chối (bắt buộc)" rules={[{ required: true }]} />
      </ModalForm>

      <Drawer title="Lịch sử thao tác hệ thống" visible={historyVisible} onClose={() => setHistoryVisible(false)} width={400}>
        <List dataSource={getHistory()} renderItem={(item: any) => (
          <List.Item><List.Item.Meta title={item.action} description={item.time} /></List.Item>
        )} />
      </Drawer>
    </>
  );
};

export default DonDangKy;