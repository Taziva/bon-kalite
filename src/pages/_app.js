import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import customTheme from "src/theme";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={customTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
