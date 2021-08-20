const booksUrl = 'http://localhost:3000/books'
const usersUrl = 'http://localhost:3000/users'

document.addEventListener("DOMContentLoaded", function() {
getBooks()
});

function getBooks() {
    fetch(booksUrl)
    .then(response => response.json())
    .then(data => data.forEach(book => renderBookToList(book)))
}

function renderBookToList(bookObj) {
    //create li element and append it to the DOM
    listUl = document.getElementById('list')
    const li = document.createElement('li')
    li.id = bookObj.id
    li.innerText = bookObj.title
    listUl.appendChild(li)

    //add and event listener that will render the book to the DOM
    li.addEventListener('click', (e) => {
        const showPanel = document.getElementById('show-panel')
        fetch(booksUrl + '/' + e.target.id)
        .then(response => response.json())
        .then(book => renderPanel(book))
    })
}

function renderPanel(bookObj) {
    const panel = document.getElementById('show-panel')
    panel.innerHTML = ''
    //create elements
    const bookDiv = document.createElement('div')
    const image = document.createElement('img')
    const title = document.createElement('h2')
    const subtitle = document.createElement('h3')
    const author = document.createElement('h4')
    const description = document.createElement('p')
    const likesUl = document.createElement('ul')

    //assign values to elements
    bookDiv.id = bookObj.id
    image.src = bookObj['img_url']
    title.innerText = bookObj.title
    subtitle.innerText = bookObj.subtitle
    author.innerText = bookObj.author
    description.innerText = bookObj.description
    likesUl.className = 'likes-ul'


    //append elements to the DOM
    panel.appendChild(image)
    panel.appendChild(title)
    panel.appendChild(subtitle)
    panel.appendChild(author)
    panel.appendChild(description)
    panel.appendChild(likesUl)
    createLikesButton(bookObj, panel)

    //create lis and append them to the DOM
    bookObj.users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        li.id = 'user' + user.id
        document.querySelector('.likes-ul').appendChild(li)
    })
}

function createLikesButton (bookObj, panel) {
    const likesBtn = document.createElement('input')
    likesBtn.id = 'likes-btn'
    likesBtn.type = 'button'
    likesBtn.value = 'LIKE'
    bookObj.users.forEach(user => {
        //1 works in this instance because I am user 1, but I would need to do this differently so I could generalize it.
        if(user.id === 1) {
            likesBtn.value = 'UNLIKE'
        }
    })
    panel.appendChild(likesBtn)
    //add an event listener to the likes button that updates the users who have liked it
    likesBtn.addEventListener('click', e => {
        if(likesBtn.value === 'LIKE') {
            likesBtn.value = 'UNLIKE'
            bookObjUpdate = {users: [...bookObj.users]}
            bookObjUpdate.users.push({id: 1, username: 'pouros'})
            console.log(bookObjUpdate)
            fetch(booksUrl + '/' + bookObj.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookObjUpdate)
            })
            .then(response => response.json())
            .then(book => renderPanel(book))
        }
        //     //working on this part. I don't know how to access an array within the users array, I could just update the whole bookObj, but then I'd need to delete it and then post the new object and it would have a new id. 
        //     likesBtn.value = 'LIKE'
        //     fetch(booksUrl + '/' + bookObj.id + '/users/' + ?, {
        //         method: 'DELETE',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(bookObjUpdate)
        //     })   
        // }
    })
}