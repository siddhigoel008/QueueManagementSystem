import { useState, useEffect } from "react";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const translations = {
  English: {
    heroTag: "🏛️ Digital Government Service",
    heroHeadingLine1: "Skip the Queue.",
    heroHeadingLine2: "Save Your Time.",
    heroDesc: "Select your government service, get a digital token, and track your queue without standing in line.",
    getStarted: "Get Started →",
    heroCardTitle: "Your Time Matters",
    heroCardDesc: "Know your queue position and estimated waiting time in real time.",
    heroStatLabel: "Example wait time",
    feature1Title: "Digital Token",
    feature1Desc: "Get your token without standing in a physical queue.",
    feature2Title: "Live Wait Time",
    feature2Desc: "Know how many people are ahead of you.",
    feature3Title: "Status Updates",
    feature3Desc: "Receive SMS-style updates about your token.",

    servicesStep: "STEP 1 OF 4",
    servicesHeading: "Select a Service",
    servicesDesc: "Choose the government service you need today.",

    visitStep: "STEP 2 OF 4",
    visitHeading: "How would you like to visit?",
    youSelected: "You selected:",
    appointmentTitle: "Appointment",
    appointmentDesc: "Choose a scheduled visit time.",
    walkinTitle: "Walk-in",
    walkinDesc: "Get a token and join the queue now.",
    continueArrow: "Continue →",

    generateStep: "STEP 3 OF 4",
    generateHeading: "Confirm Your Request",
    generateDesc: "Check your details before generating your token.",
    serviceLabel: "Service",
    visitTypeLabel: "Visit Type",
    accessModeLabel: "Access Mode",
    standardMode: "Standard",
    accessibilityMode: "Accessibility Mode",
    generateBtn: "🎫 Generate My Token",
    citizenNameLabel: "Your Full Name",
    citizenNamePlaceholder: "e.g. Ramesh Kumar",
    nameRequired: "Please enter your name to generate a token.",
    generating: "Generating...",
    tokenServerError: "Could not reach the server. Is the backend running?",
    counterPending: "To be assigned",

    queueStep: "STEP 4 OF 4",
    queueHeading: "Your Queue Status",
    queueDesc: "You don't need to stand in line. You can wait comfortably until your turn.",
    yourToken: "YOUR TOKEN",
    assignedCounter: "Assigned Counter",
    liveQueue: "Live Queue",
    live: "● LIVE",
    peopleAhead: "people ahead of you",
    estimatedWaitLabel: "Estimated waiting time",
    minutes: "minutes",
    currentStatus: "Current Status",
    statusWaiting: "Waiting",
    smsNotification: "SMS-style notification",
    simulateBtn: "🔔 Simulate \"Token Called\"",
    returnHome: "← Return to Home",
    back: "← Back",

    footerLine1: "Smart Citizen Queue Management System",
    footerLine2: "Accessible • Transparent • Citizen-Centric"
  },

  Hindi: {
    heroTag: "🏛️ डिजिटल सरकारी सेवा",
    heroHeadingLine1: "कतार में न रुकें।",
    heroHeadingLine2: "अपना समय बचाएं।",
    heroDesc: "अपनी सरकारी सेवा चुनें, डिजिटल टोकन प्राप्त करें, और बिना लाइन में खड़े हुए अपनी बारी को ट्रैक करें।",
    getStarted: "शुरू करें →",
    heroCardTitle: "आपका समय महत्वपूर्ण है",
    heroCardDesc: "अपनी बारी की स्थिति और अनुमानित प्रतीक्षा समय वास्तविक समय में जानें।",
    heroStatLabel: "उदाहरण प्रतीक्षा समय",
    feature1Title: "डिजिटल टोकन",
    feature1Desc: "बिना भौतिक कतार में खड़े हुए अपना टोकन प्राप्त करें।",
    feature2Title: "लाइव प्रतीक्षा समय",
    feature2Desc: "जानें कि आपसे पहले कितने लोग हैं।",
    feature3Title: "स्थिति अपडेट",
    feature3Desc: "अपने टोकन के बारे में एसएमएस-शैली के अपडेट प्राप्त करें।",

    servicesStep: "चरण 1 / 4",
    servicesHeading: "एक सेवा चुनें",
    servicesDesc: "आज आपको जिस सरकारी सेवा की आवश्यकता है उसे चुनें।",

    visitStep: "चरण 2 / 4",
    visitHeading: "आप कैसे आना चाहेंगे?",
    youSelected: "आपने चुना:",
    appointmentTitle: "अपॉइंटमेंट",
    appointmentDesc: "एक निर्धारित मुलाकात समय चुनें।",
    walkinTitle: "वॉक-इन",
    walkinDesc: "अभी टोकन प्राप्त करें और कतार में शामिल हों।",
    continueArrow: "जारी रखें →",

    generateStep: "चरण 3 / 4",
    generateHeading: "अपने अनुरोध की पुष्टि करें",
    generateDesc: "टोकन जनरेट करने से पहले अपना विवरण जांच लें।",
    serviceLabel: "सेवा",
    visitTypeLabel: "मुलाकात का प्रकार",
    accessModeLabel: "पहुँच मोड",
    standardMode: "मानक",
    accessibilityMode: "सुगमता मोड",
    generateBtn: "🎫 मेरा टोकन जनरेट करें",
    citizenNameLabel: "आपका पूरा नाम",
    citizenNamePlaceholder: "जैसे रमेश कुमार",
    nameRequired: "टोकन जनरेट करने के लिए कृपया अपना नाम दर्ज करें।",
    generating: "जनरेट हो रहा है...",
    tokenServerError: "सर्वर से संपर्क नहीं हो सका। क्या बैकएंड चल रहा है?",
    counterPending: "आवंटन शेष",

    queueStep: "चरण 4 / 4",
    queueHeading: "आपकी कतार की स्थिति",
    queueDesc: "आपको लाइन में खड़े होने की ज़रूरत नहीं है। आप आराम से अपनी बारी तक प्रतीक्षा कर सकते हैं।",
    yourToken: "आपका टोकन",
    assignedCounter: "निर्धारित काउंटर",
    liveQueue: "लाइव कतार",
    live: "● लाइव",
    peopleAhead: "लोग आपसे आगे हैं",
    estimatedWaitLabel: "अनुमानित प्रतीक्षा समय",
    minutes: "मिनट",
    currentStatus: "वर्तमान स्थिति",
    statusWaiting: "प्रतीक्षा में",
    smsNotification: "एसएमएस-शैली सूचना",
    simulateBtn: "🔔 \"टोकन बुलाया गया\" का अनुकरण करें",
    returnHome: "← होम पर वापस जाएं",
    back: "← वापस",

    footerLine1: "स्मार्ट सिटीज़न क्यू मैनेजमेंट सिस्टम",
    footerLine2: "सुलभ • पारदर्शी • नागरिक-केंद्रित"
  }
};

function App() {
  const [page, setPage] = useState("home");

  // --- Staff / Supervisor login state ---
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem("qms_auth");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedService, setSelectedService] = useState("");

  const [visitType, setVisitType] = useState("");

  const [tokenNumber, setTokenNumber] = useState("");

  const [language, setLanguage] = useState("English");

  const [largeText, setLargeText] = useState(false);

  const [status, setStatus] = useState("waiting");

  const [peopleAhead, setPeopleAhead] = useState(6);

  const [estimatedWait, setEstimatedWait] = useState(30);

  const [counter, setCounter] = useState("");

  const [citizenName, setCitizenName] = useState("");
  const [tokenId, setTokenId] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState("");

  const t = translations[language] || translations.English;

  const services = [
    {
      name: "Birth / Death Certificate",
      nameHi: "जन्म / मृत्यु प्रमाणपत्र",
      icon: "📄",
      description: "Apply for birth or death certificate services",
      descriptionHi: "जन्म या मृत्यु प्रमाणपत्र सेवाओं के लिए आवेदन करें",
      code: "BIRTH"
    },
    {
      name: "Income / Domicile Certificate",
      nameHi: "आय / अधिवास प्रमाणपत्र",
      icon: "🏠",
      description: "Apply for income or domicile certificates",
      descriptionHi: "आय या अधिवास प्रमाणपत्र के लिए आवेदन करें",
      code: "INC"
    },
    {
      name: "Welfare-Scheme Enquiry",
      nameHi: "कल्याण-योजना पूछताछ",
      icon: "🤝",
      description: "Get information about government welfare schemes",
      descriptionHi: "सरकारी कल्याण योजनाओं के बारे में जानकारी प्राप्त करें",
      code: "WELFARE"
    }
  ];

  function selectService(service) {
    setSelectedService(service);
    setPage("visit");
  }

  function selectVisitType(type) {
    setVisitType(type);
    setPage("generate");
  }

  async function fetchTokenStatus(id) {
    try {
      const response = await fetch(`${API_BASE}/api/tokens/${id}/status`);
      if (!response.ok) return;
      const data = await response.json();

      setStatus(data.status);
      setPeopleAhead(data.peopleAhead);
      setEstimatedWait(data.estimatedWait);
    } catch (err) {
      // Silent fail on a background poll — don't interrupt the citizen's screen
      // over a single dropped request. The next poll will retry.
    }
  }

  useEffect(() => {
    if (page !== "queue" || !tokenId) return;

    fetchTokenStatus(tokenId);

    const interval = setInterval(() => {
      fetchTokenStatus(tokenId);
    }, 6000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, tokenId]);

  async function generateToken() {
    setTokenError("");

    if (!citizenName.trim()) {
      setTokenError(t.nameRequired);
      return;
    }

    const selected = services.find(
      (service) => service.name === selectedService
    );

    setTokenLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: selected.code,
          citizenName: citizenName.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setTokenError(data.error || t.tokenServerError);
        setTokenLoading(false);
        return;
      }

      setTokenId(data._id);
      setTokenNumber(data.tokenNumber);
      setEstimatedWait(data.estimatedWait);
      setCounter(data.assignedCounter || "");
      setStatus("waiting");
      setPeopleAhead(0);

      setPage("queue");
    } catch (err) {
      setTokenError(t.tokenServerError);
    } finally {
      setTokenLoading(false);
    }
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
    setVisitType("");
    setTokenNumber("");
    setTokenId(null);
    setCitizenName("");
    setTokenError("");
  }

  function simulateTokenCall() {
    // Demo-only fallback: in the real flow, this happens when counter staff
    // click "Call Next" on the staff dashboard, and this screen picks it up
    // automatically via polling. Use this button only when demoing without
    // a second staff-side session open.
    setPeopleAhead(0);
    setEstimatedWait(0);
    setStatus("called");
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError("");

    if (!employeeId || !password) {
      setLoginError("Enter both employee ID and password.");
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Invalid credentials. Please try again.");
        setLoginLoading(false);
        return;
      }

      const user = {
        token: data.token,
        name: data.name,
        role: data.role,
        assignedCounter: data.assignedCounter
      };

      localStorage.setItem("qms_auth", JSON.stringify(user));
      setAuthUser(user);
      setPassword("");
      setPage("staffHome");
    } catch (err) {
      setLoginError("Could not reach the server. Is the backend running?");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("qms_auth");
    setAuthUser(null);
    setEmployeeId("");
    setLoginError("");
    setPage("home");
  }

  return (
    <div className={largeText ? "app large-text" : "app"}>

      {/* HEADER */}

      <header className="header">

        <div className="logo-section">

          <div className="logo">
            SC
          </div>

          <div>
            <h1>Smart Citizen Queue</h1>

            <p>
              Government Service Centre
            </p>
          </div>

        </div>


        <div className="header-controls">

          <select
            value={language}
            onChange={changeLanguage}
            className="language-select"
          >
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
          </select>


          <button
            className="accessibility-button"
            onClick={toggleLargeText}
          >
            {largeText ? "Normal Text" : "A+ Large Text"}
          </button>

          <button
            className="staff-login-link"
            onClick={() => setPage(authUser ? "staffHome" : "login")}
          >
            {authUser ? `👤 ${authUser.name}` : "Staff Login"}
          </button>

        </div>

      </header>


      {/* HOME PAGE */}

      {page === "home" && (

        <main className="main-container">

          <section className="hero">

            <div className="hero-content">

              <span className="badge">
                {t.heroTag}
              </span>

              <h2>
                {t.heroHeadingLine1}
                <br />
                <span>{t.heroHeadingLine2}</span>
              </h2>

              <p>
                {t.heroDesc}
              </p>

              <button
                className="primary-button"
                onClick={() => setPage("services")}
              >
                {t.getStarted}
              </button>

            </div>


            <div className="hero-card">

              <div className="hero-card-icon">
                🎫
              </div>

              <h3>
                {t.heroCardTitle}
              </h3>

              <p>
                {t.heroCardDesc}
              </p>

              <div className="hero-stat">

                <strong>
                  30 min
                </strong>

                <span>
                  {t.heroStatLabel}
                </span>

              </div>

            </div>

          </section>


          <section className="features">

            <div className="feature-card">

              <div className="feature-icon">
                🎫
              </div>

              <h3>
                {t.feature1Title}
              </h3>

              <p>
                {t.feature1Desc}
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                ⏱️
              </div>

              <h3>
                {t.feature2Title}
              </h3>

              <p>
                {t.feature2Desc}
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-icon">
                📱
              </div>

              <h3>
                {t.feature3Title}
              </h3>

              <p>
                {t.feature3Desc}
              </p>

            </div>

          </section>

        </main>

      )}


      {/* SERVICE SELECTION */}

      {page === "services" && (

        <main className="main-container">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            {t.back}
          </button>


          <section className="page-heading">

            <span className="step-label">
              {t.servicesStep}
            </span>

            <h2>
              {t.servicesHeading}
            </h2>

            <p>
              {t.servicesDesc}
            </p>

          </section>


          <div className="service-grid">

            {services.map((service) => (

              <button
                className="service-card"
                key={service.name}
                onClick={() => selectService(service.name)}
              >

                <div className="service-icon">
                  {service.icon}
                </div>

                <div className="service-content">

                  <h3>
                    {language === "Hindi" ? service.nameHi : service.name}
                  </h3>

                  <p>
                    {language === "Hindi" ? service.descriptionHi : service.description}
                  </p>

                </div>

                <span className="arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        </main>

      )}


      {/* APPOINTMENT / WALK-IN */}

      {page === "visit" && (

        <main className="main-container">

          <button
            className="back-button"
            onClick={() => setPage("services")}
          >
            {t.back}
          </button>


          <section className="page-heading">

            <span className="step-label">
              {t.visitStep}
            </span>

            <h2>
              {t.visitHeading}
            </h2>

            <p>
              {t.youSelected}
              <strong> {language === "Hindi"
                ? services.find((s) => s.name === selectedService)?.nameHi
                : selectedService}</strong>
            </p>

          </section>


          <div className="visit-grid">

            <button
              className="visit-card"
              onClick={() => selectVisitType("Appointment")}
            >

              <div className="visit-icon">
                📅
              </div>

              <h3>
                {t.appointmentTitle}
              </h3>

              <p>
                {t.appointmentDesc}
              </p>

              <span>
                {t.continueArrow}
              </span>

            </button>


            <button
              className="visit-card"
              onClick={() => selectVisitType("Walk-in")}
            >

              <div className="visit-icon">
                🚶
              </div>

              <h3>
                {t.walkinTitle}
              </h3>

              <p>
                {t.walkinDesc}
              </p>

              <span>
                {t.continueArrow}
              </span>

            </button>

          </div>

        </main>

      )}


      {/* TOKEN GENERATION */}

      {page === "generate" && (

        <main className="main-container">

          <button
            className="back-button"
            onClick={() => setPage("visit")}
          >
            {t.back}
          </button>


          <section className="page-heading">

            <span className="step-label">
              {t.generateStep}
            </span>

            <h2>
              {t.generateHeading}
            </h2>

            <p>
              {t.generateDesc}
            </p>

          </section>


          <div className="confirmation-card">

            <div className="confirmation-row">

              <span>
                {t.serviceLabel}
              </span>

              <strong>
                {language === "Hindi"
                  ? services.find((s) => s.name === selectedService)?.nameHi
                  : selectedService}
              </strong>

            </div>


            <div className="confirmation-row">

              <span>
                {t.visitTypeLabel}
              </span>

              <strong>
                {visitType}
              </strong>

            </div>


            <div className="confirmation-row">

              <span>
                {t.accessModeLabel}
              </span>

              <strong>
                {largeText ? t.accessibilityMode : t.standardMode}
              </strong>

            </div>


            <label className="login-label" htmlFor="citizenName">
              {t.citizenNameLabel}
            </label>
            <input
              id="citizenName"
              className="login-input"
              type="text"
              value={citizenName}
              onChange={(e) => setCitizenName(e.target.value)}
              placeholder={t.citizenNamePlaceholder}
            />

            {tokenError && (
              <p className="login-error">
                {tokenError}
              </p>
            )}

            <button
              className="primary-button full-width"
              onClick={generateToken}
              disabled={tokenLoading}
            >
              {tokenLoading ? t.generating : t.generateBtn}
            </button>

          </div>

        </main>

      )}


      {/* QUEUE STATUS */}

      {page === "queue" && (

        <main className="main-container">

          <section className="queue-header">

            <span className="step-label">
              {t.queueStep}
            </span>

            <h2>
              {t.queueHeading}
            </h2>

            <p>
              {t.queueDesc}
            </p>

          </section>


          <div className="queue-layout">


            {/* TOKEN CARD */}

            <div className="token-card">

              <p className="token-label">
                {t.yourToken}
              </p>

              <h1>
                {tokenNumber}
              </h1>

              <div className="token-details">

                <div>
                  <span>
                    {t.serviceLabel}
                  </span>

                  <strong>
                    {language === "Hindi"
                      ? services.find((s) => s.name === selectedService)?.nameHi
                      : selectedService}
                  </strong>
                </div>


                <div>
                  <span>
                    {t.visitTypeLabel}
                  </span>

                  <strong>
                    {visitType}
                  </strong>
                </div>


                <div>
                  <span>
                    {t.assignedCounter}
                  </span>

                  <strong>
                    {counter || t.counterPending}
                  </strong>
                </div>

              </div>

            </div>


            {/* WAITING INFORMATION */}

            <div className="status-card">

              <div className="status-header">

                <h3>
                  {t.liveQueue}
                </h3>

                <span className="live-indicator">
                  {t.live}
                </span>

              </div>


              <div className="queue-number">

                <strong>
                  {peopleAhead}
                </strong>

                <span>
                  {t.peopleAhead}
                </span>

              </div>


              <div className="wait-time">

                <span>
                  {t.estimatedWaitLabel}
                </span>

                <strong>
                  {estimatedWait} {t.minutes}
                </strong>

              </div>


              <div className="progress-bar">

                <div
                  className="progress"
                  style={{
                    width:
                      peopleAhead === 0
                        ? "100%"
                        : "40%"
                  }}
                ></div>

              </div>


              <div className="current-status">

                <span>
                  {t.currentStatus}
                </span>

                <strong>
                  {status === "waiting"
                    ? t.statusWaiting
                    : `${language === "Hindi" ? "कृपया आगे बढ़ें" : "Please proceed to"} ${counter}`}
                </strong>

              </div>

            </div>

          </div>


          {/* SMS STYLE UPDATE */}

          <div className="sms-card">

            <div className="sms-icon">
              📱
            </div>

            <div>

              <span>
                {t.smsNotification}
              </span>

              <p>

                {status === "waiting"
                  ? (language === "Hindi"
                      ? `आपका टोकन ${tokenNumber} सक्रिय है। आपसे पहले ${peopleAhead} लोग हैं। अनुमानित प्रतीक्षा ${estimatedWait} मिनट है।`
                      : `Your token ${tokenNumber} is active. ${peopleAhead} people are ahead of you. Estimated wait is ${estimatedWait} minutes.`)
                  : (language === "Hindi"
                      ? `आपका टोकन ${tokenNumber} अब बुलाया गया है। कृपया ${counter} पर जाएं।`
                      : `Your token ${tokenNumber} is now called. Please proceed to ${counter}.`)
                }

              </p>

            </div>

          </div>


          {/* DEMO BUTTON */}

          <button
            className="simulate-button"
            onClick={simulateTokenCall}
          >
            {t.simulateBtn}
          </button>


          <button
            className="home-button"
            onClick={goHome}
          >
            {t.returnHome}
          </button>

        </main>

      )}


      {/* STAFF / SUPERVISOR LOGIN */}

      {page === "login" && (

        <main className="main-container">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>

          <section className="page-heading">
            <span className="step-label">
              STAFF ACCESS
            </span>

            <h2>
              Counter Staff / Supervisor Login
            </h2>

            <p>
              This login is for government staff only. Citizens do not need
              an account to join a queue.
            </p>
          </section>

          <form className="login-card" onSubmit={handleLogin}>

            <label className="login-label" htmlFor="employeeId">
              Employee ID
            </label>
            <input
              id="employeeId"
              className="login-input"
              type="text"
              autoComplete="username"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. STAFF001"
            />

            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="login-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {loginError && (
              <p className="login-error">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="primary-button full-width"
              disabled={loginLoading}
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </main>

      )}


      {/* STAFF LANDING (post-login placeholder — full dashboard is a separate screen) */}

      {page === "staffHome" && authUser && (

        <main className="main-container">

          <section className="page-heading">
            <span className="step-label">
              LOGGED IN AS {authUser.role.toUpperCase()}
            </span>

            <h2>
              Welcome, {authUser.name}
            </h2>

            <p>
              {authUser.role === "staff"
                ? `Assigned counter: ${authUser.assignedCounter || "Not assigned"}`
                : "You have supervisor-level access to all counters."}
            </p>
          </section>

          <div className="hero-card">
            <p>
              The full staff dashboard (call next, complete, skip, redirect,
              priority overrides) is built separately. This screen confirms
              your login is working end-to-end against the real backend.
            </p>
          </div>

          <button
            className="back-button"
            onClick={handleLogout}
          >
            Log Out
          </button>

        </main>

      )}


      {/* FOOTER */}

      <footer>

        <p>
          {t.footerLine1}
        </p>

        <p>
          {t.footerLine2}
        </p>

      </footer>

    </div>
  );
}

export default App;