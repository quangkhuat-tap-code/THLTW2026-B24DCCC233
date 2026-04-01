import React, { useState, useRef } from 'react';
import { ActionType, ProTable, ProColumns, ModalForm, ProFormText, ProFormDatePicker, ProFormTextArea, ProFormSwitch } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag, Drawer, List, Avatar, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { getClubs, setClubs, getApps } from './mockData';

const CauLacBo: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [data, setData] = useState(getClubs());
  const [memberVisible, setMemberVisible] = useState(false);
  const [currentClub, setCurrentClub] = useState<any>(null);
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState<any>({});

  const handleBatchDelete = () => {
    const newData = data.filter((item: any) => selectedRowKeys.indexOf(item.id) === -1);
    setData(newData);
    setClubs(newData);
    message.success('Đã xóa ' + selectedRowKeys.length + ' Câu lạc bộ');
    setSelectedRowKeys([]);
  };

  const showMembers = (record: any) => {
    const allApps = getApps();
    const members = allApps.filter(
      (app: any) => app.clb_id === record.id && app.trang_thai === 'Approved'
    );
    setCurrentClub(record);
    setClubMembers(members);
    setMemberVisible(true);
  };

  const columns: ProColumns[] = [
    { title: 'Ảnh', dataIndex: 'avatar', valueType: 'avatar', hideInSearch: true },
    { 
      title: 'Tên câu lạc bộ', 
      dataIndex: 'ten_clb',
      sorter: (a: any, b: any) => a.ten_clb.localeCompare(b.ten_clb)
    },
    { 
      title: 'Ngày thành lập', 
      dataIndex: 'ngay_thanh_lap', 
      valueType: 'date',
      hideInSearch: true,
      sorter: (a: any, b: any) => new Date(a.ngay_thanh_lap).getTime() - new Date(b.ngay_thanh_lap).getTime()
    },
    { 
      title: 'Chủ nhiệm', 
      dataIndex: 'chu_nhiem',
      sorter: (a: any, b: any) => (a.chu_nhiem || '').localeCompare(b.chu_nhiem || '')
    },
    { title: 'Mô tả', dataIndex: 'mo_ta', hideInSearch: true, hideInTable: true },
    {
      title: 'Hoạt động',
      dataIndex: 'hoat_dong',
      valueType: 'select',
      valueEnum: {
        true: { text: 'Đang hoạt động', status: 'Success' },
        false: { text: 'Ngừng hoạt động', status: 'Error' },
      },
      render: (_, record) => (
        <Tag color={record.hoat_dong ? 'green' : 'red'}>
          {record.hoat_dong ? 'Có' : 'Không'}
        </Tag>
      ),
      sorter: (a: any, b: any) => (a.hoat_dong === b.hoat_dong ? 0 : a.hoat_dong ? -1 : 1)
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (text, record) => [
        <a key="members" onClick={() => showMembers(record)}><TeamOutlined /> Thành viên</a>,
        <a key="edit" onClick={() => { setCurrentRow(record); setModalVisible(true); }}><EditOutlined /> Sửa</a>,
        <Popconfirm
          key="delete"
          title="Xóa câu lạc bộ này?"
          onConfirm={() => {
            const newData = data.filter((item: any) => item.id !== record.id);
            setData(newData);
            setClubs(newData);
            message.success('Đã xóa thành công');
          }}
        >
          <a style={{ color: 'red' }}><DeleteOutlined /> Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  const filteredData = data.filter((item: any) => {
    let match = true;
    if (searchParams.ten_clb && item.ten_clb && item.ten_clb.toLowerCase().indexOf(searchParams.ten_clb.toLowerCase()) === -1) match = false;
    if (searchParams.chu_nhiem && item.chu_nhiem && item.chu_nhiem.toLowerCase().indexOf(searchParams.chu_nhiem.toLowerCase()) === -1) match = false;
    if (searchParams.hoat_dong !== undefined && String(item.hoat_dong) !== String(searchParams.hoat_dong)) match = false;
    return match;
  });

  return (
    <>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        dataSource={filteredData}
        cardBordered
        rowKey="id"
        options={false}
        search={{ labelWidth: 'auto' }}
        onSubmit={(params) => setSearchParams(params)}
        onReset={() => setSearchParams({})}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <Popconfirm title="Chắc chắn xóa các CLB đã chọn?" onConfirm={handleBatchDelete}>
              <Button danger disabled={selectedRowKeys.length === 0}>Xóa CLB đã chọn</Button>
            </Popconfirm>
          </Space>
        )}
        headerTitle="Danh sách Câu lạc bộ"
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
            Thêm CLB
          </Button>,
        ]}
      />

      <ModalForm
        title={currentRow ? "Chỉnh sửa Câu lạc bộ" : "Thêm mới Câu lạc bộ"}
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        initialValues={currentRow || { hoat_dong: true }}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (values) => {
          const currentData = getClubs();
          if (currentRow) {
            const newData = currentData.map((item: any) => item.id === currentRow.id ? { ...currentRow, ...values } : item);
            setClubs(newData);
            setData(newData);
            message.success('Cập nhật thành công');
          } else {
            const newData = [{ 
              id: Date.now().toString(), 
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
              ...values 
            }, ...currentData];
            setClubs(newData);
            setData(newData);
            message.success('Thêm mới thành công');
          }
          return true;
        }}
      >
        <ProFormText name="ten_clb" label="Tên câu lạc bộ" rules={[{ required: true }]} />
        <ProFormDatePicker name="ngay_thanh_lap" label="Ngày thành lập" />
        <ProFormText name="chu_nhiem" label="Chủ nhiệm" />
        <ProFormTextArea name="mo_ta" label="Mô tả" />
        <ProFormSwitch name="hoat_dong" label="Đang hoạt động" />
      </ModalForm>

      <Drawer
        title={currentClub ? "Thành viên CLB: " + currentClub.ten_clb : "Danh sách"}
        width={500}
        visible={memberVisible}
        onClose={() => setMemberVisible(false)}
      >
        <List
          itemLayout="horizontal"
          dataSource={clubMembers}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={"https://joeschmoe.io/api/v1/" + item.ho_ten} />}
                title={item.ho_ten}
                description={"SĐT: " + item.sdt}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};

export default CauLacBo;