const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  console.log(text);

  chrome.runtime.sendMessage({
    from: "content-script",
    message: text,
  });
}
