import React, { useState } from 'react'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'
import user_icon from '../Assets/person.png'
import { useNavigate } from 'react-router-dom';
import './Auth.css'
const Login = () => {

    const [action, setAction] = useState("Sign In");
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleClickSignUp = async (e) => {
        e.preventDefault();
    
        if (!validateEmail(email)) {
            setError("The email is not valid.");
            setTimeout(() => setError(''), 3000);
            return;
        }
    
        if (!validateUsername(username)) {
            setError("The username is not valid.");
            setTimeout(() => setError(''), 3000);
            return;
        }
    
        if (!validatePassword(password)) {
            setError("The password is not valid. It must contain at least 6 characters, uppercase and lowercase, and at least one special character.");
            setTimeout(() => setError(''), 3000);
            return;
        }
    
        try {
            const accounts = await getAll();
            let emailTaken = false;
            let usernameTaken = false;
            accounts.forEach(element => {
                if (element.email === email) {
                    emailTaken = true;
                }
                if (element.username === username) {
                    usernameTaken = true;
                }
            });
    
            if (emailTaken) {
                setError("The email its already use.");
                setTimeout(() => setError(''), 3000);
                return;
            }
    
            if (usernameTaken) {
                setError("The username its already use.");
                setTimeout(() => setError(''), 3000);
                return;
            }
    
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const day = currentDate.getDate() + 1;
            const account_date_created = new Date(year, month, day);
    
            const account = { email, username, password, account_date_created };
            console.log(account)
    
            const response = await fetch("http://localhost:8080/account/add",{
                method:"POST",
                headers:{"Content-Type":"application/json"}, 
                body:JSON.stringify(account)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            console.log("account added");
            setEmail('');
            setUsername('');
            setPassword('');
            setError('');
            //Navigate to the home page
            navigate(`/home`);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleClickSignIn = async (e) => {
        e.preventDefault()
        
        try {
            const accounts = await getAll();
            const accountExist = false;

            accounts.forEach(element => {
                if ((element.email === email) && (element.password === password)) {
                    accountExist = true;
                }
            });
            
            if (accountExist) {
                setError("The email and password doesn't match.");
                setTimeout(() => setError(''), 3000);
                return;
            }
            else {
                navigate(`/home`);
                console.log("Connected")
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    }

    const getAll = () => {
        return fetch("http://localhost:8080/account/getAll", {
            method: "GET",
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            console.log("All accounts:", data);
            return data;
        }).catch(error => {
            console.error("Error getting accounts:", error);
            return [];
        });
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validateUsername = (username) => {
        return username.length >= 3;
    };

    const validatePassword = (password) => {
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[a-zA-Z]).{6,}$/;
        return re.test(password);
    };

  return (
    <div className='container'>
        <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
        </div>
        <div className='inputs'>
            {action==="Sign In"?<div></div>:<div className='input'>
                                            <img src={user_icon} alt=''/>
                                            <input type='text' placeholder='Name' onChange={(e) => setUsername(e.target.value)}/>
                                            </div>}
            <div className='input'>
                <img src={email_icon} alt=''/>
                <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='input'>
                <img src={password_icon} alt=''/>
                <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className='connect' onClick={action === "Sign In" ? handleClickSignIn : handleClickSignUp}>Connect</div>
        </div>

        {error && <div className="error">{error}</div>}

        {action==="Sign Up"?<div></div>:<div className='forgot-password'>Forgot password?<span>Click Here!</span></div>}
        <div className='submit-container'>
            <div className={action==="Sign In"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Sign In")}}>Sign In</div>
        </div>

    </div>
  )
}

export default Login
