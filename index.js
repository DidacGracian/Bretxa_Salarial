const gameTimeDona = 25000;
const gameTimeHome = 9000;
var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;
var refresh = true;
var genere = true; // true dona, false home

var showObstacle = false;

var time = new Date();
var fechaInicio = new Date();
var deltaTime = 0;

if (/Mobi|Android/i.test(navigator.userAgent)) {
    alert("Lo siento, este juego solo funciona en ordenadores.");
  }

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}

if (localStorage.getItem('restartGame')) {
    startGame();
}

document.addEventListener("touchend", function (event) {
    Saltar();
});

// Función para refrescar la página
function refrescarPagina() {
    location.reload();
}

// Función para detener la actualización
function detenerActualizacion() {
    clearInterval(intervalId);
}

// Configuración del intervalo de actualización
var intervalo = 5000; // 5000 ms = 5 segundos
var intervalId = setInterval(function () {
    if (refresh) {
        refrescarPagina();
    } else {
        detenerActualizacion();
    }
}, intervalo);

function selectSex(genere) {
    this.refresh = false;
    this.genere = genere;
    startGame()
}

function startGame() {
    time = new Date();
    setInterval(console.log("waiting..."), 10000);
    let element = document.querySelector('.showMenu');
    element.style.display = 'none';
    element = document.querySelector('.showGame');
    element.style.display = 'block';
    element = document.querySelector('.dino');
    var whoRun = document.querySelector(".dino-corriendo");
    if (!this.genere) {
        whoRun.style.animationName = "animarHome";
        element.style.backgroundPositionY = "-12px";
    } else {
        whoRun.style.animationName = "animarDona";
        element.style.backgroundPositionY = "-57px";
    }

    element.style.display = 'block';
    showObstacle = true;
}

function restarGame() {
    localStorage.setItem('restartGame', ture);
    location.reload()
}

function startMenu() {
    location.reload()
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

function inicializeObjects() {
    tiempoHastaObstaculo = 2;
    tiempoObstaculoMin = 0.7;
    tiempoObstaculoMax = 1.8;
    obstaculoPosY = 16;
    obstaculos = [];
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
    document.addEventListener("touchstart", HandleKeyDown);
}

function Update() {
    if (parado) return;
    if (showObstacle) {
        TimeWin();
        MoverDinosaurio();
        MoverSuelo();
        if (genere) {
            DecidirCrearObstaculos();
            MoverObstaculos();
            DetectarColision();
        }
        DecidirCrearNubes();
        MoverNubes();
    }

    velY -= gravedad * deltaTime;
}

function TimeWin() {
    var fechaActual = new Date();
    if (genere) {
        if ((fechaActual - fechaInicio) >= gameTimeDona) { // Compara las fechas (en milisegundos)
            win();
        }
    } else {
        if ((fechaActual - fechaInicio) >= gameTimeHome) { // Compara las fechas (en milisegundos)
            win();
        }
    }

}
function HandleKeyDown(ev) {
    Saltar();
}

function Saltar() {
    if (dinoPosY === sueloY) {
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if (dinoPosY < sueloY) {
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY + "px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if (saltando) {
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("murPetit");
    if (Math.random() > 0.5) obstaculo.classList.add("murGran");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

function eliminarObstaculos() {
    for (var i = 0; i < obstaculos.length; i++) {
        var obstaculo = obstaculos[i];
        obstaculo.remove();
    }
    obstaculos.splice(0, obstaculos.length);
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}

function eliminarNubes() {
    for (var i = 0; i < nubes.length; i++) {
        var nube = nubes[i];
        nube.remove();
    }
    nubes.splice(0, nubes.length);
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if (score == 5) {
        gameVel = 1.3;
    } else if (score == 7) {
        gameVel = 1.5;
    } else if (score == 11) {
        gameVel = 1.7;
    } else if (score == 17) {
        gameVel = 2.0;
    } else if (score == 20) {
        gameVel = 2.3;
    } else if (score == 23) {
        gameVel = 2.5;
    } else if (score == 25) {
        gameVel = 3.0;
    }


    suelo.style.animationDuration = (3 / gameVel) + "s";
}

function win() {
    parado = true;
    const textoOriginal = document.getElementById('texto-original');
    const textoOriginal2 = document.getElementById('texto-original2');
    eliminarNubes();
    dino.classList.remove("dino-corriendo");
    dino.classList.remove("container");
    var winDona = document.querySelector(".winDona");
    if (genere) {
        eliminarObstaculos();
        winDona.style.display = "block";
        textoOriginal.textContent = "Sou mig d’una dona: 1.604,83€/bruts.";
        textoOriginal2.textContent = " Un 18,73% menys que un home.";
    } else {
        dino.classList.remove("dino-corriendo");
        var winHome = document.querySelector(".winDona");
        winHome.style.display = "block";
        textoOriginal.textContent = "Sou mig d’un home: 1.974,46€/bruts. ";
        textoOriginal2.textContent = " Un 18,73% més que una dona.";
    }

    setTimeout(() => {
        textoOriginal.textContent = "22 de febrer: Dia de la igualtat salarial entre homes i dones.";
        textoOriginal2.textContent = "💵 TRENQUEM AMB LA BRETXA SALARIAL, EQUILIBREM LA BALANÇA!⚖️";
    }, 5000);
}

function GameOver() {
    Estrellarse();
    gameOver.style.display = "block";
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        } else {
            if (IsCollision(dino, obstaculos[i], 10, 3, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}