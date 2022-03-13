import React from 'react'
import { Container, Alert, Row, Col } from 'react-bootstrap'
const Successful = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Alert variant="success">تمت عملية قبول الطلب بنجاح</Alert>
                </Col>
            </Row>
        </Container>
    )
}

export default Successful
