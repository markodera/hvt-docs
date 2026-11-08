import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

const clientRouter = typeof window !== 'undefined'
  ? createBrowserRouter(routes, {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      },
    })
  : null;

export default function App() {
  return clientRouter ? <RouterProvider router={clientRouter} /> : null;
}
