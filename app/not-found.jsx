"use client";

export default function NotFound() {
  const src = "/video/spider.mp4";
  return (
    <div className="flex flex-col items-center font-['Futura_Book']">
      <div className="text-[100px]">404</div>
      <div className="pb-2">
        Hoppá! Hát itt bizony nincs semmi érdekes. Biztos elírtad a címet.{" "}
        <br />
        De ha már itt vagy itt egy animáció amit Blenderben csináltam :).
      </div>
      <video controls width="20%" autoPlay muted loop>
        <source src={src} type="video/mp4" />
        ...Vagy mégsem. Úgy látszik a böngésződ nem támogatja a beágyazott
        videókat :(
      </video>
    </div>
  );
}
