import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { ChakraProvider } from "@chakra-ui/react";
import theme from './theme.js';
import {ToastContainer} from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme ={theme}>
        <App />
      
      
      <ToastContainer />
    </ChakraProvider>
  </React.StrictMode>
)

