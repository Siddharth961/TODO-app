const login_form = document.querySelector('#login');
const signup_form = document.querySelector('#signup');

if (login_form) {
    login_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            let res = await axios({
                method: 'POST',
                url: '/users/login',
                data: {
                    email: login_form.querySelector('#email').value,
                    password: login_form.querySelector('#password').value
                }
            });

            // console.log(res.data);

            window.location.replace('/home');
        } catch (err) {
            alert(err.response.data.message);
        }
    });
}

if (signup_form) {
    signup_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            let res = await axios({
                method: 'POST',
                url: '/users/signup',
                data: {
                    name: signup_form.querySelector('#name').value,
                    email: signup_form.querySelector('#email').value,
                    password: signup_form.querySelector('#password').value,
                    passwordConfirm:
                        signup_form.querySelector('#passwordConfirm').value
                }
            });

            window.location.replace('/home');
            
        } catch (err) {
            alert(err.response.data.message);
        }
    });
}
