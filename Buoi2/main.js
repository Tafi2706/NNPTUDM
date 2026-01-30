async function GetData() {
    try {
        let res = await fetch('http://localhost:3000/posts')
        if (res.ok) {
            let posts = await res.json();
            let bodyTable = document.getElementById('body-table');
            bodyTable.innerHTML = '';
            for (const post of posts) {
                bodyTable.innerHTML += convertObjToHTML(post)
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function getNextId() {
    try {
        let res = await fetch('http://localhost:3000/posts');
        if (res.ok) {
            let posts = await res.json();
            if (posts.length === 0) {
                return "1";
            }
            // Find max ID and add 1
            let maxId = Math.max(...posts.map(p => parseInt(p.id) || 0));
            return (maxId + 1).toString();
        }
        return "1";
    } catch (error) {
        console.log(error);
        return "1";
    }
}

async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("views_txt").value;

    if (!id) {
        id = await getNextId();
    }

    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {

        let existingPost = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views,
                isDeleted: existingPost.isDeleted || false
            })
        })
    } else {

        let res = await fetch('http://localhost:3000/posts', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views,
                isDeleted: false
            })
        })
    }
    // Clear form
    document.getElementById("id_txt").value = '';
    document.getElementById("title_txt").value = '';
    document.getElementById("views_txt").value = '';

    GetData();
    return false;
}

function convertObjToHTML(post) {
    let deletedStyle = post.isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
    let actionButton = post.isDeleted
        ? `<input type='button' value='Restore' onclick='Restore(${post.id})'>`
        : `<input type='button' value='Delete' onclick='Delete(${post.id})'>`;

    return `<tr ${deletedStyle}>
    <td>${post.id}</td>
    <td>${post.title}</td>
    <td>${post.views}</td>
    <td>${actionButton}</td>
    </tr>`
}

async function Delete(id) {

    let getItem = await fetch('http://localhost:3000/posts/' + id);
    if (getItem.ok) {
        let post = await getItem.json();
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        })
        if (res.ok) {
            GetData()
        }
    }
    return false;
}

async function Restore(id) {

    let res = await fetch('http://localhost:3000/posts/' + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: false
        })
    })
    if (res.ok) {
        GetData()
    }
    return false;
}

async function GetComments() {
    try {
        let res = await fetch('http://localhost:3000/comments')
        if (res.ok) {
            let comments = await res.json();
            let bodyTable = document.getElementById('comments-body-table');
            bodyTable.innerHTML = '';
            for (const comment of comments) {
                bodyTable.innerHTML += convertCommentToHTML(comment)
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function getNextCommentId() {
    try {
        let res = await fetch('http://localhost:3000/comments');
        if (res.ok) {
            let comments = await res.json();
            if (comments.length === 0) {
                return "1";
            }

            let maxId = Math.max(...comments.map(c => parseInt(c.id) || 0));
            return (maxId + 1).toString();
        }
        return "1";
    } catch (error) {
        console.log(error);
        return "1";
    }
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value.trim();
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;


    if (!id) {
        id = await getNextCommentId();
    }

    let getItem = await fetch('http://localhost:3000/comments/' + id);
    if (getItem.ok) {

        let existingComment = await getItem.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                text: text,
                postId: postId,
                isDeleted: existingComment.isDeleted || false
            })
        })
    } else {

        let res = await fetch('http://localhost:3000/comments', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                text: text,
                postId: postId,
                isDeleted: false
            })
        })
    }


    document.getElementById("comment_id_txt").value = '';
    document.getElementById("comment_text_txt").value = '';
    document.getElementById("comment_postId_txt").value = '';

    GetComments();
    return false;
}

function convertCommentToHTML(comment) {
    let deletedStyle = comment.isDeleted ? 'style="text-decoration: line-through; opacity: 0.6;"' : '';
    let actionButton = comment.isDeleted
        ? `<input type='button' value='Restore' onclick='RestoreComment(${comment.id})'>`
        : `<input type='button' value='Delete' onclick='DeleteComment(${comment.id})'>`;

    return `<tr ${deletedStyle}>
    <td>${comment.id}</td>
    <td>${comment.text}</td>
    <td>${comment.postId}</td>
    <td>${actionButton}</td>
    </tr>`
}

async function DeleteComment(id) {

    let getItem = await fetch('http://localhost:3000/comments/' + id);
    if (getItem.ok) {
        let comment = await getItem.json();
        let res = await fetch('http://localhost:3000/comments/' + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isDeleted: true
            })
        })
        if (res.ok) {
            GetComments()
        }
    }
    return false;
}

async function RestoreComment(id) {

    let res = await fetch('http://localhost:3000/comments/' + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: false
        })
    })
    if (res.ok) {
        GetComments()
    }
    return false;
}
GetData();
GetComments();