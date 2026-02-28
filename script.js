const forms = document.querySelectorAll('.needs-validation');

Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const login = {
            login: document.getElementById('email').value,
            senha: document.getElementById('senha').value
        }

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify(login)
        })
        .then(res => res.json())
        .then(dados => {

            if (!dados.success) {
                document.getElementById('area-mensagem').innerHTML =
                    `<div class="alert alert-danger">${dados.mensagem}</div>`;
                return;
            }

            if(dados.nivel === "Admin"){
                window.location.href = "/admin/admin.html"
            }

            // if (dados.nivel === "Admin") {
            //     window.location.href = "/admin/admin.html";
            // } else if (dados.nivel === "Operador") {
            //     window.location.href = "/operador/dashboard"; 
            // }

        })
        .catch(erro => {
            console.error("Erro:", erro);
        });

        form.classList.add('was-validated');

    }, false);
});

const area_mensagem = document.getElementById('area-mensagem');

function fnGerarMensagem(tipo, mensagemAlert) {
    if (!area_mensagem) return;

    const mensagem = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagemAlert}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    area_mensagem.innerHTML = mensagem;
}

const params = new URLSearchParams(window.location.search);
const sucesso = params.get('sucesso');

if (sucesso === '1') {
    fnGerarMensagem('success', 'Cadastro realizado com sucesso! Faça seu login.');
    window.history.replaceState({}, document.title, window.location.pathname);
}