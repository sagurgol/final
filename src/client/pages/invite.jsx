import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Invite() {
  const [, setLocation] = useLocation();

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  
  const getEvents = async () =>{
    const response = await fetch('/getCal',{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      }
    })
    
    const data = await response.json(); 
    console.log(data);
    let newEvents = [];
  
    for (let i = 0; i < data.length; i++) {
      newEvents.push(data[i]);
    }

    setEvents(newEvents);
  }
  
  useEffect(() => {
    setEvents([]);
    getEvents();
  }, []);
  
  async function handleBack(e) {
    e.preventDefault();
    setLocation("/calendar");
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const selected = document.getElementById('eventSelect').value
    const user = document.getElementById('user').value
    let name;
    let date;
    let start;
    let end;
    
    for (let i = 0; i < events.length; i++) {
      if (events[i][0] === selected) {
        name = selected;
        date = events[i][1];
        start = events[i][2];
        end = events[i][3];
      }
    }
    
    console.log("name: ", name);
    console.log("date: ", date);
    console.log("start: ", start);
    console.log("end: ", end);
    
    const response = await fetch('/invite',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({invited: user, name: name, date: date, start: start, end: end})
    })
    
    const data = await response.json(); 
    if(data.message === "invited"){
      window.alert("Invite sent");
    }
    if(data.message === "no"){
      window.alert("Can't invite yourself");
    }
    if(data.message === "dejavu"){
      window.alert("Invite already exists");
    }
  }

  return (
    <div className="container">
      <h1>Invite Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="eventSelect">Event Name</label>
          <select
            id="eventSelect"
            required
            value={selectedEvent} // Controlled component
            onChange={(e) => setSelectedEvent(e.target.value)} // Update selected event
          >
            <option value="" disabled>Select an event</option> {}
            {events.map((event, index) => (
              <option key={index} value={event[0]}>{event[0]}</option>
            ))}
          </select>
          </div>
          <div>
            <label>GuestName</label>
            <input type="text" id="user" required></input>
          </div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <button type="button" onClick={handleBack}>Back</button>
    </div>
  );
}