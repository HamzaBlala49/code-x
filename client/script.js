import bot from './assets/bot.svg'
import user from './assets/user.svg'

// selectors
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader (el){
  el.textContent = '';
  loadInterval = setInterval(() => {
    el.textContent +='.';

    if(el.textContent == '....'){
      el.textContent ='';
    }
  }, 300);
}

function typeText(el,text) {
  let index =0;

  let interval = setInterval(() => {
    if(index < text.lenght){
      el.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  },20);
}

function generateUniqueId() {
  const timestamp = new Date();
  const randomNumber =Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi,value,uniqueId) {
  return(
    `<div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
            src = "${isAi ? bot : user}"
            alt = "${isAi ? 'bot' : 'user'}"
          />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) =>{
  e.preventDefault()

  const data = new FormData(form);

  //user's chatstrip
  chatContainer.innerHTML +=chatStripe(false,data.get('prompt'));

  form.reset();

  //bots chatstripe

  const uniqueId = generateUniqueId();
  console.log(uniqueId)
  chatContainer.innerHTML += chatStripe(true," ",uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
  //fetch data  that come from server

  let respones = await fetch("http://localhost:5000",{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (respones.ok) {
    const data = await respones.json();
    const paresData =data.bot.trim();
    typeText(messageDiv,paresData);
  }else{
    const err = await respones.text();
    messageDiv.innerHTML ="Something went wrong";
    alert(err);
  }
}

form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keyCode ==13){
    handleSubmit(e);
  }
});
