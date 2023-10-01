"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FooterBackground from "@/components/footer/FooterBackground";

const detailsText =
  "A Google Books többféle méretekben is tárolja a könyvborítókat, de ezek nem feltétlenül mindig ugyanaz a borító más felbontásban. A kereső oldal thumbnail képeket használ, amíg ez az oldal a legnagyobb elérhető képet. Néha előfordul, hogy a kettőn más borítókép van.";
const searchText =
  "A kereső oldal a találatokat a Google Books adatbázisából szerzi nyilvános API hívásokon keresztül. Sajnos a Google Books-nak nem épp az az elhivatott célja, hogy az ehhez hasonló weboldalaknak legyen a stabil alappillére így a keresési kérésekkel alaposan meg kell küzdeni. Az enyhén különböző kulcsszavakra adott válaszok sokszor kaotikusak és néha még az oldalasítás is csak megközelítően kiszámítható. Ezek ellenére még így is az egyik legjobb könyv API.";
const accountText =
  "Tudtad? Ha az értékelő ablakban már adtál egy csillag értékelést az egyik könyvre akkor jobb egérrel kattinthatsz a csillagokra hogy visszaállítsd azt 0-ra. Ugyanígy lehet a fejléc ⨁ gombjára is jobb kattintani, hogy összecsukja/lenyissa a fejlécet.";
const checkoutText =
  "Nézd mama, törzsvásárlói pontok! Igaz olyan sok mindenre még nem használhatók, lévén hogy ingyen megveheted az összes könyvet de nézd, ha akarsz egy kis kedvezményt abból az ingyenből akkor légy a vendégem!";
const registerText =
  "Ez az űrlap amit látsz a Shadcn komponenskönyvtár formját használja ami két különböző könyvtár előnyeit gyúrja össze: useHookForm illetve Zod validáció. A kettő együtt valós idejű kliens oldali adatvalidációt tesz lehetővé és azonnal megüzeni a felhasználónak az összes helytelenül kitöltött mező hibáját. A szerver oldalon magát a beléptetést és munkamenet kezelést a NextAuth könyvtár végzi, beleértve a Jegyezz Meg funkciót is ami lényegében egy helyben tárolt token alapú beléptetés.";
const loginText =
  "Ooh, hogy jutottál el ide? A checkout oldalon megjelent a login ablak és nyomtál egy frissítést? Vagy csak beírtad a keresősávba, hátha létezik ez az oldal? Úgy más lehetőség nem is igazán jut eszembe, minden esetre élvezd ezt az elrejtett kincset!";
const forgotPasswordText =
  "Van egy hotmail-es email fiókom amin keresztül a NodeMailer könyvtár leveleket képes küldeni egy általunk megadott email címre. Természetesen először ellenőrzzük hogy megvan-e az adatbázisban, de ha nincs azt nem fogja elárulni próbálkozó támadóknak.";
const resetPasswordText =
  "Bár nem a kriptográfia a szakterületem azért próbáltam egy kis titkosítást vinni a jelszó visszaállító szolgáltatásba, ami meg is látszik a jó ronda URL-en.";
const defaultText =
  "Hát ez is furcsa! Ez valami illegális oldal lehet, mert semmilyen csattanóval nem készültem. Ez az igazi ember tragédiája.";

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
            Fabók Árpád vagyok és ez egy afféle hobbi project / portfolió, amit
            azért csináltam hogy megtanítsam magamnak a NextJs 13-at illetve
            olyan funkciókat mint például a felhasználók hitelesítése. Ha van
            bármilyen kérdésed az itt látottakkal kapcsolatban akkor küldj egy
            emailt az{" "}
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
          <p className="text-right text-xs">
            <Link
              href="mailto:solibrarium@hotmail.com"
              className="hover:underline"
            >
              ©2023 Solibrarium
            </Link>
            <br /> Minden jog fenntartva! Mind egy szálig! Copyright, copyleft,
            copyup, copydown, az összes.
          </p>
        </div>
      </div>
    </div>
  );
}
