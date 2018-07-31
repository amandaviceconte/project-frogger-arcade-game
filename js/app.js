// Variável do score do jogo
let score = 0;

// Função que determina a condição de vitória
const winCondition = () => {
    if (player.y <= -15) {
        score++;
        if (score % 3 === 0) {
            totalEnemies++;
        }
        document.getElementById('score').innerHTML = `Score: <span id="scoreText">${score}</span>`;
        restartPhase();
    }
}

// Função de gameOver
const gameOver = () => {
    if (player.life === 0) {
        player.canWalk = false;
        allEnemies = [];
        document.getElementById('life').innerHTML = "GAME OVER!";
    }
}

// Função para recomeçar uma fase
const restartPhase = () => {
    player.x = 203;
    player.y = 345;
    startEnemies();
}

// Inimigos que nosso jogador deve evitar
let Enemy = function(x, y, velocidade) {
    // Ponto inicial do inimigo
    this.x = x;
    this.y = y;
    // Velocidade
    this.velocidade = velocidade;
    // Imagem
    this.sprite = 'images/enemy-bug.png';
};

// Atualize a posição do inimigo, método exigido pelo jogo
// Parâmetro: dt, um delta de tempo entre ticks
Enemy.prototype.update = function(dt) {
    // Movimento do inimigo
    this.x += this.velocidade * dt;
    // Garantindo que o inimigo volte ao começo após tocar no final
    if (this.x >= 505) {
        this.x = -90;
    }
};

// Desenhe o inimigo na tela, método exigido pelo jogo
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Classe do jogador
let Player = function (x, y, velocidade) {
    this.x = x;
    this.y = y;
    this.velocidade = velocidade;
    this.sprite = 'images/char-cat-girl.png';
    this.life = 5;
    this.canWalk = true;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (movimento) {
    // Movimentos com tratamento de colisão com o limite do mapa
    if (this.canWalk) {
        if (movimento === 'left' && this.x > 10) {
            this.x -= this.velocidade;
        } else if (movimento === 'up') {
            this.y -= this.velocidade;
        } else if (movimento === 'right' && this.x < 403) {
            this.x += this.velocidade;
        } else if (movimento === 'down' && this.y < 385) {
            this.y += this.velocidade;
        }
    }
}

// Variáveis de posicionamento e quantidade de inimigos
const enemyX = -90;
let enemyInitialY = -24;
const yIncrement = 84;
const enemyY = (n) => (enemyInitialY + (yIncrement * n));
let totalEnemies = 3;

// Criando o objeto player
let player = new Player(203, 345, 40);

// Criando os objetos inimigos
let allEnemies = [];
const startEnemies = () => {
    // Variável de controle para evitar a criação de inimigos fora das ruas de pedra
    let num = 0;
    for (let i = 0; i < totalEnemies; i++) {
        let enemySpeed = Math.round(Math.random() * 200 * ((score + 1) / 2)) + 80;
        // Se num for múltiplo de 3 e não for 0, iguala num a zero
        if ((num % 3 === 0) && (num != 0)) {
            num = 0;
        }
        allEnemies[i] = new Enemy(enemyX, enemyY(num + 1), enemySpeed);
        // Se num não for múltiplo de 3 ou for 0, incrementa o num
        if ((num % 3 != 0) || (num === 0)) {
            num++;
        }
    }
}

// Capturando as posições X e Y dos inimigos
let eX = [];
let eY = [];
const getEnemyXY = () => {
    for (let j = 0; j < allEnemies.length; j++) {
        eX[j] = Math.round(allEnemies[j].x);
        eY[j] = Math.round(allEnemies[j].y);
    }
}

// Isto reconhece cliques em teclas e envia as chaves para seu
// jogador. método handleInput(). Não é preciso mudar nada.
document.addEventListener('keydown', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});