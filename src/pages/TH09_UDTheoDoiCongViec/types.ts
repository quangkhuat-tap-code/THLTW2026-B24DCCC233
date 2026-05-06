export interface CongViec {
  id: string;
  tenCongViec: string;
  moTa: string;
  deadline: string;
  mucDoUuTien: 'Cao' | 'Trung bình' | 'Thấp';
  trangThai: 'Cần làm' | 'Đang làm' | 'Hoàn thành';
  tags: string[];
}

export const TRANG_THAI = ['Cần làm', 'Đang làm', 'Hoàn thành'] as const;
export const MUC_DO_UU_TIEN = ['Cao', 'Trung bình', 'Thấp'] as const;
