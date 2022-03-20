import React, { useEffect, useState } from 'react'
import { baseURI } from '../../config'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Container, ListGroup, Row, Col, Alert, Spinner } from 'react-bootstrap'
import moment from 'moment'

const AlreadyAccepted = () => {
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
                        <h4>الطلبية قد تم قبولها مسبقا!</h4>
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
                    <Col md={'4'}>
                        <ListGroup as="ol">
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">وصف الطلبية:</div>
                                    {orderDetails?.OrderDetails?.Description ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">رقم الطلبية:</div>
                                    {orderDetails?.OrderDetails?.RefrenceNo ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item
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
                                    {/* {orderDetails?.OrderDetails?.CreateDate
                                            ? moment(
                                                  orderDetails?.OrderDetails
                                                      ?.CreateDate
                                              )
                                            : 'لايوجد'} */}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={'4'}>
                        <ListGroup as="ol">
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">اسم المحل:</div>
                                    {orderDetails?.OrderDetails?.ShopName ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">رقم المحل:</div>
                                    {orderDetails?.OrderDetails?.ShopTelNo ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">
                                        القيمة الكلية:
                                    </div>
                                    {orderDetails?.OrderDetails?.TotalAmount ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={'4'}>
                        <ListGroup as="ol">
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">
                                        رقم هاتف الزبون:
                                    </div>
                                    {orderDetails?.OrderDetails?.ClientTelNo ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            )}
        </Container>
    )
}

export default AlreadyAccepted
