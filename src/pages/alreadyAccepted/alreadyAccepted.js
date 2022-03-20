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
    const getStatus = () => {
        switch (orderDetails?.OrderDetails?.status) {
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
                    <Col xs={'6'} md={'4'}>
                        <ListGroup as="ol">
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
                                    <div className="fw-bold">وصف الطلبية:</div>
                                    {orderDetails?.OrderDetails?.Description ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                        <ListGroup.Item
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
                                <div className="fw-bold">القيمة الكلية:</div>
                                {orderDetails?.OrderDetails?.TotalAmount ? (
                                    <span>
                                        {orderDetails.OrderDetails.TotalAmount}
                                        &nbsp;دينار ليبي
                                    </span>
                                ) : (
                                    'لايوجد'
                                )}
                            </div>
                        </ListGroup.Item>
                    </Col>
                    <Col xs={'6'} md={'4'}>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                                <div className="fw-bold">تاريخ الإنشاء:</div>
                                {moment
                                    .utc(orderDetails?.OrderDetails?.CreateDate)
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
                        <ListGroup as="ol">
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">اسم المحل:</div>
                                    {orderDetails?.OrderDetails?.ShopName ? (
                                        <span>
                                            <a
                                                style={{
                                                    textDecoration: 'none',
                                                }}
                                                href={`tel:${orderDetails?.OrderDetails?.ShopTelNo1}`}
                                            >
                                                {
                                                    orderDetails.OrderDetails
                                                        .ShopName
                                                }
                                                &nbsp; &nbsp;
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="blue"
                                                    class="bi bi-telephone-fill"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
                                                    />
                                                </svg>
                                            </a>
                                        </span>
                                    ) : (
                                        'لايوجد'
                                    )}
                                </div>
                            </ListGroup.Item>
                            {/* <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">رقم المحل:</div>
                                    {orderDetails?.OrderDetails?.ShopTelNo ??
                                        'لايوجد'}
                                </div>
                            </ListGroup.Item> */}
                        </ListGroup>
                    </Col>
                </Row>
            )}
        </Container>
    )
}

export default AlreadyAccepted
