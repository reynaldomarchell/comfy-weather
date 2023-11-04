import { useEffect, useState } from "react";
import Input from "./assets/components/Input";
import Weather from "./assets/components/Weather";
import { useLocalStorageState } from "./hooks/useLocalStorageState";

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export default function App() {
  const [location, setLocation] = useLocalStorageState("", "location");
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState("");
  const [weather, setWeather] = useState({});

  function handleSetLocation(e) {
    setLocation(e.target.value);
  }

  useEffect(() => {
    const fetchWeather = async () => {
      if (location.length < 2) return setWeather({});

      try {
        setIsLoading(true);

        // 1) Getting location (geocoding)
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
        );
        const geoData = await geoRes.json();
        console.log(geoData);

        if (!geoData.results) throw new Error("Location not found");

        const { latitude, longitude, timezone, name, country_code } =
          geoData.results.at(0);

        setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

        // 2) Getting actual weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData.daily);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    localStorage.setItem("location", location);
  }, [location]);

  return (
    <div className="app">
      <h1>Comfy Weather</h1>
      <Input location={location} onChangeLocation={handleSetLocation} />

      {isLoading && <p className="loader">Loading...</p>}

      {weather.weathercode && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}
