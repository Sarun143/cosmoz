import React from "react";
import Slider from "react-slick";

const SlidingTextComponent = () => {
  const settings = {
    dots: false, // Dots are disabled
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const slidesData = [
    {
      title: "Secure your travel",
      subtitle: "worry-free",
      caption: "Booking is simple and quick",
    },
    {
      title: "Travel In Luxury",
      subtitle: "& Comfort",
      caption: "Travel In Style With Us",
    },
    {
      title: "Explore Our",
      subtitle: "Routes",
      caption: "Connecting You to Your Destination",
    },
    {
      title: "Enjoy competitive",
      subtitle: "prices",
      caption: "without compromising on comfort or quality",
    },
    {
      title: "Extensive Network",
      subtitle: "Connecting",
      caption: "You to your destination",
    },
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slidesData.map((slide, index) => (
          <div key={index} className="slider-text">
            <h6>COSMOZ TRAVELMATE.</h6>
            <h1 className="section-title">
              <span className="highlight-text">{slide.title}</span>{" "}
              {slide.subtitle}
            </h1>
            <h6 className="section-title text-right">
              <b>{slide.caption}</b>
            </h6>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SlidingTextComponent;
