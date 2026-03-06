import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { propertyService } from '../services/services';
import PropertyCard from '../components/PropertyCard';
import '../styles/Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    adType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      const response = await propertyService.getAllProperties(appliedFilters);
      setProperties(response.data.properties);
      setError('');
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const sanitizeNumber = (v) => (typeof v === 'string' ? v.replace(/[^0-9]/g, '') : v);

    const cleanFilters = Object.fromEntries(
      Object.entries(filters)
        .map(([k, v]) => {
          if (k === 'minPrice' || k === 'maxPrice') {
            const cleaned = sanitizeNumber(v);
            return [k, cleaned === '' ? '' : cleaned];
          }
          return [k, v];
        })
        .filter(([_, v]) => v !== '')
    );

    fetchProperties(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      city: '',
      type: '',
      adType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
    });
    fetchProperties({});
  };

  return (
    <Container className='properties-container py-5'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h1>Find Your Perfect Home</h1>
        <Button variant='outline-primary' size='sm' onClick={() => window.location.href = '/'}>
          Home
        </Button>
      </div>

      {error && <Alert variant='danger'>{error}</Alert>}

      {/* Filter Section */}
      <Card className='mb-4 filter-card'>
        <Card.Body>
          <h5 className='mb-3'>Search & Filter</h5>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={6} lg={2} className='mb-3'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  name='city'
                  placeholder='City'
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={6} lg={2} className='mb-3'>
                <Form.Label>Property Type</Form.Label>
                <Form.Select
                  name='type'
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value=''>All Types</option>
                  <option value='apartment'>Apartment</option>
                  <option value='house'>House</option>
                  <option value='villa'>Villa</option>
                  <option value='studio'>Studio</option>
                  <option value='condo'>Condo</option>
                  <option value='townhouse'>Townhouse</option>
                  <option value='PG'>PG/Hostel</option>
                  <option value='Residential'>Residential</option>
                  <option value='Commercial'>Commercial</option>
                  <option value='Land/Plot'>Land/Plot</option>
                </Form.Select>
              </Col>

              <Col md={6} lg={2} className='mb-3'>
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type='text'
                  name='minPrice'
                  placeholder='e.g. 10000'
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={6} lg={2} className='mb-3'>
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type='text'
                  name='maxPrice'
                  placeholder='e.g. 20000'
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </Col>

              <Col md={6} lg={2} className='mb-3'>
                <Form.Label>Bedrooms (min)</Form.Label>
                <Form.Control
                  type='number'
                  name='bedrooms'
                  placeholder='Min bedrooms'
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                />
              </Col>
            </Row>

            <div className='d-flex gap-2'>
              <Button variant='primary' type='submit'>
                Search
              </Button>
              <Button variant='outline-secondary' onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Properties Grid */}
      {loading ? (
        <div className='text-center py-5'>
          <Spinner animation='border' />
        </div>
      ) : properties.length > 0 ? (
        <Row>
          {properties.map((property) => (
            <Col md={6} lg={4} className='mb-4' key={property._id}>
              <PropertyCard property={property} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant='info'>No properties found. Try adjusting your filters.</Alert>
      )}
    </Container>
  );
};

export default Properties;
