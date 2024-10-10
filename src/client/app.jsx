import React, { useState, useEffect } from "react";
import { Router, Link } from "wouter";
import PageRouter from "./components/router.jsx";


function App() {  
  return (
    <Router>
      <div style={{ height: "115vh" }}>
        <PageRouter />
      </div>
    </Router>
  );
}

export default App;
