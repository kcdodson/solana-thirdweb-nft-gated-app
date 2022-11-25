import { WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export const network: Network = "devnet";
export const domain = "example.org";
export const wallet = new PhantomWalletAdapter();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      authConfig={{
        authUrl: "/api/auth",
        domain: process.env.VERCEL_URL || domain,
        loginRedirect: "/",
      }}
      network={network}
    >
      <WalletProvider wallets={[wallet]}>
        <Component {...pageProps} />
      </WalletProvider>
    </ThirdwebProvider>
  );
}
