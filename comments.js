const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const postDetails=document.getElementById('post-details')
const loader=document.getElementById('loading-spinner')
const commentList=document.getElementById('comments-list')

async function loadComments() {
    if(!id){
        postDetails.innerHTML='<h2>No id provided</h2>'
        loader.style.display='none'
        return;
    }
    try{
        const postRes=await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        const postData=await postRes.json()
        console.log("reach");
        
        postDetails.innerHTML=`
        <h1>${postData.title}</h1>
        <p class="story-meta">
        <span class="meta-item">Author: <a href="" class="indiv">${postData.by}</a></span> |
        <span class="meta-item">Points: ${postData.score}</span> |
        <span class="meta-item">${timeAgo(postData.time)}</span>
        </p>
        <h3><a href="" class="indiv">${postData.url}</a> </h3>
        `
        loader.style.display='none'
        if (!postData.kids || postData.kids.length === 0) {
            commentsList.innerHTML = '<li>No comments yet.</li>';
            return;
        }
        const bring=postData.kids.slice(0,5);
        const fetchPromises = bring.map(id => 
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        );
        const fetcherN = await Promise.all(fetchPromises);
        const fetcher=Array.from(fetcherN)
        fetcher.forEach(e => {
            if (!e || e.deleted || e.dead) return;
            const li=document.createElement('li')
            li.style.marginBottom = "20px";
            li.style.borderBottom = "1px solid #ddd";
            li.style.paddingBottom = "15px";
            li.innerHTML=`
            <div style="font-size: 0.85em; color: gray; margin-bottom: 8px;">
                    <strong>by <a href='#' class="indiv">${e.by} </a></strong>  ${timeAgo(e.time)}
                </div>
                <div style="font-size: 0.95em;">
                    ${e.text} 
                </div>`
            commentList.appendChild(li)
        });
    }catch(error){
        console.log("error: "+error)
    }
}
loadComments()
