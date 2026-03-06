/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
/* eslint-enable no-unused-vars */
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  // if user is logged in we still show home page but we may
  // display a dashboard button above.

  return (
    <div className='home-page'>
      {/* Hero Section */}
      <section className='hero-section'>
        <Container>
          <Row className='align-items-center'>
            <Col lg={6} className='mb-4 mb-lg-0'>
              <div className='hero-content'>
                <h1>Find Your Perfect Home</h1>
                <p className='lead'>
                  Discover amazing rental properties in your area. HouseHunt makes it easy to find your dream home.
                </p>
                <div className='action-buttons'>
                  <Link to='/properties' className='btn btn-primary btn-lg me-3'>
                    Browse Properties
                  </Link>
                  {user ? (
                    <Link to='/dashboard' className='btn btn-outline-primary btn-lg'>
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link to='/register' className='btn btn-outline-primary btn-lg'>
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className='hero-image'>
                <div className='image-placeholder'>
                  🏠 Welcome to HouseHunt
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className='features-section'>
        <Container>
          <h2 className='text-center mb-5'>Why Choose HouseHunt?</h2>

          <Row>
            <Col md={6} lg={3} className='mb-4'>
              <div className='feature-item'>
                <div className='feature-icon'>🔍</div>
                <h5>Easy Search</h5>
                <p>Find properties with advanced filters including location, price, and amenities.</p>
              </div>
            </Col>

            <Col md={6} lg={3} className='mb-4'>
              <div className='feature-item'>
                <div className='feature-icon'>🛡️</div>
                <h5>Secure & Safe</h5>
                <p>All transactions are secure with encrypted data and verified user profiles.</p>
              </div>
            </Col>

            <Col md={6} lg={3} className='mb-4'>
              <div className='feature-item'>
                <div className='feature-icon'>⭐</div>
                <h5>Real Reviews</h5>
                <p>Read genuine reviews from actual tenants to make informed decisions.</p>
              </div>
            </Col>

            <Col md={6} lg={3} className='mb-4'>
              <div className='feature-item'>
                <div className='feature-icon'>📱</div>
                <h5>Mobile Ready</h5>
                <p>Access HouseHunt anytime, anywhere on any device.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className='cta-section'>
        <Container>
          <Row className='align-items-center'>
            <Col md={8}>
              <h2>Ready to Find Your Perfect Home?</h2>
              <p>Join thousands of happy tenants and landlords on HouseHunt.</p>
            </Col>
            <Col md={4} className='text-end'>
              <Link to='/register' className='btn btn-light btn-lg'>
                Get Started Now
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className='footer'>
        <Container>
          <Row>
            <Col md={3}>
              <h6>HouseHunt</h6>
              <p>Your trusted platform for finding rental properties.</p>
            </Col>
            <Col md={3}>
              <h6>Quick Links</h6>
              <ul>
                <li><Link to='/properties'>Browse Properties</Link></li>
                <li><Link to='/about'>About Us</Link></li>
              </ul>
            </Col>
            <Col md={3}>
              <h6>For Landlords</h6>
              <ul>
                <li><Link to='/register'>List Your Property</Link></li>
                <li><Link to='/dashboard'>Dashboard</Link></li>
              </ul>
            </Col>
            <Col md={3}>
              <h6>Contact</h6>
              <p>Email: info@househunt.com</p>
              <p>Phone: 1-800-HOUSE-HUNT</p>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className='text-center'>
              <p className='mb-0'>&copy; 2026 HouseHunt. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
