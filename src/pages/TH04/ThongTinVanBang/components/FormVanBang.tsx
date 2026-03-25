import { useEffect, useState } from 'react';
import { ModalForm, ProFormText, ProFormDatePicker, ProFormSelect, ProFormDigit } from '@ant-design/pro-components';
import { message } from 'antd';

export default function FormVanBang({ visible, setVisible, onFinish }: any) {
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);

  useEffect(() => {
    if (visible) {
      setDynamicFields([
        { ma_truong: 'dan_toc', ten_truong: 'Dân tộc', kieu_du_lieu: 'STRING' },
        { ma_truong: 'diem_tb', ten_truong: 'Điểm trung bình', kieu_du_lieu: 'NUMBER' },
      ]);
    }
  }, [visible]);

  return (
    <ModalForm
      title="Thêm mới văn bằng"
      open={visible}
      onOpenChange={setVisible}
      onFinish={async (values) => {
        message.success('Thêm mới văn bằng thành công!');
        if (onFinish) {
          onFinish(values);
        }
        return true;
      }}
    >
      <ProFormSelect name="quyet_dinh_id" label="Quyết định" rules={[{ required: true }]} options={[{ label: '123/QĐ-PTIT', value: 'qd1' }]} />
      <ProFormText name="so_vao_so" label="Số vào sổ" disabled placeholder="Hệ thống tự động sinh khi lưu" />
      <ProFormText name="so_hieu_van_bang" label="Số hiệu văn bằng" rules={[{ required: true }]} />
      <ProFormText name="ma_sinh_vien" label="Mã sinh viên" rules={[{ required: true }]} />
      <ProFormText name="ho_ten" label="Họ và tên" rules={[{ required: true }]} />
      <ProFormDatePicker name="ngay_sinh" label="Ngày sinh" rules={[{ required: true }]} />

      {dynamicFields.map((field) => {
        const fieldName = ['thong_tin_bo_sung', field.ma_truong];
        if (field.kieu_du_lieu === 'STRING') return <ProFormText key={field.ma_truong} name={fieldName} label={field.ten_truong} rules={[{ required: true }]} />;
        if (field.kieu_du_lieu === 'NUMBER') return <ProFormDigit key={field.ma_truong} name={fieldName} label={field.ten_truong} rules={[{ required: true }]} />;
        if (field.kieu_du_lieu === 'DATE') return <ProFormDatePicker key={field.ma_truong} name={fieldName} label={field.ten_truong} rules={[{ required: true }]} />;
        return null;
      })}
    </ModalForm>
  );
}