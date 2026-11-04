import Thermometer from "@meteocons/svg/fill/thermometer.svg";
import Image from "next/image";
export default function ThermometerIcon() {
  return <Image alt="thermometer" src={Thermometer} width={50} height={50} />;
}
