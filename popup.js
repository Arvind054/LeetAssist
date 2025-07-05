//To Show the Problem on which the use is Working 
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

//Initial loading of the Extension
document.addEventListener("DOMContentLoaded", async () => {
    const problemTitle = document.querySelector('.problemTitle');
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { type: "getProblemInfo" }, async ({ text, description, code }) => {
            problemTitle.textContent = text || "No Problem Found";
        });
    });
});
//When a User Clicks on the Get Hint Button
document.getElementById('hint-btn').addEventListener('click', async () => {
    addMessage("Please Give me a hint.","user-message");
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { type: "getProblemInfo" }, async ({ text, description, code }) => {
            const response = await generateHint(text, description);
            addMessage(response,"bot-message");
        });
    });
});
//when a User Clicks on a Follow Up Button
document.getElementById('follow-btn').addEventListener('click', async () => {
    addMessage("Any Further Follow Ups.","user-message");
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { type: "getProblemInfo" }, async ({ text, description, code }) => {
            const response = await generateFollowUp(text, description, code);
            addMessage(response,"bot-message");
        });
    });
});
//When a User Clicks on the Calculate Complexity Button
document.getElementById('complexity-btn').addEventListener('click', async () => {
    addMessage("Analyse the Time and Space Complexity of my code","user-message");
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { type: "getProblemInfo" }, async ({ text, description, code}) => {
            const response = await getComplexity(text, description, code);
            addMessage(response,"bot-message");
        });
    });
});
// For General Chat of the user
document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById("user-input");
    const inputText = userInput.value;
    userInput.value = '';
    if(!inputText)return ;
    addMessage(inputText,"user-message");
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
        chrome.tabs.sendMessage(tab.id, { type: "getProblemInfo" }, async ({ text, description, code}) => {
            const response = await generalChat(text, description, code, inputText);
            addMessage(response,"bot-message");
        });
    });
});
//Function to Generate Content from AI Model.
const API_KEY = "AIzaSyCx1fm7Zl1VwtALea1ZBZ_pQbxs88S9KKw";
async function generateContent(prompt) {
    showLoading(true);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        showLoading(false);
        return text;
    } catch (error) {
        console.error("Error generating hint:", error);
        showLoading(false);
        return null;
    }
    }
//Function to generate Hint from the AI
async function generateHint(problem, problemDescription) {
        const prompt = `You are an interviewer and you are interviewing a candidate who is solving the Leetcode problem "${problem}". The description of the problem is as follows: "${problemDescription}". Generate a to-the-point hint for the candidate.Only provide the Hint`;
     const text = generateContent(prompt);
     return text;

}
//Function to generate Follow Up
async function generateFollowUp(problem, problemDescription, code){
    const prompt = `You are an interviewer and you are interviewing a candidate who is solving the Leetcode problem "${problem}". The description of the problem is as follows: "${problemDescription}" and the Code written by the Candidate is ${code}. Generate a followup question for the candidate based on his/her code .Only provide the followup question`;
     const text = generateContent(prompt);
     return text;
}

//Function to calculate time and Space Complexity
async function getComplexity(problem, description, code) {
     const prompt = `Analyse the Code for the Leetcode Problem ${problem} with description as: ${description} and the code written by the User is ${code}. Calculate the Time and Spce Complexity of the Code and explain minimum lines write the time complexity followed by spce complexity followed by a short explaination without showing the Code just in 1-2 lines.`;
     const text = await generateContent(prompt);
     return text;
}
//Function for general Chat
async function generalChat(problem, description, code, message){
    const prompt = `A User is Currently Solving the Leetocde problem ${problem} with Descriptio as ${description} and the Code written by the user is ${code}. the User asks you ${message}. Provide a short and Concise Reply and if the question is Not related to the above Provided problem and details just reply "This is Out of my Scope", except for Greetings`;
    const response = await generateContent(prompt);
    return response;
}
//Function to add message to the Chat
function addMessage(text, className) {
    const msg = document.createElement("div");
    msg.className = className;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    msg.scrollIntoView({ behavior: "smooth" });
  }

//Function to Show and Hide loader
function showLoading(val){
    const loader = document.getElementById("loader");
    if(val === true){
        loader.style.display = "block";
    }else{
        loader.style.display = "none";
    }
}


