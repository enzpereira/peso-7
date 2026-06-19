const express = require('express');
const app = express();
const port = 3000;
 
// Configuração do EJS e leitura de dados do formulário
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
 
// Função para validar o algoritmo oficial do CPF brasileiro
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
 
    let soma = 0;
    let resto;
 
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
 
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
 
    return true;
}
 
// Função para formatar moeda em PT-BR (R$)
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}
 
// Rota Principal (Exibe a página com o formulário limpo)
app.get('/', (req, res) => {
    res.render('index', { erros: null, resultado: null, dados Antigos: {} });
});
 
// Rota de Processamento do Formulário (POST)
app.post('/processar', (req, res) => {
    let { nome, cpf, valorMatricula } = req.body;
    let erros = [];
 
    // Limpeza de strings para validação interna
    const valorNumerico = parseFloat(valorMatricula.replace(',', '.'));
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');
 
    // --- b. Validações ---
    if (!nome || nome.trim().length < 3) {
        erros.push("O Nome Completo é obrigatório e deve conter no mínimo 3 caracteres.");
    }
 
    if (!cpf || cpfLimpo.length !== 11 || !validarCPF(cpfLimpo)) {
        erros.push("O CPF informado é inválido. Deve conter 11 dígitos numéricos válidos.");
    }
 
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        erros.push("O Valor da Matrícula é obrigatório, deve ser numérico e maior que zero.");
    }
 
    // Se houver erros, recarrega a página exibindo as mensagens
    if (erros.length > 0) {
        return res.render('index', { erros, resultado: null, dadosAntigos: req.body });
    }
 
    // --- c. Cálculo do Bônus/Desconto ---
    let percentualDesconto = 0;
 
    if (valorNumerico <= 100) {
        percentualDesconto = 2;
    } else if (valorNumerico > 100 && valorNumerico <= 500) {
        percentualDesconto = 7;
    } else if (valorNumerico > 500 && valorNumerico <= 1500) {
        percentualDesconto = 12;
    } else if (valorNumerico > 1500) {
        percentualDesconto = 18;
    }
 
    const valorDesconto = valorNumerico * (percentualDesconto / 100);
    const valorFinal = valorNumerico - valorDesconto;
 
    // --- d. Preparação para Exibição dos Dados formatados ---
    const resultado = {
        nome: nome,
        cpf: cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"), // Máscara visual de CPF
        valorOriginal: formatarMoeda(valorNumerico),
        percentual: `${percentualDesconto}%`,
        desconto: formatarMoeda(valorDesconto),
        valorFinal: formatarMoeda(valorFinal)
    };
 
    res.render('index', { erros: null, resultado, dadosAntigos: {} });
});
 
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});