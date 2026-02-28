import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createAppKit } from "@reown/appkit/react";

import { WagmiProvider } from "wagmi";
import { somniaTestnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

// 1. Get projectId from https://dashboard.reown.com
const projectId = "YOUR_PROJECT_ID";

const networks = [somniaTestnet];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [somniaTestnet],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{<App />}</QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
