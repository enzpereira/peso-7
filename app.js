//Enzo Pereira Leite 12
//Gabriel Sousa Reis 17


const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));


function validarCPF(cpf) {

    let cpfLimpo = "";
    for (let i = 0; i < cpf.length; i++) {
        if (cpf[i] >= '0' && cpf[i] <= '9') {
            cpfLimpo += cpf[i];
        }
    }


    if (cpfLimpo.length !== 11) {
        return false;
    }


    let todosIguais = true;
    for (let i = 1; i < 11; i++) {
        if (cpfLimpo[i] !== cpfLimpo[0]) {
            todosIguais = false;
        }
    }
    if (todosIguais === true) {
        return false;
    }


    let soma1 = 0;
    let peso1 = 10;
    for (let i = 0; i < 9; i++) {
        soma1 = soma1 + (parseInt(cpfLimpo[i]) * peso1);
        peso1 = peso1 - 1;
    }
    let resto1 = (soma1 * 10) % 11;
    if (resto1 === 10 || resto1 === 11) {
        resto1 = 0;
    }
    if (resto1 !== parseInt(cpfLimpo[9])) {
        return false;
    }


    let soma2 = 0;
    let peso2 = 11;
    for (let i = 0; i < 10; i++) {
        soma2 = soma2 + (parseInt(cpfLimpo[i]) * peso2);
        peso2 = peso2 - 1;
    }
    let resto2 = (soma2 * 10) % 11;
    if (resto2 === 10 || resto2 === 11) {
        resto2 = 0;
    }
    if (resto2 !== parseInt(cpfLimpo[10])) {
        return false;
    }

    return true;
}


function formatarParaReal(valor) {
    let fixado = valor.toFixed(2);
    let formatado = fixado.replace(".", ",");
    return "R$ " + formatado;
}


app.get('/', (req, res) => {
    res.render('index', { erros: null, resultado: null });
});


app.post('/processar', (req, res) => {
    const nome = req.body.nome;
    const cpf = req.body.cpf;
    const valorVenda = req.body.valorVenda;

    let listaErros = [];




    if (!nome || nome.trim().length < 3) {
        listaErros.push("O nome completo é obrigatório e deve conter no mínimo 3 caracteres.");
    }

    if (!cpf || !validarCPF(cpf)) {
        listaErros.push("O CPF é obrigatório, deve conter 11 dígitos e ser um CPF válido.");
    }


    let valorNumerico = parseFloat(valorVenda);
    if (!valorVenda || isNaN(valorNumerico) || valorNumerico <= 0) {
        listaErros.push("O valor da venda é obrigatório, deve ser numérico e maior que zero.");
    }


    if (listaErros.length > 0) {
        return res.render('index', { erros: listaErros, resultado: null });
    }


    let percentual = 0;

    if (valorNumerico <= 5000) {
        percentual = 3;
    } else if (valorNumerico > 5000 && valorNumerico <= 15000) {
        percentual = 5;
    } else if (valorNumerico > 15000) {
        percentual = 7;
    }

    let valorComissao = (valorNumerico * percentual) / 100;


    const dadosResultado = {
        nomeVendedor: nome,
        cpfVendedor: cpf,
        valorOriginal: formatarParaReal(valorNumerico),
        comissaoPercentual: percentual + "%",
        comissaoTotal: formatarParaReal(valorComissao)
    };

    res.render('index', { erros: null, resultado: dadosResultado });
});


app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});