let answer = '';
let answerArr = [];

fetch("./json/quiz.json")
  .then(response => response.json())
  .then(json => {
    answer = json[Math.floor(Math.random()*json.length)];
    answerArr = answer.toUpperCase().split('');
  });

let darkMode = localStorage.getItem('darkMode');
let darkModeToggle = document.getElementById('dark-mode-toggle');

let state = '';
let lock = false;

// document.querySelector('.refresh a').addEventListener('click', (e) => {
//   e.preventDefault();
//   location.reload();
// });

const enableDarkMode = () => {
  document.body.classList.add('darkMode');
  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  document.body.classList.remove('darkMode');
  localStorage.setItem('darkMode', null);
}

if (darkMode === 'enabled') {
  enableDarkMode();
}
darkModeToggle.addEventListener('change', (e) => {
  darkMode = localStorage.getItem('darkMode');
  if (darkMode !== 'enabled') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
})

const keyBtns = document.querySelectorAll('.keybtn');
let currentInput = [];

const renderTiles = (arr) => {
  let str = ''
  for (let i = 0; i < 5; i++) {
    if (arr[i]) {
      str += `<div class="tile">${arr[i]}</div>`;
    } else {
      str += `<div class="tile"></div>`;
    }
  }
  document.querySelector('.space-row').innerHTML = str;
}
const checkRow = () => {
  if (currentInput.length === 5) {
    lock = true;
    checkTiles(currentInput);
  } else {
    showSnackbar('Invalid word!','wrong');
  }
}
const checkTiles = (arr) => {
  for (let i = 0; i < 5; i++) {
    setTimeout(function () {
      let correctCount = 0;
      let str = '';
      for (let j = 0; j <= i; j++) {
        let type = '';
        if (answerArr[j] === arr[j]) {
          type = 'correct';
          correctCount += 1;
        } else if (answerArr.includes(arr[j])) {
          type = 'checked';
        } else {
          type = 'wrong';
        }
        str += `<div class="tile ${type} ${ i===j && (type !== 'wrong') ? 'flip' : '' }">${arr[j]}</div>`;
        if (j === i) {
          renderKeyboard(arr[j], type);
        }
      }
      for (let k = i + 1; k < 5; k++) {
        str += `<div class="tile">${arr[k]}</div>`;
      }
      document.querySelector('.space-row').innerHTML = str;
      if (i === 4) {
        //end 
        currentInput = [];
        document.querySelector('.space-row').classList.remove('space-row');
        if (correctCount === 5) {
          showSnackbar('Congratulations!','success');
        } else {
          lock = false;
        }
      }
    }, i * 600)
  }
}
const renderKeyboard = (id, ans) => {
  const target = document.getElementById(id.toLowerCase());
  target.classList.contains(ans) ? null : target.classList.add(ans);
}

keyBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if(!lock) {
      if (btn.innerText === 'backspace') {
        currentInput.pop();
      } else if (btn.innerText === 'check') {
        checkRow(currentInput);
      } else {
        if (currentInput.length < 5)
          currentInput.push(btn.innerText)
      }
      renderTiles(currentInput);
    }
  })
})

const showSnackbar = (content, type) => {
  let x = document.querySelector('.snackbar');
  x.innerHTML = content;
  x.classList.add('show');
  x.classList.add(type);
  setTimeout(function () {
    x.className = x.className.replace("show", "");
    x.className = x.className.replace(type, "");
  }, 3000);
}