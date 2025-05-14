import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);

    const acheiveBooking = async (bookingId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xác nhận đặt phòng này không?')) {
            return;
        }

        try {
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("Đặt phòng đã được xác nhận thành công.");

                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="find-booking-page">
            <h2>Chi tiết đặt phòng</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Thông tin đặt phòng</h3>
                    <p>Mã xác nhận: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Ngày nhận phòng: {bookingDetails.checkInDate}</p>
                    <p>Ngày trả phòng: {bookingDetails.checkOutDate}</p>
                    <p>Số lượng người lớn: {bookingDetails.numOfAdults}</p>
                    <p>Số lượng trẻ em: {bookingDetails.numOfChildren}</p>
                    <p>Email khách: {bookingDetails.guestEmail}</p>

                    <br />
                    <hr />
                    <br />
                    <h3>Thông tin khách hàng</h3>
                    <div>
                        <p>Tên: {bookingDetails.user.name}</p>
                        <p>Email: {bookingDetails.user.email}</p>
                        <p>Số điện thoại: {bookingDetails.user.phoneNumber}</p>
                    </div>

                    <br />
                    <hr />
                    <br />
                    <h3>Thông tin phòng</h3>
                    <div>
                        <p>Loại phòng: {bookingDetails.room.roomType}</p>
                        <p>Giá phòng: ${bookingDetails.room.roomPrice}</p>
                        <p>Mô tả phòng: {bookingDetails.room.roomDescription}</p>
                        <img src={bookingDetails.room.roomPhotoUrl} alt="Hình ảnh phòng" />
                    </div>
                    <button
                        className="acheive-booking"
                        onClick={() => acheiveBooking(bookingDetails.id)}>
                        Xác nhận đặt phòng
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;
