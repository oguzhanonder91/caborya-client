import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';

import {API_BASE_URL} from '../constants';

import PollList from '../poll/PollList';
import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import axios from "axios";
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import { Layout, notification } from 'antd';
import Cookies from "js-cookie";
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });    
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });

      if(!document.cookie.includes("JSESSIONID")) {
          this.props.history.push("/login");
          this.setState({
              isAuthenticated: false,
              isLoading: false
          });
      }else{
          axios.get(API_BASE_URL+'/user/loginUser',{withCredentials:true})
              .then(res => {
                      this.setState({
                          currentUser: res,
                          isAuthenticated: true,
                          isLoading: false
                      });
                  },
                  (error) => {
                      this.setState({
                          isAuthenticated: false,
                          currentUser: null,
                          isLoading: false
                      });

                  });
      }


  }

  componentWillMount(){
      this.loadCurrentUser();
  }

  handleLogout(redirectTo="/login", notificationType="success", description="You're successfully logged out.") {

      axios.post(API_BASE_URL + "/logout",null,{withCredentials:true})
          .then((result) => {
                  Cookies.remove("JSESSIONID");
                  this.setState({
                      currentUser: null,
                      isAuthenticated: false,
                      isLoading: false
                  });
              },
              (error) => {
                  notification.error({
                      message: 'Caborya App',
                      description: error.response.data.message || 'Sorry! Something went wrong. Please try again!'
                  });
              });


    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Caborya App',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Caborya App',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated} 
            currentUser={this.state.currentUser} 
            onLogout={this.handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>      
                <Route exact path="/"
                  render={(props) => <PollList isAuthenticated={this.state.isAuthenticated}
                      currentUser={this.state.currentUser} handleLogout={this.handleLogout} {...props} />}>
                </Route>
                <Route path="/login" 
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <Route path="/users/:username" 
                  render={(props) => <Profile isAuthenticated={this.state.isAuthenticated} currentUser={this.state.currentUser} {...props}  />}>
                </Route>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/poll/new" component={NewPoll} handleLogout={this.handleLogout}></PrivateRoute>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);
