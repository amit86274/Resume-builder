import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Standard React Router Context
 * Provides navigation state and hooks without Next.js shims.
 * Includes resilience against SecurityError in sandboxed environments.
 */

interface RouterContextType {
  pathname: string;
  searchParams: URLSearchParams;
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateStateFromPath = (path: string) => {
    const [pathPart, queryPart] = path.split('?');
    setPathname(pathPart);
    setSearchParams(new URLSearchParams(queryPart || ''));
  };

  const push = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      console.warn('[Router] pushState failed (SecurityError). Using state-only navigation.', e);
    }
    updateStateFromPath(path);
    window.scrollTo(0, 0);
  };

  const replace = (path: string) => {
    try {
      window.history.replaceState({}, '', path);
    } catch (e) {
      console.warn('[Router] replaceState failed (SecurityError). Using state-only update.', e);
    }
    updateStateFromPath(path);
  };

  const back = () => {
    try {
      window.history.back();
    } catch (e) {
      console.warn('[Router] history.back() failed.', e);
    }
  };

  return (
    <RouterContext.Provider value={{ pathname, searchParams, push, replace, back }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within RouterProvider');
  return context;
};

export const usePathname = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('usePathname must be used within RouterProvider');
  return context.pathname;
};

export const useSearchParams = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useSearchParams must be used within RouterProvider');
  return context.searchParams;
};

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  const { push } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check for standard navigation (not ctrl+click etc)
    if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};
