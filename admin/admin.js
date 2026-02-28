fetch('http://localhost:3000/dados-admin', {
    method: 'GET',
    credentials: 'include' 
})
.then(res => res.json())
.then(dados => {
    // if (!dados.logado) {
    //     window.location.href = "../index.html"; 
    // }
    console.log(dados);
});