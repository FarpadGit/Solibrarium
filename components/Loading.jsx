export default function Loading() {
  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center bg-[#4EB8D2] rounded-3xl">
      <Clouds />
      <span className="loading_text">Betöltés</span>
      <div className="absolute top-[25%] w-3/4 flex justify-around">
        <Wind />
        <Wind />
      </div>
      <div className="flex w-full justify-around">
        <Windmill />
        <div className="hidden sm:block">
          <Windmill />
        </div>
        <Windmill />
      </div>
    </div>
  );
}

function Windmill() {
  return (
    <div className="h-0 w-1 border-t-0 border-r-[20px] border-b-[200px] border-l-[20px] border-solid border-x-transparent border-b-[#FDC680] relative pt-[50px]">
      <div className="h-1 w-1 border-[15px] border-solid border-[#FDC680] bg-black rounded-full absolute -translate-x-[15px] -translate-y-[15px]" />
      <div className="windmill_rotator">
        <div className="h-0 w-0.5 border-t-[133px] border-r-[10px] border-b-4 border-l-[10px] border-t-solid border-x-solid border-b-none border-t-[#FDC680] border-x-transparent border-b-transparent absolute origin-[-5px_-15px] rotate-[60deg]" />
        <div className="h-0 w-0.5 border-t-[133px] border-r-[10px] border-b-4 border-l-[10px] border-t-solid border-x-solid border-b-none border-t-[#FDC680] border-x-transparent border-b-transparent absolute origin-[5px_-5px] rotate-180" />
        <div className="h-0 w-0.5 border-t-[133px] border-r-[10px] border-b-4 border-l-[10px] border-t-solid border-x-solid border-b-none border-t-[#FDC680] border-x-transparent border-b-transparent absolute origin-[15px_3px] rotate-[300deg]" />
      </div>
    </div>
  );
}

function Wind() {
  return (
    <svg
      width="225"
      height="90"
      stroke="#FFFFFF"
      version="1.1"
      viewBox="0 0 144 57.6"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
      >
        <path
          className="wind_spinner"
          d="m4.297 19.662s20.348-8.4837 28.756-8.6742c8.4083-0.19052 21.218 9.1863 26.832 9.1863h26.5c6.7315 0 13.572-0.18436 18.555 0 3.7982 0.14051 7.6789-2.9693 7.843-7.9609 0.16411-4.9916-4.6542-8.0589-7.6379-8.1409-2.9837-0.082052-7.8208 2.3347-8.1822 6.5433-0.08764 1.0204-0.12308 1.7867-0.12308 1.7867"
        />
        <path
          className="wind_spinner"
          d="m30.029 29.333s12.474 4.9854 20.242 4.9854h22.193c3.7585 0 14.198-0.53209 17.905 1.171 3.7069 1.7031 7.66 5.0907 7.57 9.0479-0.08996 3.9573-2.5773 8.3391-8.1516 8.2962-5.5743-0.04291-7.9064-5.8859-7.8885-6.7406 0.01784-0.85469 0-1.2919 0-1.2919"
        />
        <path
          className="wind_spinner"
          d="m7.2755 28.532s18.349-6.4 25.778-6.4c9.5138 0 13.668 7.2526 22.544 7.2526h20.593c5.4259 0 9.8815-0.04402 15.566-0.04402s10.735 5.6091 16.134 7.0557 11.309 0.98258 11.309 0.98258"
        />
        <path
          className="wind_spinner"
          d="m46.261 20.637s2.097 1.3003 3.6016 1.9578c1.5046 0.65751 3.221 1.9546 5.289 1.9546 2.068 0 4.8355-3.39e-4 5.4711-3.39e-4 1.2711 0 16.355-0.1406 24.531 3.39e-4 8.8189 0.15194 19.195 0.47427 26.445 0.9112 7.2503 0.43692 13.127 1.0883 17.06 1.2209 3.933 0.13258 7.6204-4.6778 7.5483-8.4553-0.0675-3.5389-3.8362-7.421-7.3686-7.6459-3.7104-0.23624-8.5183 2.2694-8.696 6.9848-0.0203 0.53797-0.0776 1.0846-0.0776 1.0846"
        />
        <path
          className="wind_spinner short"
          d="m105.86 30.232s11.004 1.4367 16.788 2.0709c5.7839 0.63417 18.452 1.869 18.452 1.869"
        />
      </g>
    </svg>
  );
}

function Clouds() {
  return (
    <svg
      width="1440"
      height="405"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 1440 405"
      className="absolute"
    >
      <g transform="">
        <g transform="translate(467.144 239.937)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 239.93653035708195;1440 239.93653035708195"
            dur="50s"
            repeatCount="indefinite"
            begin="-15.397045945644273s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#FFFFFF"
            transform="scale(0.6793233412902888)"
          ></path>
        </g>
        <g transform="translate(348.606 71.442)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 71.44197460284714;1440 71.44197460284714"
            dur="50s"
            repeatCount="indefinite"
            begin="-11.548391482921794s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#FFFFFF"
            transform="scale(0.669862094279972)"
          ></path>
        </g>
        <g transform="translate(785.422 30.2236)">
          <animateTransform
            attributeName="transform"
            type="translate"
            keyTimes="0;1"
            values="-100 30.22355357262141;1440 30.22355357262141"
            dur="50s"
            repeatCount="indefinite"
            begin="-25.730750845170746s"
          ></animateTransform>
          <path
            d="M84.717,33.597c0.791-2.503,1.186-5.138,1.186-7.773C85.903,11.594,74.308,0,60.079,0 c-9.881,0-18.445,5.534-22.793,13.702c-1.581-0.527-3.426-0.791-5.138-0.791c-9.486,0-17.128,7.642-17.128,17.128 c0,1.186,0.132,2.372,0.395,3.426C6.719,34.783,0,42.424,0,51.515C0,61.66,8.169,69.829,18.314,69.829h63.373 C91.831,69.829,100,61.66,100,51.515C99.868,42.556,93.281,35.046,84.717,33.597z"
            fill="#FFFFFF"
            transform="scale(0.3631798112728168)"
          ></path>
        </g>
      </g>
    </svg>
  );
}
