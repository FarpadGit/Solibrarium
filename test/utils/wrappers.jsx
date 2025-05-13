import ShoppingCartContext from "@/contexts/ShoppingCartContext";
import ReduxProvider from "@/redux/ReduxProvider";

export function ReduxWrapper({ children }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}

// AppContext is largely independent from all the other providers and only few components use it,
// so it gets mocked globally in the setup file and is unnecessary in AllWrapper
export function AllWrapper({ children }) {
  return (
    <ReduxProvider>
      <ShoppingCartContext>{children}</ShoppingCartContext>
    </ReduxProvider>
  );
}
