import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png'; // Don't forget to import this!

const Weather = () => {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null); // Initialize to null
  const [error, setError] = useState(null); // State for error messages

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    setError(null); // Reset error state on new search
    if (!city.trim()) {
      alert("Enter City name"); // Consider a better UI for this
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        if (errorData.cod === '404') {
          alert(`City "${city}" not found. Please check the spelling.`);
          setWeatherData(null);
          return;
        } else {
          setError(`Failed to fetch weather for "${city}". ${errorData.message || 'Please try again.'}`);
          setWeatherData(null);
          return;
        }
      }

      const data = await response.json();
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temprature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("An unexpected error occurred while fetching weather data.");
      setWeatherData(null);
    }
  };

  const handleSearchClick = () => {
    if (inputRef.current) {
      search(inputRef.current.value);
    }
  };

  useEffect(() => {
    search('London'); // Initial load
  }, []);

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search' />
        <img src={search_icon} alt="" onClick={handleSearchClick} />
      </div>
      {error && <p className="error-message">{error}</p>}
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className='weather-icon' />
          <p
  className='temprature'
  style={{
    color: '#fff',
    fontSize: '40px',
    lineHeight: '1',
    marginBottom: '0px',
  }}
>
  {weatherData.temprature} ℃ 
</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Search for a city to see the weather!</p>
      )}
    </div>
  );
};

export default Weather;