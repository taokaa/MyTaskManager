"use strict";

// clockの
const clock = document.getElementById("js_clock");

// h:m:s の順で時計を表示する関数
const showClock = function() {
    const now = new Date();
    const sec = Math.floor(now / 1000 % 60);
    const min = Math.floor((now / 1000 / 60) % 60);
    // gmt + 9
    const hours = Math.floor(((now / 1000 / 60 / 60) + 9) % 24);

    // リスト化して２桁表示にする処理
    const timeList = [hours,min,sec];
    const newTimeList = [3];
    for (let i in timeList) {
        newTimeList[i] = String(timeList[i]).padStart(2,"0");
    }
    clock.textContent = `${newTimeList[0]}:${newTimeList[1]}:${newTimeList[2]}`;

    // 更新速度1000msで再帰する処理
    setTimeout(() => {
        showClock()
    }, 1000);
}
showClock();



// pomodoroの
const start = document.getElementById("js-start");
const stop = document.getElementById("js-stop");
const reset = document.getElementById("js-reset");
const comment = document.getElementById("js-comment");
const countTimer = document.getElementById("js-count-timer");
const restPopup = document.getElementById("js-rest-popup");
const rest = document.getElementById("js-rest-btn");
const finish = document.getElementById("js-finish-btn");
const restartPopup = document.getElementById("js-restart-popup");
const restart = document.getElementById("js-restart-btn");
const totalTime = document.getElementById("js-total-time");
// const audio = document.getElementById("js-audio");

let startTime;
let timeLimit = 25;
let timeoutId;
let elapsedTime = 0;
let num = 0;

// 初期設定
const workTimeLimit = String(timeLimit).padStart(2,"0");
countTimer.textContent = `${workTimeLimit}:00`;

// タイマーを画面に書き出す処理
function updateTimer(t) {
  const d = new Date(t);
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  countTimer.textContent = `${m}:${s}`;
}

// タイマーのカウントダウンの処理
function countDown() {
  const runningTime =
    timeLimit * 60 * 1000 - elapsedTime - (Date.now() - startTime);

  if (runningTime < 0) {
    clearTimeout(timeoutId);
    initButtonState();
    elapsedTime = 0;
    // audio.play();
    switch (timeLimit) {
      case 5:
        restartPopup.classList.add("show");
        break;
      case 25:
        calcTime();
        restPopup.classList.add("show");
        break;
    }
    return;
  }
  updateTimer(runningTime);

  timeoutId = setTimeout(() => {
    countDown();
  }, 1000);
}

// 合計時間の算出
function calcTime() {
  ++num;
  const calcTime = timeLimit * num;
  totalTime.textContent = `Total: ${calcTime}分`;
}

// ボタンを押したら音を止める処理
// function stoppedSound() {
//   audio.pause();
//   audio.currentTime = 0;
// }

// 最初のボタンの状態
function initButtonState() {
  start.disabled = false;
  stop.disabled = true;
  reset.disabled = true;
  start.style.opacity = 1;
  stop.style.opacity = 0.4;
  reset.style.opacity = 0.4;
}

// カウント中のボタンの状態
function setButtonStateRunning() {
  start.disabled = true;
  stop.disabled = false;
  reset.disabled = true;
  start.style.opacity = 0.4;
  stop.style.opacity = 1;
  reset.style.opacity = 0.4;
}

// カウントダウンが止まっている時のボタンの状態
function setButtonStateStopped() {
  start.disabled = false;
  stop.disabled = true;
  reset.disabled = false;
  start.style.opacity = 1;
  stop.style.opacity = 0.4;
  reset.style.opacity = 1;
}

initButtonState();

// Startボタンを押した時の処理
start.addEventListener("click", () => {
  setButtonStateRunning();
  startTime = Date.now();
  countDown();
  comment.textContent = "作業中…";
});

// Stopボタンを押した時の処理
stop.addEventListener("click", () => {
  clearTimeout(timeoutId);
  setButtonStateStopped();
  elapsedTime += Date.now() - startTime;
  comment.textContent = "休止中…";
});

// Resetボタンを押した時の処理
reset.addEventListener("click", () => {
  initButtonState();
  elapsedTime = 0;
  num = 0;
  timeLimit = 25;
  countTimer.textContent = `${timeLimit}:00`;
  comment.textContent = "始めましょう。";
});

// 休憩するボタンを押した時の処理
rest.addEventListener("click", () => {
  restPopup.classList.remove("show");
  stoppedSound();
  timeLimit = 5;
  countTimer.textContent = `${timeLimit}:00`;
  start.click();
  comment.textContent = "休憩中…";
});

// 終了するボタンを押した時の処理
finish.addEventListener("click", () => {
  restPopup.classList.remove("show");
//   stoppedSound();
  num = 0;
  countTimer.textContent = `${timeLimit}:00`;
  comment.textContent = "お疲れさまでした、次回も頑張りましょう。";
});

// 再開するボタンを押した時の処理
restart.addEventListener("click", () => {
  restartPopup.classList.remove("show");
//   stoppedSound();
  timeLimit = 25;
  countTimer.textContent = `${timeLimit}:00`;
  start.click();
  comment.textContent = "作業中…";
});



// TODOの
const task_value = document.getElementById("js_task_value");
const task_submit = document.getElementById("js_task_submit");
const task_list = document.getElementById("js_task_list");

task_submit.addEventListener("click", e => {
    e.preventDefault();
    addTask();
});


function addTask() {

    const newTask = task_value.value;
    //  formが空のときの処理
    if (newTask) {
        // 入力した後のリストへの追加、表示
        const newListItem = document.createElement('li');
        const addListItem = task_list.appendChild(newListItem);
        addListItem.innerHTML = newTask;

        // 完了後押すボタン
        const finishedBtn = document.createElement('button');
        finishedBtn.innerHTML = "タスク完了";
        newListItem.appendChild(finishedBtn);

        // 完了ボタン押されたときの処理
        finishedBtn.addEventListener('click', () => {
            const chosenTask = finishedBtn.closest('li');
            task_list.removeChild(chosenTask);
        })

        // フォームの初期化
        task_value.value = "";
    }
}

// enterkey押されたときの処理
task_value.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
})