'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function SmartsuppScript() {
  const locale = useLocale();

  useEffect(() => {
    // Initialize Smartsupp
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = '638908575fda9112fede8b068509f6e55d4c8507';
    window._smartsupp.language = locale;

    if (window.smartsupp) {
      window.smartsupp('set', 'language', locale);
      window.smartsupp('html:apply');
    } else {
      const d = document;
      const s = d.getElementsByTagName('script')[0];
      const c = d.createElement('script');
      c.type = 'text/javascript';
      c.charset = 'utf-8';
      c.async = true;
      c.src = 'https://www.smartsuppchat.com/loader.js?';
      if (s && s.parentNode) {
        s.parentNode.insertBefore(c, s);
      } else {
        d.head.appendChild(c);
      }
    }
  }, [locale]);

  return null;
}

declare global {
  interface Window {
    _smartsupp: any;
    smartsupp: any;
  }
}
