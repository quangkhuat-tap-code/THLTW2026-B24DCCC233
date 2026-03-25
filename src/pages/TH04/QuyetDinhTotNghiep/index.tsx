import React, { useRef } from 'react';
import { ActionType, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const QuyetDinhTotNghiep: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    { title: 'Số Quyết định', dataIndex: 'so_quyet_dinh', formItemProps: { rules: [{ required: true }] } },
    { title: 'Ngày ban hành', dataIndex: 'ngay_ban_hanh', valueType: 'date', formItemProps: { rules: [{ required: true }] } },
    { title: 'Trích yếu', dataIndex: 'trich_yeu', ellipsis: true },
    { title: 'Thuộc sổ năm', dataIndex: 'so_van_bang_nam', formItemProps: { rules: [{ required: true }] } },
    { title: 'Lượt tra cứu', dataIndex: 'luot_tra_cuu', valueType: 'digit', readonly: true },
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
        <Popconfirm key="delete" title="Xóa quyết định này?" onConfirm={() => message.success('Đã xóa')}>
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
      options={false} // Tắt mật độ/cấu hình
      request={async () => {
        return {
          data: [
            { id: '1', so_quyet_dinh: '123/QĐ-PTIT', ngay_ban_hanh: '2026-05-15', trich_yeu: 'Công nhận tốt nghiệp đợt 1', so_van_bang_nam: '2026', luot_tra_cuu: 142 },
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
              // Gọi đúng hàm Hủy của Ant Design
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
      headerTitle="Danh sách Quyết định tốt nghiệp"
      toolBarRender={() => [
        <Button 
          key="add" 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            if (actionRef.current && actionRef.current.addEditRecord) {
              actionRef.current.addEditRecord({ 
                id: Date.now().toString(), 
                luot_tra_cuu: 0 
              });
            }
          }}
        >
          Thêm Quyết định
        </Button>
      ]}
    />
  );
};

export default QuyetDinhTotNghiep;