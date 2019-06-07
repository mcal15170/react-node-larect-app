import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import ContactUs from "./core/ContactUs";
import Singup from "./user/Singup";
import Singin from "./user/Singin";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/findPeople";
import PrivateRoute from "./auth/PrivateRoute";
import NewPost from "./post/NewPost";
import SinglePost from "./post/SinglePost";
import EditPost from "./post/EditPost";

export default function MainRouter() {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <PrivateRoute exact path="/post/create" component={NewPost} />
        <Route exact path="/post/:postId" component={SinglePost} />
        <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/contact" component={ContactUs} />
        <Route exact path="/signup" component={Singup} />
        <Route exact path="/signin" component={Singin} />
        <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
        <PrivateRoute exact path="/findpeople" component={FindPeople} />
        <PrivateRoute exact path="/user/:userId" component={Profile} />
      </Switch>
    </div>
  );
}
