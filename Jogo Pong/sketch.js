// Dimensionamento bolinha
let xBolinha = 300;
let yBolinha = 200;
let diametroBolinha = 25;
let raio = diametroBolinha / 2;

// Velocidade bolinha
let velocidadeXBolinha = 7;
let velocidadeYBolinha = 7;

// Raquete
let xRaquete = 5;
let yRaquete = 150;
let comprimentoRaquete = 10;
let alturaRaquete = 90;
let colisao = false;

//Raquete Oponente
let xRaqueteOponente = 585;
let yRaqueteOponente = 150;
let velocidadeYOponente;

//Placar
let meusPontos = 0;
let pontosDoOponente = 0;

// sons do jogo
let ponto;
let raquetada;
let trilha;
let musica;

//chance de errar
let chanceErro = 0;

// menu do jogo
let estadoJogo = "menu";

//Função para escolher modo de jogo
let borda;

function preload() {
  ponto = loadSound("ponto.mp3");
  trilha = loadSound("trilha.mp3");
  raquetada = loadSound("raquetada.mp3");
  musica = loadSound("2d-fate_oPmRw6Pc.mp3");
}

function setup() {
  createCanvas(600, 400);
  //musica.loop();
}

function draw() {
  background(0);

  if (estadoJogo === "menu") {
    exibeMenu();
  } else if (estadoJogo === "jogo") {
    mostraBolinha();
    movimentoBolinha();
    bordas();
    mostraRaquete(xRaquete, yRaquete);
    movimentaRaquete();
    verificaColisao(xRaquete, yRaquete);
    mostraRaquete(xRaqueteOponente, yRaqueteOponente);
    movimentaRaqueteOponente();
    verificaColisao(xRaqueteOponente, yRaqueteOponente);
    Placar();
    marcaPontos();
    bolinhaNaoFicaPresa();
    verificaFimDeJogo();
  } else if (estadoJogo === "fim") {
    exibeFimDeJogo();
  }
}

function bolinhaNaoFicaPresa() {
  if (xBolinha - raio < 0) {
    xBolinha = 23;
  }
}

function mouseClicked() {
  if (estadoJogo === "menu") {
    estadoJogo = "jogo";
    iniciaJogo();
  } else if (estadoJogo === "fim") {
    estadoJogo = "menu";
  }
}

function exibeMenu() {
  stroke(255);
  textAlign(CENTER);
  textSize(36);
  fill(color(255, 140, 0));
  text("PONG", width / 2, height / 2 - 100);
  rect(153, 212, 300, 50, 20);
  fill(255);
  text("Clique para iniciar", width / 2, height / 2 + 50);
  fill(255);
  textSize(20);
  text(
    "Controles Player 1: Setas direcionais cima e baixo",
    width / 2,
    height / 2 + 100
  );
}

function iniciaJogo() {
  // Reinicializa as variáveis do jogo
  xBolinha = 300;
  yBolinha = 200;
  velocidadeXBolinha = 6;
  velocidadeYBolinha = 6;
  meusPontos = 0;
  pontosDoOponente = 0;
}

function movimentoBolinha() {
  xBolinha += velocidadeXBolinha;
  yBolinha += velocidadeYBolinha;
}

function mostraBolinha() {
  circle(xBolinha, yBolinha, diametroBolinha);
}

function bordas() {
  if (xBolinha + raio > width || xBolinha - raio < 0) {
    velocidadeXBolinha *= -1;
  }

  if (yBolinha + raio > height || yBolinha - raio < 0) {
    velocidadeYBolinha *= -1;
  }
}

function mostraRaquete(x, y) {
  rect(x, y, comprimentoRaquete, alturaRaquete);
}

function movimentaRaquete() {
  if (keyIsDown(UP_ARROW)) {
    yRaquete -= 10;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yRaquete += 10;
  }

  //não deixa a raquete sumir da tela
  yRaquete = constrain(yRaquete, 0, 310);
}

function colisaoRaquete() {
  if (
    xBolinha - raio < xRaquete + comprimentoRaquete &&
    yBolinha - raio < yRaquete + alturaRaquete &&
    yBolinha + raio > yRaquete
  ) {
    velocidadeXBolinha *= -1;
    raquetada.play();
  }
}

function verificaColisao(x, y) {
  colisao = collideRectCircle(
    x,
    y,
    comprimentoRaquete,
    alturaRaquete,
    xBolinha,
    yBolinha,
    raio
  );
  if (colisao) {
    velocidadeXBolinha *= -1;
    raquetada.play();
  }
}

function calculachanceErro() {
  if (pontosDoOponente >= meusPontos) {
    chanceErro += 2; // Aumentar o incremento para 2
    if (chanceErro >= 50) {
      chanceErro = 50; // Limite superior máximo
    }
  } else {
    chanceErro -= 2; // Aumentar o decremento para 2
    if (chanceErro <= 30) {
      chanceErro = 30; // Limite inferior mínimo
    }
  }
}

function movimentaRaqueteOponente() {
  velocidadeYOponente =
    yBolinha - yRaqueteOponente - comprimentoRaquete / 2 - 30;
  yRaqueteOponente += velocidadeYOponente + chanceErro;

  calculachanceErro();
  //nao deixa a raquete sair da borda do jogo
  yRaqueteOponente = constrain(yRaqueteOponente, 0, 310);
}

function Placar() {
  stroke(255);
  textAlign(CENTER);
  textSize(16);
  fill(color(255, 140, 0));
  rect(130, 10, 40, 20);
  fill(255);
  text(meusPontos, 150, 26);
  fill(color(255, 140, 0));
  rect(430, 10, 40, 20);
  fill(255);
  text(pontosDoOponente, 450, 26);
}

function marcaPontos() {
  if (xBolinha < 13) {
    pontosDoOponente += 1;
    ponto.play();
  }

  if (xBolinha > 587) {
    meusPontos += 1;
    ponto.play();
  }
}

function verificaFimDeJogo() {
  if (meusPontos >= 10 || pontosDoOponente >= 10) {
    estadoJogo = "fim";
  }
}

function exibeFimDeJogo() {
  background(0);
  stroke(255);
  textAlign(CENTER);
  textSize(36);
  fill(color(255, 140, 0));
  if (meusPontos >= 10) {
    text("Você venceu!", width / 2, height / 2 - 100);
  } else {
    text("Você perdeu!", width / 2, height / 2 - 100);
  }
  fill(255);
  text(
    "Pontuação: " + meusPontos + " - " + pontosDoOponente,
    width / 2,
    height / 2
  );
  textSize(16);
  text("Clique para jogar novamente", width / 2, height / 2 + 50);
}
