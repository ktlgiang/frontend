import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setUser(response.user);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleDeleteProfile = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản của mình không?')) {
            return;
        }
        try {
            await ApiService.deleteMyAccount(); // dùng API mới
            navigate('/signup');
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="edit-profile-page">
            <h2>Chỉnh sửa hồ sơ</h2>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <p><strong>Họ và tên:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
                    <button className="delete-profile-button" onClick={handleDeleteProfile}>
                        Xóa tài khoản
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditProfilePage;
