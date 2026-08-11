import { useEffect, useState } from "react";
import { getInitialLocale } from "../components/preference-controls/utils";

export function useSyncedLocale() {
  const [locale, setLocale] = useState(getInitialLocale);

  useEffect(() => {
    const syncLocale = () => setLocale(getInitialLocale());

    window.addEventListener("storage", syncLocale);
    window.addEventListener("rn-preferences-change", syncLocale);

    return () => {
      window.removeEventListener("storage", syncLocale);
      window.removeEventListener("rn-preferences-change", syncLocale);
    };
  }, []);

  return locale;
}
