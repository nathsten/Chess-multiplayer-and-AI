/**
 * @returns {string}
 */
const genGamePin = () => {
    let pin = "";
    const chars = "qwertyuiopasdfghjklzxcvbnm123456789";
    const rnd = () => Math.floor(Math.random() * chars.length);
    for(var i = 0; i < 5; i++){
        pin += chars[rnd()];
    }
    return pin;
}

const startPossition = `br,18/bk,28/bb,38/bQ,48/bK,58/bb,68/bk,78/br,88/bp,17/bp,27/bp,37/bp,47/bp,57/bp,67/bp,77/bp,87/wr,11/wk,21/wb,31/wQ,41/wK,51/wb,61/wk,71/wr,81/wp,12/wp,22/wp,32/wp,42/wp,52/wp,62/wp,72/wp,82`;

module.exports = { genGamePin, startPossition };