import { useEffect } from 'react';
import { Navigate, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import { NotificationContainer } from '@/components/common/NotificationContainer';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { useThemeStore } from '@/stores';

function RootShell() {
  return (
    <>
      <NotificationContainer />
      <ConfirmationModal />
      <Outlet />
    </>
  );
}

// DEV-only design previews: statically false in production builds, so the
// branch and its dynamic import are dropped from the single-file bundle.
const devPreviewRoutes = import.meta.env.DEV
  ? [
      {
        path: '/__preview/quota-tiers',
        HydrateFallback: () => null,
        lazy: async () => {
          const { QuotaTierPreview } = await import('@/features/quota/preview/QuotaTierPreview');
          return { Component: QuotaTierPreview };
        },
      },
    ]
  : [];

const router = createHashRouter([
  {
    element: <RootShell />,
    children: [
      ...devPreviewRoutes,
      { path: '/login', element: <Navigate to="/" replace /> },
      {
        path: '/*',
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  useEffect(() => {
    const cleanupTheme = initializeTheme();
    return cleanupTheme;
  }, [initializeTheme]);

  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
