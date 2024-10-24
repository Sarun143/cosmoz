import React from 'react';
import Slider from 'react-slick';
import './Gallery.css'; // You can add your styles here

const Gallery = () => {
  const busImages = [
    { img: "/assests/images/cosnw4.jpg" },
    { img: "/assests/images/cosnw.jpg" },
    { img: "/assests/images/coznw7.jpg" },
    {  img: "/assests/images/cosnw2.jpg" },
    { img: "/assests/images/cos44.png" },
    { img: "/assests/images/cosnw6.jpg" },
];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Adjust the number of images shown at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Time in ms for automatic slide transition
    pauseOnHover: true,
  };

  return (
    <div className="gallery-container">
      <Slider {...settings}>
        {busImages.map((bus, index) => (
          <div key={index} className="bus-inner">
            <img src={bus.img} alt={bus.title} />
            <div className="bus-text">
              <h6 className="bus-title">{bus.title}</h6>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Gallery;
