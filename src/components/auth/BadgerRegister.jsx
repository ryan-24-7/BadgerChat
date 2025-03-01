import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerRegister() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeat, setRepeat] = useState('');
    const [errorText, setError] = useState('');
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if(!username || !password || !repeat){
            setError("You must provide both a username and password");
            return;
        }

        if(password !== repeat){
            setError("Your passwords do not match!");
            return;
        }

        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/register', {
            method: 'POST',
            headers: {
                'X-CS571-ID': 'bid_12f43ddd02885f40e2efd544a7ab6a81425530c8507d3e8272bbf6289c2b8af7',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                pin: password
            })
        })
        .then(res => {
            if(res.status == 400){
                setError("Password must exactly be a 7-digit PIN code");
                return;
            }
            if(res.status == 409){
                setError("That username has already been taken!");
                return;
            }
            if(res.status == 413){
                setError("'username' must be 64 characters or fewer");
                return;
            }
            if(res.ok){
                alert('You have successfully registered');
                return res.json();
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
        <h1>Register</h1>
        {errorText && <Alert variant='danger'>{errorText}</Alert>}
        <Form>
            <Form.Label htmlFor="usernameInput">Username</Form.Label>
            <Form.Control id="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <br />
            <Form.Label htmlFor="passwordInput">Password</Form.Label>
            <br />
            <Form.Text>Password must be a 7 digit PIN</Form.Text>
            <Form.Control id="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <br />
            <Form.Label htmlFor="repeatInput">Repeat Password</Form.Label>
            <Form.Control id="repeatInput" type="password" value={repeat} onChange={(e) => setRepeat(e.target.value)}/>
            <br />
            <Button type='submit' onClick={handleSubmit}>Register</Button>
        </Form>
    </>
}
