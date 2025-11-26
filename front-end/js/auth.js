/* fixly/front-end/js/auth.js - Lógica de Autenticação Firebase (SDK v9 Modular) */

// ----------------------------------------------------------------------
// IMPORTAÇÕES DO FIREBASE (v9 Modular)
// Usamos a sintaxe "import { função } from 'caminho/função'"
// Se você está usando arquivos HTML/JS locais, você deve incluir os scripts
// no HTML conforme o exemplo abaixo:
// <script type="module" src="../js/auth.js"></script>
// ----------------------------------------------------------------------

// Supondo que você está usando módulos no seu ambiente local (recomendado):

// Se você está rodando localmente (sem bundler), você precisará mudar os <script> tags no HTML
// de volta para o formato de script modular e instalar o SDK via npm ou usar um CDN.
// Mantenha os imports abaixo, mas o código final deve ser incluído via <script type="module">

// Se você está usando o CDN no HTML, a sintaxe muda. Para simplicidade, vamos usar as 
// funções globais, já que a sintaxe CDN do v9 é complexa para front-end puro sem módulos.
// Para um projeto simples com HTML, o ideal é reverter para a sintaxe CDN Global do v9,
// ou garantir que seu arquivo HTML esteja carregando os módulos corretamente.

// VOU REESCREVER O CÓDIGO USANDO AS FUNÇÕES DO v9, 
// ASSUMINDO QUE AS BIBLIOTECAS SÃO INCLUÍDAS VIA CDN NO HTML (mais comum em projetos simples).

const firebaseConfig = {
    apiKey: "AIzaSyB_LzPWwNnGi22HkpVBKb3138YXC-J74uw",
    authDomain: "fixly-1d67e.firebaseapp.com",
    databaseURL: "https://fixly-1d67e-default-rtdb.firebaseio.com",
    projectId: "fixly-1d67e",
    storageBucket: "fixly-1d67e.firebasestorage.app",
    messagingSenderId: "900028552222",
    appId: "1:900028552222:web:3beff6b483646b111c4a0f",
    measurementId: "G-XNTYTCBM6N"
};

// As funções do Firebase v9 são acessadas via "firebase/compat" ou importadas se for modular.
// Para front-end puro, o melhor é manter o uso das funções do SDK v9 através do objeto global 'firebase'.

// Inicializa o Firebase
// O objeto 'firebase' deve estar disponível globalmente após incluir o CDN.
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Cria a instância de Auth do Firebase


// URL de destino após login/cadastro bem-sucedido
const DASHBOARD_URL = 'dashboard.html';
const LOGIN_URL = 'login.html';


// --- Funções Auxiliares de Tratamento de Erro (Mantida) ---

function getFirebaseErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Email ou senha inválidos. Tente novamente.';
        case 'auth/email-already-in-use':
            return 'Este email já está cadastrado.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/invalid-email':
            return 'O formato do email é inválido.';
        default:
            return 'Ocorreu um erro desconhecido. Código: ' + errorCode;
    }
}


// --- 1. Lógica de CADASTRO (Adaptada para Auth v9) ---

function handleCadastro(event) {
    event.preventDefault();
    const email = document.getElementById('cadastro-email').value;
    const password = document.getElementById('cadastro-password').value;
    const errorMessageElement = document.getElementById('cadastro-error-message');
    errorMessageElement.style.display = 'none';

    // A função é chamada de forma similar, pois estamos usando o compat SDK no HTML
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Usuário cadastrado com sucesso:', userCredential.user.email);
            window.location.href = DASHBOARD_URL;
        })
        .catch((error) => {
            const errorMessage = getFirebaseErrorMessage(error.code);
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
        });
}


// --- 2. Lógica de LOGIN (Adaptada para Auth v9) ---

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMessageElement = document.getElementById('login-error-message');
    errorMessageElement.style.display = 'none';

    // A função é chamada de forma similar, pois estamos usando o compat SDK no HTML
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login bem-sucedido:', userCredential.user.email);
            window.location.href = DASHBOARD_URL;
        })
        .catch((error) => {
            const errorMessage = getFirebaseErrorMessage(error.code);
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
        });
}


// --- 3. Lógica de LOGOUT (Adaptada para Auth v9) ---

window.logout = function() {
    auth.signOut()
        .then(() => {
            window.location.href = LOGIN_URL;
        })
        .catch((error) => {
            console.error("Erro ao fazer logout:", error);
            alert("Não foi possível sair. Tente novamente.");
        });
};


// --- 4. Verificação de Status de Autenticação (Guarda de Rota) (Adaptada para Auth v9) ---

function checkAuthStatus() {
    auth.onAuthStateChanged((user) => {
        const isAuthPage = document.body.id === 'login-page' || document.body.id === 'cadastro-page';
        
        if (user) {
            // Usuário logado
            if (isAuthPage) {
                // Se estiver nas páginas de login/cadastro, redireciona para o dashboard
                window.location.href = DASHBOARD_URL;
            }
        } else {
            // Usuário deslogado
            if (!isAuthPage) {
                // Se estiver em qualquer outra página (dashboard, areas, etc.), redireciona para o login
                window.location.href = LOGIN_URL;
            }
        }
    });
}


// --- Inicialização e Escutas de Eventos ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configura as escutas de formulário
    const cadastroForm = document.getElementById('form-cadastro');
    const loginForm = document.getElementById('form-login');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastro);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 2. Configura a verificação de autenticação para proteger as rotas
    checkAuthStatus();
});