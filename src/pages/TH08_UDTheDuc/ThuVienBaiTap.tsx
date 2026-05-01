import React, { useState } from 'react';
import { Card, Row, Col, Input, Select, Button, Space, Modal, Tag, Form, InputNumber, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockExercises } from './mockData';

const { Meta } = Card;

const ThuVienBaiTap: React.FC = () => {
  const [data, setData] = useState(mockExercises);
  const [searchText, setSearchText] = useState('');
  const [filterNhomCo, setFilterNhomCo] = useState<string | undefined>(undefined);
  const [filterMucDo, setFilterMucDo] = useState<string | undefined>(undefined);
  
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const showDetail = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDetailVisible(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setData(data.filter((item) => item.id !== id));
    message.success('Đã xóa bài tập!');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingItem) {
        setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...values } : item)));
        message.success('Đã cập nhật bài tập!');
      } else {
        setData([...data, { id: Date.now().toString(), ...values }]);
        message.success('Đã thêm bài tập mới!');
      }
      setIsModalVisible(false);
    });
  };

  const getDifficultyColor = (level: string) => {
    if (level === 'Dễ') return 'green';
    if (level === 'Trung bình') return 'orange';
    if (level === 'Khó') return 'red';
    return 'default';
  };

  const filteredData = data.filter((item) => {
    const matchSearch = item.tenBaiTap.toLowerCase().includes(searchText.toLowerCase());
    const matchNhomCo = filterNhomCo ? item.nhomCo === filterNhomCo : true;
    const matchMucDo = filterMucDo ? item.mucDoKho === filterMucDo : true;
    return matchSearch && matchNhomCo && matchMucDo;
  });

  return (
    <div style={{ padding: 24 }}>
      <Card title="Thư viện bài tập">
        <Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm bài tập..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Nhóm cơ"
            allowClear
            style={{ width: 150 }}
            onChange={(val) => setFilterNhomCo(val)}
          >
            <Select.Option value="Chest">Chest</Select.Option>
            <Select.Option value="Back">Back</Select.Option>
            <Select.Option value="Legs">Legs</Select.Option>
            <Select.Option value="Shoulders">Shoulders</Select.Option>
            <Select.Option value="Arms">Arms</Select.Option>
            <Select.Option value="Core">Core</Select.Option>
            <Select.Option value="Full Body">Full Body</Select.Option>
          </Select>
          <Select
            placeholder="Mức độ khó"
            allowClear
            style={{ width: 150 }}
            onChange={(val) => setFilterMucDo(val)}
          >
            <Select.Option value="Dễ">Dễ</Select.Option>
            <Select.Option value="Trung bình">Trung bình</Select.Option>
            <Select.Option value="Khó">Khó</Select.Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm bài tập
          </Button>
        </Space>

        <Row gutter={[16, 16]}>
          {filteredData.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card
                hoverable
                onClick={() => showDetail(item)}
                actions={[
                  <EditOutlined key="edit" onClick={(e) => handleEdit(item, e)} />,
                  <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={(e: any) => handleDelete(item.id, e)} onCancel={(e: any) => e.stopPropagation()}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DeleteOutlined key="delete" style={{ color: 'red' }} />
                    </div>
                  </Popconfirm>,
                ]}
              >
                <Meta
                  title={item.tenBaiTap}
                  description={
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <Tag color="blue">{item.nhomCo}</Tag>
                        <Tag color={getDifficultyColor(item.mucDoKho)}>{item.mucDoKho}</Tag>
                      </div>
                      <p style={{ margin: '8px 0', minHeight: 44 }}>{item.moTaNgan}</p>
                      <p style={{ margin: 0 }}><strong>Calo/giờ:</strong> {item.caloTieuHao} kcal</p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title={selectedExercise?.tenBaiTap}
        visible={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedExercise && (
          <div>
            <p><strong>Nhóm cơ:</strong> {selectedExercise.nhomCo}</p>
            <p><strong>Mức độ khó:</strong> <Tag color={getDifficultyColor(selectedExercise.mucDoKho)}>{selectedExercise.mucDoKho}</Tag></p>
            <p><strong>Calo tiêu hao/giờ:</strong> {selectedExercise.caloTieuHao} kcal</p>
            <p><strong>Mô tả:</strong> {selectedExercise.moTaNgan}</p>
            <div>
              <strong>Hướng dẫn thực hiện:</strong>
              <p style={{ whiteSpace: 'pre-line', marginTop: 8 }}>{selectedExercise.huongDan}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={editingItem ? 'Sửa bài tập' : 'Thêm bài tập mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tenBaiTap" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nhomCo" label="Nhóm cơ" rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}>
            <Select>
              <Select.Option value="Chest">Chest</Select.Option>
              <Select.Option value="Back">Back</Select.Option>
              <Select.Option value="Legs">Legs</Select.Option>
              <Select.Option value="Shoulders">Shoulders</Select.Option>
              <Select.Option value="Arms">Arms</Select.Option>
              <Select.Option value="Core">Core</Select.Option>
              <Select.Option value="Full Body">Full Body</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="mucDoKho" label="Mức độ khó" rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}>
            <Select>
              <Select.Option value="Dễ">Dễ</Select.Option>
              <Select.Option value="Trung bình">Trung bình</Select.Option>
              <Select.Option value="Khó">Khó</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="caloTieuHao" label="Calo tiêu hao trung bình/giờ" rules={[{ required: true, message: 'Vui lòng nhập lượng calo' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="moTaNgan" label="Mô tả ngắn" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="huongDan" label="Hướng dẫn thực hiện" rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ThuVienBaiTap;
