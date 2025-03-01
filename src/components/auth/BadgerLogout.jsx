import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import React, { useEffect, useContext } from 'react';

export default function BadgerLogout() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/f24/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": 'bid_12f43ddd02885f40e2efd544a7ab6a81425530c8507d3e8272bbf6289c2b8af7'
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            setLoginStatus(undefined)
            sessionStorage.removeItem('loginStatus')
        })
    }, []);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
