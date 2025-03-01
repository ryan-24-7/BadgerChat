import React, {useRef, useState, useContext} from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {

    const username = useRef();
    const password = useRef();
    const [errorText, setError] = useState('');
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    function handleLogin(e) {
        e.preventDefault();
        setError('');

        if(!username.current.value || !password.current.value){
            setError('You must provide both a username and password!')
            return;
        }

        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/login', {
            method: 'POST',
            headers: {
                'X-CS571-ID': 'bid_12f43ddd02885f40e2efd544a7ab6a81425530c8507d3e8272bbf6289c2b8af7',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username.current.value,
                pin: password.current.value
            })
        })
        .then(res => {
            if(res.status === 401){
                setError("Incorrect username or password!")
                return;
            }
            if(res.ok){
                alert('Login was successful')
                return res.json()
            }
        }).then(data => {
            const loginData = {
                username: data.user.username,
                loggedIn: true
            }
            setLoginStatus(loginData)
            sessionStorage.setItem('loginStatus', JSON.stringify(loginData))
            navigate('/');
        })
    }

    return <>
        <h1>Login</h1>
        {errorText && <Alert variant='danger'>{errorText}</Alert>}
        <Form>
            <Form.Label htmlFor='usernameInput'>Username</Form.Label>
            <Form.Control id='usernameInput' ref={username}></Form.Control>
            <Form.Label htmlFor='passwordInput'>Password</Form.Label>
            <Form.Control id='passwordInput' type='password' ref={password}></Form.Control>
            <br />
            <Button type='submit' onClick={handleLogin}>Login</Button>
        </Form>
    </>
}
