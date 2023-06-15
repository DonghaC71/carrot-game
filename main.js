'use strict';
const items = document.querySelector('.items');
const playBtn = document.querySelector('.play');
const restartBtn = document.querySelector('.restart');
const timerText = document.querySelector('.timer .text');
const scoreText = document.querySelector('.score .text');
const showup = document.querySelector('.showup');
const showupInfo = document.querySelector('.showup__info');
const showupInfoText = document.querySelector('.info');
const startText = document.querySelector('.start');

function playSound(sound) {
  const audio = new Audio(`sound/${sound}.mp3`);
  if (sound === 'bg') audio.loop = true;
  audio.play();
}
function scatterTargets() {
  const carrots = document.querySelectorAll('.carrot');
  const bugs = document.querySelectorAll('.bug');
  carrots.forEach((carrot) => {
    carrot.style.visibility = 'visible';
    const x = Math.random() * 944;
    const y = Math.random() * 208;
    carrot.style.transform = `translate(${x}px, ${y}px)`;
  });
  bugs.forEach((bug) => {
    bug.style.visibility = 'visible';
    const x = Math.random() * 944;
    const y = Math.random() * 208;
    bug.style.transform = `translate(${x}px, ${y}px)`;
  });
}
function controlShowup(state) {
  if (state === 'hidden') {
    activateItems();
    showup.style.visibility = 'hidden';
    startText.style.visibility = 'hidden';
  } else if (state === 'pause') {
    deactivateItems();
    showup.style.visibility = 'visible';
    showupInfoText.innerHTML = `
    <span class="text">Replay<i class="fa-solid fa-question"></i></span>
    `;
  } else if (state === 'victory') {
    deactivateItems();
    playBtn.style.visibility = 'hidden';
    showup.style.visibility = 'visible';
    showupInfoText.innerHTML = `
    <span class="text">VICTORY!<i class="fa-solid fa-trophy"></i></span>
    `;
  } else if (state === 'defeated') {
    deactivateItems();
    playBtn.style.visibility = 'hidden';
    showup.style.visibility = 'visible';
    showupInfoText.innerHTML = `
    <span class="text">Defeated..<i class="fa-solid fa-thumbs-down"></i></span>
    `;
  }
}
let countdown;
let timeLimit = 10;
let remainingTime;
timerText.textContent = `${timeLimit}.00`;
function startTimer(duration) {
  // clearInterval(countdown);
  var startTime = Date.now();
  var endTime = startTime + duration * 1000;
  countdown = setInterval(() => {
    remainingTime = (endTime - Date.now()) / 1000;
    if (remainingTime > 0) {
      timerText.textContent = remainingTime.toFixed(2);
    } else {
      timerText.textContent = 'Timeover!';
      defeated();
      clearInterval(countdown);
    }
  }, 10);
}
function victory() {
  playSound('game_win');
  clearInterval(countdown);
  controlShowup('victory');
}
function defeated() {
  playSound('bug_pull');
  clearInterval(countdown);
  controlShowup('defeated');
}
let leftCarrots = 10;
function handleClick(event) {
  const id = event.target.dataset.id;
  if (id.startsWith('c')) {
    if (--leftCarrots === 0) victory();
    const target = document.querySelector(`.carrot[data-id="${id}"]`);
    target.style.visibility = 'hidden';
    scoreText.textContent = `${leftCarrots}`;
    playSound('carrot_pull');
  } else if (id === 'bug') {
    leftCarrots = 10;
    defeated();
  }
}
function addEvents() {
  items.addEventListener('click', handleClick);
}
function activateItems() {
  items.style.pointerEvents = 'auto';
}
function deactivateItems() {
  items.style.pointerEvents = 'none';
}
function startGame() {
  controlShowup('hidden');
  scatterTargets();
  startTimer(timeLimit);
  addEvents();
  restartBtn.addEventListener('click', restartGame);
}
function restartGame() {
  clearInterval(countdown);
  playBtn.style.visibility = 'visible';
  playBtn.dataset.state = 'pause';
  playBtn.innerHTML = '<i class="fa-solid fa-pause fa-3x"></i>';
  remainingTime = timeLimit;
  items.removeEventListener('click', handleClick);
  restartBtn.removeEventListener('click', restartGame);
  activateItems();
  leftCarrots = 10;
  scoreText.textContent = '10';
  startGame();
}
playBtn.addEventListener('click', (event) => {
  const state = event.currentTarget.dataset.state;
  if (state === 'play') {
    playSound('bg');
    playBtn.dataset.state = 'pause';
    playBtn.innerHTML = '<i class="fa-solid fa-pause fa-3x"></i>';
    startGame();
  } else if (state === 'pause') {
    clearInterval(countdown);
    controlShowup('pause');
    playBtn.dataset.state = 'resume';
    playBtn.innerHTML = '<i class="fa-solid fa-play fa-3x"></i>';
  } else if (state === 'resume') {
    clearInterval(countdown);
    activateItems();
    startTimer(remainingTime);
    controlShowup('hidden');
    playBtn.dataset.state = 'pause';
    playBtn.innerHTML = '<i class="fa-solid fa-pause fa-3x"></i>';
  }
});
