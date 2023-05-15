const chatLog = document.getElementById('chat-log');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

async function sendMessage() {
  const question = chatInput.value.trim();

  if (question) {
    chatInput.value = '';

    try {
      const context = getChatContext(); // 현재 대화 컨텍스트 가져오기

      const response = await fetch('http://localhost:3000/christiangpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question, context }) // 질문과 컨텍스트 함께 전달
      });

      const data = await response.json();

      const chatQuestion = document.createElement('li');
      chatQuestion.innerText = `Q: ${question}`; // 질문에 'Q:' 프리픽스 추가
      chatQuestion.classList.add('question');
      chatLog.appendChild(chatQuestion);

      const chatAnswer = document.createElement('li');
      chatAnswer.innerText = `A: ${data.assistant}`; // 답변에 'A:' 프리픽스 추가
      chatAnswer.classList.add('answer');
      chatLog.appendChild(chatAnswer);

    } catch (error) {
      console.error(error);
    }
  }
}

function getChatContext() {
  const chatItems = chatLog.getElementsByTagName('li');
  let context = [];
  let currentQuestion = null;
  let currentAnswer = null;

  for (let i = 0; i < chatItems.length; i++) {
    const itemText = chatItems[i].innerText.trim();

    if (itemText.startsWith('Q:')) {
      if (currentQuestion !== null && currentAnswer !== null) {
        context.push({ question: currentQuestion, answer: currentAnswer });
        currentQuestion = null;
        currentAnswer = null;
      }

      currentQuestion = itemText.substring(3);
    } else if (itemText.startsWith('A:')) {
      currentAnswer = itemText.substring(3);
    }
  }

  if (currentQuestion !== null && currentAnswer !== null) {
    context.push({ question: currentQuestion, answer: currentAnswer });
  }

  return context;
}
