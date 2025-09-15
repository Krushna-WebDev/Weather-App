import axios from "axios";
import React, { useEffect, useState } from "react";
interface WeatherInterface {
  name: string;
  temp: number;
  icon: string;
}

const WeatherApp = () => {
  const [Input, setInput] = useState<string>("");
  const [WeatherData, setWeatherData] = useState<WeatherInterface[]>(() => {
    const weather = localStorage.getItem("data");
    return weather ? JSON.parse(weather) : [];
  });

  const api: string = import.meta.env.VITE_API_KEY || "";
  const fetchData = async () => {
    const isDuplicate = WeatherData!.some(
      (data) => data.name.toLowerCase() === Input.toLowerCase()
    );
    if (isDuplicate) {
      alert("Already exists!");
      return;
    }

    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${Input}&appid=${api}&units=metric`
    );
    const newData = [
      ...WeatherData,
      {
        name: res.data.name,
        temp: res.data.main.temp,
        icon: res.data.weather[0].icon,
      },
    ];
    setWeatherData(newData);
    localStorage.setItem("data", JSON.stringify(newData));
    setInput("");
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb -12">
            <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Weather App
            </h1>

            <div className="w-full max-w-md p-8 bg-gray-800/40 backdrop-blur rounded-2xl shadow-2xl border border-gray-700/50">
              <div className="space-y-6">
                <input
                  type="text"
                  onChange={(e) => setInput(e.target.value)}
                  value={Input}
                  placeholder="Enter City Name"
                  className="w-full px-6 py-4 bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg placeholder-gray-400"
                />
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  onClick={fetchData}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {WeatherData.map((data, index) => (
              <div
                key={index}
                className="bg-gray-800/40 backdrop-blur rounded-2xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    {data.name}
                  </h2>

                  <img
                    src={`http://openweathermap.org/img/wn/${data.icon}@4x.png`}
                    alt="weather icon"
                    className="w-32 h-32 filter drop-shadow-lg"
                  />

                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
                    {Math.round(data.temp)}°C
                  </div>

                  <div className="w-full pt-6 border-t border-gray-700/50">
                    <div className="flex justify-end text-gray-400 text-sm">
                      <span>Updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherApp;
