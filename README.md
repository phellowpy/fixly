<div align="center">
  <img src="front-end/img/logo-fixly.gif" width="200" height="200">
</div>

# Fixly — Central de Manutenção Doméstica Preventiva

O **Fixly** é um sistema inteligente para controle, previsão e organização de manutenções domésticas. Ele permite que usuários cadastrem seus equipamentos, definam regras de manutenção periódica, façam upload de comprovantes e recebam alertas automáticos sobre futuras manutenções.

---

## Índice
- [Páginas e Funcionalidades](#páginas-e-funcionalidades)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

---


---

## Páginas e Funcionalidades

O projeto é composto por páginas específicas para cada função do sistema. O diagrama do banco de dados e o modelo entidade-relacionamento representam toda a base estrutural do projeto.

### `index.html` (Página Inicial)
- **Descrição:** Página de entrada do sistema.
- **Funcionalidade:** Apresenta o Fixly e direciona o usuário para login ou cadastro.

### `html/login.html` e `html/cadastro.html`
- **Descrição:** Autenticação e registro de usuários.
- **Funcionalidade:** Permite acesso seguro ao sistema.

### `html/dashboard.html` (Painel Principal)
- **Descrição:** Tela principal após o login.
- **Funcionalidade:** Exibe resumo de equipamentos, próximas manutenções e alertas ativos.

### `html/equipamentos.html` (Meus Equipamentos)
- **Descrição:** Lista todos os equipamentos cadastrados.
- **Funcionalidade:** Permite visualizar, editar e excluir equipamentos.

### `html/cadastrar_equipamento.html` (Novo Equipamento)
- **Descrição:** Formulário de cadastro de equipamentos.
- **Funcionalidade:** Registra dados como nome, categoria, fabricante, data de compra e garantia.

### `html/manutencoes.html` (Histórico de Manutenção)
- **Descrição:** Histórico completo de manutenções.
- **Funcionalidade:**
  - Registro de manutenções realizadas
  - Upload de comprovantes
  - Visualização por equipamento

### `html/manutwncao.html` (Alertas de Manutenção)
- **Descrição:** Tela de alertas automáticos.
- **Funcionalidade:** Mostra manutenções previstas, pendentes, feitas ou ignoradas.

### `html/perfil.html` (Perfil do Usuário)
- **Descrição:** Dados do usuário.
- **Funcionalidade:** Atualização de dados pessoais e endereço.

---

## Funcionalidades Principais

- **Cadastro de Usuários:** Login, autenticação e perfis.
- **Gestão de Equipamentos:** Registro completo dos equipamentos.
- **Regras de Manutenção:** Definição de periodicidade por equipamento.
- **Histórico de Manutenção:** Registro detalhado das ações realizadas.
- **Extração de Dados:** Leitura automática de data e periodicidade.
- **Geração de Alertas:** Avisos automáticos de próximas manutenções.
- **Logs e Auditoria:** Registro de ações do sistema.

---

## Tecnologias Utilizadas

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![FIREBASE](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

- **HTML5:** Estrutura das páginas.
- **CSS3:** Estilização e layout.
- **JavaScript:** Interatividade e regras no front-end.
- **Python:** Simulação da lógica do sistema.
- **MySQL/PostgreSQL:** Banco de dados relacional.
- **`db.js`:** Simulação de persistência local no navegador.

---

