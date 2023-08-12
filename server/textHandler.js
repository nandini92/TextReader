const sdk = require("microsoft-cognitiveservices-speech-sdk");
const router = require("express").Router();
const { Readable } = require("stream");

require("dotenv").config();

const generateAudioFile = async (text, res) => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION
  );

  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

  let synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  /* speakTextAsync has been modified to produce an ArrayBuffer object called audioData. The function takes an ArrayBuffer as input and converts it to Buffer using Buffer.from(arrayBuffer). Then, it creates a Readable stream, pushes the Buffer data to the stream using stream.push(buffer), and finally signals the end of the stream using stream.push(null). */
  synthesizer.speakTextAsync(
    text,
    (result) => {
      console.log("Synthesizer start...");
      const buffer = Buffer.from(result.audioData);
      const readable = new Readable();
      res.writeHead(206, {
        "Accept-Ranges": "bytes",
        "Content-Type": "audio/wav",
      });

      console.log("Buffer start...");

      readable.push(buffer);
      readable.push(null); //signal end of the stream

      readable.pipe(res); // Pipe redirects the readable stream to a writable stream (res);

      console.log("Buffer complete...");

      synthesizer.close();

    },
    (error) => {
      console.log(error);
      synthesizer.close();
      res.status(500).send("Failed to produce audio stream");
    }
  );
};


// Handler for browser pre-flight request
// https://stackoverflow.com/questions/29954037/why-is-an-options-request-sent-and-can-i-disable-it
router.options("/audio", (req, res) => {

  // https://dev.to/ifeanyichima/i-broke-dave-grays-code-3045
  res.set({
    "Access-Control-Allow-Origin": req.headers.origin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    "Access-Control-Expose-Headers": "*",
  });

  res.sendStatus(200);
})

router.post("/audio", async (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": req.headers.origin
  });
  
  generateAudioFile(req.body.text, res);
});

module.exports = router;
