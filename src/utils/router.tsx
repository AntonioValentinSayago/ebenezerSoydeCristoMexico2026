import { createBrowserRouter } from 'react-router-dom';
import ViewResgiter from '../viewResgiter';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ViewResgiter/>,
  },
]);