const HIGHSCORES = [];

export async function saveHighScore(value) {
    HIGHSCORES.push(value);
    return value;
}

export async function loadHighScore() {
    return HIGHSCORES;
}
