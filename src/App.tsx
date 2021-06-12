import "./App.css";
import React from "react";
// import { UnauthenticatedApp } from "unauthenticated-app";
// import { AuthenticatedApp } from "authenticated-app";
import { useAuth } from "context/auth-context";
import { ErrorBoundary } from "components/error-boundary";
import { FullPageError } from "components/lib";

const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app"));
const AuthenticatedApp = React.lazy(() => import("authenticated-app"));

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageError}>
        <React.Suspense fallback={<div></div>}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
