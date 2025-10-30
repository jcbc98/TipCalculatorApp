/**
*    Settings management
**/
const STORAGE_KEY = "tip-calculator-settings";

// Default settings
var levels = [ [ "Delivery", 10 ], [ "Restaurant", 20 ], [ "Stylist", 30 ] ];
var rounding = "NORMAL";

function loadSettings() {
  const data = window.localStorage.getItem(STORAGE_KEY);
  if (data) {
    const settings = JSON.parse(data);
    window.levels = settings[0];
    window.rounding = settings[1];
  } 
  else {
    writeSettings();
  }
}

function writeSettings() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([levels,rounding]));
}

function editSettings() {
  const b = document.getElementById('editBtn');
  const e = document.getElementById('edit');
  if (e.style.display == 'block') {
    e.style.display = 'none';
    b.innerHTML = "Edit Settings";
  }
  else {
    fillLevelsSettings();
    e.style.display = 'block';
    b.innerHTML = 'Close Settings';
  }
}

function saveSettings() {
  saveLevelsSettings();
  saveRoundingChoice();
  writeSettings();
  setupLevelChoices();
  editSettings();
}

function fillLevelsSettings() {
  const levelsElt = document.getElementById('levels');
  levelsElt.innerHTML = "<legend>Customize tip levels:</legend>";
  levels.forEach((level, idx) => {
    const d = createLevelInputs(idx, level[0], level[1]);
    levelsElt.appendChild(d); 
  });
}

function createLevelInputs(level, label, tip) {
  const levelID = "level" + level;
  var inputsStr = "<input type='text' id='" + levelID + "' size='5' name='" + levelID + "' ";
  inputsStr += "value='" + label + "' /> &nbsp; <input type='number' id='" + levelID + "_tip' "; 
  inputsStr += "min='0' max='100' value='" + tip + "' />%";
  const d = document.createElement('div');
  d.innerHTML = inputsStr;
  return d;
}

function saveLevelsSettings() {
  levels.forEach((level, idx) => {
    const levelID = "level" + idx;
    const levelElt_label = document.getElementById(levelID).value;
    const levelElt_tip = Number(document.getElementById(levelID + "_tip").value);
    levels[idx][0] = levelElt_label;
    levels[idx][1] = levelElt_tip;
  });
}

function setupLevelChoices() {
  const selectElt = document.getElementById("choice");
  selectElt.innerHTML = "";
  levels.forEach((level, idx) => {
    var o = document.createElement('option');
    o.value = idx;
    o.innerHTML = level[0];
    selectElt.appendChild(o);
  });
}

function saveRoundingChoice() {
  const radioBtns = document.querySelectorAll('input[name="rounding"]');
  for (let i = 0; i < radioBtns.length; i++) {
    if (radioBtns[i].checked) {
      window.rounding = radioBtns[i].value;
      break;
    }
  }
}

function setupRoundingChoices() {
  const noRnd = document.getElementById("noround");
  const upRnd = document.getElementById("upround");
  const nlRnd = document.getElementById("nlround");
  noRnd.checked = (rounding == "NONE");
  upRnd.checked = (rounding == "UP");
  nlRnd.checked = (rounding == "NORMAL");
}

/**
*   Tip calculation based on settings
**/
function calc() {
  const c = document.getElementById("choice").value;
  var s = Number(document.getElementById("subtotal").value);
  if (isNaN(s)) s = 0;
  const t = levels[c][1] * s / 100.00;
  var tr = t;
  if (rounding == "UP") {
    tr = Math.round(tr + 0.499);
  }
  else if (rounding != "NONE") {
    tr = Math.round(tr);
  }
  document.getElementById("result").innerHTML = "$ " + tr.toFixed(2);
}

/**
*   Set up page on first load 
**/
window.addEventListener("load", (event) => {
  loadSettings();
  setupLevelChoices();
  setupRoundingChoices();
});