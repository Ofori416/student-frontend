import Head from "next/head";
import Hero from "@/components/landing_page/Hero";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
mixpanel.init("c2d2405209ce3c42e4f2953c6859580a");

export default function Home() {
  useEffect(() => {
    mixpanel.track("Visited Homepage");
  }, []);
  return (
    <>
      <Head>
        <title>VirtualMane</title>
        <meta name="description" content="Web app for compressing images" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Footer />
    </>
  );
}
