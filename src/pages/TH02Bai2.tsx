import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, Table, Modal, Form, Input, InputNumber, Select, Space, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const DIFF_OPTIONS = [
  { label: 'Dễ', value: 'Dễ' },
  { label: 'Trung bình', value: 'Trung bình' },
  { label: 'Khó', value: 'Khó' },
  { label: 'Rất khó', value: 'Rất khó' },
];

const TH02Bai2: React.FC = () => {
  const [khoiKienThucs, setKhoiKienThucs] = useState<any[]>([]);
  const [monHocs, setMonHocs] = useState<any[]>([]);
  const [cauHois, setCauHois] = useState<any[]>([]);
  const [deThis, setDeThis] = useState<any[]>([]);
  const [cauTrucs, setCauTrucs] = useState<any[]>([]);

  const [isModalKKT, setIsModalKKT] = useState(false);
  const [isModalMonHoc, setIsModalMonHoc] = useState(false);
  const [isModalCauHoi, setIsModalCauHoi] = useState(false);
  

  const [isModalDeThi, setIsModalDeThi] = useState(false);
  const [editingDeThiId, setEditingDeThiId] = useState<string | null>(null);
  const [viewDeThi, setViewDeThi] = useState<any>(null);
  
  const [isModalTenCauTruc, setIsModalTenCauTruc] = useState(false);
  const [tenCauTruc, setTenCauTruc] = useState('');

  const [formKKT] = Form.useForm();
  const [formMonHoc] = Form.useForm();
  const [formCauHoi] = Form.useForm();
  const [formDeThi] = Form.useForm();

  useEffect(() => {
    const dKKT = localStorage.getItem('th02_kkt');
    const dMH = localStorage.getItem('th02_mh');
    const dCH = localStorage.getItem('th02_ch');
    const dDT = localStorage.getItem('th02_dt');
    const dCT = localStorage.getItem('th02_ct');
    if (dKKT) setKhoiKienThucs(JSON.parse(dKKT));
    if (dMH) setMonHocs(JSON.parse(dMH));
    if (dCH) setCauHois(JSON.parse(dCH));
    if (dDT) setDeThis(JSON.parse(dDT));
    if (dCT) setCauTrucs(JSON.parse(dCT));
  }, []);

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSaveKKT = (values: any) => {
    const updated = [...khoiKienThucs, { ...values, id: Date.now().toString() }];
    setKhoiKienThucs(updated);
    saveToStorage('th02_kkt', updated);
    setIsModalKKT(false);
    formKKT.resetFields();
    message.success('Thêm khối kiến thức thành công');
  };

  const handleSaveMonHoc = (values: any) => {
    const updated = [...monHocs, { ...values, id: Date.now().toString() }];
    setMonHocs(updated);
    saveToStorage('th02_mh', updated);
    setIsModalMonHoc(false);
    formMonHoc.resetFields();
    message.success('Thêm môn học thành công');
  };

  const handleSaveCauHoi = (values: any) => {
    const updated = [...cauHois, { ...values, id: Date.now().toString() }];
    setCauHois(updated);
    saveToStorage('th02_ch', updated);
    setIsModalCauHoi(false);
    formCauHoi.resetFields();
    message.success('Thêm câu hỏi thành công');
  };

  const handleSaveStructure = () => {
    const { subjectId, structure } = formDeThi.getFieldsValue();
    if (!subjectId || !structure || structure.length === 0) {
      return message.warning('Vui lòng chọn Môn học và thêm ít nhất 1 tiêu chí cấu trúc!');
    }
    if (!tenCauTruc.trim()) {
      return message.warning('Vui lòng nhập tên cấu trúc!');
    }

    const newCT = { id: Date.now().toString(), name: tenCauTruc, subjectId, structure };
    const updated = [...cauTrucs, newCT];
    setCauTrucs(updated);
    saveToStorage('th02_ct', updated);
    
    setIsModalTenCauTruc(false);
    setTenCauTruc('');
    message.success('Đã lưu cấu trúc mẫu!');
  };

  const handleApplyStructure = (ctId: string) => {
    if (!ctId) return;
    const ct = cauTrucs.find(c => c.id === ctId);
    if (ct) {
      formDeThi.setFieldsValue({
        subjectId: ct.subjectId,
        structure: ct.structure
      });
      message.info(`Đã áp dụng cấu trúc: ${ct.name}`);
    }
  };

  const openCreateExamModal = () => {
    setEditingDeThiId(null);
    formDeThi.resetFields();
    setIsModalDeThi(true);
  };

  const openEditExamModal = (record: any) => {
    setEditingDeThiId(record.id);
    formDeThi.setFieldsValue({
      examName: record.name,
      subjectId: record.subjectId,
      structure: record.structure,
    });
    setIsModalDeThi(true);
  };

  const handleDeleteDeThi = (id: string) => {
    const updated = deThis.filter(dt => dt.id !== id);
    setDeThis(updated);
    saveToStorage('th02_dt', updated);
    message.success('Đã xóa đề thi!');
  };

  const handleGenerateDeThi = (values: any) => {
    const { examName, subjectId, structure } = values;
    
    if (!structure || structure.length === 0) {
      return message.warning('Vui lòng thêm ít nhất 1 cấu trúc đề thi');
    }

    let selectedQuestions: any[] = [];

    for (const req of structure) {
      if (!req || !req.khoiKienThucId || !req.difficulty || !req.count) continue;

      const matched = cauHois.filter((q: any) =>
        q.subjectId === subjectId &&
        q.khoiKienThucId === req.khoiKienThucId &&
        q.difficulty === req.difficulty
      );

      if (matched.length < req.count) {
        const kktName = khoiKienThucs.find((k: any) => k.id === req.khoiKienThucId)?.name;
        message.error(`Không đủ câu hỏi cho "${kktName}", độ khó "${req.difficulty}". Cần ${req.count}, có ${matched.length}`);
        return;
      }

      const shuffled = [...matched].sort(() => 0.5 - Math.random());
      selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, req.count)];
    }

    const newExam = {
      id: editingDeThiId ? editingDeThiId : Date.now().toString(),
      name: examName,
      subjectId,
      structure,
      questions: selectedQuestions
    };

    let updated;
    if (editingDeThiId) {
      updated = deThis.map(dt => dt.id === editingDeThiId ? newExam : dt);
      message.success('Cập nhật đề thi thành công!');
    } else {
      updated = [...deThis, newExam];
      message.success('Tạo đề thi thành công!');
    }

    setDeThis(updated);
    saveToStorage('th02_dt', updated);
    setIsModalDeThi(false);
  };

  return (
    <Card title="TH02 - Bài 2: Hệ thống quản lý ngân hàng câu hỏi">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Khối kiến thức" key="1">
          <Button type="primary" onClick={() => setIsModalKKT(true)} style={{ marginBottom: 16 }}>Thêm Khối KT</Button>
          <Table dataSource={khoiKienThucs} rowKey="id" columns={[
            { title: 'Tên khối kiến thức', dataIndex: 'name' },
            { title: 'Mô tả', dataIndex: 'description' }
          ]} />
        </TabPane>
        
        <TabPane tab="Môn học" key="2">
          <Button type="primary" onClick={() => setIsModalMonHoc(true)} style={{ marginBottom: 16 }}>Thêm Môn học</Button>
          <Table dataSource={monHocs} rowKey="id" columns={[
            { title: 'Mã môn', dataIndex: 'code' },
            { title: 'Tên môn', dataIndex: 'name' },
            { title: 'Số tín chỉ', dataIndex: 'credits' }
          ]} />
        </TabPane>

        <TabPane tab="Ngân hàng Câu hỏi" key="3">
          <Button type="primary" onClick={() => setIsModalCauHoi(true)} style={{ marginBottom: 16 }}>Thêm Câu hỏi</Button>
          <Table dataSource={cauHois} rowKey="id" columns={[
            { title: 'Mã CH', dataIndex: 'code' },
            { title: 'Nội dung', dataIndex: 'content' },
            { title: 'Môn học', render: (_: any, r: any) => monHocs.find(m => m.id === r.subjectId)?.name },
            { title: 'Khối KT', render: (_: any, r: any) => <Tag color="blue">{khoiKienThucs.find(k => k.id === r.khoiKienThucId)?.name}</Tag> },
            { title: 'Độ khó', render: (_: any, r: any) => <Tag color={r.difficulty === 'Dễ' ? 'green' : r.difficulty === 'Khó' ? 'red' : 'orange'}>{r.difficulty}</Tag> }
          ]} />
        </TabPane>

        <TabPane tab="Quản lý Đề thi" key="4">
          <Button type="primary" onClick={openCreateExamModal} style={{ marginBottom: 16 }}>Tạo Đề thi tự động</Button>
          <Table dataSource={deThis} rowKey="id" columns={[
            { title: 'Tên đề thi', dataIndex: 'name' },
            { title: 'Môn học', render: (_: any, r: any) => monHocs.find(m => m.id === r.subjectId)?.name },
            { title: 'Tổng số câu', render: (_: any, r: any) => r.questions.length },
            {
              title: 'Hành động',
              render: (_: any, r: any) => (
                <Space>
                  <Button type="link" onClick={() => setViewDeThi(r)}>Xem</Button>
                  <Button type="link" onClick={() => openEditExamModal(r)}>Sửa</Button>
                  <Popconfirm title="Bạn có chắc muốn xóa đề thi này?" onConfirm={() => handleDeleteDeThi(r.id)}>
                    <Button type="link" danger>Xóa</Button>
                  </Popconfirm>
                </Space>
              )
            }
          ]} />
        </TabPane>
      </Tabs>

      <Modal title="Thêm Khối kiến thức" visible={isModalKKT} onCancel={() => setIsModalKKT(false)} onOk={() => formKKT.submit()}>
        <Form form={formKKT} onFinish={handleSaveKKT} layout="vertical">
          <Form.Item name="name" label="Tên khối kiến thức" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Thêm Môn học" visible={isModalMonHoc} onCancel={() => setIsModalMonHoc(false)} onOk={() => formMonHoc.submit()}>
        <Form form={formMonHoc} onFinish={handleSaveMonHoc} layout="vertical">
          <Form.Item name="code" label="Mã môn" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="name" label="Tên môn" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="credits" label="Số tín chỉ" rules={[{ required: true }]}><InputNumber min={1} style={{ width: '100%' }}/></Form.Item>
        </Form>
      </Modal>

      <Modal title="Thêm Câu hỏi" visible={isModalCauHoi} onCancel={() => setIsModalCauHoi(false)} onOk={() => formCauHoi.submit()}>
        <Form form={formCauHoi} onFinish={handleSaveCauHoi} layout="vertical">
          <Form.Item name="code" label="Mã câu hỏi" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
            <Select options={monHocs.map(m => ({ label: m.name, value: m.id }))} />
          </Form.Item>
          <Form.Item name="khoiKienThucId" label="Khối kiến thức" rules={[{ required: true }]}>
            <Select options={khoiKienThucs.map(k => ({ label: k.name, value: k.id }))} />
          </Form.Item>
          <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true }]}>
            <Select options={DIFF_OPTIONS} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true }]}><Input.TextArea rows={4}/></Form.Item>
        </Form>
      </Modal>

      <Modal 
        title={editingDeThiId ? "Chỉnh sửa Đề thi" : "Tạo Đề thi"} 
        visible={isModalDeThi} 
        onCancel={() => setIsModalDeThi(false)} 
        onOk={() => formDeThi.submit()} 
        width={750}
        okText={editingDeThiId ? "Cập nhật lại câu hỏi" : "Tạo Đề"}
      >
        <div style={{ marginBottom: 16, padding: '10px 15px', background: '#f5f5f5', borderRadius: 6 }}>
          <b>Sử dụng cấu trúc mẫu:</b>
          <Space style={{ display: 'flex', marginTop: 8 }}>
            <Select 
              placeholder="-- Chọn cấu trúc mẫu đã lưu --" 
              style={{ width: 250 }} 
              allowClear 
              onChange={handleApplyStructure}
              options={cauTrucs.map(c => ({ label: c.name, value: c.id }))} 
            />
            <Button icon={<SaveOutlined />} onClick={() => setIsModalTenCauTruc(true)}>Lưu cấu trúc hiện tại</Button>
          </Space>
        </div>

        <Form form={formDeThi} onFinish={handleGenerateDeThi} layout="vertical">
          <Form.Item name="examName" label="Tên đề thi" rules={[{ required: true }]}><Input placeholder="VD: Đề thi cuối kỳ" /></Form.Item>
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn học" options={monHocs.map(m => ({ label: m.name, value: m.id }))} />
          </Form.Item>
          
          <Card size="small" title="Cấu trúc đề thi" style={{ marginBottom: 16 }}>
            <Form.List name="structure">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'khoiKienThucId']} rules={[{ required: true, message: 'Thiếu' }]}>
                        <Select placeholder="Khối kiến thức" style={{ width: 220 }} options={khoiKienThucs.map(k => ({ label: k.name, value: k.id }))} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'difficulty']} rules={[{ required: true, message: 'Thiếu' }]}>
                        <Select placeholder="Độ khó" style={{ width: 130 }} options={DIFF_OPTIONS} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'count']} rules={[{ required: true, message: 'Thiếu' }]}>
                        <InputNumber placeholder="SL" min={1} style={{ width: 80 }} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red', marginLeft: 8 }} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Thêm tiêu chí cấu trúc</Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Form>
      </Modal>

      <Modal title="Lưu Cấu trúc mẫu" visible={isModalTenCauTruc} onCancel={() => setIsModalTenCauTruc(false)} onOk={handleSaveStructure}>
        <Input 
          placeholder="Nhập tên cấu trúc (VD: Cấu trúc Toán dễ)" 
          value={tenCauTruc} 
          onChange={e => setTenCauTruc(e.target.value)} 
          onPressEnter={handleSaveStructure}
        />
      </Modal>

      <Modal title={`Chi tiết đề thi: ${viewDeThi?.name}`} visible={!!viewDeThi} onCancel={() => setViewDeThi(null)} footer={null} width={800}>
        <Table dataSource={viewDeThi?.questions} rowKey="id" pagination={false} columns={[
          { title: 'Mã CH', dataIndex: 'code', width: 100 },
          { title: 'Nội dung', dataIndex: 'content' },
          { title: 'Độ khó', dataIndex: 'difficulty', width: 120, render: (t) => <Tag>{t}</Tag> }
        ]} />
      </Modal>
    </Card>
  );
};

export default TH02Bai2;