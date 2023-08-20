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

  const main = document.querySelector(".main");
  const audioElement = new Audio(response.message);

  main.appendChild(audioElement);
})();
