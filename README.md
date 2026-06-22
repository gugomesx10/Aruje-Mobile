# Arujé Mobile

Aplicativo mobile do **Arujé**, uma plataforma de monitoramento agrícola inteligente que conecta dados de sensores IoT, alertas automatizados e análises inteligentes para apoiar a tomada de decisão no campo.

O app foi desenvolvido com **React Native + Expo + TypeScript** e consome a API do projeto **Arujé Back-End**, exibindo informações reais de sensores, leituras, alertas e análises geradas a partir do processamento dos dados.

---

## Visão geral

O **Arujé Mobile** é a interface mobile da solução Arujé.
Ele permite que o usuário acompanhe, de forma visual e simples, o estado da lavoura monitorada por sensores IoT.

A aplicação exibe:

* Login com autenticação JWT
* Sessão persistida
* Painel principal com indicadores da lavoura
* Saúde da API
* Sensores cadastrados
* Leituras IoT recentes
* Alertas gerados automaticamente
* Análises inteligentes com recomendação
* Navegação inferior entre telas

---

## Objetivo do projeto

O objetivo do Arujé Mobile é complementar o back-end da plataforma, criando uma experiência visual para o usuário final.

Enquanto o back-end recebe e processa os dados agrícolas, o mobile apresenta essas informações de forma acessível, permitindo acompanhar rapidamente:

* Temperatura
* Umidade do ar
* Umidade do solo
* Luminosidade
* Quantidade de leituras
* Alertas ativos
* Análises inteligentes
* Recomendações automáticas

---

## Arquitetura geral da solução

O projeto mobile faz parte de uma arquitetura maior:

```text
Wokwi / ESP32
     ↓
Arujé API
     ↓
PostgreSQL
     ↓
Outbox Pattern
     ↓
RabbitMQ
     ↓
Worker
     ↓
Alertas + Análises IA
     ↓
Arujé Mobile
```

O mobile não se comunica diretamente com o Wokwi.
Ele consome os dados já processados pela API.

---

## Tecnologias utilizadas

### Mobile

* React Native
* Expo
* TypeScript
* Axios
* React Navigation
* Bottom Tabs
* AsyncStorage
* Expo Vector Icons

### Integração

* API REST
* JWT Bearer Token
* Variáveis de ambiente com `EXPO_PUBLIC_`
* Consumo de endpoints protegidos

### Back-end consumido

* .NET 8
* PostgreSQL
* RabbitMQ
* Worker Service
* Outbox Pattern
* Swagger
* Prometheus
* Grafana
* Wokwi/ESP32 para simulação IoT

---

## Funcionalidades

### Autenticação

O app possui tela de login integrada com a API.

Funcionalidades da autenticação:

* Envio de e-mail e senha para a API
* Recebimento do token JWT
* Salvamento do token no AsyncStorage
* Sessão persistida mesmo ao atualizar ou reabrir o app
* Logout com limpeza dos dados locais

---

### Painel principal

A tela principal exibe um resumo da lavoura inteligente:

* Saúde da API
* Temperatura mais recente
* Umidade do ar
* Umidade do solo
* Luminosidade
* Total de leituras
* Total de alertas
* Total de análises IA
* Última análise inteligente gerada

---

### Sensores

A tela de sensores lista os dispositivos cadastrados na API.

Ela exibe informações como:

* Nome do sensor
* Tipo do sensor
* Status
* Identificador
* Descrição
* Data de criação, quando disponível

---

### Leituras IoT

A tela de leituras mostra os dados recebidos da simulação IoT.

Cada leitura pode conter:

* Temperatura
* Umidade do ar
* Umidade do solo
* Luminosidade
* Data e horário da leitura
* Indicação visual se a leitura está normal ou em risco

---

### Alertas

A tela de alertas apresenta ocorrências geradas automaticamente pelo back-end.

Os alertas são gerados quando as leituras indicam algum risco, por exemplo:

* Temperatura elevada
* Baixa umidade do solo
* Risco de estresse hídrico

A tela exibe:

* Título do alerta
* Descrição
* Severidade
* Status
* Data de criação

---

### Análises IA

A tela de análises apresenta recomendações automáticas baseadas nos alertas.

Cada análise possui:

* Nível de risco
* Motivo
* Recomendação
* Provider da análise
* Data de criação

Atualmente, o projeto utiliza um provider simulado baseado em regras:

```text
RuleBased-Mock
```

Esse modelo permite demonstrar o comportamento de uma análise inteligente sem depender de uma API externa de IA.

---

## Estrutura de pastas

```text
Aruje-Mobile/
├── src/
│   ├── config/
│   │   └── apiConfig.ts
│   │
│   ├── navigation/
│   │   └── MainTabs.tsx
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── SensorsScreen.tsx
│   │   ├── ReadingsScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   └── AnalysesScreen.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── dashboardService.ts
│   │
│   ├── storage/
│   │   └── authStorage.ts
│   │
│   └── theme/
│       └── colors.ts
│
├── .env.example
├── .gitignore
├── App.tsx
├── package.json
└── README.md
```

---

## Pré-requisitos

Antes de rodar o mobile, é necessário ter instalado:

* Node.js
* npm
* Expo CLI via `npx`
* Git
* API Arujé rodando localmente
* Docker Desktop, caso o back-end esteja rodando via Docker

---

## Configuração do ambiente

O projeto utiliza variável de ambiente para definir a URL da API.

Crie um arquivo `.env.local` na raiz do projeto:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

O arquivo `.env.local` não deve ser enviado para o GitHub.

O arquivo `.env.example` deve conter:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/gugomesx10/Aruje-Mobile.git
```

Entre na pasta do projeto:

```bash
cd Aruje-Mobile
```

Instale as dependências:

```bash
npm install
```

---

## Rodando o projeto

Para iniciar o Expo:

```bash
npx expo start
```

Para abrir no navegador:

```text
Pressione w
```

Para abrir no celular com Expo Go:

```text
Escaneie o QR Code exibido no terminal
```

---

## Rodando com a API local

Para testar no navegador usando o Expo Web, a variável pode apontar para:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

A API precisa estar rodando em:

```text
http://localhost:8080
```

Exemplo de teste da API:

```bash
curl http://localhost:8080/health
```

---

## Rodando no celular com Expo Go

Quando o app for testado em um celular físico, o endereço `localhost` do computador não será acessível diretamente pelo aparelho.

Nesse caso, é possível usar o LocalTunnel para expor temporariamente a API local.

No projeto do back-end, rode:

```bash
npx localtunnel --port 8080
```

O comando irá gerar uma URL temporária, por exemplo:

```text
https://sua-url-temporaria.loca.lt
```

Depois, atualize o `.env.local` do mobile:

```env
EXPO_PUBLIC_API_BASE_URL=https://sua-url-temporaria.loca.lt
```

Reinicie o Expo limpando o cache:

```bash
npx expo start -c
```

Importante: a URL gerada pelo LocalTunnel é temporária e não deve ser commitada.

---

## Integração com o back-end

O app consome endpoints da API Arujé.

Principais rotas utilizadas:

```text
POST /api/auth/login
GET  /health
GET  /api/sensors
GET  /api/sensor-readings
GET  /api/alerts
GET  /api/ai-analyses
```

A autenticação é feita via JWT.

Após o login, o token é salvo localmente e enviado automaticamente nas próximas requisições por meio do header:

```text
Authorization: Bearer {token}
```

---

## Usuário de demonstração

Quando o back-end está com seed de demonstração habilitado, é possível utilizar:

```text
E-mail: gustavo@aruje.com
Senha: Aruje123@
```

Essas credenciais são apenas para ambiente de demonstração.

---

## Fluxo de autenticação

```text
Usuário informa e-mail e senha
        ↓
App envia POST /api/auth/login
        ↓
API retorna dados do usuário e token JWT
        ↓
App salva o token no AsyncStorage
        ↓
App libera acesso às telas protegidas
        ↓
Token é enviado automaticamente nas requisições seguintes
```

---

## Fluxo dos dados IoT

```text
Wokwi simula sensores agrícolas
        ↓
ESP32 envia leituras para a API
        ↓
API salva leitura no banco
        ↓
API registra evento na tabela de Outbox
        ↓
Worker publica/processa evento
        ↓
Sistema gera alerta quando necessário
        ↓
Sistema gera análise inteligente
        ↓
Mobile exibe os dados processados
```

---

## Telas do app

### Login

Tela inicial do aplicativo.

Permite autenticar o usuário na API.

---

### Painel

Resumo geral da lavoura inteligente.

Exibe:

* Saúde da API
* Última temperatura
* Última umidade do ar
* Última umidade do solo
* Última luminosidade
* Total de leituras
* Total de alertas
* Total de análises IA
* Última recomendação inteligente

---

### Sensores

Lista os sensores cadastrados na plataforma.

---

### Leituras

Lista as leituras IoT recebidas.

---

### Alertas

Lista os alertas gerados automaticamente pelo Worker.

---

### Análises

Lista as análises inteligentes e recomendações geradas a partir dos alertas.

---

## Visual e identidade

O app utiliza uma identidade visual inspirada no contexto agrícola.

Principais características:

* Tons verdes e terrosos
* Cards arredondados
* Layout limpo
* Navegação inferior
* Ícones temáticos
* Interface focada em leitura rápida dos dados

---

## Comandos úteis

Instalar dependências:

```bash
npm install
```

Rodar Expo:

```bash
npx expo start
```

Rodar limpando cache:

```bash
npx expo start -c
```

Instalar dependência compatível com Expo:

```bash
npx expo install nome-do-pacote
```

Ver status do Git:

```bash
git status
```

---

## Git Flow

O projeto segue um fluxo baseado em branches:

```text
main      → versão estável
develop   → desenvolvimento
feature/* → novas funcionalidades
release/* → preparação de release
```

Exemplo de criação de feature:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature
```

Commit:

```bash
git add .
git commit -m "feat: descrição da funcionalidade"
```

Merge na develop:

```bash
git checkout develop
git merge feature/nome-da-feature
git push origin develop
```

---

## Releases

Para criar uma release:

```bash
git checkout develop
git checkout -b release/v1.0.0
```

Merge na main:

```bash
git checkout main
git merge release/v1.0.0
git push origin main
```

Criar tag:

```bash
git tag -a v1.0.0 -m "Release mobile MVP"
git push origin v1.0.0
```

---

## Status do projeto

Status atual:

```text
MVP funcional concluído
```

Funcionalidades concluídas:

* Login com API
* Persistência de sessão
* Dashboard com dados reais
* Tela de sensores
* Tela de leituras
* Tela de alertas
* Tela de análises IA
* Navegação inferior
* Configuração de URL por ambiente
* Integração com o back-end Arujé

---

## Próximas melhorias

Possíveis melhorias futuras:

* Tela de detalhes de um sensor
* Tela de detalhes de uma leitura
* Filtros por período
* Filtros por severidade
* Gráficos no mobile
* Pull to refresh
* Refresh automático
* Splash screen personalizada
* Ícone do app
* Tema escuro
* Deploy mobile com EAS
* Build Android
* Build iOS

---

## Autor

Desenvolvido por **Gustavo Gomes**.

Projeto criado para fins acadêmicos, estudo de arquitetura, integração mobile e composição de portfólio na área de desenvolvimento de software.

---

## Licença

Este projeto é de uso acadêmico e demonstrativo.
