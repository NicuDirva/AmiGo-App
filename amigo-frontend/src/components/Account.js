import React, { useState } from 'react'

function Account() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const handleClick = (e) => {
        e.preventDefault()

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const account_date_created = new Date(year, month - 1, day);

        const account={email, username, password, account_date_created}
        console.log(account)

        fetch("http://localhost:8080/account/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"}, 
            body:JSON.stringify(account)
        }).then(() => {
            console.log("account added")
        })
    } 
  return (
    <div>
      <form>
        <label>
            email:
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </label>
        <label>
            username:
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        </label>
        <label>
            password:
            <input type='text' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        </label>
        <button onClick={handleClick}>Submit</button>
      </form>
    </div>
  )
}

export default Account
