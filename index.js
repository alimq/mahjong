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
    console.log(hands[i].map(humanReadable).join(', '));
    console.log('\n');
}

function checkFourCombs(count) {
    let mn=-1;
    for(let i=0;i<46;i++) {
        if(count[i]>0) {
            mn=i;
            break;
        }
        if(count[i]<0) {
            return false;
        }
    }
    if(mn==-1) return true;
    count[mn]-=3;
    let pong=checkFourCombs(count);
    count[mn]+=3;
    count[mn]-=1;
    count[mn+1]-=1;
    count[mn+2]-=1;
    let chow=checkFourCombs(count);
    count[mn]+=1;
    count[mn+1]+=1;
    count[mn+2]+=1;
    return pong || chow;
}

function isWinning(hand) {
    let count=Array(50).fill(0);
    for(let i=0;i<hand.length;i++)
        count[hand[i]]++;
    for(let i=0;i<46;i++) {
        if(count[i]>=2) {
            count[i]-=2;
            if(checkFourCombs(count)) {
                return true;
            }
            count[i]+=2;
        }
    }
    return false;
}