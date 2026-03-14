import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const banners = [
    {
        id: 1,
        title: "Anime Collection",
        subtitle: "For the Otakus.",
        image: "/banners/anime_banner.jpg",
        link: "/collection/69b39ef8040365bc3908deb8?name=Anime"
    },
    {
        id: 2,
        title: "Web Series Collection",
        subtitle: "Binge-worthy styles for fans.",
        image: "/banners/webseries_banner.jpg",
        link: "/collection/69b39ef8040365bc3908deb4?name=Webseries"
    },
    {
        id: 3,
        title: "Sports Collection",
        subtitle: "Gear up for the game.",
        image: "/banners/sports_banner.png",
        link: "/collection/69b39ef8040365bc3908deb3?name=Sports"
    },
    {
        id: 4,
        title: "Tamil Traditional Print",
        subtitle: "Express your culture with style.",
        image: "/banners/tamil_banner.jpg",
        link: "/collection/69b39ef8040365bc3908deaf?name=Tamil"
    },
    {
        id: 5,
        title: "Cartoon Collection",
        subtitle: "Relive your childhood favorites.",
        image: "/banners/cartoons_banner_v2.jpg",
        link: "/collection/69b39ef8040365bc3908deb6?name=Cartoons"
    }
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === banners.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? banners.length - 1 : current - 1);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [current]);

    return (
        <section className="hero-carousel">
            <div className="carousel-container">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`carousel-slide ${index === current ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${banner.image})` }}
                    >
                        <div className="carousel-overlay">
                            <div className="container">
                                <div className="carousel-content">
                                    <h1>{banner.title}</h1>
                                    <p>{banner.subtitle}</p>
                                    <Link to={banner.link} className="btn btn-primary">Shop Now</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="carousel-control prev" onClick={prevSlide}>
                    <ChevronLeft size={32} />
                </button>
                <button className="carousel-control next" onClick={nextSlide}>
                    <ChevronRight size={32} />
                </button>

                <div className="carousel-indicators">
                    {banners.map((_, index) => (
                        <div
                            key={index}
                            className={`indicator ${index === current ? 'active' : ''}`}
                            onClick={() => setCurrent(index)}
                        ></div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroCarousel;
