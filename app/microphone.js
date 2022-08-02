class Microphone {
  constructor() {
    this.initialized = false;
    //coleta dados do microfone
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(function(stream) {
      //converte para o formato adequado
      this.audioContext = new AudioContext();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      //cria e configura analyser
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      
      //converte para 8bit audio
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      //conecta o microfone ao analyser
      this.microphone.connect(this.analyser);
      
      this.initialized = true;
      //bing serve para que o then entenda o this
    }.bind(this)).catch(err => alert(err));
  }

  // retorna array para o visualizer visualizar
  getSamples(){
    this.analyser.getByteTimeDomainData(this.dataArray);

    // normaliza os dados do sample para um range de -1 e 1
    let normSamples = [...this.dataArray].map(e => e/128 - 1);
    return normSamples;
  }
  // retorna o volume do microfone
  getVolume(){
    this.analyser.getByteTimeDomainData(this.dataArray);
    let normSamples = [...this.dataArray].map(e => e/128 - 1);
    let sum = 0;
    // RMS -> Root Means Square é uma medida de magnitude entre um grupo de números
    for(let i = 0; i < normSamples.length; i++) {
      // os negativos serão transformados em positivos
      sum += normSamples[i] * normSamples[i];
    }

    // arredonda os dados
    let volume = Math.sqrt(sum / normSamples.length);
    return volume;
  }
}