/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
/* eslint-enable no-unused-vars */
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/services';
import '../styles/Profile.css';

const Profile = () => {
  const { updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfileData(response.data.user);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await userService.updateProfile(profileData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
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
    <Container className='profile-container py-5'>
      <Row>
        <Col md={8} className='mx-auto'>
          <Card>
            <Card.Body>
              <h2 className='mb-4'>My Profile</h2>

              {error && <Alert variant='danger'>{error}</Alert>}
              {success && <Alert variant='success'>{success}</Alert>}

              <Form onSubmit={handleUpdate}>
                <Form.Group className='mb-3'>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type='text'
                    name='name'
                    value={profileData?.name || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    name='email'
                    value={profileData?.email || ''}
                    disabled
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type='tel'
                    name='phone'
                    value={profileData?.phone || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type='text'
                    name='address'
                    value={profileData?.address || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type='text'
                        name='city'
                        value={profileData?.city || ''}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type='text'
                        name='state'
                        value={profileData?.state || ''}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className='mb-3'>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type='text'
                    name='zipCode'
                    value={profileData?.zipCode || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type='text'
                    value={profileData?.role || ''}
                    disabled
                  />
                </Form.Group>

                <div className='d-flex gap-2'>
                  {!editMode ? (
                    <Button variant='primary' onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button variant='success' type='submit'>
                        Save Changes
                      </Button>
                      <Button
                        variant='secondary'
                        onClick={() => {
                          setEditMode(false);
                          fetchProfile();
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
