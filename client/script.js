//import bot from './assets/bot.svg';
//import user from './assets/user.svg';
let bot = './assets/bot_regular_icon.svg';
//const bot = new Image();
 //bot.src = './assets/bot.svg';

 //const user = new Image();
 //user.src = './assets/user.png';

 let user = './assets/user_icon.svg';
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element)
{
  element.textContent = '';

  loadInterval= setInterval(() => {
     // Update the text content of the loading indicator
    element.textContent += '.';

     // If the loading indicator has reached three dots, reset it
    if(element.textContent === '....')
    {
      element.textContent = '';
    }
  },300 //evry 300 MilliSeconds
  );
}

function typeText(element, text){
  let ino = 0;

  let interval = setInterval (() =>
  {
    if(ino < text.length)
    {
      //console.log("check"+ element.id +" "+text);
      element.innerHTML += text.charAt(ino);
      ino++;
      
    }else{
      clearInterval(interval);
      //element.innerHtml += text.charAt(ino);
     // console.log("eureka");
    }

  },20)
}

//generating a unique Id for the answers
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId()
{
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueID)
{
  return(
    `
      <div class ="wrapper ${isAi && 'ai'}">
      <div class ="chat">
      <div class ="profile">
      <img src ="${isAi ? bot : user}"
      alt="${isAi ? 'bot' : 'user'}"
      width ="80px" height="80px"
      />
      </div>
      <div class = "message" id =${uniqueID}>${value}></div>
      </div>
      </div>
    `
  )
}

const handleSubmit = async (o) =>{

    o.preventDefault();

  const data = new FormData(form);

  //user's chatStripe
  chatContainer.innerHTML += chatStripe(false,data.get('prompt'));

  form.reset();

  //bot's chatting
  const uniques = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true," ", uniques);

  chatContainer.scrollTop = chatContainer.scrollHeight;

   // specific message div 
  const messageDiv = document.getElementById(uniques);

  // messageDiv.innerHTML = "..."
  //console.log(messageDiv);
  loader(messageDiv);

  //fetch data from server -> bot's response
  const response = await fetch('http://localhost:5000',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = " ";

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 
       // console.log(data);
        typeText(messageDiv, parsedData)
    } else {
        const erro = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(erro);
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})