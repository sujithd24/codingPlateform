import { useState } from "react";
import image from "../../assets/image.gif";
import Logo from "../../assets/logo.png";
import GoogleSvg from "../../assets/icons8-google.svg";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import './login.css'
import { auth , googleAuthProvider } from "../firebase/FireBase";
import { signInWithPopup ,signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";




const Login = () => {
  const [ showPassword, setShowPassword ] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
});


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
      ...formData,
      [name]: value
  });
};

const handleSubmit = async(e) => {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;
    
    // Fetch the username (displayName) and store it in localStorage
    const username = user.displayName ? user.displayName : 'Anonymous';  // Handle cases where displayName might be null
    window.localStorage.setItem("auth", true);
    window.localStorage.setItem("username", username);
    toast.success("Signed in successfully");
    window.location.href = '/';
  } catch (error) {
    const errorCode = error.code; 
    const errorMessage = error.message; 
    if (errorCode === 'auth/cancelled-popup-request') { 
      console.warn('Popup request was cancelled.'); 
    } else if (errorCode === 'auth/invalid-credential') {
      alert('Invalid username or password');
    } else { 
      console.error('Error signing in:', errorCode, errorMessage);
    }
  }
  
}

const handleGoogleSignIn = async () => {
  try {
    await signInWithPopup(auth, googleAuthProvider).then(
      () => {
        window.localStorage.setItem("auth",true);
        toast.success("Sign in successfull");
        window.location.href='/';

      }
    );


  } catch (error) {
    const errorCode = error.code; 
    const errorMessage = error.message; 
    if (errorCode === 'auth/cancelled-popup-request') { 
      console.warn('Popup request was cancelled.'); 
    } else { 
      console.error('Error signing in:', errorCode, errorMessage);
  }
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
            <h2>Welcome Back!</h2>
            <p>Please enter your details</p>
            <form>
              <input 
              type="email" 
              placeholder="Email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              />
              <div className="pass-input-div">
                <input type={showPassword ? "text" : "password"} placeholder="Password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {showPassword ? <FaEyeSlash onClick={() => {setShowPassword(!showPassword)}} /> : <FaEye onClick={() => {setShowPassword(!showPassword)}} />}
                
              </div>

              <div className="login-center-options">
                <a href="/" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="button"
                  onClick={handleSubmit}
                >
                  Log In</button>
                <button type="button" onClick={() => handleGoogleSignIn()}>
                  <img src={GoogleSvg} alt="google" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account?<a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;