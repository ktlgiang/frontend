import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Lỗi khi tải loại phòng:', error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  /** Hàm hiển thị lỗi */
  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, timeout);
  };

  /** Hàm tìm phòng trống theo dữ liệu đã chọn */
  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError('Vui lòng chọn đầy đủ thông tin.');
      return false;
    }
    try {
      const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

      const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate, roomType);

      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          showError('Không có phòng trống trong khoảng thời gian và loại phòng đã chọn.');
          return;
        }
        handleSearchResult(response.roomList);
        setError('');
      }
    } catch (error) {
      showError("Đã xảy ra lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
      <section>
        <div className="search-container">
          <div className="search-field">
            <label>Ngày nhận phòng</label>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày nhận phòng"
            />
          </div>
          <div className="search-field">
            <label>Ngày trả phòng</label>
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày trả phòng"
                minDate={startDate}
            />
          </div>

          <div className="search-field">
            <label>Loại phòng</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option disabled value="">
                Chọn loại phòng
              </option>
              {roomTypes.map((roomType) => (
                  <option key={roomType} value={roomType}>
                    {roomType}
                  </option>
              ))}
            </select>
          </div>
          <button className="home-search-button" onClick={handleInternalSearch}>
            Tìm phòng
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </section>
  );
};

export default RoomSearch;
