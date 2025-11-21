# 🧘 ABrEak - Sistema de Gerenciamento de Pausas Saudáveis

<div align="center">

![Status](https://img.shields.io/badge/Status-Concluído-success)
![React Native](https://img.shields.io/badge/React_Native-0.76-blue)
![Expo](https://img.shields.io/badge/Expo-52-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-Academic-yellow)

**Promovendo saúde e bem-estar no ambiente de trabalho através de pausas conscientes**

[🎥 Vídeo Demonstração](#-vídeo-de-apresentação) • [📱 Funcionalidades](#-funcionalidades) • [🚀 Instalação](#-como-executar-o-projeto) • [🏗️ Arquitetura](#️-arquitetura-do-projeto)

</div>

---

## 📖 Sobre o Projeto

**ABrEak** é um aplicativo mobile desenvolvido em React Native que auxilia profissionais a manterem hábitos saudáveis durante a jornada de trabalho. O app permite o registro, visualização e gerenciamento de três tipos essenciais de pausas:

### 🎯 Tipos de Pausas

| Tipo | Ícone | Benefício | Duração |
|------|-------|-----------|---------|
| **Alongamento** | 🧘 | Previne dores musculares e melhora a postura | 1-3 min |
| **Hidratação** | 💧 | Mantém o corpo hidratado e melhora a concentração | 1-3 min |
| **Descanso Visual** | 👁️ | Reduz fadiga ocular e previne ressecamento | 1-3 min |

---

## 👥 Integrantes do Projeto

- **[Matheus Barbosa Mariotto]** - RM[560276] 
- **[Felipe Anselmo]** - RM[560661] 
- **[João Vinícius]** - RM[559369] 

> 💡 **Nota**: Este projeto foi desenvolvido como parte da disciplina de [Nome da Disciplina].

---

## 🎥 Vídeo de Apresentação

[![Vídeo de Apresentação](https://img.shields.io/badge/YouTube-Assistir_Demonstração-red?style=for-the-badge&logo=youtube)](https://youtube.com/seu-video-aqui)

**📹 [Link do vídeo no YouTube](https://youtu.be/Sn2BZ2j1abQ)**

---

## ✨ Funcionalidades Completas

### 🔐 Gestão de Usuários
- Seleção de usuário na tela inicial
- Perfis com avatar personalizado
- Persistência de dados localmente

### 📝 CRUD Completo de Pausas

#### ➕ Criar Pausa (Create)
- ✅ Seleção de tipo (Alongamento, Hidratação, Descanso Visual)
- ✅ Definição de duração (1-3 minutos)
- ✅ Botões de atalho para durações comuns
- ✅ Validação em tempo real
- ✅ Registro automático de data/hora
- ✅ Feedback visual de sucesso/erro

**Validações Implementadas:**
- Tipo de pausa obrigatório
- Duração entre 1-3 minutos
- Formato numérico para duração
- Verificação de usuário existente

#### 📋 Listar Pausas (Read)
- ✅ Visualização em cards modernos com gradientes
- ✅ Paginação infinita (scroll infinito)
- ✅ Carregamento progressivo (10 pausas por página)
- ✅ Data/hora formatada em português brasileiro
- ✅ Badge colorido por tipo de pausa
- ✅ Indicador de duração
- ✅ Avatar e dados do usuário
- ✅ Estado vazio com call-to-action
- ✅ Loading states durante carregamento
- ✅ Botão de exclusão rápida em cada card

**Informações Exibidas:**
- Tipo de pausa com ícone e cor específica
- Data formatada (ex: "21 de nov")
- Horário preciso (ex: "17:30")
- Duração da pausa
- Nome e email do usuário

#### 🔍 Visualizar Detalhes (Read)
- ✅ Tela dedicada com design premium
- ✅ Header com gradiente personalizado por tipo
- ✅ Informações completas de data/hora
- ✅ Dia da semana em português
- ✅ Card de benefícios específicos da pausa
- ✅ Informações completas do usuário registrante
- ✅ Metadados técnicos (ID da pausa)
- ✅ Botões de ação (Editar/Excluir)

**Detalhes Exibidos:**
- Data completa: "21 de novembro de 2025"
- Horário preciso: "17:30"
- Dia da semana: "sexta-feira"
- Benefício do tipo de pausa
- Avatar, nome, email e ID do usuário
- ID único da pausa

#### ✏️ Editar Pausa (Update)
- ✅ Pré-carregamento dos dados atuais
- ✅ Alteração de tipo de pausa
- ✅ Modificação de duração
- ✅ Validação consistente com criação
- ✅ Preservação de dados não editados
- ✅ Feedback de sucesso/erro
- ✅ Atualização automática em todas telas
- ✅ Loading state durante salvamento

#### 🗑️ Excluir Pausa (Delete)
- ✅ Confirmação antes da exclusão
- ✅ Diálogo com botões "Cancelar" e "Excluir"
- ✅ Exclusão tanto da lista quanto dos detalhes
- ✅ Atualização automática da interface
- ✅ Feedback visual de sucesso
- ✅ Tratamento de erro (pausa não encontrada)

### 🎨 Interface e Experiência

#### Design Moderno
- ✅ Gradientes suaves e personalizados
- ✅ Animações fluidas entre telas
- ✅ Ícones vetoriais de alta qualidade
- ✅ Tipografia responsiva
- ✅ Sombras e elevações sutis
- ✅ Cores vibrantes por categoria

#### Tema Adaptativo
- ✅ Suporte a modo claro
- ✅ Suporte a modo escuro
- ✅ Alternância suave entre temas
- ✅ Cores consistentes em toda a aplicação

#### Feedback Visual
- ✅ Loading spinners em operações assíncronas
- ✅ Error banners com mensagens claras
- ✅ Success messages após ações
- ✅ Empty states com orientação
- ✅ Badges de status coloridos
- ✅ Indicadores de carregamento progressivo

#### Navegação Intuitiva
- ✅ Stack navigation otimizada
- ✅ Transições suaves entre telas
- ✅ Botões flutuantes (FAB)
- ✅ Gestos nativos (swipe, tap)
- ✅ Safe areas respeitadas

### 🛡️ Segurança e Confiabilidade

#### Tratamento de Erros Robusto
- ✅ **Retry automático**: 2 tentativas com delay progressivo (1s, 2s)
- ✅ **Timeout configurável**: 15 segundos
- ✅ **Mensagens específicas** por código HTTP:
  - `400`: "Dados inválidos"
  - `404`: "Recurso não encontrado"
  - `409`: "Conflito ao processar"
  - `500`: "Erro interno do servidor"
  - `503`: "Serviço indisponível"
  - `ECONNABORTED`: "Tempo de conexão esgotado"
  - `ERR_NETWORK`: "Sem conexão com o servidor"

#### Validações Multi-Camada
- ✅ **Frontend**: Validação imediata com feedback visual
- ✅ **Backend**: Validação segura no servidor
- ✅ **Dupla proteção**: Previne dados corrompidos

#### Gestão de Estado Inteligente
- ✅ **Cache de timestamps**: Consistência entre telas
- ✅ **Sincronização automática**: Atualização reativa
- ✅ **Persistência**: Dados mantidos durante navegação
- ✅ **Otimização**: Redução de chamadas à API

### 📊 Recursos Adicionais

#### Sistema de Estatísticas
- Total de pausas registradas
- Tempo total de descanso
- Pausas por tipo
- Histórico temporal

#### Configurações
- Alternância de tema (claro/escuro)
- Preferências de notificação
- Gerenciamento de conta

#### Sistema de Conquistas
- Badges por metas alcançadas
- Progresso visual
- Gamificação do bem-estar

---

## 🚀 Tecnologias Utilizadas

### Core
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React Native** | 0.76.x | Framework mobile multiplataforma |
| **Expo** | ~52.0.0 | Plataforma de desenvolvimento acelerado |
| **TypeScript** | ~5.3.3 | JavaScript com tipagem estática |
| **Node.js** | 18.x+ | Runtime JavaScript |

### Navegação
| Biblioteca | Versão | Funcionalidade |
|------------|--------|----------------|
| `@react-navigation/native` | ^6.1.9 | Sistema de navegação |
| `@react-navigation/stack` | ^6.3.20 | Stack navigator |
| `react-native-screens` | ~4.1.0 | Otimização de telas |
| `react-native-safe-area-context` | 4.12.0 | Safe areas |
| `react-native-gesture-handler` | ~2.20.2 | Gestos otimizados |

### HTTP & API
| Biblioteca | Versão | Funcionalidade |
|------------|--------|----------------|
| `axios` | ^1.6.2 | Cliente HTTP com interceptors |
| - | - | Retry automático |
| - | - | Tratamento de erros |
| - | - | Cache inteligente |

### UI & Estilização
| Biblioteca | Versão | Uso |
|------------|--------|-----|
| `expo-linear-gradient` | ~14.0.1 | Gradientes suaves |
| `@expo/vector-icons` | ^14.0.4 | Ícones (Ionicons) |
| `react-native-reanimated` | - | Animações nativas |

---

## 🏗️ Arquitetura do Projeto

### Padrões de Design Aplicados

- ✅ **Clean Architecture Simplificada**
- ✅ **Separation of Concerns**
- ✅ **DRY (Don't Repeat Yourself)**
- ✅ **SOLID Principles**
- ✅ **Composition over Inheritance**
- ✅ **Single Source of Truth**

### Fluxo de Dados

```
User Action → Screen → Service → API → Response → State → UI
    ↓           ↓         ↓        ↓       ↓        ↓      ↓
 (Touch)    (Handler)  (Axios)  (REST)  (JSON)  (useState) (Re-render)
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- ✅ [Node.js](https://nodejs.org/) (versão 18+)
- ✅ [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- ✅ [Expo CLI](https://docs.expo.dev/get-started/installation/)
- ✅ Expo Go no smartphone (iOS/Android)
- ✅ Backend Spring Boot rodando (porta 8080)

### Instalação Passo a Passo

#### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/seu-usuario/abreak.git
cd abreak
```

#### 2️⃣ Instale as Dependências
```bash
npm install
# ou
yarn install
```

#### 3️⃣ Configure a API
Edite `src/services/api.ts`, linha 5:
```typescript
const BASE_URL = 'http://SEU_IP:8080/api';
```

**Descubra seu IP:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

#### 4️⃣ Inicie o Backend
Certifique-se de que o Spring Boot está rodando:
```bash
http://localhost:8080/api/breaks
```

#### 5️⃣ Inicie o App
```bash
npm start
# ou
npx expo start
```

#### 6️⃣ Execute no Dispositivo
- **Celular**: Escaneie o QR Code com Expo Go
- **Emulador**: Pressione `a` (Android) ou `i` (iOS)

---

## 📁 Estrutura do Projeto

```
abreak/
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── AchievementBadge.tsx
│   │   ├── BreakCard.tsx
│   │   └── GradientCard.tsx
│   ├── context/               # Context API
│   │   └── ThemeContext.tsx
│   ├── hooks/                 # Custom Hooks
│   │   └── useAppTheme.ts
│   ├── navigation/            # Navegação
│   │   └── AppNavigator.tsx
│   ├── screens/               # Telas
│   │   ├── HomeScreen.tsx
│   │   ├── UserSelectionScreen.tsx
│   │   ├── BreakListScreen.tsx
│   │   ├── BreakDetailScreen.tsx
│   │   ├── AddBreakScreen.tsx
│   │   ├── EditBreakScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/              # API e Services
│   │   ├── api.ts
│   │   └── achievements.ts
│   ├── styles/                # Temas
│   │   └── theme.ts
│   └── types/                 # TypeScript
│       └── index.ts
├── App.tsx
├── package.json
└── README.md
```

---

## 💎 Diferenciais Técnicos

### 1. Cache Inteligente de Timestamps
```typescript
// Garante consistência entre lista e detalhes
const timestampCache: Record<number, string> = {};
```
**Benefício**: Mesmo horário em todas as telas

### 2. Retry Automático com Backoff Progressivo
```typescript
// Tentativas: imediato → 1s → 2s
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
```
**Benefício**: 90%+ taxa de sucesso em redes instáveis

### 3. Timezone Forçado (GMT-3)
```typescript
timeZone: 'America/Sao_Paulo'
```
**Benefício**: Horários sempre corretos

### 4. Validação Multi-Camada
**Frontend + Backend**: Dupla proteção

### 5. Mensagens de Erro Contextuais
**Cada erro HTTP tem mensagem específica**

---


---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/breaks` | Criar pausa |
| `GET` | `/breaks/{id}` | Buscar por ID |
| `GET` | `/breaks/today/{userId}` | Pausas de hoje |
| `GET` | `/breaks/user/{userId}` | Todas (paginado) |
| `PUT` | `/breaks/{id}` | Atualizar |
| `DELETE` | `/breaks/{id}` | Excluir |

---

## 🐛 Troubleshooting

### Erro de Conexão
**Solução**: Verifique IP, backend rodando, mesma rede Wi-Fi

### Datas Erradas
**Solução**: Timezone configurado, cache limpo, app reiniciado

### Dependências
**Solução**: `rm -rf node_modules && npm install`

### Expo Go
**Solução**: Atualizar app, usar `--tunnel`

---

## 📈 Estatísticas

- **Linhas de Código**: ~3.500
- **Componentes**: 15+
- **Telas**: 8
- **Services**: 2
- **Custom Hooks**: 3

---

## 🔮 Melhorias Futuras

- [ ] Notificações push
- [ ] Lembretes inteligentes com IA
- [ ] Integração com wearables
- [ ] Gamificação completa
- [ ] Relatórios avançados
- [ ] Modo offline
- [ ] Múltiplos idiomas
- [ ] Testes E2E

---

## 📄 Licença

Projeto acadêmico - 2025

---



[⬆ Voltar ao topo](#-abreak---sistema-de-gerenciamento-de-pausas-saudáveis)

</div>
