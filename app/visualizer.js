function main() {
  // configura o canvas do html
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // essa classe, quando call, irá gerar cada uma das barras que irão interagir com o microfone
  class Bar {
    constructor(x, y, width, height, color, index) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.index = index;
    };
    update(micInput) {
      this.height = micInput * 500;
    };
    draw(context) {
      context.strokeStyle = this.color;
      context.save();

      context.translate(canvas.width/2,canvas.height/2);
      context.rotate(this.index++ * 4);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, this.height);
      context.stroke();

      context.restore();
    };
  }

  // renderizando as barras
  const microphone = new Microphone();
  let bars = [];
  let barWidth = canvas.width/248;
  let barHeight = canvas.height/248;

  function createBars() {
    for(let i = 0; i < 2048; i++) {
      let color = 'hsl(' + i * 0.5 + ', 100%, 50%)';
      bars.push(new Bar(i * barWidth, barHeight, barWidth, 100, color, i));
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
    }
    requestAnimationFrame(animate);
  }

  animate();
}
