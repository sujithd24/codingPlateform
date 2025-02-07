import { useState } from "react";
import image from "../../assets/image.gif";
import Logo from "../../assets/logo.png";

import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import './signup.css'
import { auth } from "../firebase/FireBase";
import { createUserWithEmailAndPassword , updateProfile } from 'firebase/auth'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";




const SignupPage = () => {
  const [ showPassword, setShowPassword ] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
});

const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
    validateField(name, value);
};

const validateField = (fieldName, value) => {
  let error = '';
  
  if (fieldName === 'username') {
      if (value.trim() === '') {
          error = 'Username is required.';
      } else if (value.length < 4) {
          error = 'Username must be at least 4 characters.';
      }
  } else if (fieldName === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email format.';
  } else if (fieldName === 'password') {
      if (value.length < 8) {
          error = 'Password must be at least 8 characters.';
      } else if (!/[A-Z]/.test(value)) {
          error = 'Password must contain at least one uppercase letter.';
      } else if (!/[a-z]/.test(value)) {
          error = 'Password must contain at least one lowercase letter.';
      } else if (!/[0-9]/.test(value)) {
          error = 'Password must contain at least one number.';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = 'Password must contain at least one special character.';
      }
  }

  setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error
  }));
};

const handleSubmit = async(e) => {
  e.preventDefault();
  if (Object.values(errors).every(error => error === '') &&
      Object.values(formData).every(field => field.trim() !== '')) {
          try { 
               await createUserWithEmailAndPassword(auth, formData.email, formData.password).then(
                  (userDetail) => {
                      alert('User sign up  successful')
                      window.location.href='/login'
                    }
              ); 
          } catch (error) { 
              const errorCode = error.code; 
              const errorMessage = error.message; 
              if (errorCode === 'auth/cancelled-popup-request') { 
                console.warn('Popup request was cancelled.'); 
              } else if(errorCode === 'auth/email-already-in-use'){
               alert('User already exist go to login page')
            }else { 
                console.error('Error signing in:', errorCode, errorMessage);
            }
          }
  } else {
      alert('Please fix the errors in the form.');
  }
};


  return (
    <div className="login-main">
      
      <div className="login-left">
        <img src={image} alt="logo" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="logo" />
          </div>
          <div className="login-center">
            <h2>Welcome!</h2>
            <p>Please enter your details</p>
            <form>
            <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {errors.username && <span className="error">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
            
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
                
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

             
              
              <div className="login-center-buttons">
                <button type="button"
                  onClick={handleSubmit}
                >
                  Sign up</button>
                
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account?<a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;