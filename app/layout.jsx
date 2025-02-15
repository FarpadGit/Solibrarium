//import "tw-elements-react/dist/css/tw-elements-react.min.css";
import "@/styles/globals.css";
import AppContext from "@/contexts/AppContext";
import ShoppingCartContext from "@/contexts/ShoppingCartContext";
import SessionProvider from "@/contexts/SessionProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import dynamic from "next/dynamic";
const LoginModal = dynamic(
  () => import("@/components/popovers/LoginModal").then((res) => res.default),
  { ssr: false }
);
const ConfirmModal = dynamic(
  () => import("@/components/popovers/ConfirmModal").then((res) => res.default),
  { ssr: false }
);
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata = {
  title: "Solibrarium",
  description: "A library of the Sun",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="hu">
      <body>
        <div className="global_background_image"></div>
        <SessionProvider session={session}>
          <ReduxProvider>
            <AppContext>
              <ShoppingCartContext>
                <Header />
                <main className="app">
                  <div className="app_backdrop">
                    <div className="gradient" />
                  </div>
                  <LoginModal />
                  <ConfirmModal />
                  {children}
                </main>
                <Footer />
              </ShoppingCartContext>
            </AppContext>
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
