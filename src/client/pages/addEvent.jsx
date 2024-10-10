import React, {useState,useEffect} from "react"
import { Link, useLocation } from "wouter";
import "../styles/login.css";

export default function AddEvent() {
  const [, setLocation] = useLocation();
  
  
  async function handleSubmit(e){
    e.preventDefault();    
    
    const form = document.forms["Events"]
    const name = document.getElementById('name').value
    const date = document.getElementById('date').value
    const start = document.getElementById('start').value
    const end = document.getElementById('end').value
    
    const response = await fetch('/add',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({name: name, date: date, start: start, end: end})
    })
    

    
    const data = await response.json(); 
    if (data.message === "updated"){
      window.alert("Event Created Successfully");
      form.reset();
    }
    if(data.message === "Event name already used"){
      window.alert("Please use a different event name");
    }
    
  }
  
  async function handleBack(e){
     e.preventDefault();   

    setLocation("/calendar");

  }
  

  return (
    <div className="container">
      <h1>New Event</h1>
      <form id = "Events" onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" id="name" required></input>
          <label>Date</label>
          <input type="date" id="date" required></input>
          <label>Start Time </label>
          <input type="time" id="start" required></input>
          <label>End Time </label>
          <input type="time" id="end" required></input>
          <button type="submit">Submit</button>
        </div>
      </form>
      <button type="button" onClick={handleBack}>Back</button>
    </div>
  );
}