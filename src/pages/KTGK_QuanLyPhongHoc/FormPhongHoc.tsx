import React, { useEffect } from 'react';
import { Classroom, RoomType, MANAGERS } from './types';
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';

interface FormPhongHocProps {
  initialData?: Classroom | null;
  onSubmit: (data: Classroom) => void;
  onCancel: () => void;
  existingClassrooms: Classroom[];
}

export const FormPhongHoc: React.FC<FormPhongHocProps> = ({ initialData, onSubmit, onCancel, existingClassrooms }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.setFieldsValue({
        seats: 10,
        type: RoomType.THEORY,
        manager: MANAGERS[0],
      });
    }
  }, [initialData, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const isDuplicateId = existingClassrooms.some(c => c.id === values.id && c.id !== initialData?.id);
      if (isDuplicateId) {
        message.error('Mã phòng đã tồn tại.');
        return;
      }

      const isDuplicateName = existingClassrooms.some(c => c.name === values.name && c.id !== initialData?.id);
      if (isDuplicateName) {
        message.error('Tên phòng đã tồn tại.');
        return;
      }

      onSubmit(values as Classroom);
      message.success(initialData ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
    }).catch(err => {
      console.log('Validate Failed:', err);
    });
  };

  return (
    <Modal
      title={<div style={{ fontSize: 18 }}>{initialData ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'}</div>}
      visible={true}
      onOk={handleOk}
      onCancel={onCancel}
      width={600}
      okText="Lưu thông tin"
      cancelText="Hủy bỏ"
      style={{ top: 40 }}
    >
      <Form
        form={form}
        layout="vertical"
        name="classroom_form"
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="id"
          label={<span style={{ fontWeight: 500 }}>Mã phòng</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập mã phòng!' },
            { max: 10, message: 'Mã phòng tối đa 10 ký tự!' },
            { whitespace: true, message: 'Mã phòng không được chỉ chứa khoảng trắng!' }
          ]}
        >
          <Input disabled={!!initialData} placeholder="Vd: P101" size="large" />
        </Form.Item>

        <Form.Item
          name="name"
          label={<span style={{ fontWeight: 500 }}>Tên phòng</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập tên phòng!' },
            { max: 50, message: 'Tên phòng tối đa 50 ký tự!' }
          ]}
        >
          <Input placeholder="Vd: Phòng học đa năng" size="large" />
        </Form.Item>

        <Form.Item
          name="type"
          label={<span style={{ fontWeight: 500 }}>Loại phòng</span>}
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
        >
          <Select size="large">
            {Object.values(RoomType).map(type => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="manager"
          label={<span style={{ fontWeight: 500 }}>Người phụ trách</span>}
          rules={[{ required: true, message: 'Vui lòng chọn người phụ trách!' }]}
        >
          <Select size="large">
            {MANAGERS.map(manager => (
              <Select.Option key={manager} value={manager}>{manager}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="seats"
          label={<span style={{ fontWeight: 500 }}>Số chỗ ngồi</span>}
          rules={[
            { required: true, message: 'Vui lòng nhập số chỗ ngồi!' },
            { type: 'number', min: 10, max: 200, message: 'Số chỗ ngồi phải từ 10 đến 200!' }
          ]}
        >
          <InputNumber style={{ width: '100%' }} size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
