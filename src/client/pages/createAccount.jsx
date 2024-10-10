import React, {useState} from "react"
import { Link, useLocation } from "wouter";


export default function CreateAccount() {
  const [, setLocation] = useLocation();
  
  async function handleSubmit(e){
    e.preventDefault();    
    
    
    const username = document.getElementById('user').value
    const password = document.getElementById('pass').value
    
    const response = await fetch('/create',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({username: username, password: password})
    })
    

    
    const data = await response.json(); 
    if (data.message === "created"){
      window.alert("Account Created Successfully");
    }
    if (data.message === "username already used"){
      window.alert("Username is taken");
    }
  }
  
   
  async function handleBack(e){
     e.preventDefault();   

    setLocation("/");

  }

  return (
    <div className="container">
      <h1>Account Creation</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" id="user" required></input>
          <label>Password</label>
          <input type="password" id="pass" required></input>
          <button type="submit">Submit</button>
        </div>
      </form>
      <button type="button" onClick={handleBack}>Back To Login</button>
    </div>
  );
}