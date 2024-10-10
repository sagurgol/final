import * as React from "react";
import { Switch, Route, Router } from "wouter";
import Login from "../pages/login";
import Cal from "../pages/calendar";
import Create from "../pages/createAccount";
import Add from "../pages/addEvent";
import Invite from "../pages/invite";
import Notif from "../pages/notifications";

export default () => (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/calendar" component={Cal}/>
      <Route path="/create_account" component={Create}/>
      <Route path="/add_event" component={Add}/>
      <Route path="/invite" component={Invite}/>
    <Route path="/rsvp" component={Notif}/>
    </Switch>
);