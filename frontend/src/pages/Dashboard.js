import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { bookingService, propertyService } from '../services/services';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'user') {
        const bookingResponse = await bookingService.getUserBookings();
        setBookings(bookingResponse.data.bookings);
      } else if (user?.role === 'landlord' || user?.role === 'admin') {
        const propertyResponse = await propertyService.getUserProperties(user?.id);
        setProperties(propertyResponse.data.properties);

        const bookingResponse = await bookingService.getUserBookings();
        const myRequests = bookingResponse.data.bookings.filter(
          (b) => b.landlord?._id === user.id || b.landlord?._id === user._id
        );
        setBookings(myRequests);
      }

      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'confirmed');
      fetchData();
      alert('Booking confirmed');
    } catch (err) {
      alert('Failed to confirm booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'rejected');
      fetchData();
      alert('Booking rejected');
    } catch (err) {
      alert('Failed to reject booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'unpaid': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className='text-center py-5'>
        <Spinner animation='border' />
      </Container>
    );
  }

  return (
    <Container className='dashboard-container py-5'>
      <Row className='mb-4'>
        <Col>
          <h1>Welcome, {user?.name}!</h1>
          <p className='text-muted'>Role: {user?.role === 'landlord' ? 'Landlord' : user?.role === 'admin' ? 'Admin' : 'Tenant'}</p>
        </Col>
        <Col md={3} className='text-end'>
          <Link to='/profile' className='btn btn-outline-primary'>
            Edit Profile
          </Link>
        </Col>
      </Row>

      {error && <Alert variant='danger'>{error}</Alert>}

      {user?.role === 'user' ? (
        <Tabs defaultActiveKey='bookings' className='mb-4'>
          <Tab eventKey='bookings' title='My Bookings'>
            {bookings.length > 0 ? (
              <Row>
                {bookings.map((booking) => (
                  <Col md={6} lg={4} key={booking._id} className='mb-3'>
                    <Card className='h-100'>
                      <Card.Body>
                        <h5>{booking.property?.title || 'Property'}</h5>
                        <p className='text-muted'>
                          {booking.property?.address || ''}, {booking.property?.city || ''}
                        </p>
                        <hr />
                        <p className='mb-1'>
                          <strong>Check-In:</strong>{' '}
                          {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className='mb-1'>
                          <strong>Check-Out:</strong>{' '}
                          {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className='mb-1'>
                          <strong>Total Price:</strong> ₹{booking.totalPrice?.toLocaleString() || 'N/A'}
                        </p>
                        <p className='mb-1'>
                          <strong>Status:</strong>{' '}
                          <span className={`badge bg-${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </p>
                        <p className='mb-1'>
                          <strong>Payment:</strong>{' '}
                          <span className={`badge bg-${getPaymentColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </p>
                        {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && (
                          <Button
                            variant='success'
                            size='sm'
                            className='mt-2'
                            onClick={() => navigate(`/booking/${booking._id}`)}
                          >
                            Pay Now
                          </Button>
                        )}
                        {booking.paymentStatus === 'paid' && (
                          <Button
                            variant='outline-primary'
                            size='sm'
                            className='mt-2 ms-2'
                            onClick={() => navigate(`/booking/${booking._id}`)}
                          >
                            View Details
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant='info'>
                No bookings yet.{' '}
                <Link to='/properties'>Browse properties</Link>
              </Alert>
            )}
          </Tab>

          <Tab eventKey='properties' title='Browse Properties'>
            <Link to='/properties' className='btn btn-primary'>
              Explore Properties
            </Link>
          </Tab>
        </Tabs>
      ) : (
        <Tabs defaultActiveKey='listings' className='mb-4'>
          <Tab eventKey='listings' title='My Listings'>
            {properties.length > 0 ? (
              <Row>
                {properties.map((property) => (
                  <Col md={6} lg={4} key={property._id} className='mb-3'>
                    <Card className='h-100'>
                      <Card.Body>
                        <h5>{property.title}</h5>
                        <p className='text-muted'>
                          {property.address}, {property.city}
                        </p>
                        <p className='text-primary'>
                          <strong>₹{property.price?.toLocaleString()}/month</strong>
                        </p>
                        <p className='mb-2'>
                          <strong>Status:</strong>{' '}
                          <span className={`badge ${property.isApproved ? 'bg-success' : 'bg-warning'}`}>
                            {property.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </p>
                        <Link to={`/property/${property._id}`} className='btn btn-sm btn-outline-primary'>
                          View Details
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant='info'>No listings yet.</Alert>
            )}
          </Tab>

          <Tab eventKey='new-listing' title='Add New Property'>
            <Link to='/add-property' className='btn btn-success'>
              Create New Listing
            </Link>
          </Tab>

          <Tab eventKey='bookings' title='Booking Requests'>
            {bookings.length > 0 ? (
              <Row>
                {bookings.map((booking) => (
                  <Col md={6} lg={4} key={booking._id} className='mb-3'>
                    <Card className='h-100'>
                      <Card.Body>
                        <h5>{booking.property?.title || 'Property'}</h5>
                        <p className='text-muted'>
                          {booking.property?.address || ''}, {booking.property?.city || ''}
                        </p>
                        <hr />
                        <p className='mb-1'>
                          <strong>Tenant:</strong> {booking.tenant?.name || booking.tenant?.email || 'N/A'}
                        </p>
                        <p className='mb-1'>
                          <strong>Check-In:</strong>{' '}
                          {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className='mb-1'>
                          <strong>Check-Out:</strong>{' '}
                          {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className='mb-1'>
                          <strong>Status:</strong>{' '}
                          <span className={`badge bg-${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </p>
                        <Button variant='outline-secondary' size='sm' onClick={() => navigate(`/booking/${booking._id}`)}>
                          View Details
                        </Button>
                        {booking.status === 'pending' && (
                          <>
                            <Button variant='success' size='sm' className='ms-2' onClick={() => handleConfirmBooking(booking._id)}>
                              Confirm
                            </Button>
                            <Button variant='danger' size='sm' className='ms-2' onClick={() => handleRejectBooking(booking._id)}>
                              Reject
                            </Button>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant='info'>No booking requests yet.</Alert>
            )}
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default Dashboard;
