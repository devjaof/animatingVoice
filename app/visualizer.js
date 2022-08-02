function main() {
  // configura o canvas do html
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // essa classe, quando call, irá gerar cada uma das barras que irão interagir com o microfone
  class Bar {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
    };
    update(micInput) {
      this.height = micInput * 1000;
    };
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
    };
  }

  const microphone = new Microphone();
  
  // função que chama a classe Bar
  let bars = [];
  let barWidth = canvas.width/256;
  function createBars() {
    for(let i = 0; i < 256; i++) {
      let color = 'hsl(' + i * 3 + ', 100%, 50%)';
      bars.push(new Bar(i * barWidth, canvas.height/2, 1, 20, color));
    };
  }
  createBars();

  function animate() {
    if(microphone.initialized) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // gerar sample de audio que vem do microfone
      const samples = microphone.getSamples();
  
      // faz a animação em loop
      bars.forEach((bar, i) => {
        bar.update(samples[i]);
        bar.draw(ctx);
      })
      requestAnimationFrame(animate);
    }
  }

  animate();
}
