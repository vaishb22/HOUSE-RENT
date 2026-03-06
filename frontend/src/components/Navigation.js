import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showBackButton = location.pathname !== '/';

  if (loading) {
    // while auth state is resolving do not render links
    return null;
  }
  // always allow going back except from home (brand serves as home link)


  return (
    <Navbar bg='dark' expand='lg' fixed='top' className='navbar-custom'>
      <Container className='d-flex align-items-center'>
        <div className='navbar-start'>
          {showBackButton && (
            <Button
              variant='outline-light'
              size='sm'
              onClick={() => navigate(-1)}
              className='me-2 back-button'
              title='Go Back'
            >
              <FaArrowLeft /> Back
            </Button>
          )}
          <Navbar.Brand as={Link} to='/' className='brand'>
            🏠 HouseHunt
          </Navbar.Brand>
        </div>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />

        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link as={Link} to='/' className='me-2'>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to='/properties' className='me-2'>
              Browse
            </Nav.Link>

            {user ? (
              <>
                <Nav.Link as={Link} to='/dashboard'>
                  {user.role === 'landlord' ? 'My Listings' : 'Dashboard'}
                </Nav.Link>

                {user.role === 'landlord' && (
                  <Nav.Link as={Link} to='/add-property'>
                    + List Property
                  </Nav.Link>
                )}

                {user.role === 'admin' && (
                  <Nav.Link as={Link} to='/admin'>
                    Admin
                  </Nav.Link>
                )}

                <Nav.Link as={Link} to='/profile' className='user-profile-link'>
                  👤 {user.name.split(' ')[0]}
                </Nav.Link>

                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={handleLogout}
                  className='ms-2'
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to='/login'>
                  Login
                </Nav.Link>

                <Button
                  variant='primary'
                  size='sm'
                  as={Link}
                  to='/register'
                  className='ms-2'
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
