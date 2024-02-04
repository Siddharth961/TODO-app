const first = document.querySelector('.first');
const heading = document.querySelector('#heading');
const body = document.querySelector('#body');
const add_btn = document.querySelector('#add-btn');

const cards = document.querySelectorAll('.my-card');

let noteId = '';
cards.forEach((card) => {
    card.addEventListener('click', () => {
        noteId = card.getAttribute('noteid');
        // console.log(noteId)
    });
});

//Add new notee
let data = {};

add_btn.addEventListener('click', async () => {
    data['title'] = heading.value;
    data['body'] = body.value;
    console.log(data);

    const response = await fetch('/note/add', {
        method: 'post',
        body: data
    });
    heading.value = '';
    body.value = '';
    heading.setAttribute('placeholder', 'TODO');
    body.classList.remove('active');
    add_btn.classList.remove('active');
    first.style.height = '48vh';
});

heading.addEventListener('click', (e) => {
    heading.setAttribute('placeholder', 'Title');

    body.classList.add('active');
    add_btn.classList.add('active');
    first.style.height = '65vh';
    console.log(body);
});

//delete a note
const container = document.querySelector('.contain');
const delete_btns = document.querySelectorAll('.bi-trash');
const delete_panel = document.querySelector('.delete');
const del_yes = document.querySelector('#del-yes-btn');
const del_no = document.querySelector('#del-no-btn');

delete_btns.forEach((del_btn) => {
    del_btn.addEventListener('click', () => {
        blur_body();
    });
});

del_yes.addEventListener('click', async () => {
    await fetch('/note', {
        method: 'delete',
        id: noteId
    });
    unblur_body();
});
del_no.addEventListener('click', () => {
    unblur_body();
});

//-----------------------Edit note--------------------

const edit_btns = document.querySelectorAll('.bi-pencil');

edit_btns.forEach((edit_btn) => {
    edit_btn.addEventListener('click', async () => {
        container.style.filter = 'blur(2px)';
        edit_panel.style.display = 'block';
        // console.log(noteId);

        await fetch('/note', {
            method: 'get',
            id: noteId
        });
    });
});
const edit_panel = document.querySelector('.edit');
const edit_title = edit_panel.querySelector('input');
const edit_body = edit_panel.querySelector('textarea');

const edit_panel_btn = document.querySelector('#note-edit-btn');
const cancel_panel_btn = document.querySelector('#note-cancel-btn');
console.log(cancel_panel_btn);
data = {};

edit_panel_btn.addEventListener('click', async () => {
    // console.log(noteId)
    await fetch('/note', {
        method: 'update',
        data: {
            id: noteId,
            title: edit_title.value,
            body: edit_body.value.trim()
        }
    });
    unblur_body();
});

cancel_panel_btn.addEventListener('click', () => {
    unblur_body();
});

//------------Profilee-----------
const profile_pic = document.querySelector('.bi-person-circle');
const profile_panel = document.querySelector('.profile');
const profile_cross = profile_panel.querySelector('.bi');

profile_pic.addEventListener('click', () => {
    profile_pic.style.display = 'none';
    profile_panel.classList.add('active');
});

profile_cross.addEventListener( 'click', () =>{
    profile_pic.style.display = 'block' ;
    profile_panel.classList.remove('active');

})

// utilities
const blur_body = function () {
    container.style.filter = 'blur(2px)';
    delete_panel.style.display = 'flex';
};

const unblur_body = function () {
    container.style.filter = '';
    delete_panel.style.display = 'none';
    edit_panel.style.display = 'none';
};
