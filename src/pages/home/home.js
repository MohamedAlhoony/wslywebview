import React, { useEffect, useState } from 'react'
import { baseURI } from '../../config'
import Map from './map/map'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
    Container,
    ListGroup,
    Row,
    Col,
    Form,
    Button,
    Alert,
    Spinner,
} from 'react-bootstrap'
import moment from 'moment'

const Home = (props) => {
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
    const sendSubmitForm = () => {
        return new Promise(async (resolve, reject) => {
            var myHeaders = new Headers()
            var urlencoded = new URLSearchParams()
            try {
                urlencoded.append('DOToken', DOToken)
                urlencoded.append('Lang', orderDetails?.selectedLocation?.Lang)
                urlencoded.append('Lat', orderDetails?.selectedLocation?.Lat)
                urlencoded.append('IsAccepted', 'True')
                urlencoded.append('ReciverName', recieverName)
                urlencoded.append('ReciverTelNo', recieverNumber)
                urlencoded.append('SenderNoteToReciver', senderNote)
                urlencoded.append('SenderName', senderName)
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow',
                }
                var response = await fetch(
                    `${baseURI}/D/ClientResponse`,
                    requestOptions
                )
                const responseText = await response.text()
                const body = responseText ? JSON.parse(responseText) : ''
                if (response.status >= 200 && response.status < 300) {
                    navigate('/successful', { replace: true })
                    resolve()
                } else {
                    reject(body)
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    const submitForm = async () => {
        try {
            setIsLoadingErrorSubmit(false)
            setIsLoadingSubmit(true)
            let orderDetails = await sendSubmitForm()
            orderDetails?.ClientLocations?.forEach((element) => {
                element.isSelected = false
                element.isOldLocation = true
            })
            setOrderDetails(orderDetails)
            setIsLoadingSubmit(false)
        } catch (error) {
            setErrorMsg(error)
            setIsLoadingErrorSubmit(true)
            setIsLoadingSubmit(false)
        }
    }

    const handleMarkerClick = (item, marker, key) => {
        let locations = orderDetails.ClientLocations
        locations.splice(-1)
        locations.forEach((e) => (e.isSelected = false))
        locations.push({ ...item, isSelected: true })
        setOrderDetails({
            ...orderDetails,
            ClientLocations: locations,
            selectedLocation: item,
        })
    }
    const onMapClick = (marker) => {
        let locations = orderDetails.ClientLocations
        locations.splice(-1)
        locations.forEach((e) => (e.isSelected = false))
        const newLocation = {
            isSelected: true,
            Lat: marker.latLng.lat(),
            Lang: marker.latLng.lng(),
        }
        locations.push(newLocation)
        setOrderDetails({
            ...orderDetails,
            ClientLocations: locations,
            selectedLocation: newLocation,
        })
    }
    const [orderDetails, setOrderDetails] = useState(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [isLoadingError, setIsLoadingError] = useState(false)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
    const [isLoadingErrorSubmit, setIsLoadingErrorSubmit] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const [senderName, setSenderName] = useState('')
    const [recieverName] = useState('')
    const [recieverNumber] = useState('')
    const [senderNote, setSenderNote] = useState('')

    useEffect(() => {
        if (!DOToken) {
            navigate('/error')
        }
        const getData = async () => {
            try {
                setIsLoadingError(false)
                setIsLoadingDetails(true)
                let orderDetails = await getOrderDetails({
                    doToken: DOToken,
                })
                if (orderDetails.OrderDetails?.Status !== 0) {
                    navigate(`/alreadyAccepted/?DOToken=${DOToken}`)
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
                    {/* <Col md={'4'}>
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
                    </Col> */}
                </Row>
            )}
            <Row>
                <Col className={'my-2 mt-5'}>
                    <Alert variant="primary">
                        <h5>معلوماتك:</h5>
                    </Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    {orderDetails ? (
                        <>
                            <h5>قم بتحديد موقعك على الخريطة:</h5>
                            <Map
                                store={{
                                    lat: orderDetails?.OrderDetails?.FromLat,
                                    lang: orderDetails?.OrderDetails?.FromLang,
                                }}
                                onMapClick={onMapClick}
                                handleMarkerClick={handleMarkerClick}
                                locations={orderDetails.ClientLocations}
                            />
                        </>
                    ) : null}
                </Col>
            </Row>
            {isLoadingSubmit ? (
                <Row>
                    <Col className={'d-flex justify-content-center my-5'}>
                        <Spinner
                            variant="primary"
                            animation="border"
                            role="status"
                        >
                            <span className="visually-hidden"></span>
                        </Spinner>
                    </Col>
                </Row>
            ) : (
                <Row className={'my-4'}>
                    <Col>
                        {isLoadingErrorSubmit && (
                            <Row>
                                <Col className={'my-2'}>
                                    <Alert variant="danger">
                                        <h5>{errorMsg}</h5>
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col className={'my-2'}>
                                <p>أدخل بياناتك هنا:</p>
                            </Col>
                        </Row>
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Col sm="6" className="mb-2">
                                    <Form.Control
                                        placeholder="اسم المرسل"
                                        value={senderName}
                                        onChange={(event) =>
                                            setSenderName(event.target.value)
                                        }
                                        type="text"
                                    />
                                </Col>
                                {/* <Col sm="6" className="mb-2">
                                    <Form.Control
                                        placeholder="اسم المستقبل"
                                        value={recieverName}
                                        onChange={(event) =>
                                            setRecieverName(event.target.value)
                                        }
                                        type="text"
                                    />
                                </Col>

                                <Col sm="6" className="mb-2">
                                    <Form.Control
                                        placeholder="رقم هاتف المستقبل"
                                        value={recieverNumber}
                                        onChange={(event) =>
                                            setRecieverNumber(
                                                event.target.value
                                            )
                                        }
                                        maxLength={'20'}
                                        type="number"
                                    />
                                </Col> */}
                                <Col sm="6" className="mb-2">
                                    <Form.Control
                                        placeholder="ملاحظات"
                                        value={senderNote}
                                        onChange={(event) =>
                                            setSenderNote(event.target.value)
                                        }
                                        as="textarea"
                                    />
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            )}
            <Row>
                <Col xs={12} className={'mb-4 d-grid gap-2'}>
                    <Button
                        disabled={
                            senderName === '' ||
                            // recieverName === '' ||
                            // recieverNumber === '' ||
                            isLoadingSubmit
                        }
                        variant="success"
                        onClick={submitForm}
                    >
                        قبول الطلب
                    </Button>
                    <Button variant="danger" onClick={() => {}}>
                        رفض
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default Home
