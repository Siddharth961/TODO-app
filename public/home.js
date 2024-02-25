let URL = window.location.protocol + '//' + window.location.hostname;
if (window.location.port) URL = URL + ':' + window.location.port;
const container = document.querySelector('.contain');

const first = document.querySelector('.first');
const heading = document.querySelector('#heading');
const body = document.querySelector('#body');
const add_btn = document.querySelector('#add-btn');

const cards = document.querySelectorAll('.my-card');
let outside = false;

//----------------Add new notee---------------------
let data = {};

add_btn.addEventListener('click', async () => {
    data['title'] = heading.value;
    data['body'] = body.value;

    try {
        let res = await axios({
            method: 'POST',
            url: `${URL}/notes`,
            data
        });

        window.location.reload();
    } catch (err) {
        alert(err.response.data.message);
    }
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
});

//--------------------Note activitiess-----------------------

let noteId = '';

const edit_panel = document.querySelector('.edit');
const edit_title = edit_panel.querySelector('input');
const edit_body = edit_panel.querySelector('textarea');

const edit = edit_panel.querySelector('#note-edit-btn');
const delete_ = edit_panel.querySelector('#note-delete-btn');

cards.forEach((card) => {
    card.addEventListener('click', () => {
        if (outside == false) {
            noteId = card.getAttribute('noteid');

            setTimeout(() => {
                outside = true;
            }, 200);
            edit_title.value = card
                .querySelector('.mycard-title')
                .textContent.trim();
            edit_body.value = card
                .querySelector('.mycard-body')
                .textContent.trim();
            container.style.filter = 'blur(2px)';
            edit_panel.style.display = 'block';
        }
    });
});
container.addEventListener('click', () => {
    if (outside) {
        unblur_body();
        outside = false;
    }
});

//-------------------------Edit Request---------------------
edit.addEventListener('click', async () => {
    try {
        let res = await axios({
            method: 'PATCH',
            url: `${URL}/notes/${noteId}`,
            data: {
                title: edit_title.value,
                body: edit_body.value
            }
        });

        window.location.reload();
    } catch (err) {
        alert(err.response.data.message);
    }
});

//----------------------Delete--------------------
const delete_panel = document.querySelector('.delete');
const del_yes = delete_panel.querySelector('#del-yes-btn');
const del_no = delete_panel.querySelector('#del-no-btn');

delete_.addEventListener('click', () => {
    delete_panel.style.display = 'block';
    container.style.filter = 'blur(2px)';
    edit_panel.style.display = 'none';
});

del_no.addEventListener('click', () => {
    delete_panel.style.display = 'none';
    edit_panel.style.display = 'block';
});

del_yes.addEventListener('click', async () => {
    try {
        let res = await axios({
            method: 'DELETE',
            url: `${URL}/notes/${noteId}`
        });

        window.location.reload();
    } catch (err) {
        alert(err.response.data.message);
    }
});

//------------Profilee-----------
const profile_pic = document.querySelector('.bi-person-circle');
const profile_panel = document.querySelector('.profile');
const profile_cross = profile_panel.querySelector('.bi');

profile_pic.addEventListener('click', () => {
    profile_pic.style.display = 'none';
    profile_panel.classList.add('active');
});

profile_cross.addEventListener('click', () => {
    profile_pic.style.display = 'block';
    profile_panel.classList.remove('active');
});

//-----------update----------
const update = profile_panel.querySelector('#update');
const update_panel = document.querySelector('.update');
const update_cross = update_panel.querySelector('.bi');
const update_form = update_panel.querySelector('form');

update.addEventListener('click', () => {
    outside = true;
    update_panel.classList.add('active');
    container.style.filter = 'blur(2px)';
    profile_panel.style.filter = 'blur(2px)';
});

update_cross.addEventListener('click', () => {
    unblur_body();
});

update_form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        let res = await axios({
            method: 'PATCH',
            url: `${URL}/users/updatePassword`,
            data: {
                oldPassword: update_panel.querySelector('#oldPassword').value,
                password: update_panel.querySelector('#password').value,
                passwordConfirm:
                    update_panel.querySelector('#passwordConfirm').value
            }
        });

        unblur_body();
    } catch (err) {
        alert(err.response.data.message);
    }
});

//---------------------Logout-----------------------
const logout = profile_panel.querySelector('#logout');
logout.addEventListener('click', async () => {
    try {
        await axios({
            method: 'DELETE',
            url: `${URL}/users/logout`
        });

        window.location.replace(`${URL}`);
    } catch (err) {
        alert(err.response.data.message);
    }
});
// utilities

const blur_body = function () {
    container.style.filter = 'blur(2px)';
    delete_panel.style.display = 'flex';
};

const unblur_body = function () {
    container.style.filter = '';
    profile_panel.style.filter = '';
    update_panel.classList.remove('active');
    update_panel.querySelectorAll('input').forEach((in_) => {
        in_.value = '';
    });
    delete_panel.style.display = 'none';
    edit_panel.style.display = 'none';
};
