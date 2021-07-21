import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactLoader from './components/loader';
import * as ROUTES from './constants/routes';
import UserContext from './context/user';
import useAuthListener from './hooks/use-auth-listener';

import ProtectedRoute from './helpers/protected-route';
import TermProvider from './context/providers/term-provider';
import ChangePassword from './pages/settings/change-password';
import Publish from './pages/publish';

const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/sign-up'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));
const NotFound = lazy(() => import('./pages/not-found'));
const EditProfile = lazy(() => import('./pages/settings/edit-profile'));

export default function App() {
  const { user } = useAuthListener();

  return (
    <UserContext.Provider value={{ user }}>
      <TermProvider>
        <Router>
          <Suspense fallback={<ReactLoader />}>
            <Switch>
              <ProtectedRoute user={user} path={ROUTES.DASHBOARD} exact>
                <Dashboard />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.EDIT_PROFILE} exact>
                <EditProfile />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.CHANGE_PASSWORD} exact>
                <ChangePassword />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.PUSH_NOTIFICATIONS} exact>
                <EditProfile />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.PRIVACY_AND_SECURITY} exact>
                <EditProfile />
              </ProtectedRoute>
              <ProtectedRoute user={user} path={ROUTES.LOGIN_ACTIVITY} exact>
                <EditProfile />
              </ProtectedRoute>
              <Route path={ROUTES.LOGIN} component={Login} />
              <Route path={ROUTES.SIGN_UP} component={SignUp} />
              <Route path={ROUTES.POST} component={Publish} />
              <Route path={ROUTES.PROFILE} component={Profile} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </TermProvider>
    </UserContext.Provider>
  );
}
