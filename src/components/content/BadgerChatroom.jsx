import React, { useEffect, useState, useContext } from "react"
import { Container, Col, Row, Pagination, Form, Button, Alert } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [activePg, setActive] = useState(1);
    const pgArray = [1, 2, 3, 4];
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorText, setError] = useState('');
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}&page=${activePg}`, {
            headers: {
                "X-CS571-ID": 'bid_12f43ddd02885f40e2efd544a7ab6a81425530c8507d3e8272bbf6289c2b8af7'
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    function submitPost(e) {
        e.preventDefault();
        setError('');

        if (!title || !content) {
            setError('You must provide both a title and content!');
            return;
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                'X-CS571-ID': 'bid_12f43ddd02885f40e2efd544a7ab6a81425530c8507d3e8272bbf6289c2b8af7',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                content: content
            })
        })
            .then(res => {
                if(res.status == 413) {
                    setError("Title must be 128 characters or fewer and Content must be 1024 characters or fewer");
                    return;
                }
                if (res.ok) {
                    return res.json();
                }
            })
            .then(data => {
                if(data == undefined){
                    return;
                }
                alert('Successfully posted the message!');
                setTitle('');
                setContent('');
                setError('');
                loadMessages();
            })
    }

    function deletePost(id) {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?id=${id}`, {
            method: 'DELETE',
            headers: {
                'X-CS571-ID': 'bid_12f43ddd02885f40e2efd544a7ab6a81425530c8507d3e8272bbf6289c2b8af7',
            },
            credentials: 'include'
        })
            .then(res => {
                if (res.ok) {
                    alert("Successfully deleted the post!");
                    loadMessages();
                    return;
                }
            })
    }

    useEffect(loadMessages, [props, activePg]);

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            (!loginStatus || !loginStatus.loggedIn) ?
                <p>You must be logged in to post!</p>
                :
                <>
                    <Col>
                        {errorText && <Alert variant='danger'>{errorText}</Alert>}
                        <Form>
                            <Form.Label htmlFor="postTitle">Post Title</Form.Label>
                            <Form.Control id="postTitle" value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
                            <br />
                            <Form.Label htmlFor="postContent">Post Content</Form.Label>
                            <Form.Control id="postContent" value={content} onChange={(e) => setContent(e.target.value)}></Form.Control>
                            <br />
                            <Button onClick={submitPost}>Create Post</Button>
                        </Form>
                    </Col>

                </>
        }
        <hr />
        {
            messages.length > 0 ?
                <>
                    <Container fluid>
                        <Row>
                            {
                                messages.map(m => (
                                    <Col key={m.id} xs={12} sm={12} md={6} lg={4} xl={3}>
                                        <BadgerMessage {...m} deletePost={() => deletePost(m.id)} />
                                    </Col>
                                ))

                            }
                        </Row>
                    </Container>
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <Pagination>
            {pgArray.map(page => (
                <Pagination.Item key={page} active={page === activePg} onClick={() => setActive(page)}>
                    {page}
                </Pagination.Item>
            ))}
        </Pagination>
    </>
}
