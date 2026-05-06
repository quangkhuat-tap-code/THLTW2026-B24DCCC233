import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Typography, Row, Col } from 'antd';
import { useCongViec } from './useCongViec';
import { CongViec, TRANG_THAI } from './types';
import moment from 'moment';

const { Title, Text } = Typography;

const getPriorityColor = (priority: string) => {
  if (priority === 'Cao') return 'red';
  if (priority === 'Trung bình') return 'orange';
  return 'green';
};

const BangKanban: React.FC = () => {
  const { danhSachCongViec, capNhatTrangThai } = useCongViec();
  const [columns, setColumns] = useState<Record<string, CongViec[]>>({
    'Cần làm': [],
    'Đang làm': [],
    'Hoàn thành': [],
  });

  useEffect(() => {
    const newColumns: Record<string, CongViec[]> = {
      'Cần làm': [],
      'Đang làm': [],
      'Hoàn thành': [],
    };
    danhSachCongViec.forEach(cv => {
      if (newColumns[cv.trangThai]) {
        newColumns[cv.trangThai].push(cv);
      }
    });
    setColumns(newColumns);
  }, [danhSachCongViec]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = [...columns[source.droppableId]];
      const destColumn = [...columns[destination.droppableId]];
      const [removed] = sourceColumn.splice(source.index, 1);
      
      const newStatus = destination.droppableId as 'Cần làm' | 'Đang làm' | 'Hoàn thành';
      removed.trangThai = newStatus;
      
      destColumn.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });

      capNhatTrangThai(draggableId, newStatus);
    } else {
      const column = [...columns[source.droppableId]];
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: column,
      });
    }
  };

  return (
    <div style={{ padding: 24, height: '100%' }}>
      <Title level={3} style={{ marginBottom: 24 }}>Kanban Board</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={[16, 16]} style={{ minHeight: '600px' }}>
          {TRANG_THAI.map((trangThai) => (
            <Col xs={24} md={8} key={trangThai}>
              <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '8px', height: '100%' }}>
                <Title level={4} style={{ textAlign: 'center', marginBottom: 16 }}>{trangThai}</Title>
                <Droppable droppableId={trangThai}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        minHeight: '500px',
                        background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {columns[trangThai].map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                marginBottom: '16px',
                                ...provided.draggableProps.style,
                              }}
                            >
                              <Card
                                size="small"
                                style={{
                                  boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
                                  borderRadius: '8px',
                                  borderLeft: `4px solid ${getPriorityColor(item.mucDoUuTien)}`
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Text strong>{item.tenCongViec}</Text>
                                  <Tag color={getPriorityColor(item.mucDoUuTien)}>{item.mucDoUuTien}</Tag>
                                </div>
                                <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: '12px' }}>
                                  {item.moTa}
                                </div>
                                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {item.tags.map(tag => <Tag key={tag} style={{ fontSize: '10px', margin: 0 }}>{tag}</Tag>)}
                                </div>
                                <div style={{ marginTop: 8, fontSize: '12px', textAlign: 'right', color: moment(item.deadline).isBefore(moment().startOf('day')) && item.trangThai !== 'Hoàn thành' ? 'red' : 'inherit' }}>
                                  Hạn: {moment(item.deadline).format('DD/MM/YYYY')}
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </div>
  );
};

export default BangKanban;
