(async () => {
  console.log("popup started");

  const response = await chrome.runtime.sendMessage({
    from: "popup",
    message: "get audio",
  });

  // do something with response here, not outside the function
  console.log("Received message from background...");
  console.log(response.message);

  // Fetch the audio stream from the backend
  const audioStream = await fetch("http://localhost:8000/audio", {
    method: "POST",
    headers: {
      Origin: document.URL,
      Accept: "audio/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: response.message }),
  }).then((res) => res.arrayBuffer());

  // Get the audio element
  const audio = document.getElementById("audioContainer");

  // Convert the ArrayBuffer to a Blob and create an object URL
  const blob = new Blob([audioStream], { type: "audio/wav" });
  const blobUrl = URL.createObjectURL(blob);

  // Set the Blob URL as the source of the audio element
  audio.src = blobUrl;

})();
