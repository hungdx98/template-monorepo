import { SwapProvider } from "@/context";
import SwapScreen from "@/views/SwapScreen";

const Main = () => {
  return <SwapProvider>
    <SwapScreen />;
  </SwapProvider>
}

export default Main;