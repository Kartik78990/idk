import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePanel from './ProfilePanel'; // your existing component

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // Redirect user to login page immediately after logout
  const handleLogoutSuccess = () => {
    navigate('/login');
  };

  // Optional: navigate back to previous page on back button
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <ProfilePanel
      onBackClick={handleBackClick}
      onLogoutSuccess={handleLogoutSuccess}
    />
  );
};

export default ProfilePage;
