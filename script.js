/* Sude Academic Widgets
   Edit the CONFIG section below to personalize the widgets.
*/

const CONFIG = {
  name: "Sude",
  countdownTitle: "UNTIL 2027",
  countdownDate: "2027-09-01T00:00:00",
  dailyGoalHours: 6,

  // Temporary local demo data.
  // Later this can be replaced with Notion API data.
  studyTodayHours: 4.5,
  deepWorkTodayHours: 3.25,
  weekHours: [4.0, 5.5, 3.25, 4.5, 2.0, 5.0, 0],
};

const $ = (id) => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");

function formatDate(d) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(d);
}
function hoursToText(h) {
  const total = Math.round(h * 60);
  const hr = Math.floor(total / 60);
  const min = total % 60;
  return `${hr}h ${min}m`;
}

/* Header */
function renderHeader() {
  const now = new Date();
  $("header-widget").innerHTML = `
    <div class="eyebrow">ACADEMIC DASHBOARD</div>
    <h1>Hello, ${CONFIG.name}.</h1>
    <div class="muted">${formatDate(now)}</div>
  `;
}

/* Clock */
function renderClock() {
  const now = new Date();
  $("clock-widget").innerHTML = `
    <div class="eyebrow">LOCAL TIME</div>
    <div class="big" id="clock-value">${pad(now.getHours())}:${pad(now.getMinutes())}</div>
    <div class="muted">${Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
  `;
}
function tickClock() {
  const now = new Date();
  const el = $("clock-value");
  if (el) el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/* Countdown */
function renderCountdown() {
  $("countdown-widget").innerHTML = `
    <div class="eyebrow">${CONFIG.countdownTitle}</div>
    <div class="big" id="countdown-value">--</div>
    <div class="muted">${new Date(CONFIG.countdownDate).toLocaleDateString("en-US", {day:"numeric",month:"long",year:"numeric"})}</div>
  `;
  tickCountdown();
}
function tickCountdown() {
  const target = new Date(CONFIG.countdownDate).getTime();
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000);
  const el = $("countdown-value");
  if (el) el.textContent = `${days} DAYS`;
}

/* Daily progress */
function renderProgress() {
  const pct = Math.min(100, CONFIG.studyTodayHours / CONFIG.dailyGoalHours * 100);
  $("progress-widget").innerHTML = `
    <div class="row">
      <div><div class="eyebrow">TODAY'S PROGRESS</div><h2>${Math.round(pct)}%</h2></div>
      <div class="muted">${hoursToText(CONFIG.studyTodayHours)} / ${CONFIG.dailyGoalHours}h</div>
    </div>
    <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
  `;
}
function renderStudy() {
  $("study-widget").innerHTML = `
    <div class="eyebrow">STUDY TIME</div>
    <div class="big">${hoursToText(CONFIG.studyTodayHours)}</div>
    <div class="small-note">today</div>
  `;
}
function renderDeepWork() {
  $("deep-work-widget").innerHTML = `
    <div class="eyebrow">DEEP WORK</div>
    <div class="big">${hoursToText(CONFIG.deepWorkTodayHours)}</div>
    <div class="small-note">today</div>
  `;
}

/* Focus timer */
let timerSeconds = 25 * 60;
let timerRunning = false;
let timerInterval = null;

function renderTimer() {
  $("timer-widget").innerHTML = `
    <div class="eyebrow">FOCUS TIMER</div>
    <div class="timer-display" id="timer-value">25:00</div>
    <div class="actions">
      <button id="timer-start">Start</button>
      <button id="timer-reset">Reset</button>
    </div>
  `;
  $("timer-start").onclick = toggleTimer;
  $("timer-reset").onclick = resetTimer;
}
function updateTimer() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  $("timer-value").textContent = `${pad(m)}:${pad(s)}`;
}
function toggleTimer() {
  timerRunning = !timerRunning;
  $("timer-start").textContent = timerRunning ? "Pause" : "Start";
  if (timerRunning) {
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) { timerSeconds--; updateTimer(); }
      else { clearInterval(timerInterval); timerRunning = false; $("timer-start").textContent = "Start"; }
    }, 1000);
  } else clearInterval(timerInterval);
}
function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 25 * 60;
  $("timer-start").textContent = "Start";
  updateTimer();
}

/* Weekly overview */
function renderWeek() {
  const max = Math.max(...CONFIG.weekHours, 1);
  const names = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  $("week-widget").innerHTML = `
    <div class="row">
      <div><div class="eyebrow">WEEKLY STUDY</div><h2>${hoursToText(CONFIG.weekHours.reduce((a,b)=>a+b,0))}</h2></div>
      <div class="muted">hours this week</div>
    </div>
    <div class="week">
      ${CONFIG.weekHours.map((h,i) => `
        <div class="day">
          <div class="day-name">${names[i]}</div>
          <div class="day-bar"><div class="day-fill" style="height:${h/max*100}%"></div></div>
          <div class="day-hours">${h ? h.toFixed(1) : "·"}</div>
        </div>`).join("")}
    </div>
  `;
}

function init() {
  renderHeader();
  renderClock();
  renderCountdown();
  renderProgress();
  renderStudy();
  renderDeepWork();
  renderTimer();
  renderWeek();
  setInterval(tickClock, 1000);
  setInterval(tickCountdown, 60000);
  setInterval(renderHeader, 60000);
}
init();
