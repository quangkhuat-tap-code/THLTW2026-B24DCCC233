import React from 'react';
import { Classroom, RoomType } from './types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, Button, Space, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface BangPhongHocProps {
  classrooms: Classroom[];
  onEdit: (classroom: Classroom) => void;
  onDelete: (id: string) => void;
}

export const BangPhongHoc: React.FC<BangPhongHocProps> = ({ classrooms, onEdit, onDelete }) => {
  const columns: ColumnsType<Classroom> = [
    {
      title: 'Mã phòng',
      dataIndex: 'id',
      key: 'id',
      fontWeight: 'bold',
    } as any,
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      render: (type: RoomType) => {
        let color = 'default';
        if (type === RoomType.THEORY) color = 'blue';
        if (type === RoomType.PRACTICE) color = 'green';
        if (type === RoomType.HALL) color = 'purple';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'seats',
      key: 'seats',
      align: 'right',
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            ghost
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            size="small"
          />
          <Popconfirm
            title={`Bạn có chắc chắn muốn xóa phòng ${record.name}?`}
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={classrooms} 
      rowKey="id" 
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};
