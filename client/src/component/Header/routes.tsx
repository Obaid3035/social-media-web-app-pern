import PostDetail from '../Posts/PostDetail/PostDetail';
import Blog from '../../container/Blog/Blog';
import BlogDetail from '../../container/Blog/BlogDetail/BlogDetail';
import CalorieTracker from '../../container/CalorieTracker/CalorieTracker';
import FoodDetail from '../../container/FoodDetail/FoodDetail';
import Queries from '../../container/Queries/Queries';
import OtherProfile from '../../container/Profile/OtherProfile/OtherProfile';
import CurrentProfile from '../../container/Profile/CurrentProfile/CurrentProfile';
import Setting from '../../container/Setting/Setting';
import Home from '../../container/Home/Home';
import AdminBlog from '../../container/admin/pages/Blog/Blog';
import CreateBlog from '../../container/admin/pages/CreateBlog/CreateBlog';
import FoodStats from '../../container/FoodStats/FoodStats';
import HistoryLog from '../../container/HistoryLog/HistoryLog';
import Chat from '../../container/Chat/Chat';
import User from '../../container/admin/pages/User/User';
import Graph from '../../container/Graph/Graph';
import EmailConfirmation from '../../container/Setting/SettingForm/ResetEmail/EmailConfirmation';
import Notification from "../../container/Notification/Notification";

export interface RoutesLink {
   component: JSX.Element;
   path: string;
}

export const sideBarRoutes = [
   {
      path: '/admin/users',
      component: <User />,
   },
   {
      path: '/admin/blogs',
      component: <AdminBlog />,
   },
   {
      path: '/admin/create/blog',
      component: <CreateBlog />,
   },
   {
      path: '/admin/update/blog/:id',
      component: <CreateBlog />,
   },
];

export const mainRoutes: RoutesLink[] = [
   {
      path: '/home',
      component: <Home />,
   },
   {
      path: '/mail-confirmation/:id',
      component: <EmailConfirmation />,
   },
   {
      path: '/chat',
      component: <Chat />,
   },
   {
      path: '/graph',
      component: <Graph />,
   },
   {
      path: '/post-detail/:id',
      component: <PostDetail />,
   },
   {
      path: '/notification',
      component: <Notification/>
   },
   {
      path: '/blog',
      component: <Blog />,
   },
   {
      path: '/blog/:id',
      component: <BlogDetail />,
   },
   {
      path: '/food-stats/:id/:type',
      component: <FoodStats />,
   },
   {
      path: '/history',
      component: <HistoryLog />,
   },
   {
      path: '/calorie-tracker',
      component: <CalorieTracker />,
   },
   {
      path: '/food-detail/:id',
      component: <FoodDetail />,
   },
   {
      path: '/queries',
      component: <Queries />,
   },
   {
      path: '/:id',
      component: <OtherProfile />,
   },
   {
      path: '/profile',
      component: <CurrentProfile />,
   },
   {
      path: '/setting',
      component: <Setting />,
   },
];
