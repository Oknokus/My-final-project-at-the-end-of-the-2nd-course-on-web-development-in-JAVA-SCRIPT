function scrollWin() {
  const piano = document.getElementById('index');
  scrollTo({
      top: piano.offsetTop,
      left: 0,
      behavior: 'smooth',
  });
}
scrollWin()

const piano = document.getElementById('index');

function openPiano(e) {
  e.preventDefault();
  window.location.hash = 'Piano'
  document.body.style.opacity = 0;
}

piano.addEventListener('click', openPiano)

function onLoad(data) {  
  document.body.style.transition = 'opacity 3s ease-in-out';
  document.body.style.opacity = 1;
  document.body.innerHTML = data;

  $.ajax('/script.js', {
    data: "GET",
    dataType: "script",
    success: onScriptLoad,
    error: onScriptError,
  })
}

function onScriptLoad() {
  console.log('script was loaded!')
}

function onScriptError() {
  console.log('script was not loaded!')
}

function onError(err) {
  console.log(err.message)
}

window.onhashchange = function(e) { 
  const hash = window.location.hash.substring(1);  
  $.ajax(`${hash}.html`, {
    data: "GET",
    dataType: "html",
    success: onLoad,
    error: onError,
  }) 
}
