"use client";

import { useState } from "react";
import {
  Globe,
  Globe2,
  LocateFixed,
  MapPin,
  FlagIcon,
  Clock,
  ThermometerSnowflake,
  Wind,
  CloudSun,
} from "lucide-react";
import WeatherIcon from "./components/WeatherIcon";
import WindIcon from "./components/windSpeed";
import ThermometerIcon from "./components/Temperature";

type CityData = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
};

type weatherData = {
  temperature: number;
  windspeed: number;
  time: string;
};

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [weather, setWeather] = useState<weatherData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorSignal, setError] = useState<string | null>(null);

  function UpdateInput(event: React.ChangeEvent<HTMLInputElement>) {
    setCity(event.target.value.trim());
  }

  async function fetchData(event: any) {
    setError(null);
    setCityData(null);
    setWeather(null);
    setCity("");

    event.preventDefault();
    if (!city) {
      setError("Please enter a city name.");
      return;
    } 
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data, try again");
      }

      console.log("Response status:", response.status);
      const data = await response.json();

      if (data && data.results && data.results.length > 0) {
        const dataResults = data.results[0];
        setCityData(dataResults);
        setCity("");

        // Pass latitude and logitude to the weather forecast api
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${dataResults.latitude}&longitude=${dataResults.longitude}&current_weather=true`,
        );
        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch the weather data, try again");
        } else {
          const weatherResult = await weatherResponse.json();
          setWeather({
            temperature: weatherResult.current_weather.temperature,
            windspeed: weatherResult.current_weather.windspeed,
            time: weatherResult.current_weather.time,
          });
        }
      } else {
        throw new Error("No data found for the specified city.");
      }

    } catch(err:any){

      if(err.message === "Failed to fetch"){
        setError("Network error. Please check internet connection.");
      } else{
        setError(err.message);
      }
    }
    
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-linear-to-br from-slate-50 via-indigo-50 to-cyan-50 text-slate-900">
      <div className="sticky top-0 z-10 w-full border-b border-white/10 bg-slate-950 shadow-lg shadow-slate-900/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            SkyCast
          </h1>
          <form
            onSubmit={fetchData}
            className="flex w-full sm:ms-auto sm:max-w-md"
          >
            <input
              onChange={UpdateInput}
              placeholder=" enter city.."
              autoFocus
              className="min-w-0 flex-1 rounded-l-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:z-10 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              type="text"
              value={city || ""}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="rounded-r-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              search
            </button>
          </form>
        </div>
      </div>
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-start gap-5 px-4 py-8 sm:grid-cols-2 sm:px-6 sm:py-10 lg:px-8">
        {errorSignal && (
          <div className="col-span-full mx-auto w-full max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm font-medium text-rose-700 shadow-sm sm:text-base">
            {errorSignal}
          </div>
        )}

        {isLoading && (
          <div className="col-span-full flex items-center justify-center gap-3 rounded-2xl border border-indigo-100 bg-white/70 px-5 py-6 text-indigo-700 shadow-sm">
            <div className="mr-1 h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-b-indigo-600"></div>
            <p className="text-sm font-medium sm:text-base">Loading...</p>
          </div>
        )}

        <div className="col-span-full mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-cyan-500 px-6 py-10 text-white shadow-xl shadow-indigo-900/15 sm:px-10 sm:py-12">
          <p className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Welcome to SkyCast
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-indigo-50 sm:text-lg">
            Get real-time weather updates for any city!
          </p>
        </div>

        {!isLoading && cityData && (
          <div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-7">
            <ul className="grid gap-1">
              <li className="col-span-full mb-2 flex items-center text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                <MapPin className="mr-2 text-indigo-600" size={25} />
                {cityData.name}
              </li>
              <li className="rounded-xl px-3 py-2 text-sm text-slate-600">
                <div className="flex flex-row items-center">
                  <Globe className="mr-2 text-indigo-500" size={15} />
                  <span>
                    Latitude:{" "}
                    <span className="ml-2 font-semibold text-slate-900">
                      {cityData.latitude}
                    </span>
                  </span>
                </div>
              </li>
              <li className="rounded-xl px-3 py-2 text-sm text-slate-600">
                <div className="flex flex-row items-center">
                  <Globe className="mr-2 text-indigo-500" size={15} />
                  <span>
                    Longitude:{" "}
                    <span className="ml-2 font-semibold text-slate-900">
                      {cityData.longitude}
                    </span>
                  </span>
                </div>
              </li>
              <li className="rounded-xl px-3 py-2 text-sm text-slate-600">
                <div className="flex flex-row items-center">
                  <LocateFixed className="mr-2 text-indigo-500" size={20} />
                  <span>
                    Country:{" "}
                    <span className="ml-2 font-semibold text-slate-900">
                      {cityData.country}
                    </span>
                  </span>
                </div>
              </li>
              <li className="rounded-xl px-3 py-2 text-sm text-slate-600">
                <div className="flex flex-row items-center">
                  <Globe2 className="mr-2 text-indigo-500" size={15} />
                  <span>
                    Timezone:{" "}
                    <span className="font-semibold text-slate-900">
                      {cityData.timezone}
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        )}

        {!isLoading && weather && (
          <div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-7">
            <ul className="grid gap-2">
              <li className="mb-2 flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                <div className="flex items-center gap-2">
                  <WeatherIcon /> <span>Weather Data</span>
                </div>
              </li>
              <li className="flex flex-row items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:text-base">
                <div className="flex flex-row items-center gap-2">
                  <ThermometerIcon />
                  <span>
                    Temperature:{" "}
                    <span className="font-semibold text-slate-900">
                      {weather.temperature} °C
                    </span>
                  </span>
                </div>
              </li>
              <li className="flex flex-row items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:text-base">
                <div className="flex flex-row items-center gap-2">
                  <WindIcon />
                  <span>
                    Wind Speed:{"  "}
                    <span className="font-semibold text-slate-900">
                      {weather.windspeed} km/h
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
