let timerRef = document.querySelector(".timer");
const activeAlarms = document.querySelector(".activeAlarms");
const hour_input = document.getElementById("hour_input");
const minute_input = document.getElementById("minute_input");
const select_Am_Pm = document.getElementById("select_Am_Pm");
const setAlarm = document.getElementById("set");
let alarm_array = [];
let alarmSound = new Audio("./alarm.mp3");

let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

// Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const searchObject = (parameter, value) => {
  let alarmObjctect,
    objIndex,
    exists = false;
  alarm_array.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObjctect = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObjctect, objIndex];
};

// Display Time
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  // Convert hours to 12-hour format
  let AMPM = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  // Display time
  timerRef.innerHTML = `${hours}:${minutes}:${seconds} ${AMPM}`;

  // Alarm
  alarm_array.forEach((alarm, index) => {
    if (alarm.isActive) {
      let alarmHour = parseInt(alarm.alarmHour);
      let alarmMinute = parseInt(alarm.alarmMinute);

      // Convert alarm hour to 24-hour format if necessary
      if (alarm.AMPM === "PM" && alarmHour !== 12) {
        alarmHour += 12;
      } else if (alarm.AMPM === "AM" && alarmHour === 12) {
        alarmHour = 0;
      }

      if (
        alarmHour === date.getHours() &&
        alarmMinute === date.getMinutes() &&
        seconds === "00"
      ) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

hour_input.addEventListener("input", () => {
  hour_input.value = inputCheck(hour_input.value);
});

minute_input.addEventListener("input", () => {
  minute_input.value = inputCheck(minute_input.value);
});

// Create alarm div
const createAlarm = (alarmObjct) => {
  // Keys from object
  const { id, alarmHour, alarmMinute, AMPM } = alarmObjct;

  // Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute} ${AMPM}</span>`;

  // Checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);

  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);

  activeAlarms.appendChild(alarmDiv);
};

// Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  // Alarm Object
  let alarmObjct = {};
  alarmObjct.id = `${alarmIndex}_${hour_input.value}_${minute_input.value}`;
  alarmObjct.alarmHour = hour_input.value;
  alarmObjct.alarmMinute = minute_input.value;
  alarmObjct.AMPM = select_Am_Pm.value;
  alarmObjct.isActive = false;
  console.log(alarmObjct);

  alarm_array.push(alarmObjct);
  createAlarm(alarmObjct);
  hour_input.value = appendZero(initialHour);
  minute_input.value = appendZero(initialMinute);
});

// Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarm_array[index].isActive = true;
  }
};

// Stop Alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarm_array[index].isActive = false;
    if (alarmSound) {
      alarmSound.pause();
    }
  }
};

// Delete Alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarm_array.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarm_array = [];
  hour_input.value = appendZero(initialHour);
  minute_input.value = appendZero(initialMinute);
};
