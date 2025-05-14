import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const HomePage = () => {
    const [roomSearchResults, setRoomSearchResults] = useState([]);

    // Hàm xử lý kết quả tìm kiếm
    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };

    return (
        <div className="home">
            {/* PHẦN HEADER / BANNER KHÁCH SẠN */}
            <section>
                <header className="header-banner">
                    <img src="./assets/images/hinh1.webp" alt="Khách sạn YangHong" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Chào mừng đến với <span className="phegon-color">YangHong Hotel</span>
                        </h1><br />
                        <h3>Bước vào không gian tiện nghi và tận hưởng sự chăm sóc tận tình</h3>
                    </div>
                </header>
            </section>

            {/* PHẦN TÌM PHÒNG */}
            <RoomSearch handleSearchResult={handleSearchResult} />
            <RoomResult roomSearchResults={roomSearchResults} />

            <h4><a className="view-rooms-home" href="/rooms">Xem tất cả phòng</a></h4>

            <h2 className="home-services">Dịch vụ tại <span className="phegon-color"> YangHong Hotel</span></h2>

            {/* PHẦN DỊCH VỤ */}
            <section className="service-section">
                <div className="service-card">
                    <img src="./assets/images/ac.png" alt="Điều hòa không khí" />
                    <div className="service-details">
                        <h3 className="service-title">Điều hòa không khí</h3>
                        <p className="service-description">Luôn mát mẻ và dễ chịu với hệ thống điều hòa không khí điều chỉnh riêng cho từng phòng.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/mini-bar.png" alt="Mini Bar" />
                    <div className="service-details">
                        <h3 className="service-title">Mini Bar</h3>
                        <p className="service-description">Thưởng thức đồ uống và đồ ăn nhẹ được chuẩn bị sẵn trong mini bar của phòng, hoàn toàn miễn phí.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/parking.png" alt="Bãi đỗ xe" />
                    <div className="service-details">
                        <h3 className="service-title">Bãi đỗ xe</h3>
                        <p className="service-description">Chúng tôi cung cấp bãi đỗ xe ngay tại khách sạn để thuận tiện cho bạn. Vui lòng hỏi thêm về dịch vụ đỗ xe có nhân viên hỗ trợ nếu cần.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/wifi.png" alt="WiFi" />
                    <div className="service-details">
                        <h3 className="service-title">WiFi</h3>
                        <p className="service-description">Luôn kết nối internet trong suốt kỳ nghỉ của bạn với Wi-Fi tốc độ cao miễn phí tại tất cả các phòng và khu vực công cộng.</p>
                    </div>
                </div>
            </section>

            {/* PHẦN PHÒNG CÓ SẴN */}
            <section>

            </section>
        </div>
    );
}

export default HomePage;
