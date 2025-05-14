import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const today = new Date(); // Lấy ngày hôm nay

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
      return;
    }

    if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
      setErrorMessage('Please enter valid numbers for adults and children.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    const totalGuests = numAdults + numChildren;
    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };

  const acceptBooking = async () => {
    try {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms');
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (isLoading) {
    return <p className='room-detail-loading'>Đang tải chi tiết phòng...</p>;
  }

  if (error) {
    return <p className='room-detail-loading'>{error}</p>;
  }

  if (!roomDetails) {
    return <p className='room-detail-loading'>Không tìm thấy phòng.</p>;
  }

  return (
      <div className="room-details-booking">
        {showMessage && (
            <p className="booking-success-message">
              Đặt phòng thành công!! Mã xác nhận {confirmationCode}. Một tin nhắn đặt chỗ và thông tin email của bạn sẽ được gửi đến bạn.
            </p>
        )}
        {errorMessage && (
            <p className="error-message">
              {errorMessage}
            </p>
        )}
        <h2>Chi tiết phòng</h2>
        <br />
        <img src={roomDetails.roomPhotoUrl} alt={roomDetails.roomType} className="room-details-image" />
        <div className="room-details-info">
          <h3>{roomDetails.roomType}</h3>
          <p>Giá: ${roomDetails.roomPrice} / night</p>
          <p>{roomDetails.description}</p>
        </div>

        <div className="booking-info">
          <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Đặt ngay bây giờ</button>
          <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Trở lại</button>

          {showDatePicker && (
              <div className="date-picker-container">
                <DatePicker
                    className="detail-search-field"
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    selectsStart
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={today}  // Cho phép chọn từ ngày hôm nay
                    placeholderText="Ngày vào"
                    dateFormat="dd/MM/yyyy"
                />
                <DatePicker
                    className="detail-search-field"
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    selectsEnd
                    startDate={checkInDate}
                    endDate={checkOutDate}
                    minDate={checkInDate}  // Ngày ra không được nhỏ hơn ngày vào
                    placeholderText="Ngày ra"
                    dateFormat="dd/MM/yyyy"
                />

                <div className='guest-container'>
                  <div className="guest-div">
                    <label>Người lớn:</label>
                    <input
                        type="number"
                        min="1"
                        value={numAdults}
                        onChange={(e) => setNumAdults(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="guest-div">
                    <label>Trẻ em:</label>
                    <input
                        type="number"
                        min="0"
                        value={numChildren}
                        onChange={(e) => setNumChildren(parseInt(e.target.value))}
                    />
                  </div>
                  <button className="confirm-booking" onClick={handleConfirmBooking}>Xác nhận đặt phòng</button>
                </div>
              </div>
          )}
          {totalPrice > 0 && (
              <div className="total-price">
                <p>Tổng giả tiền: ${totalPrice}</p>
                <p>Số lượng khách hàng: {totalGuests}</p>
                <button onClick={acceptBooking} className="accept-booking">Đồng ý đặt phòng</button>
              </div>
          )}
        </div>
      </div>
  );
};

export default RoomDetailsPage;
