import React from 'react'
import { Container, Alert, Row, Col } from 'react-bootstrap'
const Error = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Alert variant="danger">DOToken Error!</Alert>
                </Col>
            </Row>
        </Container>
    )
}

export default Error
