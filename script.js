const main = document.querySelector('.main');
const keys = document.querySelectorAll(".key");
const keysDiv = document.querySelector(".keys");
const noteList = document.querySelector(".nodePlayList");
const designation = document.querySelectorAll(".designation");
const img = document.getElementById('img');
const recordButton = document.querySelector('.record-button');
const repeatButton = document.getElementById('button_repeat');
const stopButton = document.getElementById('button_stop');
const selectedBGColor = document.getElementById("bgchoice");
const selectChange = document.getElementById('changeSong');
const ball = document.getElementById('IBall');
const div = document.querySelector('body');
const html = document.querySelector('html');
const input__volume = document.querySelector('#volume');
const title__volume = document.querySelector('#volume_show')
const backgroundText = document.querySelector('.P_background');
const buttons = document.querySelectorAll('.button button')


let keyDown;
let stop = false;
let timePassed = null;
let timerInterval = null;
let songArr = null;
let recordingStartTime = null;
let posX = 1;
let posY = 1;
let timer1 = null;
let speedX = 1;
let speedY = 1;
let timerPlayed = [];

// Функция приводит в движение элемент заставки

function moveBall() {
  cancelAnimationFrame(timer1);
  if (ball.offsetLeft + ball.offsetWidth === div.offsetWidth || ball.offsetLeft === 0) {
    speedX = -speedX;
  }
  if (ball.offsetTop + ball.offsetHeight === div.offsetHeight || ball.offsetTop === 0) {
    speedY = -speedY;
  }

  posX += speedX;
  posY += speedY;

  ball.style.left = posX + 'px';
  ball.style.top = posY + 'px';

  timer1 = requestAnimationFrame(moveBall);
}

// Функция таймер для включения заставки с указанным временем

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    if (timePassed === 20) {
      timer1 = requestAnimationFrame(moveBall);
      main.classList.add('screenSaved');
      ball.style.display = "block";
    }
  }, 1000)
}

// Функция для выхода из режима динамической заставки

function delateBall(e) {
  cancelAnimationFrame(timer1);
  ball.style.display = "none";
  clearInterval(timerInterval);
  startTimer();
  timePassed = null;
  main.classList.remove('screenSaved');
}

//Функция toggleReсording() при нажатии на кнопку RECORD добавляет класс "ACTIVE" кнопке RECORD,
//при повторном нажатии убирает класс "ACTIVE"

function toggleReсording() {
  recordButton.classList.toggle('active');
  if (isRecording()) {
    stopReplay(); // Остановить воспроизведение перед записью
    startRecording() // Если нажата кнопка RECORD выполняется функция startRecording
  }
}

// Функция isRecording возвращает состояние кнопки RECORD и проверяет на наличие класса 'acive'

function isRecording() {
  return recordButton !== null && recordButton.classList.contains('active');
}

// Функция strartRecording проверяет если setTimeout активирован, удаляет, записывает текущее время в
//переменную recordingStartTime

function startRecording() {
  songArr = [];
  recordingStartTime = Date.now();
}

// Функция repeatReplay, запускает  повтор

function repeatReplay(e) {
  if (recordButton.classList.contains('active') ||
    repeatButton.classList.contains('active1') || 
    keyDown === e.target) {
    return;
  }

  songArr.forEach(({
    key,
    keyNote,
    audio,
    timePlay,
  }, index) => {
    const newTimer = setTimeout(() => {
      if (!audio.ended) {
        audio.currentTime = 0;
        audio.pause();
      }
      if (stop) {
        return;
      }
      noteList.innerHTML = `Note: ${keyNote}`;
      key.classList.add("playing");
      audio.play();

      if (index === songArr.length - 1) {
        repeatButton.classList.remove('active1');
      }
    }, timePlay);

    timerPlayed.push(newTimer);
    stop = false;
  })
  repeatButton.classList.add('active1')
}


// Функция stopReplay, останавливает повтор записанной мелодии
function stopReplay(e) {
  stop = true;
  timerPlayed.forEach(timer => clearTimeout(timer));
  repeatButton.classList.remove('active1');
}

//Функция для проигрывания нот при нажатии на клавиши мышкой. Получает e(target)при событии ;click,
// получает клавиши при событии, получает audio при событии через дата атрибуты, записывает в KeyNote
//атрибуты data-note(ноты которую нажали), добавляется класс к константе key "playing", воспроизводим аудио с начала

function playOneNote(e) {
  const key = e.target;
  const dataKey = key.getAttribute("data-key");
  const audio = document.querySelector(`audio[data-key="${dataKey}"]`);
  const keyNote = key.getAttribute("data-note");
  keynoteDown = key;
  noteList.innerHTML = `Note: ${keyNote}`;
  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();
  delateBall();
  main.classList.remove('screenSaved');
  if (!key) return;
  // кладем в timePlay разницу между текущим временем и стартом записи в миллисекундах.
  // после остановки запуски, для каждой ноты запустится таймер с игрой, равный количеству миллисекунд
  // (будет играть через столько же млс, через сколько была записана после старта записи)

  if (repeatReplay()) {
    recordButton.classList.remove('active')
  }

  if (isRecording()) {
    const timePlay = Date.now() - recordingStartTime;
    songArr.push({
      key,
      keyNote,
      audio,
      timePlay,
    })
    audio.play();
  }
}


// Функция для проигрывания нот при нажатии на клавиши. Получает e(target)при событии keyDown,
// получает клавиши при событии, получает audio при событии через дата атрибуты, записывает в KeyNote
//атрибуты data-note(ноты которую нажали), добавляется класс к константе key "playing", воспроизводим аудио с начала

function playNote(e) {  
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const keyNote = key.getAttribute("data-note");
  keynoteDown = key;
  noteList.innerHTML = `Note: ${keyNote}`;
  key.classList.add("playing");
  audio.currentTime = 0;
  audio.play();
  delateBall();
  main.classList.remove('screenSaved');
  if (!key) return;
  // кладем в timePlay разницу между текущим временем и стартом записи в миллисекундах.
  // после остановки запуски, для каждой ноты запустится таймер с игрой, равный количеству миллисекунд
  // (будет играть через столько же млс, через сколько была записана после старта записи)
  if (repeatReplay()) {
    recordButton.classList.remove('active')
  }
  if (isRecording()) {
    const timePlay = Date.now() - recordingStartTime;
    songArr.push({
      key,
      keyNote,
      audio,
      timePlay,
    })
    audio.play();
  }
}


// Функция находит элемент select со значением и взависимости от его значение, задаёт background Div с классом "wrapper__grey"

function changeBG() {
  const selectedBGColor = document.getElementById("bgchoice").value;
  const wrapperGreyBg = document.querySelector('.wrapper__grey');

  document.body.style.backgroundColor = selectedBGColor;
  if (selectedBGColor === 'black') {
    wrapperGreyBg.style.cssText = 'background-image: url(./backgroundImg/black.jpg);';
    backgroundText.classList.remove('P_background1');
    title__volume.classList.remove('volume_show1');

    Array.from(buttons).forEach(key => {
      key.classList.remove('record-button1')
    })
  }
  if (selectedBGColor === 'grey') {
    wrapperGreyBg.style.cssText = 'background-image: url(./backgroundImg/grey.jpg);';

    backgroundText.classList.add('P_background1');
    title__volume.classList.add('volume_show1');


    Array.from(buttons).forEach(key => {
      key.classList.add('record-button1')
    })

  }
  if (selectedBGColor === '#fff') {
    wrapperGreyBg.style.cssText = 'background-image: url(./backgroundImg/default.jpg);';
    backgroundText.classList.remove('P_background1');
    title__volume.classList.remove('volume_show1');

    Array.from(buttons).forEach(key => {
      key.classList.remove('record-button1')
    })
  }
}

// Функция находит все элементы audio в HTML и проходит по массиву методом forEach,
// audio.volume задаёт значение input__volume.value / 100 и сетает title__volume.innerHTML

function volume_change() {
  const audio = document.querySelectorAll('audio');
  Array.from(audio).forEach(audio =>
    audio.volume = input__volume.value / 100);
  title__volume.innerHTML = input__volume.value;
}

//Функция проверяет если у клавиши уже нет свойства transform, удаляем класс "playing" из описания клавиши.

function removeTransition(e) {
  if (e.propertyName !== "transform") {
    noteList.innerHTML = '';
    return;
  }
  this.classList.remove("playing");
}


//Функция перебирает все клавиши, где запустилась анимация, и убирает обводку с тех клавиш,
//где она уже закончила отрисовываться

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

//обьект песен

const song = {
  grasshopper: "В траве сидел кузнечик, (4,1,4,1,4,3,3) в траве сидел кузнечик. (3,1,3,1,3,4,4)<br>Совсем как огуречик, (4,1,4,1,4,3,3) зелененький он был. (3,1,3,1,3,4)<br>Представьте себе представьте себе. (4,5,5,5,5,5,6,6,6,6) Совсем как огуречик. (6,6,5,4,3,4,4)<br>Представьте себе представьте себе. (4,5,5,5,5,5,6,6,6,6). Зелененький он был, (6,6,5,4,3,4)<br><br>Он ел одну лишь травку он ел одну лишь травку.<br>Не трогал и козявку и с мухами дружил.<br>Представьте себе представьте себе. Не трогал и козявку.<br>Представьте себе представьте себе. И с мухами дружил.",
  toys: "Спят усталые игрушки, книжки спят, (5,3,5,3,5,5,4,3,2,3,5)<br>Одеяла и подушки ждут ребят, (5,2,5,2,5,4,3,2,3,5)<br>За день мы устали очень, (5,5,6,5,1,1,6,5)<br>Скажем всем: «Спокойной ночи». (1,1,4,5,6,6,5,4)<br>Глазки закрывай, баю-бай. (4,2,1)<br><br>Обязательно по дому в этот час<br>Тихо – тихо ходит дрѐма возле нас.<br>За окошком всѐ темнее,<br>Утро ночи мудренее,<br>Глазки закрывай, баю-бай.",
  herringbone: "В лесу родилась елочка, (1,6,6,5,6,4,1,1)<br>В лесу она росла, (1,6,6,7,5,1)<br>Зимой и летом стройная, (1,2,2,7,7,6,5,4)<br>Зеленая была. (4,6,6,5,6,4)<br><br>Метель ей пела песенку:<br>«Спи, елочка, бай-бай!»<br>Мороз снежком укутывал:<br>«Смотри, не замерзай!»"
}

//Функция выбора песни, если песня не выбрана контейнер opacity = 0, если выбран то opacity =1

function changeSong() {
  const songContainer = document.getElementById('song');
  const selectChange = document.getElementById('changeSong').value;

  const songValue = song[selectChange];

  if (songValue) {
    songContainer.innerHTML = songValue;
    songContainer.style.opacity = "1"
  } else {
    songContainer.style.opacity = "0"
  }
}

// Навешиваем события на элементы HTML

selectChange.addEventListener('click', changeSong);
input__volume.addEventListener('click', volume_change);
selectedBGColor.addEventListener('click', changeBG);
repeatButton.addEventListener('click', repeatReplay)
recordButton.addEventListener('click', toggleReсording);
stopButton.addEventListener('click', stopReplay);
div.addEventListener('click', delateBall);
keysDiv.addEventListener("click", playOneNote);
window.addEventListener("keydown", playNote);
