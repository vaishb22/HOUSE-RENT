import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { propertyService } from '../services/services';
import '../styles/AddProperty.css';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyCategory: 'Residential',
    type: 'apartment',
    adType: 'Rent',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    amenities: '',
    images: '',
    petFriendly: false,
    furnished: false,
  });

  // ensure only landlords can add
  if (!user || (user.role !== 'landlord' && user.role !== 'admin')) {
    return (
      <Container className='py-5 text-center'>
        <Alert variant='danger'>You must be a landlord to list a property.</Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.address ||
      !formData.city
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseFloat(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        squareFeet: parseFloat(formData.squareFeet),
        amenities: formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a),
        images: formData.images
          .split(',')
          .map((i) => i.trim())
          .filter((i) => i),
      };

      const response = await propertyService.createProperty(submitData);
      alert('Property listed successfully!');
      // go to detail view of new listing
      const newId = response.data.property._id;
      navigate(`/property/${newId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='add-property-container py-5'>
      <Row>
        <Col lg={8} className='mx-auto'>
          <Card>
            <Card.Body>
              <h2 className='mb-4'>List Your Property</h2>

              {error && <Alert variant='danger'>{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {/* Title */}
                <Form.Group className='mb-3'>
                  <Form.Label>
                    Property Title <span className='text-danger'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    name='title'
                    placeholder='e.g., Cozy Studio in Downtown'
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className='mb-3'>
                  <Form.Label>
                    Description <span className='text-danger'>*</span>
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={4}
                    name='description'
                    placeholder='Describe your property...'
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Price and Type */}
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>
                        Monthly Price (₹) <span className='text-danger'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='number'
                        name='price'
                        placeholder='15000'
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>
                        Property Type <span className='text-danger'>*</span>
                      </Form.Label>
                      <Form.Select
                        name='type'
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value='apartment'>Apartment</option>
                        <option value='house'>House</option>
                        <option value='villa'>Villa</option>
                        <option value='studio'>Studio</option>
                        <option value='condo'>Condo</option>
                        <option value='townhouse'>Townhouse</option>
                        <option value='PG'>PG/Hostel</option>
                        <option value='office'>Office</option>
                        <option value='plot'>Plot</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Bedrooms, Bathrooms, Square Feet */}
                <Row>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        type='number'
                        name='bedrooms'
                        placeholder='2'
                        value={formData.bedrooms}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        type='number'
                        name='bathrooms'
                        placeholder='1'
                        value={formData.bathrooms}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Square Feet</Form.Label>
                      <Form.Control
                        type='number'
                        name='squareFeet'
                        placeholder='800'
                        value={formData.squareFeet}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Address */}
                <Form.Group className='mb-3'>
                  <Form.Label>
                    Address <span className='text-danger'>*</span>
                  </Form.Label>
                  <Form.Control
                    type='text'
                    name='address'
                    placeholder='Street address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* City, State, Zip */}
                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>
                        City <span className='text-danger'>*</span>
                      </Form.Label>
                      <Form.Control
                        type='text'
                        name='city'
                        placeholder='New York'
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type='text'
                        name='state'
                        placeholder='NY'
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        type='text'
                        name='zipCode'
                        placeholder='10001'
                        value={formData.zipCode}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Amenities */}
                <Form.Group className='mb-3'>
                  <Form.Label>Amenities (comma-separated)</Form.Label>
                  <Form.Control
                    type='text'
                    name='amenities'
                    placeholder='e.g., WiFi, Pool, Gym, AC'
                    value={formData.amenities}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Images */}
                <Form.Group className='mb-3'>
                  <Form.Label>Image URLs (comma-separated)</Form.Label>
                  <Form.Control
                    type='text'
                    name='images'
                    placeholder='https://example.com/image1.jpg, https://example.com/image2.jpg'
                    value={formData.images}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Checkboxes */}
                <Form.Group className='mb-3'>
                  <Form.Check
                    type='checkbox'
                    name='petFriendly'
                    label='Pet Friendly'
                    checked={formData.petFriendly}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type='checkbox'
                    name='furnished'
                    label='Furnished'
                    checked={formData.furnished}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Submit Button */}
                <div className='d-flex gap-2'>
                  <Button
                    variant='primary'
                    type='submit'
                    className='w-100'
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'List Property'}
                  </Button>
                  <Button
                    variant='outline-secondary'
                    className='w-100'
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProperty;
