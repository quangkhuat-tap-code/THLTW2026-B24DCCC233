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