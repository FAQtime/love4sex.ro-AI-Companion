// Base64 encoded sound for a sent message (a soft swoosh)
const sentSoundB64 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI V1NTVAAAAAQAAAAD/+0DEAAPwA2wA4VgQGbwgHewZ4BkA4MAA6AAAAAANIAAAAATP/7QMQSACTAFrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxA0DMMgWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPADNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxBEAIMGWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPABNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxA0DMMgWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPADNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxA0DMMgWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPADNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAA';

// Base64 encoded sound for a received message (a gentle chime)
const receivedSoundB64 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI V1NTVAAAAAQAAAAD/+0DEAAPwA2wA4VgQGbwgHewZ4BkA4MAA6AAAAAANIAAAAATP/7QMQSACTAFrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxA0DMMgWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPADNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxBEAIMGWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPABNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxA0DMMgWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPADNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAD/7QMAQ8AAzgBaQCGqBAZuCBf9gt4BkySE+gAKeAAUAAAAAAYAAAAAA//tAxA0DMMgWsAALUQYGA/BHewZ4BmyWFuADKOAAUAAAAAAYAAAAApbBj/8AAAAAA/+0DAEPADNYAWkAhqgQGbgwX/YLeAZMkf/oACngAFAAAAAAGAAAAAP/tAxBMAJMABrAEC1EEBgL4R3sGeAZslhbgAyjgAFAAAAAAGgAAAAClsGN/wAAAAAA';

// Create a single Audio object for each sound to prevent creating new ones on every play.
const sentAudio = new Audio(sentSoundB64);
sentAudio.volume = 0.3;

const receivedAudio = new Audio(receivedSoundB64);
receivedAudio.volume = 0.4;

/**
 * Plays a sound effect for a sent message.
 */
export const playMessageSentSound = () => {
  // Reset current time to play from the start, allowing overlapping sounds.
  sentAudio.currentTime = 0;
  sentAudio.play().catch(error => {
    // Autoplay errors are common if the user hasn't interacted with the page yet.
    if (error.name !== 'NotAllowedError') {
      console.error("Error playing sent sound:", error);
    }
  });
};

/**
 * Plays a sound effect for a received message.
 */
export const playMessageReceivedSound = () => {
  receivedAudio.currentTime = 0;
  receivedAudio.play().catch(error => {
    if (error.name !== 'NotAllowedError') {
      console.error("Error playing received sound:", error);
    }
  });
};