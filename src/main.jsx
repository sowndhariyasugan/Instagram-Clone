import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ViewStory from './ViewStory.jsx'
import Profile from './Profile.jsx'
import Search from './Search.jsx'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'


const router=createBrowserRouter(
  [
    {
      path:'/', 
      element:<App/>
    },{
      path:'/story/:id/:tot',
      element:<ViewStory/>
    },{
      path :'/profile',
      element:<Profile/>
    },{
      path:'/search',
      element:<Search/>
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
