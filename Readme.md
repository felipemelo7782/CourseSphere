# CourseSphere - Gestão de Cursos Online Colaborativa  

![React](https://img.shields.io/badge/React-18.2.0-blue)  
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC)  
![JSON Server](https://img.shields.io/badge/JSON%20Server-0.17.4-green)  

---

## 📖 Índice / Index  

### Português  
- [Sobre o Projeto](#português-sobre-o-projeto)  
- [Funcionalidades](#português-funcionalidades)  
- [Tecnologias](#português-tecnologias)  
- [Pré-requisitos](#português-pré-requisitos)  
- [Instalação e Execução](#português-instalação-e-execução)  
- [Estrutura do Projeto](#português-estrutura-do-projeto)  
- [Credenciais de Teste](#português-credenciais-de-teste)  

### English  
- [About the Project](#english-about-the-project)  
- [Features](#english-features)  
- [Technologies](#english-technologies)  
- [Prerequisites](#english-prerequisites)  
- [Installation and Execution](#english-installation-and-execution)  
- [Project Structure](#english-project-structure)  
- [Test Credentials](#english-test-credentials)  

---

## Português  

### Sobre o Projeto  
O **CourseSphere** é uma plataforma moderna para gestão colaborativa de cursos e aulas, permitindo que múltiplos instrutores e estudantes autenticados interajam em um ambiente educacional digital.  
```text
Projeto foi proposto como um desafio pra min... desafio cumprido , porem com melhorias a se fazer 🧑‍💻👨‍💻
```

### Funcionalidades  
✅ Autenticação de usuários com controle de acesso  
✅ CRUD completo de cursos e aulas  
✅ Controle de permissões baseado em roles  
✅ Sistema de busca com filtros e paginação  
✅ Interface responsiva com TailwindCSS  
✅ Integração com API externa para sugestão de instrutores  

### Tecnologias  
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS  
- **Backend**: JSON Server (API REST simulada)  
- **Ferramentas**: React Hook Form, React Router, Axios  

### Pré-requisitos  
- Node.js 16+  
- npm ou yarn  
- Git  

### Instalação e Execução  
```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/coursesphere.git
cd coursesphere

# 2. Instale as dependências de ambos os projetos
npm run install:all

# 3. Execute o projeto (frontend + backend)
npm run dev

# Ou execute separadamente:
# Terminal 1 - JSON Server (backend)
npm run dev:mock

# Terminal 2 - React App (frontend)
npm run dev:front
```

### Estrutura do Projeto  
```text
coursesphere/
├── front/                 # Aplicação React
│   ├── src/
│   │   ├── components/   # Componentes (Atomic Design)
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── services/     # Serviços de API
│   │   ├── types/        # Tipos TypeScript
│   │   ├── utils/        # Utilitários e helpers
│   │   └── hooks/        # Custom hooks
│   ├── package.json
│   └── vite.config.ts
├── mock/                  # JSON Server (API)
│   ├── db.json           # Banco de dados JSON
│   └── package.json
└── package.json          # Scripts raiz
```

### Credenciais de Teste  
- **Admin**: `felipe@example.com` / `123456`  
- **Instrutor**: `instructor1@email.com` / `123456`  
- **Estudante**: `student1@email.com` / `123456`

---

## English  

### About the Project  
**CourseSphere** is a modern platform for collaborative course and class management, allowing multiple instructors and authenticated students to interact in a digital learning environment.  

### Features  
✅ User authentication with access control  
✅ Full CRUD for courses and classes  
✅ Role-based permissions management  
✅ Search system with filters and pagination  
✅ Responsive UI with TailwindCSS  
✅ External API integration for instructor suggestions  

### Technologies  
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS  
- **Backend**: JSON Server (mock REST API)  
- **Tools**: React Hook Form, React Router, Axios  

### Prerequisites  
- Node.js 16+  
- npm or yarn  
- Git  

### Installation and Execution  
```bash
# 1. Clone the repository
git clone https://github.com/your-username/coursesphere.git
cd coursesphere

# 2. Install dependencies for both projects
npm run install:all

# 3. Run the project (frontend + backend)
npm run dev

# Or run separately:
# Terminal 1 - JSON Server (backend)
npm run dev:mock

# Terminal 2 - React App (frontend)
npm run dev:front
```

### Project Structure  
```text
coursesphere/
├── front/                 # React application
│   ├── src/
│   │   ├── components/   # Components (Atomic Design)
│   │   ├── pages/        # Application pages
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utilities and helpers
│   │   └── hooks/        # Custom hooks
│   ├── package.json
│   └── vite.config.ts
├── mock/                  # JSON Server (API)
│   ├── db.json           # JSON database
│   └── package.json
└── package.json          # Root scripts
```

### Test Credentials  
- **Admin**: `admin@email.com` / `123456`  
- **Instructor**: `instructor1@email.com` / `123456`  
- **Student**: `student1@email.com` / `123456`
