import React from "react";
import Footer from "@/components/Footer";

function Sponsor() {
  return (
    <div>
    <div className="sponsor">
      <div className="sponsor-left">
        <p className="sponsor-title">Wanna sponsor me?</p>
        <p className="sponsor-text">
          Loving VirtualMane? Join our journey and become a sponsor, supporting
          innovation and empowering users worldwide. Together, let&apos;s
          transform the way we share and store captivating visuals.
        </p>
        <div className="sponsor-buttons">
          <a href="https://www.buymeacoffee.com/collinsabrusu">buy me a coffee</a>
          <a href="https://www.patreon.com/abrusucollins">Patreon</a>
        </div>
      </div>
      <img src="/images/money.svg"></img>
    </div>
          <Footer />
  </div>
  );
}

export default Sponsor;
