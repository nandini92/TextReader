console.log("Service worker started");

(async () => {
    // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    // console.log(tab);
    const audioQueue = [];

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Service worker listening...");
        console.log(message);
    
        if(message.from === 'content-script'){
            console.log("Received message from content-script...");
            audioQueue.push(message.message);
            console.log("pushed to array: " + message.message);
            sendResponse({from: 'background', message: 'Audio received'})
        }

        if(message.from === 'popup'){
            console.log("Received message from popup...");
            console.log(audioQueue[0]);
            sendResponse({from: 'background', message: audioQueue[0]});
        }
    })
  })();

  const getAudioQueue = () => {
    return audioQueue;
  }