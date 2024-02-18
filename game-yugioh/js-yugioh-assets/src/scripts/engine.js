const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprite: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
}

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
}

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [1],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId)

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();

    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {

    if(value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if(value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprite.avatar.src = "";
    state.cardSprite.name.innerText = "";
    state.cardSprite.type.innerText = "";
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose:${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        await playAudio(duelResults);
        state.score.playerScore++;
    } 

    if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = state.playerSides;
    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprite.avatar.src = cardData[index].img;
    state.cardSprite.name.innerText = cardData[index].name;
    state.cardSprite.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprite.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        audio.play();
    } catch {}
}

function init() {
    showHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();