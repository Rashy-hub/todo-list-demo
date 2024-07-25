document.addEventListener('DOMContentLoaded', () => {
    modalHandler('registerModal', 'registerButtonModal', 'registerForm', 'api/auth/register'),
        modalHandler('loginModal', 'loginButtonModal', 'loginForm', 'api/auth/login')
    let e = document.querySelector('.logoutButton')
    e.addEventListener('click', (e) => {
        displayLoggedOutPage(), infoDialogHandler({ title: 'Logged out', message: 'See You Soon :D' })
    })
    let t = document.querySelector('.addTodo')
    t.addEventListener('submit', (e) => {
        e.preventDefault(), submitFormWithToken(t), (document.getElementById('inputTodo').value = ''), document.getElementById('inputTodo').focus()
    })
    let o = localStorage.getItem('user'),
        a = localStorage.getItem('token')
    o && a && displayLoggedInUser(o)
})
const checkboxlistener = async (e) => {
        e.preventDefault()
        let t = e.target,
            o = t.closest('.todo-complete-form')
        if (!o) {
            console.warn('Checkbox not found within a .todo-complete-form element.')
            return
        }
        let a = o.action,
            n = o.method.toUpperCase(),
            l = new FormData(o),
            d = Object.fromEntries(l.entries()),
            r = localStorage.getItem('token')
        try {
            let i = await fetch(a, {
                method: n,
                headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${r}` },
                body: JSON.stringify(d),
            })
            if (i.ok) {
                let s = await i.json()
                updateTodos(s)
            } else console.error('Form submission failed:', i.status, i.statusText)
        } catch (c) {
            console.error('Error during form submission:', c)
        }
    },
    infoDialogHandler = (e) => {
        let { title: t, message: o } = e,
            a = document.getElementById('dialog-box'),
            n = document.getElementById('dialog-ok-button'),
            l = document.querySelector('.dialog-header h2'),
            d = document.querySelector('.dialog-body p')
        ;(l.textContent = t),
            (d.textContent = o),
            a.showModal(),
            n.addEventListener('click', () => {
                a.close()
            })
    },
    displayLoggedInUser = async (e) => {
        let t = document.getElementById('userSpan')
        ;(t.innerText = e),
            (t.style.textTransform = 'uppercase'),
            document.querySelector('.loginButtonModal').classList.add('hidden'),
            document.querySelector('.logoutButton').classList.remove('hidden'),
            document.querySelector('.registerButtonModal').classList.add('hidden'),
            document.querySelector('.todo-list').classList.remove('hidden'),
            (document.getElementById('usernameField').value = e),
            (document.getElementById('inputTodo').disabled = !1),
            (document.getElementById('addTodo').disabled = !1),
            (document.getElementById('clear').disabled = !1)
        let o = await getTodos()
        updateTodos(o), updateTodos(o)
    },
    displayLoggedOutPage = () => {
        let e = document.getElementById('userSpan')
        ;(e.innerText = 'Please connect to see the'),
            (document.getElementById('usernameField').value = ''),
            localStorage.removeItem('token'),
            localStorage.removeItem('user'),
            document.querySelector('.loginButtonModal').classList.remove('hidden'),
            document.querySelector('.logoutButton').classList.add('hidden'),
            document.querySelector('.registerButtonModal').classList.remove('hidden'),
            document.querySelector('.todo-list').classList.add('hidden'),
            (document.getElementById('inputTodo').value = ''),
            (document.getElementById('inputTodo').disabled = !0),
            (document.getElementById('addTodo').disabled = !0),
            (document.getElementById('clear').disabled = !0)
    },
    modalFormEventsHandler = (e, t, o) => {
        e.addEventListener('submit', async (a) => {
            a.preventDefault()
            let n = new FormData(e),
                l = {}
            n.forEach((e, t) => {
                l[t] = e
            }),
                await modalFetchHandler(l, t, o)
        })
    },
    modalFetchHandler = async (e, t, o) => {
        try {
            let a = await fetch(t, {
                    method: 'POST',
                    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify(e),
                }),
                n = await a.json()
            a.ok
                ? (o.close(),
                  localStorage.setItem('token', n.token),
                  localStorage.setItem('user', n.user),
                  infoDialogHandler(n),
                  displayLoggedInUser(n.user))
                : (infoDialogHandler({ title: `Error ${n.status}`, message: n.message }), console.error('Submission failed'))
        } catch (l) {
            console.error('Error:', l)
        }
    },
    modalHandler = (e, t, o, a) => {
        let n = document.getElementById(e),
            l = document.querySelector(`.${t}`),
            d = n.querySelector('.closeModalBtn'),
            r = n.querySelector('.cancelBtn'),
            i = document.getElementById(o)
        l.addEventListener('click', () => n.showModal()),
            d.addEventListener('click', () => n.close()),
            r.addEventListener('click', () => n.close()),
            modalFormEventsHandler(i, a, n)
    }
async function submitFormWithToken(e) {
    let t = localStorage.getItem('token'),
        o = new FormData(e),
        a = {}
    o.forEach((e, t) => {
        a[t] = e
    })
    try {
        let n = await fetch(e.action, {
            method: e.method,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
            body: JSON.stringify(a),
        })
        if (n.ok) {
            let l = await n.json()
            updateTodos(l)
        } else console.error('Request failed:', n.status, n.statusText)
    } catch (d) {
        console.error('Error:', d)
    }
}
function updateTodos(e) {
    0 === e.todos.length && console.log('TODOS LIST EMPTY')
    let t = e.todos
    try {
        let o = document.querySelector('.todo-list')
        ;(o.innerHTML = ''),
            t.forEach((e) => {
                let t = document.createElement('li')
                t.className = `todo-item ${e.completed ? 'completed' : ''}`
                let a = document.createElement('form')
                ;(a.action = `api/todo/complete/${e._id}`), (a.method = 'POST'), (a.className = 'todo-complete-form form-with-token')
                let n = document.createElement('input')
                ;(n.type = 'checkbox'),
                    (n.name = 'iscomplete'),
                    (n.className = 'iscomplete'),
                    e.completed && (n.checked = !0),
                    a.appendChild(n),
                    t.appendChild(a)
                let l = document.createElement('span')
                ;(l.textContent = e.text), t.appendChild(l)
                let d = document.createElement('div')
                d.className = 'actions'
                let r = document.createElement('form')
                ;(r.action = `api/todo/edit/${e._id}`), (r.method = 'POST'), (r.className = 'form-with-token')
                let i = document.createElement('button')
                ;(i.type = 'submit'), (i.disabled = !0)
                let s = document.createElement('img')
                ;(s.src = '/assets/pen.svg'), (s.alt = 'pen'), i.appendChild(s), r.appendChild(i), d.appendChild(r)
                let c = document.createElement('form')
                ;(c.action = `api/todo/delete/${e._id}`), (c.method = 'POST'), (c.className = 'form-with-token')
                let m = document.createElement('button')
                m.type = 'submit'
                let u = document.createElement('img')
                ;(u.src = '/assets/trash.svg'),
                    (u.alt = 'trash'),
                    m.appendChild(u),
                    c.appendChild(m),
                    d.appendChild(c),
                    t.appendChild(d),
                    o.appendChild(t)
                let p = document.querySelectorAll('.iscomplete')
                p.forEach((e) => {
                    e.addEventListener('change', checkboxlistener)
                })
                let g = document.querySelectorAll('.form-with-token')
                g.forEach((e) => {
                    e.addEventListener('submit', function (t) {
                        t.preventDefault(), submitFormWithToken(e)
                    })
                })
            })
    } catch (a) {
        console.error('Error updating todos:', a)
    }
}
async function getTodos() {
    let e = localStorage.getItem('token')
    try {
        let t = await fetch('api/todo', {
            method: 'GET',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${e}` },
        })
        if (t.ok) {
            let o = await t.json()
            return o
        }
        console.error('Request failed:', t.status, t.statusText)
    } catch (a) {
        console.error('Error:', a)
    }
}
