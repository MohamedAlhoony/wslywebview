import React from 'react'
import { Container, Alert, Row, Col } from 'react-bootstrap'
const AlreadyAccepted = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Alert variant="danger">الطلبية قد تم قبولها من قبل!</Alert>
                </Col>
            </Row>
        </Container>
    )
}

export default AlreadyAccepted
