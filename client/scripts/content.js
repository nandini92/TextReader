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
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: text }),
  })
  .then((res) => {
    console.log("Send audio to background...");
    const audioBlob = res.body.getReader().blob();
    return chrome.runtime.sendMessage({from: 'content-script', message: audioBlob});
  })
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
}
