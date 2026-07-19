const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const postDetails=document.getElementById('post-details')
const loader=document.getElementById('loading-spinner')
const commentList=document.getElementById('comments-list')

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
        const list = document.getElementById('comments-list');
        for(const  toplvlid of postData.kids){
            await renderComment(toplvlid,list,0)
        }
    }catch(error){
        console.log("error: "+error)
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
        by <a href='#' class="indiv">${comment.by} </a></strong>  ${timeAgo(comment.time)}
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
        for(const child of comment.kids){
            await renderComment(child,replies,depth+1)
        }
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