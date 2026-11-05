import cloudDaydrizzle from "@meteocons/svg/fill/partly-cloudy-day-drizzle.svg";
import clearDay from "@meteocons/svg/fill/clear-day.svg";
import snow from "@meteocons/svg/fill/extreme-snow.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import Image from "next/image";

export default function WeatherIcon({temperature}: {temperature: number}) {
  let selectedIcon = cloudDaydrizzle;
  let altText = "weather icon";

  if(temperature > 25){
    selectedIcon = clearDay;
    altText = "clear day";
  }else if(temperature < 5){
    selectedIcon = snow;
    altText = "snow";
  } else if(temperature >= 5 && temperature <= 25){
    selectedIcon = rain;
    altText = "rainy";
  }

  return <Image alt={altText} src={selectedIcon} width={40} height={40} />
}



