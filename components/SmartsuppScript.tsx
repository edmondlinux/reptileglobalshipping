'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

export default function SmartsuppScript() {
  const locale = useLocale();

  useEffect(() => {
    // Prevent duplicate loading
    if (document.getElementById('jivochat-script')) return;

    const script = document.createElement('script');
    script.id = 'jivochat-script';
    script.src = '//code.jivosite.com/widget/GhR18cGL3O';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById('jivochat-script');
      if (existing) {
        existing.remove();
      }
    };
  }, []);

  return null;
}
