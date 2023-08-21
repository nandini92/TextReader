# TextReader
Project aimed at utilizing Azure AI Text to Speech service to build a text reader for news sites, Wikipedia etc.


## Intro

> What is Azure Speech Service? 

The Speech service provides speech to text and text to speech capabilities with a Speech resource. You can transcribe speech to text with high accuracy, produce natural-sounding text to speech voices, translate spoken audio, and use speaker recognition during conversations.

## Frontend

Front is a chrome extension containing a popup.html to displayer the audio player and 3 layers of scripts: 

i. content.js - to collect article text from page.
ii. background.js - service worker to handle messages from content.js and popup.js.
iii. popup.js - to fetch audio from backend and serve audio file to popup.html

### Challenges

Currently popup.js retriggers fetch everytime it is closed and opened. We need to identify a way to persist the audio as long as the tab is open to reduce the calls to the backend. 

## Backend

Backend is built on Express.js to serve requests from the front end. Currently, there is only one service - it accepts text and responds with a Readable Stream of WAV audio.

1. OPTIONS request for "/audio" handles pre-flight requests from chrome extension to prevent any CORS exceptions. 

2. POST request for "/audio" calls the generateAudioFile function.

i. generateAudioFile creates a new instance of Azure speech configuration:
```javascript
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY,
  process.env.SPEECH_REGION
);
```

ii. A new instance of SpeechSynthesizer is created to perform speech synthesis audio. 

```javascript
var synthesizer = new sdk.SpeechSynthesizer(speechConfig);
```

iv. speakTextAsync produces an ArrayBuffer object called audioData. The function takes an ArrayBuffer as input and converts it to Buffer using Buffer.from(arrayBuffer). Then, it creates a Readable stream, pushes the Buffer data to the stream using stream.push(buffer), and finally signals the end of the stream using stream.push(null).
