    import React, { useState, useEffect } from 'react'
    import email_icon from '../Assets/email.png'
    import password_icon from '../Assets/password.png'
    import dbo_icon from '../Assets/dbo.png'
    import user_icon from '../Assets/person.png'
    import { useNavigate } from 'react-router-dom';
    import { useGlobalState, setGlobalState } from '../state';
    import styles from './Auth.module.css'
    import NavBar from '../Navbar';
    const urlBase = "http://localhost:8080/";

    const Login = () => {

        const [action, setAction] = useState("Sign In");
        const [email, setEmail] = useState('')
        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')
        const [repeatPassword, setRepeatPassword] = useState('')
        const [dob, setDob] = useState('');
        const [error, setError] = useState('');
        const navigate = useNavigate();
        const [defaultLoggin] = useGlobalState("loggin");
        const [defaultEmail] = useGlobalState("email");
        const [defaultUsername] = useGlobalState("username");

        useEffect(() => {
            console.log("Current defaultLoggin:", defaultLoggin);
            console.log("Current defaultEmail:", defaultEmail);
            console.log("Current defaultUsername:", defaultUsername);
        }, [defaultLoggin, defaultEmail, defaultUsername])

        const handleCleanData  = () => {
            setEmail('');
            setUsername('');
            setPassword('');
            setRepeatPassword('');
            setDob('');
            setError('');
        }
        
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
                setError("The password is not valid. It must contain at least 6 and at most 30 characters, uppercase and lowercase, and at least one special character.");
                setTimeout(() => setError(''), 3000);
                return;
            }

            if (password != repeatPassword) {
                setError("Passwords do not match.");
                setTimeout(() => setError(''), 3000);
                return;
            }
        
            try {
                let accounts = await getAllAccount();
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
        
                let currentDate = new Date();
                let year = currentDate.getFullYear();
                let month = currentDate.getMonth() + 1; // Adăugăm 1 pentru că lunile încep de la 0
                let day = currentDate.getDate();
                
                // Formatare data
                let account_date_created = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        
                let account = { email, username, password, account_date_created };
                console.log(account)
        
                let response = await fetch(urlBase+"account/add",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"}, 
                    body:JSON.stringify(account)
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                let account_id = await getIdByEmail(email);
                // console.log("The ID for the account is: " + account_id);

                //Create the profile for the account
                const gender = {
                    MALE: 'MALE',
                    FEMALE: 'FEMALE',
                    OTHER: 'OTHER'
                };
                let profile = {account_id, access: "public", dob, img_url:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgFBQkGBxYIBwYGBw8ICQgWIBEiIiAdHx8YHSggGCYlGx8fITEhJSkrLi4uFx8zODMsNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAMgAyAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAABAUGAwIBB//EADEQAQACAQIDBQYFBQAAAAAAAAABAgMEEgURIiEyQlJxEyMxUVNiQXKBkcEzYWNz0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9bAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHm960pNrzWta13WtZSa7id8szTBNsOPu7vFYFpqNfp9Pzi991vp4+qyDfjUR/Tw7v8AZdUALWONX59WHHy+26Vp+K4MsxW+7Ba31O7+6gAa74jM4NdqMHKKZLWr9O3VVdaHXU1VeU+7yV72PzegJgAAAAAAAAAAAAAAAAI+vzew0uS8T1bdtfWQVXFtZObJOGk+7xW6tvilXAAAAAA9UvalovSbVtXqraryA0fD9XGqw8521yU6b1/lLZjQ6idNqKX59Pdv6NPE845wAAAAAAAAAAAAAAAq+O35YcdPNfd+y0VHHufPD8u0FQAAAAAAAA0+hvN9HitPx2Mw0vDqzXRYonybgSQAAAAAAAAAAAAAFbxyk209LxH9K/V+qyQeL5JporREbva22flBnwAAAAAAAeqV32rWPFba1VKxStaR8KV2spEzExMTtmrR8Nve+jx2yza1rc+q3yBKAAAAAAAAAAAAAAcNZhjUafJSY7du6vq7gMlMcpmJ+NXxO4pprYM83iPd57bq2/v8kEAAAAAH2Im0xERum3drUHTTYbajPTHX42t1W8sNRWsUrWsfCtdtVbwnQ3wzOXL02tXbXH5YWYAAAAAAAAAAAAAAAAOebHXNjtjvG6L12/lZnNjthy2x3jtpba1Sp43p+da56x216L/wCnAAAAWnBNPFsls1o7MXTT1VbQcHrt0VZ89psCcAAAAAAAAAAAAAAAAAAj8RrFtFlifJuSFfxnNFNN7OJ6s9tv6AoQAAAGh4ReLaKkeS01szyz4LqIplthtPZl6qeoLsAAAAAAAAAAAAAAAAR82s0+Hv5MfPy16rK/U8YtbnXT02/wCTJ/wFjqtTj01N2Se3w4/FZntTqL6nLN7+Lu18sOeS98lpvktbJa3is8gAAAAPtZmtotWds16q2fAF/wAP19NRSKXmtMte9XzJ7JRMxPOJ2ystHxW9OVNRFstfDkr3qguxzw5seeu7FeuSPtdAAAAAAAAAHy1orWbWmtYr3rWecuSmKlr5Lba171lBrtdk1NpiN2PHXu4/N6gmavi0Vmaaatck/Vt3Vbl1ObNMzkyXt9u7pcQAAAAAAAAAAAAHql70tFqWtjmvirZPwcXy05RmrXPHm7tlcA0en4hp8/ZF/ZW+nk6UtkU3R8Qy6a0VtNsuP6dvD6A0I54ctM+OMmO26tnQAAAEDi+onDp9lZ22z9P6fiCu4prJ1OXZSfd4rdP3T80EAAAAAAAAAAAAAAAAAAAS+H6u2my9u62O/fr/AC0UTFqxaJ3RbqrZkl5wXUTfDbFad04O76AsgAFBxrJu1ez8MVIqAIAAAAAAAAAAAAAAAAAAAACXwvN7HWU5z05eiwA0YAP/2Q==", description: null, gender:gender.OTHER, location: "No location selected"};
                console.log(profile);
                response = await fetch(urlBase+"profile/add",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"}, 
                    body:JSON.stringify(profile)
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const response2 = await fetch(`${urlBase}account/HAS_PROFILE`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(account_id),
                });

                if (!response2.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }


                setGlobalState("loggin", true);
                setGlobalState("email", email);
                setGlobalState("username", username)
                setEmail('');
                setUsername('');
                setPassword('');
                setRepeatPassword('');
                setError('');
                //Navigate to the home page
                navigate(`/home`);
            } catch (error) {
                console.error("Error:", error.message);
            }
        };

        const handleClickSignIn = async (e) => {
            e.preventDefault()
            let local_username;
            
            try {
                let accounts = await getAllAccount();
                let accountExist = false;

                accounts.forEach(element => {
                    if ((element.email === email) && (element.password === password)) {
                        accountExist = true;
                        local_username = element.username;
                    }
                });
                
                if (!accountExist) {
                    setError("The email and password doesn't match.");
                    setTimeout(() => setError(''), 3000);
                    return;
                }
                else {
                    
                    setGlobalState("loggin", true);
                    setGlobalState("email", email);
                    setGlobalState("username", local_username);
                    navigate(`/home`);
                }
            } catch (error) {
                console.error("Error:", error.message);
            }
        }

        const validateEmail = (email) => {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        };

        const validateUsername = (username) => {
            return username.length >= 3;
        };

        const validatePassword = (password) => {
            const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?=.*[a-zA-Z]).{6,}$/;
            const maxLength = 30; // Lungimea maximă a parolei
            
            if (password.length > maxLength) {
                return false; // Parola este prea lungă
            }
        
            return re.test(password);
        };

        return (
            <div className={styles.authPage}>
                <NavBar />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.text}>{action}</div>
                        <div className={styles.underline}></div>
                    </div>
                    <div className={styles.inputs}>
                        {action === "Sign In" ? <div></div> : 
                            <div className={styles.input}>
                                <img src={user_icon} alt='' />
                                <input type='text' placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        }
                        <div className={styles.input}>
                            <img src={email_icon} alt='' />
                            <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        {action === 'Sign Up' ?
                            <div className={styles.inputData}>
                                <div className={styles.dataContainer}>
                                    <label htmlFor="birthDate">Date of Birth:</label>
                                    <input type="date" id="birthDate" name="birthDate" max="2024-03-16" required onChange={(e) => setDob(e.target.value)} />
                                </div>
                            </div> : <div></div>
                        }
                        <div className={styles.input}>
                            <img src={password_icon} alt='' />
                            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {action === "Sign Up" ? 
                            <div className={styles.input}>
                                <img src={password_icon} alt='' />
                                <input type='password' placeholder='Repeat Password' onChange={(e) => setRepeatPassword(e.target.value)} />
                            </div> : <div></div>
                        }
                        <div className={styles.connect} onClick={action === "Sign In" ? handleClickSignIn : handleClickSignUp}>Connect</div>
                    </div>
                    {error && <div className={styles.error}>{error}</div>}
                    {action === "Sign Up" ? <div></div> : 
                        <div className={styles.forgotPassword}>Forgot password?<span>Click Here!</span></div>
                    }
                    <div className={styles.submitContainer}>
                        <div className={action === "Sign In" ? styles.submitGray : styles.submit} onClick={() => { handleCleanData(); setAction("Sign Up"); }}>Sign Up</div>
                        <div className={action === "Sign Up" ? styles.submitGray : styles.submit} onClick={() => { handleCleanData(); setAction("Sign In"); }}>Sign In</div>
                    </div>
                </div>
            </div>
        );
        

    };

    const getIdByEmail = async (email) => {
        try {
        const accounts = await getAllAccount();
        const account = accounts.find(account => account.email === email);
        if (account) {
            return account.account_id;
        } else {
            throw new Error("Account not found");
        }
        } catch (error) {
        console.error("Error:", error.message);
        return null;
        }
    };
    const getIdByUsername = async (username) => {
        try {
        const accounts = await getAllAccount();
        const account = accounts.find(account => account.username === username);
        if (account) {
            return account.account_id;
        } else {
            throw new Error("Account not found");
        }
        } catch (error) {
        console.error("Error:", error.message);
        return null;
        }
    };

    const getAllAccount = async () => {
        return fetch(urlBase+"account/getAll", {
            method: "GET",
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            return data;
        }).catch(error => {
            console.error("Error getting accounts:", error);
            return [];
        });
    }

    const getAccountByEmail = async (email) => {
        try {
            const accounts = await getAllAccount();
            const account = accounts.find(account => account.email == email);
            if (account) {
                return account;
            }
            else {
                throw new Error("Account not found")
            }
        }
        catch(error) {
            console.log("Error getAccountByEmail", error.message);
            return null;
        }
    }


const getUsernameByEmail = async (email) => {
    try {
    const accounts = await getAllAccount();
    const account = accounts.find(account => account.email === email);
    if (account) {
        return account.username;
    } else {
        throw new Error("Account not found");
    }
    } catch (error) {
    console.error("Error:", error.message);
    return null;
    }
};

const getUsernameById = async (id) => {
    try {
    const accounts = await getAllAccount();
    const account = accounts.find(account => account.account_id == id);
    if (account) {
        return account.username;
    } else {
        throw new Error("Account not found");
    }
    } catch (error) {
    console.error("Error:", error.message);
    return null;
    }
};

const getEmailByUsername = async (username) => {
    try {
    const accounts = await getAllAccount();
    const account = accounts.find(account => account.username === username);
    console.log("In getEmailByUsername:::::::" + username)
    if (account) {
        return account.email;
    } else {
        throw new Error("Account not found");
    }
    } catch (error) {
    console.error("Error:", error.message);
    return null;
    }
};

const getProfileByAccountId = async (account_id) => {
    try {
        const response = await fetch(urlBase + "account/getProfileByAccountId", {
            method: "POST", // Vom folosi POST pentru a trimite creator_id către backend
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(account_id) // Trimiterea creator_id către backend în corpul cererii
        });
  
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting group:", error);
        return [];
    }
}
    

    export default {Login , getAllAccount, getIdByEmail, getUsernameByEmail, getEmailByUsername, getIdByUsername, getUsernameById, getProfileByAccountId }
