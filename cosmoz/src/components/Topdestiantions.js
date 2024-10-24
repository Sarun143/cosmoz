// TopDestinations.js
import React from 'react';
import Slider from "react-slick";
import './Topdestinations.css'; // You can add your styles here

const TopDestinations = () => {
  const destinations = [
    { title: "BANGLORE", img: "/assests/images/blrjpg.jpeg" },
    { title: "CHENNAI", img: "/assests/images/chennaii.jpg" },
    { title: "KOCHI", img: "/assests/images/kochii.jpeg" },
    { title: "MYSORE", img: "/assests/images/mysoor.jpeg" },
    { title: "KOTTAYAM", img: "/assests/images/cmsss.jpg" },
    { title: "COIMBATORE", img: "/assests/images/cova.jpeg" },
    { title: "SALEM", img: "/assests/images/salm.jpg" }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Adjust how many slides are shown at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Time in ms for automatic slide transition
    pauseOnHover: true,
  };

  return (
    <div className="top-destinations-container">
                <h1>Top Destinations</h1>
      <Slider {...settings}>
        {destinations.map((destination, index) => (
          <div key={index} className="route-inner">
            <img src={destination.img} alt={destination.title} />
            <div className="route-text">
              <h6 className="route-title">{destination.title}</h6>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default TopDestinations;
