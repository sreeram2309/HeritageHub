import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  // useState hook to manage our form's data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Destructure for easier access
  const { username, email, password } = formData;

  // This function updates the state whenever a user types in an input field
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This function handles the form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading on submit

    // Create the user object to send to the backend
    const newUser = {
      username,
      email,
      password,
    };

    try {
      // Set up headers for the POST request
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // The body of the request is our newUser object, converted to a JSON string
      const body = JSON.stringify(newUser);

      // Make the POST request to our registration endpoint
      const res = await axios.post('http://localhost:5001/api/auth/register', body, config);

      // If successful, log the response and show a success message
      console.log(res.data);
      alert('Registration successful!');

    } catch (error) {
      // If there's an error (e.g., user already exists), log it and show an error message
      console.error(error.response.data);
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Register Account</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};

export default Register;