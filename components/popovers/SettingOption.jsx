import Image from "next/image";
import { SearchType } from "@/utils/SearchENUM";

export default function SettingOption({ id, type, setType, active }) {
  return (
    <div className="relative inline-block">
      <input
        className="settings_input"
        type="radio"
        id={id}
        name="searchSettings"
        value={type}
        defaultChecked={active}
        autoFocus={active}
        aria-checked={active}
        onClick={(e) => setType(e.target.value)}
      />
      <label htmlFor={id} className="settings_label">
        <Image
          src={SearchType[type].Icon}
          alt={SearchType[type].Alt}
          width={20}
          height={20}
          className="md:w-[30px] md:h-[30px]"
        />
        <div className="grow">{SearchType[type].Text}</div>
        <Circle />
      </label>
    </div>
  );
}

function Circle() {
  return (
    <div className="svg_overlay">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          className="drawn_circle"
          fill="none"
          stroke="#000"
          strokeWidth="10"
          d="m112.81198,63.19602c-0.98429,0 -1.92261,-0.07155 -4.92149,-1.98934c-4.84985,-3.10147 -12.34173,-6.4046 -22.63888,-8.952c-9.60835,-2.37699 -19.75651,-2.29709 -31.49756,-0.99467c-9.02061,1.00064 -22.11695,8.77777 -30.51327,20.888c-12.12671,17.49069 -16.35083,36.71582 -16.73308,58.68533c-0.31195,17.92883 8.8851,35.28208 25.59177,46.74934c17.11828,11.74976 50.30678,17.17496 68.90093,14.92c20.40635,-2.47472 45.99221,-15.63558 67.91663,-36.80267c21.78535,-21.03282 29.82537,-45.77529 23.62318,-62.66401c-7.88401,-21.4683 -28.54467,-34.81333 -47.24635,-51.72267l-21.65458,-15.91467l-28.54467,-14.92l-11.81159,-3.97866"
        />
      </svg>
    </div>
  );
}
