import React, { Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import { NotificationContainer } from './components/common/react-notifications';
import { isMultiColorActive, adminRoot } from './constants/defaultValues';
import { getDirection, setCurrentUser } from './helpers/Utils';
import { ProtectedRoute, UserRole } from './helpers/authHelper';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

const ViewHome = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views/home')
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/app')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);
const ViewUnauthorized = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/unauthorized')
);

const GET_USER_QUERY = gql`
  query getUser {
    getUser {
      id
      username
      emails {
        address
        verified
      }
      firstName
      lastName
    }
  }
`;

const App = ({ locale }) => {
  const direction = getDirection();
  if (direction.isRtl) {
    document.body.classList.add('rtl');
    document.body.classList.remove('ltr');
  } else {
    document.body.classList.add('ltr');
    document.body.classList.remove('rtl');
  }

  const currentAppLocale = AppLocale[locale];

  const { loading, error, data } = useQuery(GET_USER_QUERY);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: 'center' }}>Error: {error.message}</p>;

  if (data.getUser) {
    setCurrentUser(data.getUser);
  } else {
    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <ProtectedRoute
                    path={adminRoot}
                    component={ViewApp}
                    roles={[UserRole.Admin, UserRole.Editor]}
                  />
                  <Route
                    path="/user"
                    render={(props) => <ViewUser {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={(props) => <ViewError {...props} />}
                  />
                  <Route
                    path="/unauthorized"
                    exact
                    render={(props) => <ViewUnauthorized {...props} />}
                  />
                  {/* <Route
                  path="/"
                  exact
                  render={(props) => <ViewHome {...props} />}
                /> */}

                  <Redirect to="/user" />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </>
        </IntlProvider>
      </div>
    );
  }

  return (
    <div className="h-100">
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <>
          <NotificationContainer />
          {isMultiColorActive && <ColorSwitcher />}
          <Suspense fallback={<div className="loading" />}>
            <Router>
              <Switch>
                <ProtectedRoute
                  path={adminRoot}
                  component={ViewApp}
                  roles={[UserRole.Admin, UserRole.Editor]}
                />
                <Route
                  path="/user"
                  render={(props) => <ViewUser {...props} />}
                />
                <Route
                  path="/error"
                  exact
                  render={(props) => <ViewError {...props} />}
                />
                <Route
                  path="/unauthorized"
                  exact
                  render={(props) => <ViewUnauthorized {...props} />}
                />
                {/* <Route
                  path="/"
                  exact
                  render={(props) => <ViewHome {...props} />}
                /> */}

                <Redirect exact from="/" to={adminRoot} />

                <Redirect to="/error" />
              </Switch>
            </Router>
          </Suspense>
        </>
      </IntlProvider>
    </div>
  );
};

const mapStateToProps = ({ authUser, settings }) => {
  const { currentUser } = authUser;
  const { locale } = settings;
  return { currentUser, locale };
};
const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(App);
