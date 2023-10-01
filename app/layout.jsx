//import "tw-elements-react/dist/css/tw-elements-react.min.css";
import "@/styles/globals.css";
import AppContext from "@/contexts/AppContext";
import SessionProvider from "@/contexts/SessionProvider";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
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
        <AppContext>
          <SessionProvider session={session}>
            <Header />
            <main className="app">
              <div className="app_backdrop">
                <div className="gradient" />
              </div>
              {children}
            </main>
            <Footer />
          </SessionProvider>
        </AppContext>
      </body>
    </html>
  );
}
