import React from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

const App = () => {
  return (
    <div>
      <h1>User Registration</h1>
      <RegistrationForm />
      <hr />
      <h1>User Login</h1>
      <LoginForm />
    </div>
  );
};

export default App;
