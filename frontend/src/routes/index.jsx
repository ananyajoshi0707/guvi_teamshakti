import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Layout from '../components/Layout';
import StudyPlanner from '../pages/StudyPlanner';  // import StudyPlanner

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'study-planner',        // new route path
        element: <StudyPlanner />,    // new page element
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
