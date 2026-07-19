const urlPms = new URLSearchParams(window.location.search);
const id1 = urlPms.get('id');
const userDetails=document.getElementById('user-details')
const ldr=document.getElementById('loading-spinner')
const submissions=document.getElementById('subm-list')

async function loadProfile(){
    if(!id1){
        userDetails.innerHTML='<h2>No id provided</h2>'
        if(ldr!=null)loader.style.display='none'
        return;
    }try{
        const userRes=await fetch(`https://hacker-news.firebaseio.com/v0/user/${id1}.json`)
        const user=await userRes.json()
        console.log("reach");
        
        userDetails.innerHTML=`<div class="profile-card">
            <h1 style="color: rgb(251 146 60);">${user.id}'s profile</h1>
            <div class="profile-info">
                <p><strong>Joined:</strong> ${dateexact(user.created)}</p>
                <p><strong>Karma:</strong> ${user.karma}</p>
                ${
                    user.url
                        ? `<p><strong>Website:</strong> <a href="${user.url}" target="_blank" class="indiv">${user.url}</a></p>`
                        : ""
                }
                ${
                    user.about
                        ? `<div class="about">
                                <h3>About</h3>
                                <p>${user.about}</p>
                        </div>`
                        : "<p><em>No bio available.</em></p>"
                }
            </div>
        </div>`
        const postSubmissions=user.submitted
        console.log(postSubmissions);
        const lst=document.getElementById('subm-list')
        document.getElementById('subm').innerHTML=`Submissions (${postSubmissions.length})`
        for(const e of postSubmissions){
            renderPosts(e,lst)
        }
        ldr.style.display='none'
    }catch(error){
        console.log("error: is what"+error)
    }
}
async function renderPosts(e,lst){
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${e}.json`);
    const posts = await response.json()
    console.log(posts);
    
    if(!posts||posts.deleted||posts.dead){
        return
    }
    const li=document.createElement('li')
    li.id='each'
    li.classList.add("posts");
    li.style.listStyle='none'
    li.style.marginTop = "15px";
    li.style.marginBottom = "15px";
    const postsBody = document.createElement('div');
    if(posts.type=="comment"){
        postsBody.innerHTML=`
        <div style="font-size: 0.85em; color: gray; margin-bottom: 8px;">
            comment on <a href="comments.html?id=${posts.parent}" style="color:rgb(251 146 60);">#${posts.parent}</a> | ${timeAgo(posts.time)}
        </div>
        <div class="posts-text" style="font-size:0.95em;">
        ${posts.text}
        </div>`
    }else if(posts.type=='story'){
        postsBody.innerHTML=`
        <div style="font-size: 1.5em; margin-bottom: 8px;">
            ${posts.title}
        </div>
        <div class="posts-text" style="font-size: 0.85em; color: gray; margin-bottom: 8px;">
        <span class="meta-item" style="font-size: 0.85em; color: gray; margin-bottom: 8px;">
        <a href="comments.html?id=${posts.id}" class="indiv" id="comms" >
        ${posts.descendants || 0} comments</a></span> |
                    <span class="meta-item" style="font-size: 0.85em; color: gray; margin-bottom: 8px;">Points: ${posts.score}</span> |
                    <span class="meta-item" style="font-size: 0.85em; color: gray; margin-bottom: 8px;">${timeAgo(posts.time)}</span>
        </div>`
    }
    
    li.appendChild(postsBody)
    lst.appendChild(li)
}
loadProfile()