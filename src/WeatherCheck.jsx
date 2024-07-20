import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import axios from "axios";


const WeatherCheck = () => {
    return (
        <div className="grid w-full h-screen place-content-center bg-gradient-to-br from-red-600 to-gray-950 px-4 py-12 text-slate-900 ">
            <BackgroundCard />
        </div>
    );
};

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const BackgroundCard = () => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e) => {
        if (!ref.current) return [0, 0];

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const [city, setCity] = useState("");

    const [weather, setWeather] = useState("");
    const [temperature, setTemperature] = useState("");
    const [description, setDescription] = useState("");
    function handleCity(event) {
        setCity(event.target.value);
    }

    function getWeather() {
        var weatherData = axios('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=d941d1071c02c83474694eb9c79ccb4e');

        weatherData.then(function(sucess){
            setWeather(sucess.data.weather[0].main);
            setTemperature(sucess.data.main.temp);
            setDescription(sucess.data.weather[0].description);
        })
        
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className="relative h-72 w-96 rounded-xl bg-gradient-to-br from-red-300 to-gray-500"
        >
            <div style={{
                transform: "translateZ(75px)",
            }}>
                <div
                    style={{
                        transform: "translateZ(50px)",
                    }}
                    className="justify-center items-center p-5"
                >
                    <h1 className="text-2xl font-bold p-2 ">Weather App</h1>
                    <p>I can give you a weather report about your city!</p>
                    <input type="text"
                        onChange={handleCity}
                        placeholder="Enter your city"
                        className="border-2 border-black rounded-md m-5 bg-transparent placeholder:text-slate-700 placeholder:px-1" />

                    <button type="submit"
                        onClick={getWeather}
                        className="bg-sky-800 text-black p-2 rounded-full">
                        Get Report
                    </button>

                    <p><b>Wether :</b>{weather}</p>
                    <p><b>Temperature:</b>{temperature}</p>
                    <p><b>Description:</b>{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherCheck;
