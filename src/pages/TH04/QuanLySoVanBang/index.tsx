import React, { useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

type SoVanBangItem = { id: string; nam: string; so_vao_so_hien_tai: number };

const QuanLySoVanBang: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<SoVanBangItem>[] = [
    {
      title: 'Năm cấp',
      dataIndex: 'nam',
      formItemProps: { 
        rules: [
          { required: true, message: 'Vui lòng nhập năm' },
          { pattern: /^[0-9]{4}$/, message: 'Năm phải là số có 4 chữ số' }
        ] 
      },
    },
    {
      title: 'Số vào sổ hiện tại',
      dataIndex: 'so_vao_so_hien_tai',
      valueType: 'digit',
      readonly: true,
      tooltip: 'Tự động tăng khi thêm văn bằng mới, bắt đầu từ 0',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a 
          key="edit" 
          onClick={() => {
            if (action && action.startEditable) {
              action.startEditable(record.id);
            }
          }}
        >
          <EditOutlined /> Sửa
        </a>,
        <Popconfirm key="delete" title="Xóa sổ này?" onConfirm={() => message.success('Đã xóa')}>
          <a style={{ color: 'red' }}><DeleteOutlined /> Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<SoVanBangItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async () => {
        return {
          data: [{ id: '1', nam: '2026', so_vao_so_hien_tai: 15 }],
          success: true,
        };
      }}
      options={false}
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
      headerTitle="Quản lý sổ văn bằng"
      toolBarRender={() => [
        <Button 
          key="add" 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            if (actionRef.current && actionRef.current.addEditRecord) {
              actionRef.current.addEditRecord({ 
                id: Date.now().toString(), 
                so_vao_so_hien_tai: 0 
              });
            }
          }}
        >
          Mở sổ mới
        </Button>,
      ]}
    />
  );
};

export default QuanLySoVanBang;