const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const postDetails=document.getElementById('post-details')
const loader=document.getElementById('loading-spinner')
const commentList=document.getElementById('comments-list')
const BATCH_SIZE = 3;
let commentIds = [];
let currentIndex = 0;
let loading = false;
async function loadComments() {
    if(!id){
        postDetails.innerHTML='<h2>No id provided</h2>'
        if(loader!=null)loader.style.display='none'
        return;
    }
    try{
        const postRes=await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        const postData=await postRes.json()
        console.log("reach");
        
        postDetails.innerHTML=`
        ${postData.title ?`
        <h1>${postData.title}</h1>`:''}
        <p class="story-meta">
        <span class="meta-item">Author: <a href="users.html?id=${postData.by}" class="indiv">${postData.by}</a></span> |
        ${postData.score ?
        `<span class="meta-item">Points: ${postData.score}</span> |`:
        ""}
        <span class="meta-item">${timeAgo(postData.time)}</span>
        </p>
        ${postData.url ?`
        <h3><a href="${postData.url}" class="indiv">${postData.url}</a> </h3>`:''}
        ${postData.text?`<h3>${postData.text}?</h3>`:
            ""
        }
        `
        loader.style.display='none'

        document.getElementById('counter').innerText=`Comments (${postData.kids.length})`
        if (!postData.kids || postData.kids.length === 0) {
            commentsList.innerHTML = '<li>No comments yet.</li>';
            return;
        }
        const list = document.getElementById('comments-list');
        commentIds = postData.kids;
        currentIndex = 0;
        // for(const  toplvlid of postData.kids){
        //     await renderComment(toplvlid,list,0)
        // }
        await loadNextBatch();
        observer.observe(sentinel);
    }catch(error){
        console.log("error: "+error)
    }
}
async function loadNextBatch() {
    if(loading) return;
    loading=true;
    let start=currentIndex;
    let end= Math.min(currentIndex+BATCH_SIZE,commentIds.length)
    await Promise.all(
        commentIds.slice(start, end).map(id => renderComment(id, commentList, 0))
    );
    // for (let i = start; i < end; i++) {
    //     await(renderComment(commentIds[i], commentList, 0));
        
    // }
    currentIndex = end;
    loading=false;
    if (currentIndex >= commentIds.length) {
        observer.disconnect();
    }
}
async function renderComment(id,list,depth){
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const comment = await response.json()
    if(!comment||comment.deleted||comment.dead){
        return
    }
    const li=document.createElement('li')
    li.classList.add("comment");
    li.style.listStyle='none'
    li.style.marginTop = "15px";
    li.style.marginBottom = "15px";
    const commentBody = document.createElement('div');
    commentBody.innerHTML=`
    <div style="font-size: 0.85em; color: gray; margin-bottom: 8px;">
        <strong>${comment.kids?.length ? '<span class="toggle">⬇ |</span>' : ''}  
        by <a href='users.html?id=${comment.by}' class="indiv">${comment.by} </a></strong>  ${timeAgo(comment.time)}
    </div>
    <div class="comment-text" style="font-size:0.95em;">
    ${comment.text}
    </div>`
    li.appendChild(commentBody)
    
    if(comment.kids && comment.kids.length>0){
        const replies=document.createElement('ul')
        replies.style.borderLeft = "1px solid #544e4e"; 
        replies.style.marginLeft = "10px"; 
        replies.style.marginBottom = "15px";  
        replies.style.paddingLeft = "15px";
        await Promise.all(
            comment.kids.map(child =>
                renderComment(child, replies, depth + 1)
            )
        );
        // for(const child of comment.kids){
        //     await renderComment(child,replies,depth+1)
        // }
        const z=commentBody.querySelector('.toggle');
        const text=commentBody.querySelector('.comment-text')
        z.addEventListener("click", () => {
            const collapsed=replies.style.display === "none"
            if (collapsed) {
                replies.style.display = "";
                text.style.display="";
                z.textContent = "⬇";
            } else {
                replies.style.display = "none";
                text.style.display="none";
                z.textContent = "➡";
            }
        });
        li.appendChild(replies)
    }
    list.appendChild(li)
}
document.addEventListener('DOMContentLoaded', loadComments);