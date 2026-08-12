import { useState } from "react";
import "./index.css";

// ✅ Change this to your Render URL
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function App() {
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceCode, setSelectedServiceCode] = useState("");
  const [visitType, setVisitType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [language, setLanguage] = useState("English");
  const [largeText, setLargeText] = useState(false);
  const [status, setStatus] = useState("Waiting");
  const [peopleAhead, setPeopleAhead] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const [counter, setCounter] = useState("To be assigned");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const services = [
    {
      name: "Birth / Death Certificate",
      icon: "📄",
      description: "Apply for birth or death certificate services",
      code: "BIRTH"
    },
    {
      name: "Income / Domicile Certificate",
      icon: "🏠",
      description: "Apply for income or domicile certificates",
      code: "INC"
    },
    {
      name: "Welfare-Scheme Enquiry",
      icon: "🤝",
      description: "Get information about government welfare schemes",
      code: "WELFARE"
    }
  ];

  function selectService(service) {
    setSelectedService(service.name);
    setSelectedServiceCode(service.code);
    setPage("visit");
  }

  function selectVisitType(type) {
    setVisitType(type);
    if (type === "Walk-in") {
      // Walk-in goes straight to name entry
      setPage("generate");
    } else {
      // Appointment goes to date/time picker first
      setPage("appointment");
    }
  }

  async function generateToken() {
    if (!citizenName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  serviceType: selectedServiceCode,
  citizenName: citizenName.trim(),
  visitType,
  appointmentDateTime: visitType === "Appointment"
    ? `${appointmentDate}T${appointmentTime}`
    : null
})

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Fetch live queue status
      const statusRes = await fetch(`${API_BASE}/api/tokens/${data._id}/status`);
      const statusData = await statusRes.json();

      setTokenNumber(data.tokenNumber);
      setTokenId(data._id);
      setPeopleAhead(statusData.peopleAhead || 0);
      setEstimatedWait(statusData.estimatedWait || 0);
      setCounter(data.assignedCounter || "To be assigned");
      setStatus("Waiting");
      setPage("queue");
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
    }

    setLoading(false);
  }

  function changeLanguage(event) {
    setLanguage(event.target.value);
  }

  function toggleLargeText() {
    setLargeText(!largeText);
  }

  function goHome() {
    setPage("home");
    setSelectedService("");
    setSelectedServiceCode("");
    setVisitType("");
    setAppointmentDate("");
    setAppointmentTime("");
    setCitizenName("");
    setTokenNumber("");
    setTokenId("");
    setError("");
  }

  function simulateTokenCall() {
    setPeopleAhead(0);
    setEstimatedWait(0);
    setStatus("Please proceed to Counter 3");
    setCounter("Counter 3");
  }

  // Get today's date in YYYY-MM-DD format for min date on appointment picker
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={largeText ? "app large-text" : "app"}>

      {/* HEADER */}
      <header className="header">
        <div className="logo-section">
          <div className="logo">SC</div>
          <div>
            <h1>Smart Citizen Queue</h1>
            <p>Government Service Centre</p>
          </div>
        </div>
        <div className="header-controls">
          <select value={language} onChange={changeLanguage} className="language-select">
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
          </select>
          <button className="accessibility-button" onClick={toggleLargeText}>
            {largeText ? "Normal Text" : "A+ Large Text"}
          </button>
        </div>
      </header>

      {/* HOME PAGE */}
      {page === "home" && (
        <main className="main-container">
          <section className="hero">
            <div className="hero-content">
              <span className="badge">🏛️ Digital Government Service</span>
              <h2>Skip the Queue.<br /><span>Save Your Time.</span></h2>
              <p>Select your government service, get a digital token, and track your queue without standing in line.</p>
              <button className="primary-button" onClick={() => setPage("services")}>Get Started →</button>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon">🎫</div>
              <h3>Your Time Matters</h3>
              <p>Know your queue position and estimated waiting time in real time.</p>
              <div className="hero-stat">
                <strong>30 min</strong>
                <span>Example wait time</span>
              </div>
            </div>
          </section>
          <section className="features">
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Digital Token</h3>
              <p>Get your token without standing in a physical queue.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>Live Wait Time</h3>
              <p>Know how many people are ahead of you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Status Updates</h3>
              <p>Receive SMS-style updates about your token.</p>
            </div>
          </section>
        </main>
      )}

      {/* SERVICE SELECTION */}
      {page === "services" && (
        <main className="main-container">
          <button className="back-button" onClick={() => setPage("home")}>← Back</button>
          <section className="page-heading">
            <span className="step-label">STEP 1 OF 4</span>
            <h2>Select a Service</h2>
            <p>Choose the government service you need today.</p>
          </section>
          <div className="service-grid">
            {services.map((service) => (
              <button className="service-card" key={service.name} onClick={() => selectService(service)}>
                <div className="service-icon">{service.icon}</div>
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* APPOINTMENT / WALK-IN */}
      {page === "visit" && (
        <main className="main-container">
          <button className="back-button" onClick={() => setPage("services")}>← Back</button>
          <section className="page-heading">
            <span className="step-label">STEP 2 OF 4</span>
            <h2>How would you like to visit?</h2>
            <p>You selected: <strong>{selectedService}</strong></p>
          </section>
          <div className="visit-grid">
            <button className="visit-card" onClick={() => selectVisitType("Appointment")}>
              <div className="visit-icon">📅</div>
              <h3>Appointment</h3>
              <p>Choose a scheduled visit time.</p>
              <span>Continue →</span>
            </button>
            <button className="visit-card" onClick={() => selectVisitType("Walk-in")}>
              <div className="visit-icon">🚶</div>
              <h3>Walk-in</h3>
              <p>Get a token and join the queue now.</p>
              <span>Continue →</span>
            </button>
          </div>
        </main>
      )}

      {/* APPOINTMENT DATE/TIME PICKER — only for Appointment type */}
      {page === "appointment" && (
        <main className="main-container">
          <button className="back-button" onClick={() => setPage("visit")}>← Back</button>
          <section className="page-heading">
            <span className="step-label">STEP 2B OF 4</span>
            <h2>Choose Your Appointment</h2>
            <p>Select a date and time for your visit to <strong>{selectedService}</strong>.</p>
          </section>
          <div className="confirmation-card">
            <div className="confirmation-row">
              <span>Select Date</span>
              <input
                type="date"
                min={today}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </div>
            <div className="confirmation-row" style={{ marginTop: "16px" }}>
              <span>Select Time</span>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </div>
            {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
            <button
              className="primary-button full-width"
              style={{ marginTop: "24px" }}
              onClick={() => {
                if (!appointmentDate || !appointmentTime) {
                  setError("Please select both date and time.");
                  return;
                }
                setError("");
                setPage("generate");
              }}
            >
              Continue →
            </button>
          </div>
        </main>
      )}

      {/* TOKEN GENERATION — name entry + confirm */}
      {page === "generate" && (
        <main className="main-container">
          <button className="back-button" onClick={() => setPage(visitType === "Appointment" ? "appointment" : "visit")}>← Back</button>
          <section className="page-heading">
            <span className="step-label">STEP 3 OF 4</span>
            <h2>Confirm Your Request</h2>
            <p>Check your details before generating your token.</p>
          </section>
          <div className="confirmation-card">
            <div className="confirmation-row">
              <span>Service</span>
              <strong>{selectedService}</strong>
            </div>
            <div className="confirmation-row">
              <span>Visit Type</span>
              <strong>{visitType}</strong>
            </div>
            {visitType === "Appointment" && (
              <div className="confirmation-row">
                <span>Appointment</span>
                <strong>{appointmentDate} at {appointmentTime}</strong>
              </div>
            )}
            <div className="confirmation-row">
              <span>Access Mode</span>
              <strong>{largeText ? "Accessibility Mode" : "Standard"}</strong>
            </div>

            {/* NAME INPUT */}
            <div className="confirmation-row" style={{ marginTop: "16px", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
              <span><strong>Your Full Name</strong></span>
              <input
                type="text"
                placeholder="Enter your full name"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </div>

            {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}

            <button
              className="primary-button full-width"
              onClick={generateToken}
              disabled={loading}
              style={{ marginTop: "20px" }}
            >
              {loading ? "Generating..." : "🎫 Generate My Token"}
            </button>
          </div>
        </main>
      )}

      {/* QUEUE STATUS */}
      {page === "queue" && (
        <main className="main-container">
          <section className="queue-header">
            <span className="step-label">STEP 4 OF 4</span>
            <h2>Your Queue Status</h2>
            <p>You don't need to stand in line. You can wait comfortably until your turn.</p>
          </section>
          <div className="queue-layout">
            <div className="token-card">
              <p className="token-label">YOUR TOKEN</p>
              <h1>{tokenNumber}</h1>
              <div className="token-details">
                <div><span>Service</span><strong>{selectedService}</strong></div>
                <div><span>Visit Type</span><strong>{visitType}</strong></div>
                {visitType === "Appointment" && (
                  <div><span>Appointment</span><strong>{appointmentDate} at {appointmentTime}</strong></div>
                )}
                <div><span>Assigned Counter</span><strong>{counter}</strong></div>
              </div>
            </div>
            <div className="status-card">
              <div className="status-header">
                <h3>Live Queue</h3>
                <span className="live-indicator">● LIVE</span>
              </div>
              <div className="queue-number">
                <strong>{peopleAhead}</strong>
                <span>people ahead of you</span>
              </div>
              <div className="wait-time">
                <span>Estimated waiting time</span>
                <strong>{estimatedWait} minutes</strong>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{ width: peopleAhead === 0 ? "100%" : "40%" }}></div>
              </div>
              <div className="current-status">
                <span>Current Status</span>
                <strong>{status}</strong>
              </div>
            </div>
          </div>
          <div className="sms-card">
            <div className="sms-icon">📱</div>
            <div>
              <span>SMS-style notification</span>
              <p>
                {status === "Waiting"
                  ? `Your token ${tokenNumber} is active. ${peopleAhead} people are ahead of you. Estimated wait is ${estimatedWait} minutes.`
                  : `Your token ${tokenNumber} is now called. Please proceed to ${counter}.`
                }
              </p>
            </div>
          </div>
          <button className="simulate-button" onClick={simulateTokenCall}>
            🔔 Simulate "Token Called"
          </button>
          <button className="home-button" onClick={goHome}>← Return to Home</button>
        </main>
      )}

      {/* FOOTER */}
      <footer>
        <p>Smart Citizen Queue Management System</p>
        <p>Accessible • Transparent • Citizen-Centric</p>
      </footer>

    </div>
  );
}

export default App;