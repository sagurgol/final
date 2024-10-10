import React, {useState} from "react"
import { Link, useLocation } from "wouter";
import "../styles/login.css";

export default function Login() {
  const [, setLocation] = useLocation();
   
  async function handleSubmit(e){
    e.preventDefault();    
    
    
    const username = document.getElementById('user').value
    const password = document.getElementById('pass').value
    
    const response = await fetch('/login',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({username: username, password: password})
    })
    

    
    const data = await response.json(); 
    
    if (data.message === "login found"){
    //implement user verification
    //then move to calendar
    setLocation("/calendar");
    }
    if (data.message === "wrong"){
      window.alert("Incorrect username or password");
  }
  }
  
  async function handleCreate(e) {
    e.preventDefault();

    setLocation("/create_account");

  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" id="user" required></input>
          <label>Password</label>
          <input type="password" id="pass" required></input>
          <button type="submit">Submit</button>
        </div>
      </form>
      <button type="button" onClick={handleCreate}>Create Account</button>
    </div>
  );
}