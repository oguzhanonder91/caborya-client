import React, { Component } from 'react';
import { Avatar } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import axios from "axios/index";
import {API_BASE_URL} from "../../constants";


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });


        axios.get(API_BASE_URL+'/user/loginUser',{withCredentials:true})
            .then(res => {
                    this.setState({
                        user: res.data,
                        isLoading: false
                    });

                },
                (error) => {
                    if(error.status === 404) {
                        this.setState({
                            notFound: true,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            serverError: true,
                            isLoading: false
                        });
                    }
                });
    }
      
    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }        
    }

    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            <div className="profile">
                { 
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                        {this.state.user.name[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.name}</div>
                                    <div className="username">{this.state.user.email}</div>
                                </div>
                            </div>
                        </div>  
                    ): null               
                }
            </div>
        );
    }
}

export default Profile;