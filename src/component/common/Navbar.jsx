import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

function Navbar() {
    const isAuthenticated = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();
    const isUser = ApiService.isUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi người dùng này không');
        if (isLogout) {
            ApiService.logout();
            navigate('/home');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">YangHong Hotel</NavLink>
            </div>
            <ul className="navbar-ul">
                <li><NavLink to="/home" activeclassname="active">Trang chủ</NavLink></li>
                <li><NavLink to="/rooms" activeclassname="active">Tất cả phòng</NavLink></li>
                <li><NavLink to="/find-booking" activeclassname="active">Tìm kiếm lịch sử đặt phòng của tôi</NavLink></li>

                {isUser && <li><NavLink to="/profile" activeclassname="active">Hồ sơ</NavLink></li>}
                {isAdmin && <li><NavLink to="/admin" activeclassname="active">Quản trị</NavLink></li>}

                {!isAuthenticated &&<li><NavLink to="/login" activeclassname="active">Đăng nhập</NavLink></li>}
                {!isAuthenticated &&<li><NavLink to="/register" activeclassname="active">Đăng ký</NavLink></li>}
                {isAuthenticated && <li onClick={handleLogout}>Đăng xuất</li>}
            </ul>
        </nav>
    );
}

export default Navbar;
