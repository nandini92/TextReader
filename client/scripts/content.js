const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  console.log(text);

  fetch("http://localhost:8000/audio", {
    method: "POST",
    headers: {
      Origin: document.URL,
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: text }),
  })
    .then((res) => {
      const response = new Response(res.body);
      // Read the response body as an ArrayBuffer
      return response
        .arrayBuffer()
        .then((arrayBuffer) => {
          // Convert the ArrayBuffer to a Blob
          return new Blob([arrayBuffer], { type: "audio/wav" });
        })
        .catch((error) => {
          console.error("Error converting stream to Blob:", error);
        });
    })
    .then((res) => {
      console.log(res);
      console.log("Send audio to background...");
      return chrome.runtime.sendMessage({
        from: "content-script",
        message: res,
      });
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}
