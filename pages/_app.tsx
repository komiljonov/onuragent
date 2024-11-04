import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { QueryClientProvider } from "@tanstack/react-query";
import queryclient from "@/lib/queryclient";
import Layout from "@/components/Layout";
import { UserProvider } from "@/hooks/auth";

function Page({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default function App(props: AppProps) {
  return (

    <QueryClientProvider client={queryclient}>
      <UserProvider >
        <Page {...props} />
      </UserProvider>
    </QueryClientProvider>
  );
}
