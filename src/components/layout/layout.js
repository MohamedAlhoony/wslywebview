import React from 'react'
import { Container, Navbar, Image, Nav } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
const Layout = () => {
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
            <Outlet />
        </Container>
    )
}

export default Layout
