import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AmenitySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const amenities = [
    { icon: 'assests/images/amenity-1.png', label: 'Water Bottle' },
    { icon: 'assests/images/amenity-2.png', label: 'Live Tracking' },
    { icon: 'assests/images/amenity-3.png', label: 'Reading Lamp' },
    { icon: 'assests/images/amenity-4.png', label: 'Mobile Charging' },
    { icon: 'assests/images/amenity-6.png', label: 'Blankets' },
    { icon: 'assests/images/amenity-7.png', label: 'Air Conditioner' },
    { icon: 'assests/images/amenity-9.png', label: 'Snacks' }
  ];

  return (
    <div className="amenity-section">
      <div className="container">
        <Slider {...settings} className="amenity-slider">
          {amenities.map((amenity, index) => (
            <div key={index} className="amenity-inner">
              <div className="amenity-content">
                <div className="amenity-icon">
                  <img loading="lazy" src={amenity.icon} alt={amenity.label} />
                  <h6>{amenity.label}</h6>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AmenitySlider;
