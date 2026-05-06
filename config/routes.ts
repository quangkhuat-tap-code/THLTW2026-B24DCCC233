import path from "path";

export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user/login',
                layout: false,
                name: 'login',
                component: './user/Login',
            },
            {
                path: '/user',
                redirect: '/user/login',
            },
        ],
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: './TrangChu',
        icon: 'HomeOutlined',
    },
    {
        path: '/random-user',
        name: 'RandomUser',
        component: './RandomUser',
        icon: 'ArrowsAltOutlined',
    },
    {
        path: '/todo-list',
        name: 'TodoList',
        icon: 'OrderedListOutlined',
        component: './TodoList',
    },

    {
        path: '/bai-1',
        name: 'Bài 1: Đoán số',
        icon: 'QuestionCircleOutlined',
        component: './Bai1',
    },
    {
        path: '/bai-2',
        name: 'Bài 2: Quản lý học tập',
        icon: 'BookOutlined',
        component: './Bai2',
    },

    {
        path: '/th02-bai-1',
        name: 'TH02 - Bài 1: Oẳn Tù Tì',
        icon: 'PlayCircleOutlined',
        component: './TH02Bai1',
    },
    {
        path: '/th02-bai-2',
        name: 'TH02 - Bài 2: Ngân hàng câu hỏi',
        icon: 'DatabaseOutlined',
        component: './TH02Bai2',
    },

    {
        path: '/th03',
        name: 'TH03 - Quản lý Đặt lịch',
        icon: 'CalendarOutlined',
        component: './TH03',
    },

    {
        path: '/th04',
        name: 'TH04 - Quản lý văn bằng',
        icon: 'SafetyCertificateOutlined',
        routes: [
            { path: '/th04/so-van-bang', name: 'Quản lý sổ văn bằng', component: './TH04/QuanLySoVanBang' },
            { path: '/th04/quyet-dinh', name: 'Quyết định tốt nghiệp', component: './TH04/QuyetDinhTotNghiep' },
            { path: '/th04/cau-hinh', name: 'Cấu hình biểu mẫu', component: './TH04/CauHinhBieuMau' },
            { path: '/th04/danh-sach', name: 'Thông tin văn bằng', component: './TH04/ThongTinVanBang' },
            { path: '/th04/tra-cuu', name: 'Tra cứu', component: './TH04/TraCuu' },
        ],
    },

    {
        path: '/quan-ly-clb',
        name: 'Quản lý Câu lạc bộ',
        icon: 'team',
        routes: [
            { path: '/quan-ly-clb/danh-sach', name: 'Danh sách CLB', component: './QuanLyCauLacBo/CauLacBo' },
            { path: '/quan-ly-clb/don-dang-ky', name: 'Đơn đăng ký', component: './QuanLyCauLacBo/DonDangKy' },
            { path: '/quan-ly-clb/thanh-vien', name: 'Thành viên CLB', component: './QuanLyCauLacBo/ThanhVien' },
            { path: '/quan-ly-clb/thong-ke', name: 'Báo cáo thống kê', component: './QuanLyCauLacBo/ThongKe' },
        ],
    },

    {
        path: '/products',
        name: 'Quản lý sản phẩm',
        icon: 'table',
        component: './ProductList',
    },

    {
        path: '/quan-ly',
        name: 'Quản lý Hệ thống',
        icon: 'shop',
        routes: [
            { path: '/quan-ly/dashboard', name: 'Thống kê', component: './Dashboard' },
            { path: '/quan-ly/san-pham', name: 'Sản phẩm', component: './ProductManagement' },
            { path: '/quan-ly/don-hang', name: 'Đơn hàng', component: './OrderManagement' },
        ],
    },
    
    {
        path: '/th06',
        name: 'TH06 - Kế hoạch du lịch',
        icon: 'CompassOutlined',
        routes: [
            { path: '/th06/kham-pha', name: 'Khám phá điểm đến', component: './TH06_KeHoachDuLich/KhamPha' },
            { path: '/th06/lich-trinh', name: 'Tạo lịch trình', component: './TH06_KeHoachDuLich/LichTrinh' },
            { path: '/th06/ngan-sach', name: 'Quản lý ngân sách', component: './TH06_KeHoachDuLich/NganSach' },
            { path: '/th06/admin-diem-den', name: 'Admin - Điểm đến', component: './TH06_KeHoachDuLich/AdminDiemDen' },
            { path: '/th06/admin-thong-ke', name: 'Admin - Thống kê', component: './TH06_KeHoachDuLich/AdminThongKe' },
        ],
    },

    {
        path: '/th07',
        name: 'TH07 - Blog cá nhân',
        icon: 'ReadOutlined',
        routes: [
            { path: '/th07/trang-chu', name: 'Trang chủ', component: './TH07_BlogCaNhan/TrangChu' },
            { path: '/th07/bai-viet/:id', name: 'Chi tiết bài viết', component: './TH07_BlogCaNhan/ChiTietBaiViet', hideInMenu: true },
            { path: '/th07/gioi-thieu', name: 'Giới thiệu', component: './TH07_BlogCaNhan/TrangGioiThieu' },
            { path: '/th07/quan-ly-bai-viet', name: 'Quản lý bài viết', component: './TH07_BlogCaNhan/QuanLyBaiViet' },
            { path: '/th07/quan-ly-the', name: 'Quản lý thẻ', component: './TH07_BlogCaNhan/QuanLyThe' },
        ],
    },

    {
        path: '/th08',
        name: 'TH08 - Ứng dụng Thể dục',
        icon: 'HeartOutlined',
        routes: [
            { path: '/th08/trang-chu', name: 'Dashboard', component: './TH08_UDTheDuc/TrangChu' },
            { path: '/th08/nhat-ky-tap-luyen', name: 'Nhật ký tập luyện', component: './TH08_UDTheDuc/NhatKyTapLuyen' },
            { path: '/th08/nhat-ky-chi-so', name: 'Nhật ký chỉ số', component: './TH08_UDTheDuc/NhatKyChiSoSucKhoe' },
            { path: '/th08/quan-ly-muc-tieu', name: 'Quản lý mục tiêu', component: './TH08_UDTheDuc/QuanLyMucTieu' },
            { path: '/th08/thu-vien-bai-tap', name: 'Thư viện bài tập', component: './TH08_UDTheDuc/ThuVienBaiTap' },
        ],
    },

    {
        path: '/th09',
        name: 'TH09 - Theo dõi công việc',
        icon: 'ProjectOutlined',
        routes: [
            { path: '/th09/trang-chu', name: 'Dashboard', component: './TH09_UDTheoDoiCongViec/TrangChu' },
            { path: '/th09/kanban', name: 'Kanban Board', component: './TH09_UDTheoDoiCongViec/BangKanban' },
            { path: '/th09/danh-sach', name: 'Danh sách công việc', component: './TH09_UDTheoDoiCongViec/DanhSachCongViec' },
        ],
    },

    {
        path: '/quan-ly-phong-hoc',
        name: 'Quản lý phòng học',
        icon: 'bank',
        component: './KTGK_QuanLyPhongHoc/DanhSachPhongHoc',
    },

    {
        path: '/notification',
        layout: false,
        hideInMenu: true,
        routes: [
            { path: './subscribe', exact: true, component: './ThongBao/Subscribe' },
            { path: './check', exact: true, component: './ThongBao/Check' },
            { path: './', exact: true, component: './ThongBao/NotifOneSignal' },
        ],
    },
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/403',
        component: './exception/403/403Page',
        layout: false,
    },
    {
        path: '/hold-on',
        component: './exception/DangCapNhat',
        layout: false,
    },
    {
        component: './exception/404',
    },
];