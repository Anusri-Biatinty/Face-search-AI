import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import SearchPersonPage from './pages/SearchPersonPage';
import UploadCollectionPage from './pages/UploadCollectionPage';

const EmptyRoute = () => null;

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <EmptyRoute /> },
      { path: 'register', element: <UploadCollectionPage /> },
      { path: 'search', element: <SearchPersonPage /> },
    ],
  },
]);
