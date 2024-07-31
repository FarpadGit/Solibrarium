"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FooterBackground from "@/components/footer/FooterBackground";

const detailsText =
  "A Google Books többféle méretekben is tárolja a könyvborítókat, de ezek nem feltétlenül mindig ugyanazok a borítók más felbontásban. A kereső oldal thumbnail képeket használ, amíg ez az oldal a legnagyobb elérhető képet. Néha előfordul azonban, hogy a kettőn más borítókép van.";
const searchText =
  "A kereső oldal a találatokat a Google Books adatbázisából szerzi nyilvános API hívásokon keresztül. Sajnos a Google Books-nak nem épp az az elhivatott célja hogy az ehhez hasonló weboldalaknak legyen egy stabil alappillére így a kereső kérésekkel alaposan meg kell küzdeni. A hasonló de enyhén különböző kulcsszavakra adott válaszok sokszor kaotikusan eltérők tudnak lenni és néha még az oldalasítás is csak megközelítően kiszámítható. Ezek ellenére még így is az egyik legjobb könyv API.";
const accountText =
  "Tudtad? Ha az értékelő ablakban már adtál egy csillag-értékelést az egyik könyvedre akkor jobb egér gombbal kattinthatsz a csillagokra hogy visszaállítsd azt 0-ra. Ugyanígy lehet a fejléc ⨁ gombjára is jobb kattintani hogy összecsukja/lenyissa a fejlécet.";
const checkoutText =
  "Nézd mama, törzsvásárlói pontok! Igaz, olyan sok mindenre még nem használhatók lévén hogy ingyen megveheted az összes könyvet de nézd, ha akarsz egy kis kedvezményt abból az ingyenből akkor légy a vendégem!";
const registerText =
  "Ha érdekelnek a technikai részletek ez az űrlap a Shadcn komponenskönyvtár űrlapját használja ami két különböző könyvtár előnyeit gyúrja össze: useHookForm illetve Zod validáció. A kettő együtt valós idejű kliens oldali adatvalidációt tesz lehetővé és azonnal megüzeni a felhasználónak az összes helytelenül kitöltött mező hibáját. A szerver oldalon magát a beléptetést és munkamenet kezelést a NextAuth könyvtár végzi, beleértve a Jegyezz Meg funkciót is ami lényegében egy böngészőben tárolt token.";
const loginText =
  "Ooh, hogy jutottál el ide? A checkout oldalon megjelent a login ablak és nyomtál egy frissítést? Vagy csak beírtad a keresősávba, hátha létezik ez az oldal? Úgy más lehetőség nem is igazán jut az eszembe, minden esetre élvezd ezt az elrejtett kincset!";
const forgotPasswordText =
  "Ez tényleg ki fog küldeni egy email-t? Igen, van egy erre fenntartott Hotmail-es fiók amin keresztül a NodeMailer könyvtár leveleket képes küldeni az általad megadott email címre. Természetesen először mindig ellenőrzi hogy szerepel-e az illető a regisztráltak adatbázisában, de ha nincs ezt nem fogja elárulni a próbálkozó támadóknak. Viszont ha Gmail-t használsz nos ők sajnos kezdenek egyre háklisabbak lenni mindennemű idegen forrásra és azon túl hogy a spam mappára lökik a levelet még a háttérképeket és kirostázza a forrásból.";
const resetPasswordText =
  "Bár nem a kriptográfia a szakterületem azért próbáltam egy kis titkosítást vinni a jelszó visszaállító szolgáltatásba, ami meg is látszik a jó ronda URL-en.";
const defaultText =
  "Üdv a nem talált tárgyak osztályán. Igazán több időt kéne eltöltenem Blenderrel csak sajnos van 9 másik hobbim is és csak 24 órám egy napban :(";

export default function Footer() {
  let text = "";
  const currentPage = usePathname();
  switch (currentPage.split("/", 2)[1]) {
    case "details":
      text = detailsText;
      break;
    case "search":
      text = searchText;
      break;
    case "account":
      text = accountText;
      break;
    case "checkout":
      text = checkoutText;
      break;
    case "register":
      text = registerText;
      break;
    case "login":
      text = loginText;
      break;
    case "forgotPassword":
      text = forgotPasswordText;
      break;
    case "resetPassword":
      text = resetPasswordText;
      break;
    default:
      text = defaultText;
  }

  return (
    <div className="footer">
      <FooterBackground />
      <div className="footer_plaque">
        <div className="screw top-[10px] left-[10px]">
          <div className="indent"></div>
        </div>
        <div className="screw top-[10px] right-[10px]">
          <div className="indent"></div>
        </div>
        <div className="screw bottom-[10px] left-[10px]">
          <div className="indent"></div>
        </div>
        <div className="screw bottom-[10px] right-[10px]">
          <div className="indent"></div>
        </div>
        {currentPage === "/" && (
          <div className="text-justify">
            <div className="text-center">Üdvözlet a Solibráriumban!</div>
            <br />
            Fabók Árpád webfejlesztő vagyok és ez egy afféle hobbi / portfolió
            project amit azért csináltam hogy megtanítsam magamnak a NextJs
            13-at, illetve többféle egyéb funkciót is mint például a
            felhasználók hitelesítése vagy a MongoDB adatbázis kezelése.
            Nyugodtan nézz körbe, kattints arra ami megtetszik, esetleg
            csinálhatsz egy fiókot is ha kedved tartja, és ha van bármilyen
            kérdésed az itt látottakkal kapcsolatban akkor küldj egy emailt az{" "}
            <Link
              href="mailto:solibrarium@hotmail.com"
              className="hover:underline"
            >
              itt található címre
            </Link>
            , esküszöm néha olvasom őket.
          </div>
        )}
        {currentPage !== "/" && <div className="text-justify">{text}</div>}
        <div>
          <p className="text-right text-xs min-w-[7rem]">
            <Link
              href="mailto:solibrarium@hotmail.com"
              className="hover:underline"
            >
              {`©${new Date().getFullYear()} Solibrarium`}
            </Link>
            <br /> Minden jog fenntartva! Copyright, copyleft, copyup, copydown,
            az összes.
          </p>
        </div>
      </div>
    </div>
  );
}
