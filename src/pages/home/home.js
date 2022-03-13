import React, { useEffect, useState, useRef } from 'react'
import { baseURI } from '../../config'
import Map from './map/map'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
    Container,
    Navbar,
    ListGroup,
    Nav,
    Image,
    Row,
    Col,
    Form,
    Button,
    Alert,
    Spinner,
} from 'react-bootstrap'
const Home = (props) => {
    let navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const DOToken = searchParams.get('DOToken')
    const senderName = useRef(null)
    const recieverName = useRef(null)
    const recieverNumber = useRef(null)
    const senderNote = useRef(null)
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
            urlencoded.append('DOToken', DOToken)
            urlencoded.append('Lang', orderDetails?.selectedLocation?.Lang)
            urlencoded.append('Lat', orderDetails?.selectedLocation?.Lat)
            urlencoded.append('IsAccepted', 'True')
            urlencoded.append('ReciverName', recieverName.current.value)
            urlencoded.append('ReciverTelNo', recieverNumber.current.value)
            urlencoded.append('SenderNoteToReciver', senderNote.current.value)
            urlencoded.append('SenderName', senderName.current.value)
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow',
            }
            try {
                var response = await fetch(
                    `${baseURI}/D/ClientResponse`,
                    requestOptions
                )
                // const body = JSON.parse(await response.text())
                if (response.status >= 200 && response.status < 300) {
                    navigate('/successful', { replace: true })
                    resolve()
                } else {
                    reject()
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
            console.log(error)
            setIsLoadingErrorSubmit(true)
            setIsLoadingSubmit(false)
        }
    }
    const getData = async () => {
        try {
            setIsLoadingError(false)
            setIsLoadingDetails(true)
            let orderDetails = await getOrderDetails({
                doToken: DOToken,
            })
            if (orderDetails.OrderDetails?.Status !== 0) {
                navigate('/alreadyAccepted', { replace: true })
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
    const handleMarkerClick = (item, marker, key) => {
        const oldState = Object.assign({}, orderDetails)
        oldState.selectedLocation = item
        oldState.ClientLocations.slice().forEach((e) => (e.isSelected = false))
        oldState.ClientLocations[key].isSelected = true

        setOrderDetails(oldState)
    }
    const onMapClick = (marker) => {
        let locations = orderDetails.ClientLocations
        locations.splice(-1)
        locations.forEach((e) => (e.isSelected = false))

        locations.push({
            isOldLocation: false,
            isSelected: true,
            Lat: marker.latLng.lat(),
            Lang: marker.latLng.lng(),
        })
        setOrderDetails({
            ...orderDetails,
            ClientLocations: locations,
            selectedLocation: {
                isSelected: true,
                Lat: marker.latLng.lat(),
                Lang: marker.latLng.lng(),
            },
        })
    }
    const [orderDetails, setOrderDetails] = useState(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    const [isLoadingError, setIsLoadingError] = useState(false)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
    const [isLoadingErrorSubmit, setIsLoadingErrorSubmit] = useState(false)
    useEffect(() => {
        getData()
    }, [])
    return (
        <Container fluid={'true'}>
            <Navbar
                style={{ backgroundColor: '#2c3e50' }}
                variant="dark"
                expand={'lg'}
            >
                <Container>
                    <Navbar.Brand href="#home">
                        <Image src={'./images/logo.png'} width={'200px'} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">الرئيسية</Nav.Link>
                            <Nav.Link href="#link">عن المظلة</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
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
                        <Col md={'4'}>
                            <ListGroup as="ol">
                                <ListGroup.Item
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
                                <ListGroup.Item
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
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">
                                            تاريخ الإنشاء:
                                        </div>
                                        {orderDetails?.OrderDetails?.CreateDate
                                            ? Date(
                                                  orderDetails?.OrderDetails
                                                      ?.CreateDate
                                              )
                                            : 'لايوجد'}
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
                                            اسم المحل:
                                        </div>
                                        {orderDetails?.OrderDetails?.ShopName ??
                                            'لايوجد'}
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">
                                            رقم المحل:
                                        </div>
                                        {orderDetails?.OrderDetails
                                            ?.ShopTelNo ?? 'لايوجد'}
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
                                        {orderDetails?.OrderDetails
                                            ?.TotalAmount ?? 'لايوجد'}
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
                                        {orderDetails?.OrderDetails
                                            ?.ClientTelNo ?? 'لايوجد'}
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
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
                ) : (
                    <Row className={'my-4'}>
                        <Col>
                            {isLoadingErrorSubmit && (
                                <Row>
                                    <Col className={'my-2'}>
                                        <Alert variant="danger">
                                            <h5>
                                                فشلت العملية, تاكد من البيانات
                                                المدخلة
                                            </h5>
                                        </Alert>
                                    </Col>
                                </Row>
                            )}
                            <Form>
                                <Form.Group as={Row} className="mb-3">
                                    {/* <Col sm="6" className="mb-2">
                                    <Form.Label column sm="2">
                                        اسم الزبون:
                                    </Form.Label>
                                    <Form.Control type="text" />
                                </Col> */}
                                    <Col sm="6" className="mb-2">
                                        {/* <Form.Label column sm="2">
                                        اسم المرسل:
                                    </Form.Label> */}
                                        <Form.Control
                                            placeholder="اسم المرسل"
                                            ref={senderName}
                                            type="text"
                                        />
                                    </Col>
                                    <Col sm="6" className="mb-2">
                                        {/* <Form.Label column sm="2">
                                        اسم المستقبل:
                                    </Form.Label> */}
                                        <Form.Control
                                            placeholder="اسم المستقبل"
                                            ref={recieverName}
                                            type="text"
                                        />
                                    </Col>
                                    {/* <Col sm="6" className="mb-2">
                                    <Form.Label column sm="2">
                                        رقم الهاتف:
                                    </Form.Label>
                                    <Form.Control type="text" />
                                </Col> */}

                                    <Col sm="6" className="mb-2">
                                        {/* <Form.Label column sm="2">
                                        رقم هاتف المستقبل:
                                    </Form.Label> */}
                                        <Form.Control
                                            placeholder="رقم هاتف المستقبل"
                                            ref={recieverNumber}
                                            type="text"
                                        />
                                    </Col>
                                    <Col sm="6" className="mb-2">
                                        {/* <Form.Label column sm="2">
                                        رقم هاتف المستقبل:
                                    </Form.Label> */}
                                        <Form.Control
                                            placeholder="ملاحظات"
                                            ref={senderNote}
                                            as="textarea"
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={12} className={'mt-2'}>
                            <Button
                                style={{ marginLeft: '0.2rem' }}
                                onClick={submitForm}
                            >
                                قبول الطلب
                            </Button>
                            <Button variant="danger" onClick={submitForm}>
                                رفض
                            </Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    )
}

export default Home
