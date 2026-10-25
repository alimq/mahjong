import readline from 'node:readline/promises';

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
}

function checkFourCombs(count) {
    let mn=-1;
    for(let i=0;i<46; i++) {
        if(count[i]<0) {
            return false;
        }
    }
    for(let i=0;i<46;i++) {
        if(count[i]>0) {
            mn=i;
            break;
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
let player=Math.floor(Math.random()*4);
console.log(`You are player ${player}`);
let iter=0,i=0,winner=0;
const rl=readline.createInterface({input: process.stdin,output:process.stdout});
while(wall.length>0) {
    if(iter>0) {
        hands[i].push(wall.pop());
    }
    if(isWinning(hands[i])) {
        console.log("Player " + i + " won!");
        console.log('Hand of ' + i);
        console.log(hands[i].map(humanReadable).join(', '));
        console.log('\n');
        winner=1;
        break;
    }
    if(i!=player) {
        hands[i].splice(Math.floor(Math.random()*hands[i].length),1);
    }   else {
        hands[i].sort((a,b)=>a-b);
        console.log('Your hand:');
        console.log(hands[i].map((t,k)=>`${k}:${humanReadable(t)}`).join(', '));
        console.log('\n');
        const answer = await rl.question('Input the index of the tile to remove\n');
        hands[i].splice(Number(answer),1);
    }
    hands[i].sort((a,b)=>a-b);
    iter+=1;
    i=(i+1)%4;
}
rl.close();
if(!winner)
    console.log(`Tie! The wall is empty. You have made ${iter} turns`);