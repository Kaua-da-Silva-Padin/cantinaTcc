import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from "./Components/Header/Header";
import bootstrapUrl from "../app/index.css?url"; 

export function Layout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/imgs/pelicano.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <title>CantinaTec</title>
        <Meta />
        <Links /> 
        <link rel="stylesheet" href={bootstrapUrl} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Header /> 
      <Outlet />
    </>
  );
}
