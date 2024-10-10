import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import "../styles/table.css";

export default function Login() {
  const [, setLocation] = useLocation();
  const [invites, setInvites] = useState([]);

  const getInvites = async () => {
    const response = await fetch("/getInv", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    setInvites(data);
  };

  useEffect(() => {
    setInvites([]);
    getInvites();
  }, []);

  async function handleInvite(e) {
    e.preventDefault();
    setLocation("/invite");
  }

  async function handleBack(e) {
    e.preventDefault();
    setLocation("/calendar");
  }


  async function accept(invite) {
    console.log(invite)
    const creator = invite.creator;
    const name = invite.name;
    const date = invite.date;
    const start = invite.start;
    const end = invite.end;
    
    const response1 = await fetch('/add',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({name: name, date: date, start: start, end: end})
    })
    
    const data1 = await response1.json(); 
    
    
    const response = await fetch('/deleteInv',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({creator: creator, name: name, date: date, start: start, end: end})
    })
    
    const data = await response.json();
    if (data.message === "deleted"){
      window.alert("Invite accepted");
    }
    setInvites((prevInvites) => prevInvites.filter((i) => i._id !== invite._id));
  }
  
  async function decline(invite) {
    const creator = invite.creator;
    const name = invite.name;
    const date = invite.date;
    const start = invite.start;
    const end = invite.end;
    
    const response = await fetch('/deleteInv',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({creator: creator, name: name, date: date, start: start, end: end})
    })
    
    const data = await response.json();
    if (data.message === "deleted"){
      window.alert("Invite declined");
    }
    setInvites((prevInvites) => prevInvites.filter((i) => i._id !== invite._id));
  }

  return (
    <div >
      <h1>Invitations</h1>
      <table>
        <thead>
          <tr>
            <th>Invited By</th>
            <th>Event</th>
            <th>Date</th>
            <th>Duration</th>
            <th> </th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite, index) => (
            <tr key={index}>
              <td>{invite.creator}</td>
              <td>{invite.name}</td>
              <td>{invite.date}</td>
              <td>{invite.start + " - " + invite.end}</td>
              <td>
                <button onClick={() => accept(invite)}>Accept</button>
              </td>
              <td>
                <button onClick={() => decline(invite)}>Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" onClick={handleInvite}>Create Invite</button>
      <button type="button" onClick={handleBack}>Back</button>
    </div>
  );
}