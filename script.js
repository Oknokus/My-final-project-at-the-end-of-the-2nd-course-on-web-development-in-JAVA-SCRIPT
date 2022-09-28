// обьект песен
const song = {
    grasshopper:
        'В траве сидел кузнечик, (4,1,4,1,4,3,3) в траве сидел кузнечик. (3,1,3,1,3,4,4)<br>Совсем как огуречик, (4,1,4,1,4,3,3) зелененький он был. (3,1,3,1,3,4)<br>Представьте себе представьте себе. (4,5,5,5,5,5,6,6,6,6) Совсем как огуречик. (6,6,5,4,3,4,4)<br>Представьте себе представьте себе. (4,5,5,5,5,5,6,6,6,6). Зелененький он был, (6,6,5,4,3,4)<br><br>Он ел одну лишь травку он ел одну лишь травку.<br>Не трогал и козявку и с мухами дружил.<br>Представьте себе представьте себе. Не трогал и козявку.<br>Представьте себе представьте себе. И с мухами дружил.',
    toys: 'Спят усталые игрушки, книжки спят, (5,3,5,3,5,5,4,3,2,3,5)<br>Одеяла и подушки ждут ребят, (5,2,5,2,5,4,3,2,3,5)<br>За день мы устали очень, (5,5,6,5,1,1,6,5)<br>Скажем всем: «Спокойной ночи». (1,1,4,5,6,6,5,4)<br>Глазки закрывай, баю-бай. (4,2,1)<br><br>Обязательно по дому в этот час<br>Тихо – тихо ходит дрѐма возле нас.<br>За окошком всѐ темнее,<br>Утро ночи мудренее,<br>Глазки закрывай, баю-бай.',
    herringbone:
        'В лесу родилась елочка, (1,6,6,5,6,4,1,1)<br>В лесу она росла, (1,6,6,7,5,1)<br>Зимой и летом стройная, (1,2,2,7,7,6,5,4)<br>Зеленая была. (4,6,6,5,6,4)<br><br>Метель ей пела песенку:<br>«Спи, елочка, бай-бай!»<br>Мороз снежком укутывал:<br>«Смотри, не замерзай!»',
};

const main = document.querySelector('.main');
const keys = document.querySelectorAll('.key');
const keysDiv = document.querySelector('.keys');
const noteList = document.querySelector('.nodePlayList');

const recordButton = document.querySelector('.record-button');
const repeatButton = document.getElementById('button_repeat');
const stopButton = document.getElementById('button_stop');

const selectedBGColor = document.getElementById('bgchoice');
const selectChange = document.getElementById('changeSong');
const ball = document.getElementById('IBall');
const div = document.querySelector('body');
const html = document.querySelector('html');
const input__volume = document.querySelector('#volume');
const title__volume = document.querySelector('#volume_show');
const backgroundText = document.querySelector('.P_background');
const buttons = document.querySelectorAll('.button button');
const timerPlayed = [];

let stop = false;
let backgroundTimePassed = null;
let backgroundTimer = null;
let songArr = null;
let recordingStartTime = null;
let posX = 1;
let posY = 1;
let animationTimer;
let speedX = 1;
let speedY = 1;


/// SCROLL ///
// Функция скроллинга страницы к верхней точке div (при загрузки страницы)
function scrollWin() {
    const headerBlack = document.querySelector('.header__black');
    scrollTo({
        top: headerBlack.offsetTop,
        left: 0,
        behavior: 'smooth',
    });
}
scrollWin()

/// BACKGROUND ///
// Функция приводит в движение элемент заставки
function moveBall() {
    cancelAnimationFrame(animationTimer);
    if (ball.offsetLeft + ball.offsetWidth === div.offsetWidth || ball.offsetLeft === 0) {
        speedX = -speedX;
    }
    if (ball.offsetTop + ball.offsetHeight === div.offsetHeight || ball.offsetTop === 0) {
        speedY = -speedY;
    }

    posX += speedX;
    posY += speedY;

    ball.style.left = `${posX}px`;
    ball.style.top = `${posY}px`;

    animationTimer = requestAnimationFrame(moveBall);
}

// Функция таймер для включения заставки с указанным временем
function startBackgroundTimer() {
    backgroundTimer = setInterval(() => {
        backgroundTimePassed = backgroundTimePassed += 1;
        if (backgroundTimePassed === 40) {
            animationTimer = requestAnimationFrame(moveBall);
            main.classList.add('screenSaved');
            ball.style.display = 'block';
        }
    }, 1000);
}

// Функция для выхода из режима динамической заставки
function deleteBackground() {
    cancelAnimationFrame(animationTimer);
    ball.style.display = 'none';
    clearInterval(backgroundTimer);
    startBackgroundTimer();
    backgroundTimePassed = null;
    main.classList.remove('screenSaved');
}

/// RECORDING ///
// Функция toggleRecording() при нажатии на кнопку RECORD добавляет класс "ACTIVE" кнопке RECORD,
// при повторном нажатии убирает класс "ACTIVE"
function toggleRecording() {
    recordButton.classList.toggle('active');
    if (isRecording()) {
        stopReplay(); // Остановить воспроизведение перед записью
        startRecording(); // Если нажата кнопка RECORD выполняется функция startRecording
    }
}

// Функция isRecording возвращает состояние кнопки RECORD и проверяет на наличие класса 'active'
function isRecording() {
  return recordButton.classList.contains('active');
}

// Функция startRecording проверяет если setTimeout активирован, удаляет, записывает текущее время в
// переменную recordingStartTime
function startRecording() {
    songArr = [];
    recordingStartTime = Date.now();
}

// кладем в timePlay разницу между текущим временем и стартом записи в миллисекундах.
// после остановки запуски, для каждой ноты запустится таймер с игрой, равный количеству миллисекунд
// (будет играть через столько же млс, через сколько была записана после старта записи)
function recordPlayNote(key, keyNote, audio) {
    if (isRecording()) {
        const timePlay = Date.now() - recordingStartTime;
        songArr.push({
            key,
            keyNote,
            audio,
            timePlay,
        });
        audio.play();
    }
}

/// REPLAY ///
// Функция isReplaying возвращает состояние кнопки REPLAY и проверяет на наличие класса 'active1'
function isReplaying() {
    return repeatButton.classList.contains('active1');
}

// Функция repeatReplay, запускает  повтор записанных в массив audio
function repeatReplay() {
    if (isRecording() || isReplaying()) {
        return;
    }

    songArr.forEach(({key, keyNote, audio, timePlay}, index) => {
        const newTimer = setTimeout(() => {
            if (!audio.ended) {
                audio.currentTime = 0;
                audio.pause();
            }
            if (stop) {
                return;
            }
            noteList.innerHTML = `Note: ${keyNote}`;
            key.classList.add('playing');
            audio.play();

            if (index === songArr.length - 1) {
                repeatButton.classList.remove('active1');
            }
        }, timePlay);

        timerPlayed.push(newTimer);
        stop = false;
    });
    repeatButton.classList.add('active1');
}

// Функция stopReplay, останавливает повтор записанной мелодии
function stopReplay() {
    stop = true;
    timerPlayed.forEach((timer) => clearTimeout(timer));
    repeatButton.classList.remove('active1');
}

/// PLAY ///
function play(key, keyNote, audio) {
    noteList.innerHTML = `Note: ${keyNote}`;
    key.classList.add('playing');
    audio.currentTime = 0;
    audio.play();
    deleteBackground();
    main.classList.remove('screenSaved');
}

// Функция для проигрывания нот при нажатии на клавиши мышкой. Получает e(target)при событии ;click,
// получает клавиши при событии, получает audio при событии через дата атрибуты, записывает в KeyNote
// атрибуты data-note(ноты которую нажали), добавляется класс к константе key "playing", воспроизводим аудио с начала
function playOneNote(e) {
    const key = e.target;
    const dataKey = key.getAttribute('data-key');
    const audio = document.querySelector(`audio[data-key="${dataKey}"]`);
    const keyNote = key.getAttribute('data-note');
    play(key, keyNote, audio);
    recordPlayNote(key, keyNote, audio);
}

// Функция для проигрывания нот при нажатии на клавиши. Получает e(target)при событии keyDown,
// получает клавиши при событии, получает audio при событии через дата атрибуты, записывает в KeyNote
// атрибуты data-note(ноты которую нажали), добавляется класс к константе key "playing", воспроизводим аудио с начала
function playNote(e) {
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if (!key) return;
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const keyNote = key.getAttribute('data-note');
    play(key, keyNote, audio);
    recordPlayNote(key, keyNote, audio);
}
    
/// CHANGE BACKGROUND ///
// Функция находит элемент select со значением и взависимости от его значение, задаёт background Div с классом "wrapper__grey"
function changeBG() {
  let selectedBGColor = document.getElementById("bgchoice").value;
  const wrapperGreyBg = document.querySelector('.wrapper__grey');

  document.body.style.backgroundColor = selectedBGColor;

  const changeBackgroundImage = (name) => { 
    wrapperGreyBg.style.cssText = `background-image: url(./backgroundImg/${name}.jpg)`;   
    }

  if (selectedBGColor === 'black') {
    changeBackgroundImage('black')
    backgroundText.classList.remove('P_background1');
    title__volume.classList.remove('volume_show1');

    Array.from(buttons).forEach(key => {
      key.classList.remove('record-button1')
    })
  }
  if (selectedBGColor === 'grey') {
    changeBackgroundImage('grey')

    backgroundText.classList.add('P_background1');
    title__volume.classList.add('volume_show1');


    Array.from(buttons).forEach(key => {
      key.classList.add('record-button1')
    })

  }
  if (selectedBGColor === '#fff') {
    changeBackgroundImage('default')
    backgroundText.classList.remove('P_background1');
    title__volume.classList.remove('volume_show1');

    Array.from(buttons).forEach(key => {
      key.classList.remove('record-button1')
    })
  }
}


/// CHANGE VOLUME ///
// Функция находит все элементы audio в HTML и проходит по массиву методом forEach,
// audio.volume задаёт значение input__volume.value / 100 и сетает title__volume.innerHTML
function volumeChange() {
    const audio = document.querySelectorAll('audio');

    Array.from(audio).forEach((audio) => (audio.volume = input__volume.value / 100));
    title__volume.innerHTML = input__volume.value;
}


/// CHANGE SONG ///
// Функция выбора песни, если песня не выбрана контейнер opacity = 0, если выбран то opacity =1
function changeSong() {
    const songContainer = document.getElementById('song');
    const selectChange = document.getElementById('changeSong').value;

    const songValue = song[selectChange];

    if (songValue) {
        songContainer.innerHTML = songValue;
        songContainer.style.opacity = '1';
    } else {
        songContainer.style.opacity = '0';
    }
}

/// KEYBOARD ///
// Функция перебирает все клавиши, где запустилась анимация, и убирает обводку с тех клавиш,
// где она уже закончила отрисовываться
// Функция проверяет если у клавиши уже нет свойства transform, удаляем класс "playing" из описания клавиши.
function removeTransition(e) {  
    if (e.propertyName !== 'transform') {
        noteList.innerHTML = '';
        return;
    }
    this.classList.remove('playing');
}

//Проходим по массиву keys,  и на каждом key запускаем removeTransition
keys.forEach((key) => key.addEventListener('transitionend', removeTransition));


// Навешиваем события на элементы HTML
selectChange.addEventListener('click', changeSong);
input__volume.addEventListener('click', volumeChange);
selectedBGColor.addEventListener('click', changeBG);
repeatButton.addEventListener('click', repeatReplay);
recordButton.addEventListener('click', toggleRecording);
stopButton.addEventListener('click', stopReplay);
div.addEventListener('click', deleteBackground);
keysDiv.addEventListener('click', playOneNote);
window.addEventListener('keydown', playNote);

   


 