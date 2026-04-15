import React, { useState, useMemo } from 'react';
import { BangPhongHoc } from './BangPhongHoc';
import { FormPhongHoc } from './FormPhongHoc';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { Classroom, RoomType, MANAGERS } from './types';
import { Card, Button, Input, Select, Row, Col, Typography, message } from 'antd';

const { Title, Text } = Typography;
const { Search } = Input;

const mockData: Classroom[] = [
  { id: 'LT01', name: 'Phòng Lý Thuyết 01', seats: 50, type: RoomType.THEORY, manager: MANAGERS[0] },
  { id: 'TH01', name: 'Phòng Thực Hành 01', seats: 40, type: RoomType.PRACTICE, manager: MANAGERS[1] },
  { id: 'HT01', name: 'Hội Trường Lớn', seats: 200, type: RoomType.HALL, manager: MANAGERS[2] },
  { id: 'LT02', name: 'Phòng Lý Thuyết 02', seats: 25, type: RoomType.THEORY, manager: MANAGERS[3] },
];

const DanhSachPhongHoc: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Classroom | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<RoomType | 'ALL'>('ALL');
  const [filterManager, setFilterManager] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC' | 'NONE'>('NONE');

  const filteredAndSortedClassrooms = useMemo(() => {
    let result = classrooms.filter(room => {
      const matchSearch = room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'ALL' || room.type === filterType;
      const matchManager = filterManager === 'ALL' || room.manager === filterManager;
      
      return matchSearch && matchType && matchManager;
    });

    if (sortOrder !== 'NONE') {
      result = result.sort((a, b) => {
        return sortOrder === 'ASC' ? a.seats - b.seats : b.seats - a.seats;
      });
    }

    return result;
  }, [classrooms, searchTerm, filterType, filterManager, sortOrder]);

  const handleAddSubmit = (data: Classroom) => {
    setClassrooms([...classrooms, data]);
    setIsFormOpen(false);
  };

  const handleEditSubmit = (data: Classroom) => {
    setClassrooms(classrooms.map(c => c.id === data.id ? data : c));
    setEditingRoom(null);
  };

  const handleDelete = (id: string) => {
    const room = classrooms.find(c => c.id === id);
    if (!room) return;

    if (room.seats >= 30) {
      message.error(`Không thể xóa phòng ${room.name} vì số chỗ ngồi (${room.seats}) >= 30.`);
      return;
    }
    setClassrooms(classrooms.filter(c => c.id !== id));
    message.success('Đã xoá phòng học');
  };

  const openAddForm = () => {
    setEditingRoom(null);
    setIsFormOpen(true);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Quản Lý Phòng Học</Title>
            <Text type="secondary">Hệ thống quản lý thông tin phòng học trong trường đại học</Text>
          </Col>
          <Col>
             <Button type="primary" icon={<PlusOutlined />} onClick={openAddForm} size="large">
              Thêm phòng học
            </Button>
          </Col>
        </Row>

        <Card bordered={false} style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="Tìm mã hoặc tên phòng..."
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="ALL">Tất cả loại phòng</Select.Option>
                {Object.values(RoomType).map(type => (
                  <Select.Option key={type} value={type}>{type}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={filterManager}
                onChange={setFilterManager}
                style={{ width: '100%' }}
                size="large"
              >
                <Select.Option value="ALL">Tất cả người quản lý</Select.Option>
                {MANAGERS.map(manager => (
                  <Select.Option key={manager} value={manager}>{manager}</Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                onClick={() => setSortOrder(prev => prev === 'NONE' ? 'ASC' : prev === 'ASC' ? 'DESC' : 'NONE')}
                icon={<FilterOutlined />}
                size="large"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                Sắp xếp: {sortOrder === 'NONE' ? 'Mặc định' : sortOrder === 'ASC' ? 'Tăng dần' : 'Giảm dần'}
              </Button>
            </Col>
          </Row>
        </Card>

        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
          <BangPhongHoc
            classrooms={filteredAndSortedClassrooms}
            onEdit={setEditingRoom}
            onDelete={handleDelete}
          />
        </Card>

        {(isFormOpen || editingRoom) && (
          <FormPhongHoc
            initialData={editingRoom}
            existingClassrooms={classrooms}
            onSubmit={editingRoom ? handleEditSubmit : handleAddSubmit}
            onCancel={() => { setIsFormOpen(false); setEditingRoom(null); }}
          />
        )}
      </main>
    </div>
  );
};

export default DanhSachPhongHoc;
