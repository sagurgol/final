import React, { useState, useEffect } from "react"
import { Link, useLocation } from "wouter";
import moment from "moment";
import Calendar from "../Calendar";
import "../styles/calendarPage.css";

export default function BasicCalendar() {
  const [, setLocation] = useLocation();
  
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('month');
  const [selectedEvent, setSelectedEvent]=useState(null);
  const fillCalendar = async () =>{
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
      let name = data[i][0].toString();
      let date = data[i][1].toString();
      let start = data[i][2].toString();
      let end = data[i][3].toString();

      let newEvent = {
        start: moment(date + "T" + start + ":00").toDate(),
        end: moment(date + "T" + end + ":00").toDate(),
        title: name,
      };

      newEvents.push(newEvent);
    }

    setEvents(newEvents);
  }
  
  useEffect(() => {
    setEvents([]);
    fillCalendar();
  }, []);
  
   
  async function handleEvent(e){
     e.preventDefault();   

    setLocation("/add_event");

  }
  
  async function handleInvite(e){
     e.preventDefault();   

    setLocation("/rsvp");

  }
  
  async function handleLogout(e){
     e.preventDefault();   

    setLocation("/");

  }
  
  
  
  const deleteTask = async (title) =>{
    const response = await fetch('/delete',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({name:title})
    })

    const data = await response.json();
    
    if(data.message === "deleted"){
      window.alert("Event Successfully Deleted");
    }
    
  }
  
  
  
  const handleSelectSlot=({start,end})=>{
    console.log('Selected start:', start);
    console.log('Selected end:', end);
    console.log('Current view:', currentView); // Log current view
    console.log('All events:', events); // Log all events
    setSelectedEvent({start,end});
  }
  
  const handleSelectEvent=(event)=>{
    //alert(events.title, events.date, events.start);
    console.log(JSON.stringify(events.find(e=>e.title===event.title)));
    deleteTask(event.title)
    }
  
  return (
    <div>
    
      <div id="buttons">
      <button type="button" onClick={handleEvent}>Create Event</button>
      <button type="button" onClick={handleInvite}>Invitations</button>
      <button type="button" onClick={handleLogout}>Log Out</button>
      </div>
      <Calendar 
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onView={(view)=>setCurrentView(view)}
        style={{ backgroundColor: "white" }}
        />
    </div>
  );
}
