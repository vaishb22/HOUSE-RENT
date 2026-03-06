import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { bookingService } from '../services/services';
import { AuthContext } from '../context/AuthContext';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await bookingService.getBookingById(id);
        setBooking(res.data.booking || res.data);
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      alert('Please fill in all payment details');
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Call the payment API
      await bookingService.updatePaymentStatus(booking._id, 'paid');
      
      // Refresh booking data
      const res = await bookingService.getBookingById(id);
      setBooking(res.data.booking || res.data);
      
      alert('Payment successful! Your booking is now confirmed.');
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status}</span>;
  };

  const getPaymentBadge = (status) => {
    const colors = {
      paid: 'success',
      partial: 'warning',
      unpaid: 'danger'
    };
    return <span className={`badge bg-${colors[status] || 'secondary'}`}>{status}</span>;
  };

  if (loading) return (
    <Container className='py-5 text-center'>
      <Spinner animation='border' />
    </Container>
  );

  if (error) return (
    <Container className='py-5'>
      <Alert variant='danger'>{error}</Alert>
    </Container>
  );

  if (!booking) return (
    <Container className='py-5'>
      <Alert variant='info'>Booking not found.</Alert>
    </Container>
  );

  // Check if user can make payment (only tenant can pay)
  const canMakePayment = user && 
    booking.tenant && 
    (booking.tenant._id === user.id || booking.tenant._id === user._id || booking.tenant.email === user.email) &&
    booking.paymentStatus !== 'paid' &&
    booking.status !== 'cancelled';

  return (
    <Container className='py-5'>
      <Row>
        <Col md={8} className='mx-auto'>
          <Card className='mb-4'>
            <Card.Body>
              <h3 className='mb-3'>Booking Details</h3>
              <p><strong>Property:</strong> {booking.property?.title}</p>
              <p className='text-muted'>{booking.property?.address}, {booking.property?.city}</p>
              <hr />
              <Row>
                <Col md={6}>
                  <p><strong>Tenant:</strong> {booking.tenant?.name || booking.tenant?.email}</p>
                  <p><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Total Price:</strong> ₹{booking.totalPrice?.toLocaleString()}</p>
                  <p><strong>Status:</strong> {getStatusBadge(booking.status)}</p>
                  <p><strong>Payment:</strong> {getPaymentBadge(booking.paymentStatus)}</p>
                </Col>
              </Row>
              <div className='d-flex gap-2 mt-3'>
                <Button variant='secondary' onClick={() => navigate(-1)}>Back</Button>
                <Button variant='primary' onClick={() => navigate(`/property/${booking.property?._id}`)}>View Property</Button>
              </div>
            </Card.Body>
          </Card>

          {/* Payment Section */}
          {canMakePayment && (
            <Card className='payment-card'>
              <Card.Body>
                <h4 className='mb-4'>💳 Payment</h4>
                <Alert variant='info'>
                  <strong>Total Amount:</strong> ₹{booking.totalPrice?.toLocaleString()}
                </Alert>
                
                <Form onSubmit={handlePayment}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value='card'>Credit/Debit Card</option>
                      <option value='upi'>UPI</option>
                      <option value='netbanking'>Net Banking</option>
                    </Form.Select>
                  </Form.Group>

                  {paymentMethod === 'card' && (
                    <>
                      <Form.Group className='mb-3'>
                        <Form.Label>Cardholder Name</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter cardholder name'
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </Form.Group>
                      
                      <Form.Group className='mb-3'>
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='1234 5678 9012 3456'
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={16}
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col>
                          <Form.Group className='mb-3'>
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                              type='text'
                              placeholder='MM/YY'
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              maxLength={5}
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className='mb-3'>
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type='password'
                              placeholder='***'
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              maxLength={4}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  {paymentMethod === 'upi' && (
                    <Form.Group className='mb-3'>
                      <Form.Label>UPI ID</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='yourname@upi'
                      />
                    </Form.Group>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <Form.Group className='mb-3'>
                      <Form.Label>Select Bank</Form.Label>
                      <Form.Select>
                        <option value=''>Select your bank</option>
                        <option value='sbi'>State Bank of India</option>
                        <option value='hdfc'>HDFC Bank</option>
                        <option value='icici'>ICICI Bank</option>
                        <option value='axis'>Axis Bank</option>
                        <option value='other'>Other Banks</option>
                      </Form.Select>
                    </Form.Group>
                  )}

                  <Button 
                    variant='success' 
                    type='submit' 
                    className='w-100 mt-3'
                    disabled={processingPayment}
                  >
                    {processingPayment ? 'Processing...' : `Pay ₹${booking.totalPrice?.toLocaleString()}`}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Already Paid Message */}
          {booking.paymentStatus === 'paid' && (
            <Alert variant='success' className='text-center'>
              <h5>✓ Payment Completed</h5>
              <p className='mb-0'>Your booking is confirmed. Thank you!</p>
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookingDetail;
