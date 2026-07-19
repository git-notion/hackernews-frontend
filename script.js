let data=[]
let currPage=1;
const ppg= 25
//writing one to combine all
async function fetchall(e){
    const list=document.querySelector('.story')
    const load=document.getElementById('loader')
    document.getElementById(e).style.color="rgb(251 ,146 ,60)"
    list.style.display = 'none';
    // document.querySelector('.pagination-controls').style.display = 'none';
    load.style.display = 'block';
    try{
        const rep=await fetch(`https://hacker-news.firebaseio.com/v0/${e}stories.json?print=pretty`)
        data=await rep.json()
        currPage=1
        await renderPage()
    }catch(error){
        console.log("error caught:  "+error);
        
    }
}
async function renderPage() {
    const list = document.querySelector('.story');
    const load = document.getElementById('loader');
    
    list.replaceChildren();
    list.style.display = 'none';
    load.style.display = 'block';
    list.replaceChildren()
    list.style.display='none';
    load.style.display='block'
    try{
        const stridx=(currPage-1)*ppg
        const endidx=stridx+ppg
        const pgids=data.slice(stridx,endidx)
        const storyPromises = pgids.map(id => 
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        );
        const storiesData = await Promise.all(storyPromises);
        storiesData.forEach(trudata => {
            if (!trudata) return; 
            
            const item = document.createElement('li');
            item.style.borderBottom = "1px solid #ddd";
            item.innerHTML = `
            <div class="story-card">
                <h3><a href="${trudata.url}" target="_blank">${trudata.title}</a></h3>
                <p>Author: <a href="#" class="indiv">${trudata.by}</a></p>
                <p class="story-meta">
                    <span class="meta-item"><a href="comments.html?id=${trudata.id}" class="indiv" id="comms">${trudata.descendants || 0} comments</a></span> |
                    <span class="meta-item">Points: ${trudata.score}</span> |
                    <span class="meta-item">${timeAgo(trudata.time)}</span>
                </p>
            </div>
            `;

            list.appendChild(item);
        });

        // Update the pagination UI
        //updatePaginationUI();
    }catch (error) {
        console.log("Error loading page:", error);
    } finally {
        load.style.display = 'none';
        list.style.display = 'block';
        //document.querySelector('.pagination-controls').style.display = 'block';
    }
}

document.getElementById('best').addEventListener('click',function(){
    const x= document.querySelectorAll('.nav-trs')
    x.forEach(e => {
        e.style.color="#e9e2e8"
    })
    const list=document.querySelector('.story')
    list.replaceChildren()
    fetchall('best')
})
document.getElementById('top').addEventListener('click',function(){
    const x= document.querySelectorAll('.nav-trs')
    x.forEach(e => {
        e.style.color="#e9e2e8"
    })
    const list=document.querySelector('.story')
    list.replaceChildren()
    fetchall('top')
})
fetchall('top')

document.getElementById('new').addEventListener('click',function(){
    const x= document.querySelectorAll('.nav-trs')
    x.forEach(e => {
        e.style.color="#e9e2e8"
    })
    const list=document.querySelector('.story')
    list.replaceChildren()
    fetchall('new')
})