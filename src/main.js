import AudioConverter from './audioConverter.js';

const converter = new AudioConverter();
converter.loadFile('./public/sv_ttt_min_pcm_u8.wav').then(() => {
    converter.downloadCompressed();
});
