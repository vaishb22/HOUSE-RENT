import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Table } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { propertyService, bookingService, userService } from '../services/services';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending-properties');

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [propertiesRes, usersRes, statsRes] = await Promise.all([
        propertyService.getPendingProperties(),
        userService.getAllUsers(),
        bookingService.getBookingStats(),
      ]);

      setPendingProperties(propertiesRes.data.properties);
      setAllUsers(usersRes.data.users);
      setStats(statsRes.data.stats);
      setError('');
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      await propertyService.approveProperty(propertyId);
      alert('Property approved!');
      fetchAdminData();
    } catch (err) {
      alert('Failed to approve property');
    }
  };

  const handleRejectProperty = async (propertyId) => {
    try {
      await propertyService.rejectProperty(propertyId);
      alert('Property rejected!');
      fetchAdminData();
    } catch (err) {
      alert('Failed to reject property');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        alert('User deleted!');
        fetchAdminData();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Container className='py-5'>
        <Alert variant='danger'>Access Denied. Admin only.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className='text-center py-5'>
        <Spinner animation='border' />
      </Container>
    );
  }

  return (
    <Container className='admin-panel py-5'>
      <h1 className='mb-4'>Admin Dashboard</h1>

      {error && <Alert variant='danger'>{error}</Alert>}

      {/* Stats Cards */}
      {stats && (
        <Row className='mb-4'>
          <Col md={3} className='mb-3'>
            <Card className='stat-card'>
              <Card.Body>
                <h6 className='text-muted'>Total Bookings</h6>
                <h2>{stats.totalBookings}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className='mb-3'>
            <Card className='stat-card'>
              <Card.Body>
                <h6 className='text-muted'>Pending Bookings</h6>
                <h2 className='text-warning'>{stats.pendingBookings}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className='mb-3'>
            <Card className='stat-card'>
              <Card.Body>
                <h6 className='text-muted'>Total Revenue</h6>
                <h2 className='text-success'>${stats.totalRevenue}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className='mb-3'>
            <Card className='stat-card'>
              <Card.Body>
                <h6 className='text-muted'>Total Users</h6>
                <h2>{allUsers.length}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabs */}
      <div className='admin-tabs mb-4'>
        <Button
          variant={activeTab === 'pending-properties' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('pending-properties')}
          className='me-2'
        >
          Pending Properties ({pendingProperties.length})
        </Button>

        <Button
          variant={activeTab === 'users' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('users')}
        >
          All Users ({allUsers.length})
        </Button>
      </div>

      {/* Pending Properties Tab */}
      {activeTab === 'pending-properties' && (
        <Card>
          <Card.Body>
            <h5 className='mb-3'>Pending Property Approvals</h5>

            {pendingProperties.length > 0 ? (
              <div className='table-responsive'>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Owner</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProperties.map((property) => (
                      <tr key={property._id}>
                        <td>{property.title}</td>
                        <td>{property.owner?.name}</td>
                        <td>
                          {property.city}, {property.state}
                        </td>
                        <td>${property.price}</td>
                        <td>{property.type}</td>
                        <td>
                          <Button
                            variant='success'
                            size='sm'
                            className='me-2'
                            onClick={() => handleApproveProperty(property._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => handleRejectProperty(property._id)}
                          >
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert variant='info'>No pending properties.</Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <Card.Body>
            <h5 className='mb-3'>All Users</h5>

            {allUsers.length > 0 ? (
              <div className='table-responsive'>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>City</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || '-'}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === 'admin' ? 'bg-primary' : 'bg-secondary'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>{u.city || '-'}</td>
                        <td>
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert variant='info'>No users found.</Alert>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminPanel;

