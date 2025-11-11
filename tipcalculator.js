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
  const n = createLevelInputs('_new', '', '');
  levelsElt.appendChild(n);
}

function createLevelInputs(level, label, tip) {
  const levelID = "level" + level;
  var inputsStr = "<div class='left-input'><input type='text' size='15' id='" + levelID + "' name='" + levelID + "' ";
  inputsStr += "value='" + label + "' /></div><div class='right-input'><input type='number' id='" + levelID + "_tip' "; 
  inputsStr += "min='0' max='100' value='" + tip + "' /><label class='heavy-emphasis'>%</label>";
  if (!isNaN(level)) {
    inputsStr += "&nbsp;&nbsp;<button class='button-48' onclick='deleteLevel("+level+"); return false;'>";
    inputsStr += "<span class='text'>&#x274C</span></button>";
  }
  inputsStr += "</div>";
  const d = document.createElement('div');
  d.innerHTML = inputsStr;
  d.setAttribute('id', "div_" + levelID);
  return d;
}

function deleteLevel(level) {
  const levelID = "level" + level;
  const levelDiv = document.getElementById("div_" + levelID);
  levelDiv.style.display = 'none';
}

function saveLevelsSettings() {
  levels_to_delete = [];
  levels.forEach((level, idx) => {
    const levelID = "level" + idx;
    const levelDiv = document.getElementById("div_" + levelID);
    if (levelDiv.style.display == 'none') {
      levels_to_delete.push(idx);
    }
    else {
      const levelElt_label = trimAndSqueezeWhitespace(document.getElementById(levelID).value);
      const levelElt_tip   = Number(document.getElementById(levelID + "_tip").value);
      levels[idx][0]       = levelElt_label;
      levels[idx][1]       = levelElt_tip;
    }
  });
  levels_to_delete.forEach((level, idx) => {
    levels.splice(level, 1);
  });
  const newlevel_label = trimAndSqueezeWhitespace(document.getElementById("level_new").value);
  const newlevel_tip = Number(document.getElementById("level_new_tip").value);
  if (newlevel_label.length > 0 && !isNaN(newlevel_tip)) {
    levels.push([ newlevel_label, newlevel_tip ]);
  }
  levels.sort((a, b) => {
    return a[1] - b[1]; // Sort on tip percentage
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
  document.getElementById("result").innerHTML = "$&nbsp;" + tr.toFixed(2);
}

/**
*   Utility / Helper functions
**/

function trimAndSqueezeWhitespace(s) {
  return s.trim().replace(/\s+/g, ' ');
}

/**
*   Set up page on first load 
**/
window.addEventListener("load", (event) => {
  loadSettings();
  setupLevelChoices();
  setupRoundingChoices();
});