// Accedemos al contenedor donded crearemos el juego
const ContainerGame = document.getElementById("game");

// Creamos las etiquetas HTML que necesitaremos para desarrollar el juego
const ContainerWord = document.createElement("article");
ContainerWord.id = "grid";
ContainerWord.className = "containerWordHidden";
const Keyboard = document.createElement("article");
Keyboard.id = "keyboard";
Keyboard.className = "containerKeyboard";
ContainerGame.append(ContainerWord,Keyboard);

// Creamos la palabra oculta
const wordToQuest = ["j","e","s","u","s"];
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
const myAnswer = [];
let positions = [];

// Creamos el keyaboard en la pantalla
KeyboardLetters.map((letters) => {
    const List = document.createElement("ul");
    List.className = "listLetters";
    letters.map((letter) => {
        const ListItem = document.createElement("li");
        ListItem.className = "listLetters__item";
        ListItem.innerHTML = `
            <button onclick="pressLetter()" id=${letter} class="buttonKeyboard" >${letter}</button>
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
        case "enter":
            checkWord();
            break;
        case "delete":
            deleteLetter();
            break;
        default:
            if(myAnswer.length < wordToQuest.length) {
                myAnswer.push(button.id);
            }
            break;
    }
}
// Comprobamos la palabra
const checkWord = () => {
    if(myAnswer.join("") === wordToQuest.join("")){
        console.log("La palabra es correcta");
    } else {
        for( let i = 0; i < wordToQuest.length; i++ ) {
            switch(true) {
                case myAnswer[i] === wordToQuest[i]:
                    positions.push("green");
                    break;
                case wordToQuest.includes(myAnswer[i]):
                    positions.push("yellow");
                    break;
                default:
                    positions.push("grey");
            }
        }
    }
}
// Borramos una letra
const deleteLetter = () => {
    myAnswer.pop();
}
