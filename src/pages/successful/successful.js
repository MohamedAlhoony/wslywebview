import React from 'react'
import { Container, Alert, Row, Col } from 'react-bootstrap'
const Successful = () => {
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Alert className="text-center my-3" variant="success">
                        <h3>تمت عملية الطلب بنجاح</h3>
                    </Alert>
                </Col>
                <Col
                    xs={12}
                    className={
                        'd-flex justify-content-center align-items-center'
                    }
                    style={{ height: 'calc(50vh)' }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="200"
                        height="200"
                        fill="currentColor"
                        className="bi bi-send-check-fill"
                        viewBox="0 0 16 16"
                        color="#3b963b"
                    >
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 1.59 2.498C8 14 8 13 8 12.5a4.5 4.5 0 0 1 5.026-4.47L15.964.686Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z" />
                    </svg>
                </Col>
            </Row>
        </Container>
    )
}

export default Successful
