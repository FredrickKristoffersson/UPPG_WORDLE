export function getRandomWord(length) {
    const SECRETWORD = {
        5: ["CYKEL", "MEDEL", "HOPPA", "BULLE", "SADEL"],
        6: ["ADDERA", "DAMSUG", "JODDLA", "PUTSAR"],
        7: ["MEDDELA", "BULLRAR", "PARKERA", "SLUMPAD", "BILDÄCK"],
    };
    const wordList = SECRETWORD[length];
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

// console.log(getRandomWord(7));
