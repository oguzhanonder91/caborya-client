import React, { Component } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';
import axios from "axios";
import Cookies from 'universal-cookie';

import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();


        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);

                var formData = new FormData();
                formData.append('username', loginRequest.username);
                formData.append('password', loginRequest.password);

                axios.post(API_BASE_URL + "/login", formData,
                ).then((result) => {
                        const cookies = new Cookies();
                        cookies.set(
                            result.data.sessionId.split(";")[0].split("=")[0],result.data.sessionId.split(";")[0].split("=")[1]);
                        this.props.onLogin();
                    },
                    (error) => {
                        if(error.response.data.status === "401") {
                            notification.error({
                                message: 'Caborya App',
                                description: 'Your Username or Password is incorrect. Please try again!'
                            });
                        } else {
                            notification.error({
                                message: 'Caborya App',
                                description: error.response.data.message || 'Sorry! Something went wrong. Please try again!'
                            });
                        }
                    });
            }
        });



    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username or email!' }],
                    })(
                    <Input 
                        prefix={<Icon type="user" />}
                        size="large"
                        name="username"
                        placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input 
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="password" 
                        type="password" 
                        placeholder="Password"  />                        
                )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    Or <Link to="/signup">register now!</Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;