(async () => {
  console.log("popup started");
//   const [tab] = await chrome.tabs.query({
//     active: true,
//     lastFocusedWindow: true,
//   });
//   console.log(tab);

  const response = await chrome.runtime.sendMessage({from: 'popup', message: "get audio"});
  // do something with response here, not outside the function
  console.log("Received message from background...");
  console.log(response.message);

    // Create audio element and set the Blob as source
    const audio = new Audio();
    audio.src = URL.createObjectURL(response.message);

    // Append the audio element to the popup's DOM
    document.getElementById("audioContainer").appendChild(audio);

    // Play the audio
    audio.play();
})();
