// AppRoutes.js

import {Redirect, Route, Switch} from "react-router-dom";
import RegisterPage from "../pages/authentication/RegisterPage";
import LoginPage from "../pages/authentication/LoginPage";
import VerificationSuccessPage from "../pages/authentication/VerificationSuccessPage";
import VerificationFailedPage from "../pages/authentication/VerificationFailedPage";
import ForgotPasswordPage from "../pages/authentication/ForgotPasswordPage";
import ResetPasswordPage from "../pages/authentication/ResetPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import React from "react";
import Home from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

const PrivateRoute = ({component: Component, ...rest}) => {
    const isAuthenticated = !!localStorage.getItem('accessToken');

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? <Component {...props} /> : <Redirect to="/login"/>
            }
        />
    );
};

const AppRoutes = () => {
    return (
        <Switch>
            {/* Public Routes */}
            <Route path="/register" component={RegisterPage}/>
            <Route path="/login" component={LoginPage}/>
            <Route path="/v-success" component={VerificationSuccessPage}/>
            <Route path="/v-failed" component={VerificationFailedPage}/>
            <Route path="/forgot-password" component={ForgotPasswordPage}/>
            <Route path="/reset-password/:token" component={ResetPasswordPage}/>

            {/* Private Routes */}
            <PrivateRoute exact path="/" component={Home}/>
            <PrivateRoute exact path="/home" component={Home}/>
            <PrivateRoute exact path="/profile" component={ProfilePage}/>

            {/* 404 Not Found Pages routes */}
            <Route exact path="/*" component={NotFoundPage}/>
        </Switch>
    );
};

export default AppRoutes;
