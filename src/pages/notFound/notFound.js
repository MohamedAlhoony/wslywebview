import React from 'react'
import { Container, Alert, Row, Col } from 'react-bootstrap'
const NotFound = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Alert>404 this page does not exists!</Alert>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound
