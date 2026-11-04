import cloudDaydrizzle from "@meteocons/svg/fill/partly-cloudy-day-drizzle.svg";
import Image from "next/image";
export default function WeatherIcon() {
  return <Image alt="clear day" src={cloudDaydrizzle} width={40} height={40} />;
}



