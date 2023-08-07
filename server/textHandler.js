const sdk = require("microsoft-cognitiveservices-speech-sdk");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const rangeParser = require("range-parser");

require("dotenv").config();

const generateAudioFile = async (text) => {
  //  speakTextAsync function is asynchronous, and it doesn't return a Promise that can be awaited.
  //  To properly handle the asynchronous behavior and wait for the audio file generation to complete, speakTextAsync is wrapped in a Promise and resolved or rejected based on the completion or error of the synthesis process.
  return new Promise((resolve, reject) => {
    const audioFile = "Audio.wav";

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.SPEECH_KEY,
      process.env.SPEECH_REGION
    );

    // Currently the text reader works for strings shorter than 1s. AudioConfig.fromAudioFileOutput method, generates a single audio file and saves it to disk
    // TODO: use the AudioConfig.fromStreamOutput method to directly stream the audio data to the response.
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

    let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
          resolve("Synthesis successful.");
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
          reject(new Error("Speech synthesis canceled."));
        }
        synthesizer.close();
        synthesizer = null;
      },
      (err) => {
        console.trace("err - " + err);
        reject(err);
        synthesizer.close();
        synthesizer = null;
      }
    );
  });
};

router.post("/audio", async (req, res) => {
  const result = await generateAudioFile(req.body.text);

  if(result !== "Synthesis successful.") {
    res.status(500).send(result);
  }

  const audioFilePath = path.join(__dirname, "Audio.wav");
  const stat = fs.statSync(audioFilePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  console.log("Audio file size:", fileSize);
  console.log("Range received:", range);

  if (range) {
    const parts = rangeParser(fileSize, range);

    if (parts) {
      const start = parts[0].start;
      const end = parts[0].end;

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(audioFilePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Content-Length": chunkSize,
        "Accept-Ranges": "bytes",
        "Content-Type": "audio/wav",
      });

      file.pipe(res);
    } else {
      res.status(416).send("Requested Range Not Satisfiable");
    }
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "audio/wav",
    });

    fs.createReadStream(audioFilePath).pipe(res);
  }
});

module.exports = router;
