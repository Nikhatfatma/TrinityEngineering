import localFont from "next/font/local";

export const mulish = localFont({
  src: [
    {
      path: "../../app/fonts/Mulish-VariableFont_wght.ttf",
      weight: "200 1000",
      style: "normal",
    },
    {
      path: "../../app/fonts/Mulish-Italic-VariableFont_wght.ttf",
      weight: "200 1000",
      style: "italic",
    },
  ],
  variable: "--font-mulish",
  display: "swap",
});
