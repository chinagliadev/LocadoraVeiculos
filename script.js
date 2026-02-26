const forms = document.querySelectorAll('.needs-validation')

Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

        event.preventDefault()

        if (!form.checkValidity()) {
            event.stopPropagation()
        } else {

            const usuario = {
                email: document.getElementById('email').value,
                nome: document.getElementById('nome').value,
                tipo_veiculo: document.getElementById('tipo_veiculo').value
            }

            console.dir(usuario)

            fetch('http://localhost:3000/reservar/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            })
                .then(response => {
                    if (!response.status == 200) {
                        throw new Error('Erro na requisição')
                    }
                    return response.json()
                })
                .then(dados => {
                    fnGerarMensagem('success', 'Usuário cadastrado com sucesso!')
                })
                .catch(error => {
                    fnGerarMensagem('danger', 'Erro ao cadastrar usuário')
                })
        }

        form.classList.add('was-validated')

    }, false)
})

const area_mensagem = document.getElementById('area-mensagem')

function fnGerarMensagem(tipo, mensagemAlert) {

    const mensagem = `
        <div class="alert alert-${tipo}" role="alert">
            ${mensagemAlert}
        </div>
    `

    area_mensagem.innerHTML += mensagem
}
const params = new URLSearchParams(window.location.search);
const sucesso = params.get('sucesso');

console.log(params);

if (sucesso === '1') {
    fnGerarMensagem('success', 'Usuario cadastrado com sucesso');
}