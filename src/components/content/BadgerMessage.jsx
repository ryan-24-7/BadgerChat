import React, { useContext, useEffect, useState } from "react"
import { Card, Button } from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerMessage(props) {

    const dt = new Date(props.created);
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const checkPoster = (loginStatus?.username == props.poster)

    function deletePost() {
        props.deletePost(props.id);
        return;
    }

    return <Card style={{ margin: "0.5rem", padding: "0.5rem" }}>
        <Card.Title style={{ fontSize: '25px' }}>{props.title}</Card.Title>
        <Card.Subtitle>Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Card.Subtitle>
        <Card.Text style={{ fontStyle: 'italic' }}>Author: {props.poster}</Card.Text>
        <Card.Text style={{ fontSize: '22px' }}>{props.content}</Card.Text>
        {checkPoster && <Button variant='danger' onClick={deletePost}>Delete Post</Button>}
    </Card>
}

export default BadgerMessage;
