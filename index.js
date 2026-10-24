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

