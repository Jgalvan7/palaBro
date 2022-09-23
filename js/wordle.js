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
let colorCheck = [];
let colorLetter = [];

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
    // Rellenamos el array de colorCheck para comprobar si la letra ya fue chequeada y el array de color Letter para pintar las letras tras la comprobación
    for(p in wordToQuest) {
        colorCheck.push("grey");
        colorLetter.push("grey");
    }
    // Creamos un array para saber la cantidad que hay de cada letra en la palabra secreta
    let countLetterQuest = wordToQuest.reduce((count,item) => {
        if(!count[item]) {
            count[item] = 1;
        } else {
            count[item]++;
        }
        return count;
    },[]);
    // Creamos un array para saber la cantidad que hay de cada letra en la palabra introducida
    let countLetterAnswer = myAnswer.reduce((count,item) => {
        if(!count[item]) {
            count[item] = 1;
        } else {
            count[item]++;
        }
        return count;
    },[]);
    // Establecemos el número de intentos que llevamos
    if(attempts < 5) {
        attempts += 1;
    }
    //Recorremos la palabra secreta con un ciclo for para ir comprobando las letras y saber de que color debemos pintarlas
    for( let i = 0; i < wordToQuest.length; i++ ) {
        switch(true) {
            // Caso de que la letra esta en la posición correcta
            case myAnswer[i] === wordToQuest[i]:
                colorLetter[i] = "green";
                colorCheck[i] = "green";
                break;
            // Caso en que la letra existe en la palabra secreta pero no está en la posisción correcta
            case wordToQuest.includes(myAnswer[i]):
                // Averiguamos la posicion de la letra introducida en la palabra secreta, para lo que creamos un array donde guardaremos las posiciones donde la letra introduicida coindide cin una letra de la palabra secreta
                let positionLetter = [];
                for(position in wordToQuest) {
                    let letterAdd = wordToQuest[position];
                    if(letterAdd === myAnswer[i] ) {
                        positionLetter.push(position);
                    }
                }
                // Recorremos el aray para saber de que color debemos pintar la letra
                for(p of positionLetter) {
                    // Primero confirmamos que en la posicion correcta de la letra efectivamente no coincidirá
                    if(myAnswer[p] != wordToQuest[p]) {
                        // Comprobamos que en el array de colores esa pposicion aún no ha sido comprobada
                        if(colorCheck[p] == "grey") {
                            if(countLetterAnswer[myAnswer[i]] != 0 && countLetterQuest[myAnswer[i]] != 0) {
                                countLetterAnswer[myAnswer[i]]--;
                                if(countLetterQuest[myAnswer[i]] >= 1) {
                                    colorCheck[p] = "yellow";
                                    colorLetter[i] = "yellow";
                                    countLetterQuest[myAnswer[i]]--;
                                    positionLetter.pop();
                                }
                            }
                        }
                    }
                }
                break;
        }
    }
    // Damos color a las letras tras su comprobación
    colorLetter.map((color, id) => {
        const item = document.getElementById(`${attempts - 1}-${id}`);
        item.classList.add(color);
    });
    // Comprobamos si las palabras coinciden, sies asi llamamos a la funcion win
    if(myAnswer.join("") === wordToQuest.join("")){
        winGame();
        return;
    }
    // Comprobamos cuantos intentos lleva para saber si puede seguir jugan o ya no le quedan intentos y a perdido el juego
    if(attempts === 6) {
        lostGame();
    }
    // Borramos los arrays para la proxima vez que comprobemos la palabra
    myAnswer = [];
    colorCheck = [];
    colorLetter = [];
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
    TextWin.textContent = `Enhorabuena, has acertado la palabra en ${attempts} intento/s.`;
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
