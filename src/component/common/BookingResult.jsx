import React from 'react';
import { Link } from 'react-router-dom';

const BookingResult = ({ bookingSearchResults }) => {
  return (
    <div className="booking-results">
      {bookingSearchResults.map((booking) => (
        <div key={booking.id} className="booking-result-item">
          <p>Mã Phòng: {booking.roomId}</p>
          <p>Mã khách hàng: {booking.userId}</p>
          <p>Ngày nhận phòng: {booking.startDate}</p>
          <p>Ngày trả phòng: {booking.endDate}</p>
          <p>Trạng thái: {booking.status}</p>
          <Link to={`/admin/edit-booking/${booking.id}`} className="edit-link">Edit</Link>
        </div>
      ))}
    </div>
  );
};

export default BookingResult;
