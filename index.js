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

let msgTimer=null;
function displayHand(msg,hand) {
    let handEl=document.querySelector('#handEl');
    handEl.replaceChildren();
    for(let j=0;j<hand.length;j++) {
        let node=document.createElement('div');
        node.dataset.index=j;
        node.className='tile';
        node.style.backgroundImage=`url(tiles/${code}.png)`;
        handEl.append(node);
    }
    let msgEl=document.querySelector('#msgEl');
    clearTimeout(msgTimer);
    msgEl.textContent=msg;
    msgTimer=setTimeout(()=>msgEl.textContent='',5000);
}
let pendingResolve=null;
function waitForDiscard() {
    return new Promise(resolve=>{pendingResolve=resolve;});
}
let handEl=document.querySelector('#handEl');
handEl.addEventListener('click',e=>{
    const tile=e.target.closest('[data-index]');
    if(!tile || !pendingResolve) return;
    const resolve=pendingResolve;
    pendingResolve=null;
    resolve(Number(tile.dataset.index));
});

while(wall.length>0) {
    if(iter>0) {
        hands[i].push(wall.pop());
    }
    if(isWinning(hands[i])) {
        displayHand("Player " + i + " won!\nHand of " + i,hands[i]);
        winner=1;
        break;
    }
    if(i!=player) {
        hands[i].splice(Math.floor(Math.random()*hands[i].length),1);
    }   else {
        hands[i].sort((a,b)=>a-b);
        displayHand('Your hand:',hands[i]);
        const answer=await waitForDiscard();
        hands[i].splice(Number(answer),1);
    }
    hands[i].sort((a,b)=>a-b);
    iter+=1;
    i=(i+1)%4;
}
rl.close();
if(!winner)
    console.log(`Tie! The wall is empty. You have made ${iter} turns`);