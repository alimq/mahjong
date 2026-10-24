const SUITS = ['Dots','Bamboo','Chars'];
const HONORS = {31:'E',33:'S',35:'W',37:'N',41:'R',43:'G',45:'Wh'};

function humanReadable(x) {
    if(x<30) return `${x%10} of ${SUITS[Math.floor(x/10)]}`;
    return HONORS[x] ?? '?';
}

const possible = [];
for(let s=0;s<3;s++)
    for(let n=1;n<=9;n++) possible.push(s*10+n);
possible.push(...Object.keys(HONORS).map(Number));

let wall=Array(4).fill(possible).flat();
for(let j=wall.length-1;j>=0;j--) {
    let i=Math.floor(Math.random()*(j+1));
    [wall[i],wall[j]]=[wall[j],wall[i]]
}
let hands=Array.from({length: 4}, ()=>wall.splice(0,13));
hands[0].push(wall.pop());
for(let i=0;i<4;i++) {
    hands[i].sort((a,b)=>a-b);
    console.log('Hand of ' + i);
    for(let j=0;j<hands[i].length;j++)
        console.log(humanReadable(hands[i][j]));
    console.log('\n');
}