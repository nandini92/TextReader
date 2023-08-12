const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  console.log(text);

  fetch("http://localhost:8000/audio", {
    method: "POST",
    headers: {
      Origin: "https://developer.chrome.com/",
      Accept: "*/*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: text }),
  })
  .then((res) => window.alert(res));
}
