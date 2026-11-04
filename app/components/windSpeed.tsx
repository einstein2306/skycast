import Wind from "@meteocons/svg/fill/wind.svg";
import Image from "next/image";
export default function WindIcon() {
  return <Image alt="wind" src={Wind} width={50} height={50} />;
}
