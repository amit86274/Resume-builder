import React, { useState, useEffect } from 'react';

/**
 * Next.js Navigation Simulator
 * Mimics App Router hooks in a browser-only environment.
 * Uses event listeners to ensure reactivity across components.
 */

const NAV_EVENT = 'next-shim-navigation';

const notifyNavigation = () => {
  window.dispatchEvent(new Event(NAV_EVENT));
  window.dispatchEvent(new Event('popstate'));
};

export const useRouter = () => {
  return {
    push: (path: string) => {
      window.history.pushState({}, '', path);
      notifyNavigation();
    },
    replace: (path: string) => {
      window.history.replaceState({}, '', path);
      notifyNavigation();
    },
    back: () => {
      window.history.back();
    },
    forward: () => {
      window.history.forward();
    },
    refresh: () => {
      window.location.reload();
    }
  };
};

export const usePathname = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleUpdate = () => setPathname(window.location.pathname);
    window.addEventListener(NAV_EVENT, handleUpdate);
    window.addEventListener('popstate', handleUpdate);
    return () => {
      window.removeEventListener(NAV_EVENT, handleUpdate);
      window.removeEventListener('popstate', handleUpdate);
    };
  }, []);

  return pathname;
};

export const useSearchParams = () => {
  const [params, setParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handleUpdate = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener(NAV_EVENT, handleUpdate);
    window.addEventListener('popstate', handleUpdate);
    return () => {
      window.removeEventListener(NAV_EVENT, handleUpdate);
      window.removeEventListener('popstate', handleUpdate);
    };
  }, []);

  return params;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      notifyNavigation();
    }
  };

  return React.createElement('a', { 
    ...props, 
    href, 
    onClick: handleClick 
  }, children);
};

export default Link;