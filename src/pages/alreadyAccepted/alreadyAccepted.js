import React, { useEffect, useState } from 'react'
import { baseURI } from '../../config'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
    Container,
    ListGroup,
    Row,
    Col,
    Alert,
    Spinner,
    Modal,
    Button,
    Card,
} from 'react-bootstrap'
import moment from 'moment'
import QRCode from 'react-qr-code'

const AlreadyAccepted = () => {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    let navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const DOToken = searchParams.get('DOToken')
    const getOrderDetails = ({ doToken }) => {
        return new Promise(async (resolve, reject) => {
            var myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
            }
            try {
                var response = await fetch(
                    `${baseURI}/D/O?id=${doToken}`,
                    requestOptions
                )
                const body = JSON.parse(await response.text())
                if (response.status === 200) {
                    resolve(body)
                } else {
                    reject()
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    const [orderDetails, setOrderDetails] = useState(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [isLoadingError, setIsLoadingError] = useState(false)
    // const [isLoadingErrorSubmit, setIsLoadingErrorSubmit] = useState(false)
    // const [errorMsg, setErrorMsg] = useState('')

    // const [senderName, setSenderName] = useState('')
    // const [senderNote, setSenderNote] = useState('')
    const getStatus = () => {
        switch (orderDetails?.OrderDetails?.Status) {
            case 1:
                return 'تم قبولها'
            case 2:
                return 'تم تجهيزها'
            case 3:
                return 'جاهزة للتوصيل'
            case 4:
                return 'تم أخذها'
            default:
                return 'تم قبولها'
        }
    }
    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoadingError(false)
                setIsLoadingDetails(true)
                let orderDetails = await getOrderDetails({
                    doToken: DOToken,
                })
                if (orderDetails.OrderDetails?.Status === 0) {
                    navigate(`/?DOToken=${DOToken}`, { replace: true })
                }
                orderDetails?.ClientLocations.slice()?.forEach((element) => {
                    element.isSelected = false
                })
                setOrderDetails(orderDetails)
                setIsLoadingDetails(false)
            } catch (error) {
                setIsLoadingError(true)
                setIsLoadingDetails(false)
            }
        }
        getData()
    }, [DOToken, navigate])
    return (
        <Container>
            <Row>
                <Col>
                    <Alert variant="success">
                        <h4>الطلبية {getStatus()}.</h4>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col className={'my-2'}>
                    <Alert variant="primary">
                        <h5>تفاصيل الطلبية:</h5>
                    </Alert>
                </Col>
            </Row>
            {isLoadingDetails ? (
                <Row>
                    <Col className={'d-flex justify-content-center'}>
                        <Spinner
                            variant="primary"
                            animation="border"
                            role="status"
                        >
                            <span className="visually-hidden"></span>
                        </Spinner>
                    </Col>
                </Row>
            ) : isLoadingError ? (
                <Row>
                    <Col className={'my-2'}>
                        <Alert variant="danger">
                            <h5>فشل تحميل البيانات</h5>
                        </Alert>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col xs={'12'}>
                        {/* <Alert variant="warning"> */}
                        <h4
                            style={{
                                padding: '1rem',
                                color: 'orange',
                                display: 'flex',
                                alignItems: 'center',
                                // justifyContent: 'center',
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-shop"
                                viewBox="0 0 16 16"
                            >
                                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
                            </svg>
                            &nbsp;
                            <a
                                style={{ textDecoration: 'none' }}
                                href={`tel:${orderDetails?.OrderDetails?.ShopTelNo1}`}
                            >
                                {orderDetails?.OrderDetails?.ShopName}
                                &nbsp;
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="blue"
                                    className="bi bi-telephone-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                                    />
                                </svg>
                            </a>
                        </h4>
                    </Col>
                    <Col xs={12}>
                        <Row>
                            <Col xs={6} md={4}>
                                <ListGroup.Item
                                    style={{ border: 0 }}
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">
                                            رقم الطلبية:
                                        </div>
                                        {orderDetails?.OrderDetails
                                            ?.RefrenceNo ?? 'لايوجد'}
                                    </div>
                                </ListGroup.Item>
                            </Col>
                            <Col xs={6} md={4}>
                                <ListGroup.Item
                                    style={{ border: 0 }}
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">
                                            تاريخ الإنشاء:
                                        </div>
                                        {moment
                                            .utc(
                                                orderDetails?.OrderDetails
                                                    ?.CreateDate
                                            )
                                            .local()
                                            .format('DD/MM/YYYY HH:mm A')}
                                    </div>
                                </ListGroup.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={'12'}>
                        <Row>
                            <Col xs={12} md={4}>
                                <ListGroup.Item
                                    style={{ border: 0 }}
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">
                                            وصف الطلبية:
                                        </div>
                                        {orderDetails?.OrderDetails
                                            ?.Description ?? 'لايوجد'}
                                    </div>
                                </ListGroup.Item>
                            </Col>
                            <Col xs={12} md={4}>
                                <ListGroup.Item
                                    style={{ border: 0 }}
                                    variant="danger"
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div
                                        style={{
                                            fontWeight: '600',
                                        }}
                                        className="ms-2 me-auto"
                                    >
                                        <div className="fw-bold">
                                            القيمة الكلية:
                                        </div>
                                        {orderDetails?.OrderDetails
                                            ?.TotalAmount ? (
                                            <span>
                                                {
                                                    orderDetails.OrderDetails
                                                        .TotalAmount
                                                }
                                                &nbsp;دينار ليبي
                                            </span>
                                        ) : (
                                            'لايوجد'
                                        )}
                                    </div>
                                </ListGroup.Item>
                            </Col>
                        </Row>
                    </Col>
                    {orderDetails?.OrderDetails?.ConfirmationCode && (
                        <Col xs={12}>
                            <Row>
                                <Col className={'my-3 d-grid gap-2'}>
                                    <Button
                                        variant="primary"
                                        onClick={handleShow}
                                    >
                                        عرض QR التأكيد
                                    </Button>
                                </Col>
                            </Row>
                            <Modal centered show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>رمز التأكيد</Modal.Title>
                                </Modal.Header>
                                <Modal.Body
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <QRCode
                                        value={
                                            orderDetails?.OrderDetails
                                                ?.ConfirmationCode ?? ''
                                        }
                                    />
                                    <h2
                                        style={{
                                            padding: '1rem',
                                            direction: 'ltr',
                                        }}
                                    >
                                        {orderDetails?.OrderDetails
                                            ?.ConfirmationCode ?? ''}
                                    </h2>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                    >
                                        إغلاق
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    )}

                    {/* <Row>
                        <Col className={'d-flex my-5 justify-content-center'}>
                            <QRCode
                                value={
                                    orderDetails?.OrderDetails
                                        ?.ConfirmationCode ?? ''
                                }
                            />
                        </Col>
                    </Row> */}
                </Row>
            )}
        </Container>
    )
}

export default AlreadyAccepted
