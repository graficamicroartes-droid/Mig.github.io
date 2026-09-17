const tasks = {
    modulo1: {
        title: "Desafio 1: A Estrutura Semântica Inicial",
        text: "<p>Configurar o idioma nativo no HTML impede traduções automáticas erradas de navegadores.</p><p><strong>Sua Missão:</strong> Escreva a tag de abertura <code>&lt;html lang=\"pt-BR\"&gt;</code> e feche com <code>&lt;/html&gt;</code>.</p>",
        correctAnswers: ['<html lang="pt-BR"></html>', '<html lang=\'pt-BR\'></html>', '<html lang="pt-BR">\n</html>'],
        aiContext: "No Desafio 1, o aluno precisa abrir a tag <html> usando o atributo lang='pt-BR' e fechá-la com </html>.",
        points: 25,
        steps: [
            { text: "Abrir a tag estrutural html", rule: /<html/i },
            { text: "Definir o atributo de idioma pt-BR", rule: /lang=["']pt-BR["']/i },
            { text: "Inserir a tag de fechamento </html>", rule: /<\/html>/i }
        ]
    },
    modulo2: {
        title: "Desafio 2: Âncoras de Navegação",
        text: "<p>Links bem configurados passam relevância para robôs de indexação.</p><p><strong>Sua Missão:</strong> Crie um link apontando para <code>https://google.com</code> com o texto interno contendo exatamente <code>Buscar</code>.</p>",
        correctAnswers: ['<a href="https://google.com">Buscar</a>', '<a href=\'https://google.com\'>Buscar</a>'],
        aiContext: "No Desafio 2, a estrutura correta esperada é: <a href='https://google.com'>Buscar</a>. Atenção com as letras maiúsculas.",
        points: 25,
        steps: [
            { text: "Criar uma tag de link <a>", rule: /<a/i },
            { text: "Apontar o href para o endereço do Google", rule: /href=["']https:\/\/google\.com["']/i },
            { text: "Definir o texto visível como 'Buscar'", rule: />\s*Buscar\s*</i }
        ]
    },
    modulo3: {
        title: "Desafio 3: Acessibilidade com Imagens",
        text: "<p>Imagens profissionais exigem descrição textual alternativa para leitores de tela.</p><p><strong>Sua Missão:</strong> Crie um elemento de imagem apontando para o arquivo <code>foto.jpg</code> com o texto alternativo de <code>Perfil</code>.</p>",
        correctAnswers: ['<img src="foto.jpg" alt="Perfil">', '<img src="foto.jpg" alt="Perfil" />'],
        aiContext: "No Desafio 3, o estudante precisa usar a tag <img> com as propriedades src='foto.jpg' e alt='Perfil'. Lembre-se que a tag img não tem fechamento separado.",
        points: 25,
        steps: [
            { text: "Iniciar o elemento de imagem <img>", rule: /<img/i },
            { text: "Vincular a origem src para foto.jpg", rule: /src=["']foto\.jpg["']/i },
            { text: "Adicionar o texto de acessibilidade alt='Perfil'", rule: /alt=["']Perfil["']/i }
        ]
    },
    modulo4: {
        title: "Desafio 4: Conexão de Formulários",
        text: "<p>Unir rótulos a campos de input é um requisito de desenvolvimento profissional.</p><p><strong>Sua Missão:</strong> Digite o atributo que cria uma identificação com o valor exato <code>nome</code> dentro de um elemento.</p>",
        correctAnswers: ['id="nome"', "id='nome'"],
        aiContext: "No Desafio 4, estamos pedindo especificamente o atributo id='nome' que mapeia o input.",
        points: 25,
        steps: [
            { text: "Digitar a propriedade de chave ID", rule: /id=/i },
            { text: "Atribuir o valor de identificação 'nome'", rule: /id=["']nome["']/i }
        ]
    }
};

let currentTab = 'modulo1';
let score = 0;
let completedModules = new Set();

document.addEventListener("DOMContentLoaded", () => {
    loadChallenge(currentTab);
});

function loadChallenge(moduleKey) {
    document.getElementById('lesson-title').innerText = tasks[moduleKey].title;
    document.getElementById('lesson-text').innerHTML = tasks[moduleKey].text;
    
    // Renderiza as etapas na tela
    const stepsList = document.getElementById('steps-list');
    stepsList.innerHTML = '';
    
    tasks[moduleKey].steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.className = 'step-item';
        li.id = `step-${index}`;
        li.innerHTML = `<div class="step-checkbox"></div> <span>${step.text}</span>`;
        stepsList.appendChild(li);
    });
    
    checkLiveSteps();
}

function switchTab(moduleKey) {
    currentTab = moduleKey;
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    loadChallenge(moduleKey);
    clearEditor();
    
    appendAIMessage(`Mudamos para o ${tasks[moduleKey].title}. Complete todas as etapas marcadas em verde para avançar.`);
}

// Analisa o código do usuário em tempo real
function checkLiveSteps() {
    const code = document.getElementById('code-input').value;
    const currentSteps = tasks[currentTab].steps;
    
    currentSteps.forEach((step, index) => {
        const stepElement = document.getElementById(`step-${index}`);
        if (!stepElement) return;
        
        // Testa a regra regex no código digitado
        if (step.rule.test(code)) {
            stepElement.classList.add('completed');
            stepElement.querySelector('.step-checkbox').innerText = '✓';
        } else {
            stepElement.classList.remove('completed');
            stepElement.querySelector('.step-checkbox').innerText = '';
        }
    });
}

function clearEditor() {
    document.getElementById('code-input').value = '';
    document.getElementById('feedback').style.display = 'none';
    checkLiveSteps();
}

function verifyCode() {
    const userInput = document.getElementById('code-input').value.trim().replace(/\s+/g, ' ');
    const feedback = document.getElementById('feedback');
    const currentTask = tasks[currentTab];
    
    const isCorrect = currentTask.correctAnswers.some(ans => userInput.includes(ans) || ans.replace(/\s+/g, ' ') === userInput);
    
    if (isCorrect) {
        feedback.innerText = "🚀 Código perfeito! Desafio concluído com sucesso.";
        feedback.className = "feedback-msg success";
        appendAIMessage("Parabéns! Suas etapas estão todas verdes e o código passou na nossa esteira de testes.");
        
        if (!completedModules.has(currentTab)) {
            completedModules.add(currentTab);
            score += currentTask.points;
            updateUI();
        }
    } else {
        feedback.innerText = "❌ Alguma etapa falhou. Revise suas tags ou fale com a DevAI.";
        feedback.className = "feedback-msg error";
        appendAIMessage(`Vejo que o código enviado ainda possui pendências. Lembre-se: ${currentTask.aiContext}`);
    }
}

function updateUI() {
    document.getElementById('progress-percentage').innerText = `${score}%`;
    document.getElementById('progress-fill').style.width = `${score}%`;
    
    if (score === 100) {
        setTimeout(() => {
            document.getElementById('overlay').classList.add('show');
            document.getElementById('modal-cert').classList.add('show');
        }, 600);
    }
}

function closeModal() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('modal-cert').classList.remove('show');
}

// LÓGICA DO ASSISTENTE DEVAI
function handleAIPress(e) {
    if (e.key === 'Enter') askAI();
}

function appendAIMessage(text, sender = 'ai') {
    const container = document.getElementById('ai-messages');
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function askAI() {
    const input = document.getElementById('ai-user-query');
    const query = input.value.trim();
    if (!query) return;
    
    appendAIMessage(query, 'user');
    input.value = '';
    
    setTimeout(() => {
        const ctx = tasks[currentTab].aiContext;
        if (query.toLowerCase().includes('dica') || query.toLowerCase().includes('ajuda') || query.toLowerCase().includes('etapa')) {
            appendAIMessage(`Dica de ouro: Para marcar as etapas em verde, foque nos detalhes solicitados na lista de tarefas. Para este exercício: ${ctx}`);
        } else if (query.toLowerCase().includes('resposta')) {
            appendAIMessage("Regra do Gym: Eu te ajudo a pensar, mas não dou a resposta! Olhe os requisitos da etapa atual.");
        } else {
            appendAIMessage(`Analisando o escopo do exercício atual... Lembre-se: ${ctx}.`);
        }
    }, 600);
}
