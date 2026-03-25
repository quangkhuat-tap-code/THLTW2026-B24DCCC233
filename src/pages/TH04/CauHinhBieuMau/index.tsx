import React, { useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const CauHinhBieuMau: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    { title: 'Mã trường', dataIndex: 'ma_truong', formItemProps: { rules: [{ required: true }] } },
    { title: 'Tên trường hiển thị', dataIndex: 'ten_truong', formItemProps: { rules: [{ required: true }] } },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieu_du_lieu',
      valueType: 'select',
      valueEnum: {
        STRING: { text: 'Văn bản (String)', status: 'Default' },
        NUMBER: { text: 'Số (Number)', status: 'Success' },
        DATE: { text: 'Ngày tháng (Date)', status: 'Processing' },
      },
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a 
          key="edit" 
          onClick={() => {
            if (action && action.startEditable) action.startEditable(record.id);
          }}
        >
          <EditOutlined /> Sửa
        </a>,
        <Popconfirm key="delete" title="Xóa?" onConfirm={() => message.success('Đã xóa')}>
          <a style={{ color: 'red' }}><DeleteOutlined /> Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      options={false}
      request={async () => {
        return {
          data: [
            { id: '1', ma_truong: 'dan_toc', ten_truong: 'Dân tộc', kieu_du_lieu: 'STRING' },
            { id: '2', ma_truong: 'diem_tb', ten_truong: 'Điểm trung bình', kieu_du_lieu: 'NUMBER' },
          ],
          success: true,
        };
      }}
      editable={{ 
        type: 'multiple',
        actionRender: (row, config) => [
          <a
            key="save"
            onClick={() => {
              if (config && config.onSave) config.onSave(config.recordKey, row, row);
            }}
          >
            Lưu
          </a>,
          <a
            key="cancel"
            onClick={() => {
              if (actionRef.current && actionRef.current.cancelEditable) {
                actionRef.current.cancelEditable(config.recordKey || row.id);
              }
            }}
          >
            Hủy
          </a>,
        ],
      }}
      rowKey="id"
      search={false}
      headerTitle="Cấu hình biểu mẫu văn bằng"
      toolBarRender={() => [
        <Button 
          key="add" 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            if (actionRef.current && actionRef.current.addEditRecord) {
              actionRef.current.addEditRecord({ id: Date.now().toString() });
            }
          }}
        >
          Thêm trường mới
        </Button>,
      ]}
    />
  );
};

export default CauHinhBieuMau;