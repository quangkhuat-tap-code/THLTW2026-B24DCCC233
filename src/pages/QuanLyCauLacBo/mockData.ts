const initData = () => {
  if (!localStorage.getItem('clb_list')) {
    localStorage.setItem('clb_list', JSON.stringify([
      { id: 'clb1', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg', ten_clb: 'CLB Âm Nhạc', ngay_thanh_lap: '2020-01-01', mo_ta: 'CLB dành cho người yêu nhạc', chu_nhiem: 'Nguyễn Văn A', hoat_dong: true },
      { id: 'clb2', avatar: 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpOthOioDZSxd.svg', ten_clb: 'CLB Tin Học', ngay_thanh_lap: '2018-05-15', mo_ta: 'Code dạo', chu_nhiem: 'Trần Thị B', hoat_dong: true },
    ]));
  }
  if (!localStorage.getItem('don_dang_ky')) {
    localStorage.setItem('don_dang_ky', JSON.stringify([
      { id: '1', ho_ten: 'Khuất Tiến Quang', email: 'quang@gmail.com', sdt: '0333133391', gioi_tinh: 'Nam', dia_chi: 'Hà Nội', so_truong: 'Hát, Guitar', clb_id: 'clb1', ly_do: 'Thích đàn hát', trang_thai: 'Pending', ghi_chu: '' },
      { id: '2', ho_ten: 'Nguyễn Văn C', email: 'vanc@gmail.com', sdt: '0987654321', gioi_tinh: 'Nam', dia_chi: 'Hải Phòng', so_truong: 'Code React', clb_id: 'clb2', ly_do: 'Muốn học hỏi', trang_thai: 'Approved', ghi_chu: '' },
    ]));
  }
  if (!localStorage.getItem('lich_su_duyet')) {
    localStorage.setItem('lich_su_duyet', JSON.stringify([]));
  }
};

initData();

export const getClubs = () => JSON.parse(localStorage.getItem('clb_list') || '[]');
export const setClubs = (data: any) => localStorage.setItem('clb_list', JSON.stringify(data));

export const getApps = () => JSON.parse(localStorage.getItem('don_dang_ky') || '[]');
export const setApps = (data: any) => localStorage.setItem('don_dang_ky', JSON.stringify(data));

export const getHistory = () => JSON.parse(localStorage.getItem('lich_su_duyet') || '[]');
export const addHistory = (action: string) => {
  const h = getHistory();
  h.unshift({ id: Date.now().toString(), time: new Date().toLocaleString(), action });
  localStorage.setItem('lich_su_duyet', JSON.stringify(h));
};