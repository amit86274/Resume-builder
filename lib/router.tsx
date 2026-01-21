
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

import HomePage from '../app/page';
import BuilderPage from '../app/builder/page';
import DashboardPage from '../app/dashboard/page';
import AdminPage from '../app/admin/page';
import AuthPage from '../app/auth/page';
import BlogPage from '../app/blog/page';
import TemplatesPage from '../app/templates/page';
import ContactPage from '../app/contact/page';
import FAQPage from '../app/faq/page';
import ResumeOptionPage from '../app/resume-option/page';
import UploadMethodPage from '../app/upload-method/page';
import DirectPortPage from '../app/direct-port/page';

export const builderSession = {
  pendingFile: null as File | null,
  prefilledData: null as any | null,
};

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
    const url = new URL(path, window.location.origin);
    setPathname(url.pathname);
    setSearchParams(url.searchParams);
  };

  const push = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      console.warn('[Router] pushState failed.', e);
    }
    updateStateFromPath(path);
    window.scrollTo(0, 0);
  };

  const replace = (path: string) => {
    try {
      window.history.replaceState({}, '', path);
    } catch (e) {
      console.warn('[Router] replaceState failed.', e);
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

export const RouteHandler: React.FC = () => {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/+/, '').split('?')[0].replace(/\/$/, '') || 'landing';

  return useMemo(() => {
    switch (normalizedPath) {
      case 'landing': return <HomePage />;
      case 'builder': return <BuilderPage />;
      case 'dashboard': return <DashboardPage />;
      case 'admin': return <AdminPage />;
      case 'auth': return <AuthPage />;
      case 'login': return <AuthPage />;
      case 'signup': return <AuthPage />;
      case 'blog': return <BlogPage />;
      case 'templates': return <TemplatesPage />;
      case 'contact': return <ContactPage />;
      case 'faq': return <FAQPage />;
      case 'resume-option': return <ResumeOptionPage />;
      case 'upload-method': return <UploadMethodPage />;
      case 'direct-port': return <DirectPortPage />;
      default: return <HomePage />;
    }
  }, [normalizedPath]);
};
