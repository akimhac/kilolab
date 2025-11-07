import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    // Crisp Chat Widget
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "VOTRE_CRISP_WEBSITE_ID"; // À remplacer

    (function() {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);

  return null;
}
