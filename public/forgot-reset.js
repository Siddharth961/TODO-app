const forgot_form = document.querySelector('#forgot');
const reset_form = document.querySelector('#reset');

let URL = window.location.protocol + '//' + window.location.hostname;
if (window.location.port) URL = URL + ':' + window.location.port;

let submitted = false;
if (forgot_form) {
    forgot_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (submitted == false) {
            submitted = true;

            try {
                let res = await axios({
                    method: 'POST',
                    url: `${URL}/users/forgotPassword`,
                    data: {
                        email: forgot_form.querySelector('#email').value
                    }
                });

                alert('Reset mail sent to given email');

                window.location.replace(URL);
            } catch (err) {
                alert(err.response.data.message);
            }
        }
    });
}

if (reset_form) {
    reset_form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const token = window.location.pathname.split('/').pop();
            let res = await axios({
                method: 'PATCH',
                url: `${URL}/users/resetPassword/${token}`,
                data: {
                    password: reset_form.querySelector('#password').value,
                    passwordConfirm:
                        reset_form.querySelector('#passwordConfirm').value
                }
            });

            // console.log(res.data);

            window.location.replace(`${URL}/home`);
        } catch (err) {
            // console.log(1)
            console.log(err);
            alert(err.response.data.message);
        }
    });
}
