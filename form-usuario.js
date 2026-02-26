const forms = document.querySelectorAll('.needs-validation')

Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault()  // sempre impedir reload
        event.stopPropagation()

        if (!form.checkValidity()) {
            form.classList.add('was-validated')
            return
        }

        const usuario = {
            login: document.getElementById('email').value,
            senha: document.getElementById('senha').value,
            nivel_acesso: "Operador",
            telefone: document.getElementById('telefone').value,
            endereco: document.getElementById('endereco').value
        }

        console.dir(usuario)

        fetch('http://localhost:3000/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (!response.ok) {
                fnGerarMensagem('danger', 'Erro ao cadastrar usuário')
                throw new Error('Erro na requisição')
            }
            return response.json()
        })
        .then(dados => {
            form.reset() 
            window.location.href = "login.html?sucesso=1"
            form.classList.remove('was-validated')
        })
        .catch(erro => {
            console.error(erro)
        })

        form.classList.add('was-validated')
    }, false)
})
