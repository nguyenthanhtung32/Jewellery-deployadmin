import "@/styles/globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState } from "react";

export default function App({ Component, pageProps }) {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      <Header setIsLogin={setIsLogin} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}