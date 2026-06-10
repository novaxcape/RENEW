import React from 'react'
import { useState } from 'react';
import "../Styles/SignUpVendor.css"

const SignUpVendor = () => {
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add registration logic here
  };
  return (
   <main className='signupvendor_container'>
    <section className='signupvendor_wrapper'>
 <div className="signup-image-section">
          <div className="image-overlay">
            <h1>Create Your account</h1>
            <p>Start your journey to unforgettable memories. Join thousands of explorers discovering the best of Nigeria.</p>
          </div>
        </div>

         <div className="signup-form-section">
          <div className="form-wrapper">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Centre Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Centre name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Center phone number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Input phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Center password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Input password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="agreed"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreed">
                  I agree to the <a href="#terms">terms and condition</a> & <a href="#privacy">privacy policy</a>
                </label>
              </div>

              <button type="submit" className="signup-button">Sign Up</button>
            </form>
            <p className="signin-link">
              have an account ? <a href="#signin">Sign in</a>
            </p>
          </div>
        </div>
            </section>
   </main>
  )
}

export default SignUpVendor
