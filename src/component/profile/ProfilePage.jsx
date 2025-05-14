import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings.user);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page">
            {user && <h2>Xin chào, {user.name}</h2>}
            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>Chỉnh sửa hồ sơ</button>
                <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <h3>Thông tin cá nhân</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
                </div>
            )}
            <div className="bookings-section">
                <h3>Lịch sử đặt phòng</h3>
                <div className="booking-list">
                    {user && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <p><strong>Mã đặt phòng:</strong> {booking.bookingConfirmationCode}</p>
                                <p><strong>Ngày nhận phòng:</strong> {booking.checkInDate}</p>
                                <p><strong>Ngày trả phòng:</strong> {booking.checkOutDate}</p>
                                <p><strong>Tổng số khách:</strong> {booking.totalNumOfGuest}</p>
                                <p><strong>Loại phòng:</strong> {booking.room.roomType}</p>
                                <img src={booking.room.roomPhotoUrl} alt="Ảnh phòng" className="room-photo" />
                            </div>
                        ))
                    ) : (
                        <p>Không tìm thấy lịch sử đặt phòng.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
