function timeAgo(unixTimestamp) {
    const now = Date.now(); 
    const past = unixTimestamp * 1000; 
    const secondsAgo = Math.floor((now - past) / 1000);

    if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
    }
    
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} minutes ago`;
    }
    
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} hours ago`;
    }
    
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) {
        return `${daysAgo} days ago`;
    }
    
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
        return `${monthsAgo} months ago`;
    }
    
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo} years ago`;
}
async function topposts() {
    document.getElementById('top').style.color="rgb(251 ,146 ,60)"
    const list=document.querySelector('.story')
    try {
        const rep= await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
        const data=await rep.json()
        
        const firstTen=data.slice(0,10)
        for(const e of firstTen){
            const link=`https://hacker-news.firebaseio.com/v0/item/${e}.json?print=pretty`
            const r=await fetch(link)
            const trudata=await r.json()
            const item=document.createElement('li')

            item.innerHTML = `
            <div class="story-card">
                <h3><a href="${trudata.url}" target="_blank">${trudata.title}</a></h3>
                <p>Author: <a href="#" class="indiv">${trudata.by}</a><p>
                <p class="story-meta">
                    <span class="meta-item"><a href="#" class="indiv">${trudata.descendants} comments</a></span> |
                    
                    <span class="meta-item">Points: ${trudata.score}</span> |
                    
                    <span class="meta-item">${timeAgo(trudata.time)}</span>
                </p>
            </div>
            `;
            list.appendChild(item);
        };
    } catch (error) {
        console.log(error);
    }
}
topposts()


async function newposts() {
    document.getElementById('new').style.color="rgb(251 ,146 ,60)"
    const list=document.querySelector('.story')
    try {
        const rep= await fetch('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
        const data=await rep.json()
        
        const firstTen=data.slice(0,10)
        for(const e of firstTen){
            const link=`https://hacker-news.firebaseio.com/v0/item/${e}.json?print=pretty`
            const r=await fetch(link)
            const trudata=await r.json()
            const item=document.createElement('li')

            item.innerHTML = `
            <div class="story-card">
                <h3><a href="${trudata.url}" target="_blank">${trudata.title}</a></h3>
                <p>Author: <a href="#" class="indiv">${trudata.by}</a><p>
                <p class="story-meta">
                    <span class="meta-item"><a href="#" class="indiv">${trudata.descendants} comments</a></span> |
                    
                    <span class="meta-item">Points: ${trudata.score}</span> |
                    
                    <span class="meta-item">${timeAgo(trudata.time)}</span>
                </p>
            </div>
            `;
            list.appendChild(item);
        };
    } catch (error) {
        console.log(error);
    }
}


async function bestposts() {
    const list=document.querySelector('.story')
    document.getElementById('best').style.color="rgb(251 ,146 ,60)"
    try {
        const rep= await fetch('https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty')
        const data=await rep.json()
        
        const firstTen=data.slice(0,10)
        for(const e of firstTen){
            const link=`https://hacker-news.firebaseio.com/v0/item/${e}.json?print=pretty`
            const r=await fetch(link)
            const trudata=await r.json()
            const item=document.createElement('li')

            item.innerHTML = `
            <div class="story-card">
                <h3><a href="${trudata.url}" target="_blank">${trudata.title}</a></h3>
                <p>Author: <a href="#" class="indiv">${trudata.by}</a><p>
                <p class="story-meta">
                    <span class="meta-item"><a href="#" class="indiv">${trudata.descendants} comments</a></span> |
                    
                    <span class="meta-item">Points: ${trudata.score}</span> |
                    
                    <span class="meta-item">${timeAgo(trudata.time)}</span>
                </p>
            </div>
            `;
            list.appendChild(item);
        };
    } catch (error) {
        console.log(error);
    }
}
document.getElementById('best').addEventListener('click',function(){
    const x= document.querySelectorAll('.nav-trs')
    x.forEach(e => {
        e.style.color="#e9e2e8"
    })
    const list=document.querySelector('.story')
    list.replaceChildren()
    bestposts()
})
document.getElementById('top').addEventListener('click',function(){
    const x= document.querySelectorAll('.nav-trs')
    x.forEach(e => {
        e.style.color="#e9e2e8"
    })
    const list=document.querySelector('.story')
    list.replaceChildren()
    topposts()
})


document.getElementById('new').addEventListener('click',function(){
    const x= document.querySelectorAll('.nav-trs')
    x.forEach(e => {
        e.style.color="#e9e2e8"
    })
    const list=document.querySelector('.story')
    list.replaceChildren()
    newposts()
})