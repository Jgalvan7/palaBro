// Titulo del juego
const ContainerTitle = document.querySelector("#containerTitle");
const TitleGame = document.createElement("img");
TitleGame.id = "titleGame";
TitleGame.className = "titleGame";
TitleGame.src = "../assets/images/palabro_simple.png";
ContainerTitle.appendChild(TitleGame);

// Accedemos al contenedor donde crearemos el juego
const ContainerGame = document.getElementById("game");

// Creamos las etiquetas HTML que necesitaremos para desarrollar el juego
const ContainerWord = document.createElement("article");
ContainerWord.id = "grid";
ContainerWord.className = "containerWordHidden";
const Keyboard = document.createElement("article");
Keyboard.id = "keyboard";
Keyboard.className = "containerKeyboard";
const ContainerMenu = document.createElement("span");
ContainerMenu.id = "modal";
ContainerMenu.className = "modalMenu hidden";
const menu = document.createElement("section");
menu.id = "menu";
menu.classList = "menu";
const ContainerMenuWord = document.createElement("article");
ContainerMenuWord.id = "ContainerMenuWord";
ContainerMenuWord.className = "ContainerMenuWord hidden";
const ContainerText = document.createElement("article");
ContainerText.className = "menu__text";
const ContainerBtn = document.createElement("article");
ContainerBtn.className = "menu__btn";
const BtnNewGame = document.createElement("button");
BtnNewGame.id = "btnNewGame";
BtnNewGame.className = "menu__btn--new";
BtnNewGame.textContent = "Nuevo juego";
BtnNewGame.onclick = () => {
    location.reload();
};
const BtnExitGame = document.createElement("button");
BtnExitGame.id = "btnExitGame";
BtnExitGame.className = "menu__btn--exit";
BtnExitGame.textContent = "Salir";
BtnExitGame.onclick = () => {
    location.href="./index.html";
};
ContainerBtn.append(BtnNewGame,BtnExitGame);
ContainerMenu.appendChild(menu);
ContainerGame.append(ContainerWord,Keyboard,ContainerMenu);

// Creamos la palabra oculta y los intentos para adivinarla
const WordBase = [
    ["pato","rana","loro","vaca","mono","raton","cebra","mosca","oso","abeja","perro","gato","cerdo","zorro"],
    ["azul","rosa","rojo","negro","verde","gris","blanco"],
    ["papa","mama","prima","primo","tito","abuelo","abuela"],
    ["arbol","lapiz","avion","letra","libro","reloj","coche","viaje","jugar","mesa","leer","letras","viajar","correr","futbol","juegos","pintar","cantar","bailar","reirse","musica","planta"]
];
const newWord = () => {
    let base1 = aleatorio(1,4);
    let dimensionOne = base1 - 1;
    let max = WordBase[dimensionOne].length;
    let base2 = aleatorio(1,max);
    let wordSelected = base2 - 1;
    let word = WordBase[dimensionOne][wordSelected];
    let secretWord = word.split("");
    for(letter of secretWord) {
        wordToQuest.push(letter.toUpperCase());
    }
}
const wordToQuest = [];
newWord();
let attempts = 0;
const rows = [];
for(let row = 0; row < 5; row++) {
    const ListWordHidden = document.createElement("ul");
    ListWordHidden.className = "wordHiddenList";
    for(let column = 0; column < wordToQuest.length; column++) {
        const ListWordHiddenItem = document.createElement("li");
        ListWordHiddenItem.className = "wordHiddenList__item";
        ListWordHiddenItem.id = `${row}-${column}`;
        ListWordHidden.appendChild(ListWordHiddenItem);
    }
    rows.push(ListWordHidden);
}
ContainerWord.append(...rows);

// Creamos los array para poner el keyboard en pantalla
const KeyboardLetters = [
    ["q","w","e","r","t","y","u","i","o","p"],
    ["a","s","d","f","g","h","j","k","l"],
    ["enter","z","x","c","v","b","n","m","delete"]
];
const ListElements = [];
let myAnswer = [];
let positions = [];

// Creamos el keyaboard en la pantalla
KeyboardLetters.map((letters) => {
    const List = document.createElement("ul");
    List.className = "listLetters";
    letters.map((letter) => {
        const ListItem = document.createElement("li");
        ListItem.className = "listLetters__item";
        ListItem.innerHTML = `
            <button onclick="pressLetter()" id=${letter.toUpperCase()} class="buttonKeyboard" >${letter.toUpperCase()}</button>
        `;
        List.appendChild(ListItem);
    });
    ListElements.push(List);
});
Keyboard.append(...ListElements);

// Funciones para los botones de las letras
// Capturamos la letra pulsada
const pressLetter = () => {
    const button = event.target;
    switch(button.id){
        case "ENTER":
            checkWord();
            break;
        case "DELETE":
            deleteLetter();
            break;
        default:
            if(myAnswer.length < wordToQuest.length) {
                const currentItem = document.getElementById(`${attempts}-${myAnswer.length}`)
                currentItem.textContent = button.id;
                myAnswer.push(button.id);
            }
            break;
    }
}
// Comprobamos la palabra
const checkWord = () => {
    if(attempts < 5) {
        attempts += 1;
    }
    for( let i = 0; i < wordToQuest.length; i++ ) {
        switch(true) {
            case myAnswer[i] === wordToQuest[i]:
                positions.push("green");
                break;
            case wordToQuest.includes(myAnswer[i]):
                for(position in wordToQuest) {
                    positionLetter = wordToQuest[position];
                    if(positionLetter === myAnswer[i]){
                        let colorPosition = wordToQuest.indexOf(positionLetter,position);
                        if(positions[colorPosition] != "green" && positions[colorPosition] != "yellow") {
                            positions.push("yellow");
                        } else {
                            let countLetter = wordToQuest.reduce((count,item) => {
                                if(!count[item]) {
                                    count[item] = 1;
                                } else {
                                    count[item]++;
                                }
                                return count;
                            },{});
                            if(countLetter[myAnswer[i]] === 1){
                                positions.push("grey");
                            }
                        }
                    }
                }
                break;
            default:
                positions.push("grey");
                break;
        }
    }
    positions.map((color, id) => {
        const item = document.getElementById(`${attempts - 1}-${id}`);
        item.classList.add(color);
    });
    if(myAnswer.join("") === wordToQuest.join("")){
        //const Palabro = myAnswer.join("");
        winGame();
        return;
    }
    if(attempts === 5) {
        lostGame();
    }
    myAnswer = [];
    positions = [];
}
// Borramos una letra
const deleteLetter = () => {
    myAnswer.pop();
    const deleteItem = document.getElementById(`${attempts}-${myAnswer.length}`)
    deleteItem.textContent = "";
}

// Creamos el menú para cuando finalizamos el juego
function winGame() {

    ContainerMenu.classList.remove("hidden");
    ContainerMenuWord.classList.remove("hidden");
    menu.append(ContainerMenuWord,ContainerText,ContainerBtn);
    const ListWord = document.createElement("ul");
    ListWord.className = "winnerWord";
    for(letter of myAnswer) {
        const ListWordItem = document.createElement("li");
        ListWordItem.className = "winnerWord__item green";
        ListWordItem.textContent = letter;
        ListWord.appendChild(ListWordItem);
    }
    ContainerMenuWord.append(ListWord);
    const TextWin = document.createElement("p");
    TextWin.textContent = `Enorabuena, has acertado la palabra en ${attempts} intento/s.`;
    ContainerText.append(TextWin);
}
function lostGame() {
    ContainerMenu.classList.remove("hidden");
    ContainerMenuWord.classList.remove("hidden");
    menu.append(ContainerMenuWord,ContainerText,ContainerBtn);
    const ListWord = document.createElement("ul");
    ListWord.className = "winnerWord";
    for(letter of wordToQuest) {
        const ListWordItem = document.createElement("li");
        ListWordItem.className = "winnerWord__item grey";
        ListWordItem.textContent = letter;
        ListWord.appendChild(ListWordItem);
    }
    ContainerMenuWord.append(ListWord);
    const TextlostGame = document.createElement("p");
    TextlostGame.textContent = "Esta era la palabra correcta. Lo siento no te quedan mas intentos.";
    ContainerText.append(TextlostGame);
}

function aleatorio(min, max) {
    var resultado = Math.floor(Math.random() * (max - min + 1)) + min;
    return resultado;
}
