import React from "react";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-2 bg-sky-50 text-cyan-500 text-sm text-center">
      © Coppernoi {currentYear}, all rights reserved.
    </footer>
  );
};

export default FooterComponent;
