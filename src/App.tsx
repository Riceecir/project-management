import "./App.css";
import React, { useEffect } from "react";
// import { UnauthenticatedApp } from "unauthenticated-app";
// import { AuthenticatedApp } from "authenticated-app";
import { useAuth } from "context/auth-context";
import { ErrorBoundary } from "components/error-boundary";
import { FullPageError } from "components/lib";
import { BrowserRouter, useNavigate } from "react-router-dom";

const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app"));
const AuthenticatedApp = React.lazy(() => import("authenticated-app"));

function App() {
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageError}>
        <React.Suspense fallback={<div></div>}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

const Router = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * 登陆注册需要在完成后手动跳转至首页
   * 这里不能判断已登录的跳转，因为会导致原来pathname丢失，
   * 例如 if (user) navigate('/'); 会导致用户输入 "/projects/1/board" => "/"
   *
   * 当然路由配置还有待完善
   */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
