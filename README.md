# Arujé Mobile

Aplicativo mobile do **Arujé**, uma plataforma de monitoramento agrícola inteligente que conecta dados de sensores IoT, alertas automatizados, análises inteligentes e assistente virtual com RAG para apoiar a tomada de decisão no campo.

O app foi desenvolvido com **React Native + Expo + TypeScript** e consome a API do projeto **Arujé Back-End**, exibindo informações reais de sensores, leituras, alertas, análises e respostas geradas pela **Arujé IA**.

---

## Status atual

Versão atual:

```text
v1.0.7
```

Status do projeto:

```text
MVP funcional com autenticação, RBAC, integração mobile, IoT, alertas, análises IA, assistente RAG, gráficos, análise temporal e microinterações visuais.
```

Funcionalidades concluídas:

* Login com API
* Autenticação JWT
* Persistência de sessão
* Controle de acesso por perfil: Admin, Manager e Operator
* Dashboard com dados reais
* Exibição do usuário logado e perfil no Dashboard
* Tela de sensores
* Tela de leituras IoT
* Gráficos das leituras IoT
* Resumo temporal das leituras
* Tela de alertas
* Tela de análises inteligentes
* Telas de detalhes para leituras, alertas, análises e sensores
* Integração dos detalhes com a Arujé IA
* Navegação inferior
* Configuração de URL por ambiente
* Integração com o back-end Arujé
* Chat com assistente virtual Arujé IA
* Envio de histórico de conversa para o RAG
* Exibição de fontes consultadas pelo RAG
* Exibição de risco e recomendação quando houver análise agrícola
* Botão flutuante da Arujé IA
* Microinterações visuais
* Loading premium no Dashboard e em Leituras
* Refresh animado
* Empty state melhorado em Leituras

---

## Visão geral

O **Arujé Mobile** é a interface mobile da solução Arujé.

Ele permite que o usuário acompanhe, de forma visual e simples, o estado da lavoura monitorada por sensores IoT.

A aplicação exibe:

* Login com autenticação JWT
* Sessão persistida
* Controle de acesso por perfil
* Painel principal com indicadores da lavoura
* Saúde da API
* Informações do usuário logado
* Sensores cadastrados
* Leituras IoT recentes
* Gráficos e análise temporal das leituras
* Alertas gerados automaticamente
* Análises inteligentes com recomendação
* Detalhes de leituras, alertas, análises e sensores
* Assistente virtual agrícola com RAG
* Microinterações visuais e loading premium
* Navegação inferior entre telas

---

## Objetivo do projeto

O objetivo do Arujé Mobile é complementar o back-end da plataforma, criando uma experiência visual e acessível para o usuário final.

Enquanto o back-end recebe e processa os dados agrícolas, o mobile apresenta essas informações de forma simples, permitindo acompanhar rapidamente:

* Temperatura
* Umidade do ar
* Umidade do solo
* Luminosidade
* Quantidade de leituras
* Alertas ativos
* Análises inteligentes
* Recomendações automáticas
* Tendências das leituras IoT
* Pior ponto recente da lavoura
* Dados de mínimo, máximo e variação
* Explicações em linguagem natural com a Arujé IA
* Experiência diferenciada por perfil de usuário

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
Worker Service
     ↓
Alertas + Análises IA
     ↓
Arujé Mobile
     ↓
Arujé IA / RAG / Gemini
```

O mobile não se comunica diretamente com o Wokwi.

Ele consome os dados já processados pela API e envia perguntas para o endpoint RAG do back-end.

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
* React Native SVG
* Animated API

### Integração

* API REST
* JWT Bearer Token
* Variáveis de ambiente com `EXPO_PUBLIC_`
* Consumo de endpoints protegidos
* Consumo de endpoint RAG
* Envio de histórico de conversa para o back-end

### Back-end consumido

* .NET 8
* PostgreSQL
* RabbitMQ
* Worker Service
* Outbox Pattern
* Swagger
* Prometheus
* Grafana
* Gemini API
* RAG
* Wokwi/ESP32 para simulação IoT

---

## Funcionalidades

### Autenticação

O app possui tela de login integrada com a API.

Funcionalidades da autenticação:

* Envio de e-mail e senha para a API
* Recebimento do token JWT
* Salvamento do token no AsyncStorage
* Salvamento dos dados do usuário autenticado
* Sessão persistida mesmo ao atualizar ou reabrir o app
* Logout com limpeza dos dados locais

---

### Controle de acesso por perfil

A partir da versão `v1.0.4`, o aplicativo respeita os perfis retornados pelo back-end.

Perfis disponíveis:

```text
Admin
Manager
Operator
```

Regras aplicadas no mobile:

```text
Admin
→ Acesso completo às funcionalidades do aplicativo.

Manager
→ Acesso às áreas operacionais e de acompanhamento da lavoura.

Operator
→ Acesso focado em leituras, alertas, análises e Arujé IA.
```

A tela de sensores fica disponível apenas para perfis com permissão adequada.

---

### Experiência por perfil

O Dashboard exibe informações do usuário autenticado:

* Nome
* E-mail
* Perfil
* Descrição do tipo de acesso

Essa melhoria facilita a demonstração dos diferentes níveis de permissão da plataforma.

---

### Painel principal

A tela principal exibe um resumo da lavoura inteligente.

Ela mostra:

* Saúde da API
* Status online da API
* Usuário logado e perfil de acesso
* Temperatura mais recente
* Umidade do ar
* Umidade do solo
* Luminosidade
* Total de leituras
* Total de alertas
* Total de análises IA
* Atalho para análise temporal
* Última análise inteligente gerada

A partir da versão `v1.0.7`, o status online possui microinteração visual quando a API está saudável.

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

A partir da versão `v1.0.6`, a tela também possui análise temporal e gráficos.

Recursos visuais da tela:

* Resumo temporal das últimas leituras
* Tendência de temperatura
* Tendência de umidade do solo
* Última leitura normal ou em risco
* Pior ponto recente
* Gráfico de temperatura
* Gráfico de umidade do ar
* Gráfico de umidade do solo
* Gráfico de luminosidade
* Valores de mínimo, máximo e variação
* Último ponto destacado no gráfico

Também é possível perguntar para a Arujé IA sobre a evolução das leituras.

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

No fluxo automático do Worker, o projeto utiliza um provider baseado em regras:

```text
RuleBased-Mock
```

Esse modelo permite demonstrar o comportamento de uma análise inteligente sem depender de uma API externa de IA para o processamento assíncrono principal.

---

## Arujé IA

A partir da versão `v1.0.3`, o aplicativo possui uma tela de chat com a **Arujé IA**, um assistente virtual agrícola integrado ao back-end.

A Arujé IA permite que o usuário faça perguntas em linguagem natural sobre a lavoura.

Exemplos:

```text
Por que minha lavoura está em risco?
Tem algum alerta grave agora?
O que eu devo fazer agora?
Explique de forma simples o que aconteceu.
Estou com dificuldade de entender os alertas, pode me ajudar?
```

---

### Integração dos detalhes com a Arujé IA

A partir da versão `v1.0.5`, as telas de detalhes foram conectadas ao assistente virtual.

Fluxos disponíveis:

```text
Detalhe de alerta
→ Perguntar para Arujé IA sobre o alerta

Detalhe de análise
→ Perguntar para Arujé IA sobre a recomendação

Detalhe de leitura
→ Perguntar para Arujé IA sobre a leitura IoT

Tela de leituras
→ Perguntar para Arujé IA sobre a evolução temporal
```

O app abre o chat com uma pergunta contextual pronta, facilitando a explicação dos dados para o usuário.

---

## Como funciona o chat com RAG

O chat do mobile envia a pergunta do usuário para o endpoint:

```http
POST /api/rag/ask
```

O back-end então:

```text
Recebe a pergunta
        ↓
Classifica a intenção
        ↓
Busca dados relevantes no banco
        ↓
Monta o contexto do RAG
        ↓
Inclui histórico recente da conversa
        ↓
Envia para Gemini
        ↓
Retorna resposta, nível de risco, recomendação e fontes
        ↓
Mobile exibe a resposta de forma amigável
```

---

## Histórico de conversa

O mobile envia o histórico recente da conversa para o back-end por meio do campo `conversationHistory`.

Isso permite que o usuário faça perguntas de continuação, como:

```text
E agora?
O que eu faço?
Isso é grave?
E esse alerta?
```

Exemplo de payload enviado pelo mobile:

```json
{
  "question": "E agora, o que eu faço?",
  "maxItems": 8,
  "conversationHistory": [
    {
      "role": "user",
      "content": "Por que minha lavoura está em risco?"
    },
    {
      "role": "assistant",
      "content": "Sua lavoura está em risco por temperatura elevada e baixa umidade do solo."
    }
  ]
}
```

---

## Respostas do assistente

A resposta do endpoint RAG pode conter:

* `answer`
* `riskLevel`
* `recommendation`
* `provider`
* `sources`
* `generatedAt`

Exemplo de resposta:

```json
{
  "question": "Por que minha lavoura está em risco?",
  "answer": "Sua lavoura está em risco por causa da temperatura elevada e da baixa umidade do solo.",
  "riskLevel": "Alto",
  "recommendation": "Verifique a plantação e avalie a necessidade de irrigação.",
  "provider": "Gemini-RAG",
  "sources": [
    {
      "type": "Alert",
      "id": "guid",
      "title": "Risco de estresse hídrico",
      "summary": "Alerta registrado com temperatura elevada e baixa umidade do solo.",
      "relevanceScore": 16,
      "createdAt": "2026-06-26T17:22:48.040842Z"
    }
  ],
  "generatedAt": "2026-06-26T17:32:13.8615225Z"
}
```

---

## Providers do RAG

O mobile pode receber respostas de diferentes providers:

```text
Gemini-RAG
Aruje-Intent-RuleBased
RuleBased-RAG
```

Significado:

```text
Gemini-RAG
→ Resposta gerada pela Gemini com base no contexto recuperado pelo back-end.

Aruje-Intent-RuleBased
→ Resposta direta do classificador de intenção, usada para saudações, ajuda e perguntas simples.

RuleBased-RAG
→ Fallback local do back-end quando a Gemini não está configurada ou falha.
```

Quando a resposta possui fontes consultadas, o mobile exibe:

* Nível de risco
* Recomendação
* Fontes utilizadas
* Score de relevância
* Resumo da fonte

Quando a resposta é apenas conversacional, como `oi` ou `me ajuda`, o mobile exibe apenas o texto da resposta.

---

## Estrutura de pastas

```text
Aruje-Mobile/
├── src/
│   ├── components/
│   │   ├── LineChartCard.tsx
│   │   └── ReadingsChartsSection.tsx
│   │
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
│   │   ├── SensorDetailsScreen.tsx
│   │   ├── ReadingsScreen.tsx
│   │   ├── ReadingDetailsScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   ├── AlertDetailsScreen.tsx
│   │   ├── AnalysesScreen.tsx
│   │   ├── AnalysisDetailsScreen.tsx
│   │   └── RagAssistantScreen.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── dashboardService.ts
│   │   └── ragService.ts
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

## Rodando no navegador com Expo Web

Para rodar diretamente no navegador:

```bash
npx expo start --web
```

Ou limpando o cache:

```bash
npx expo start -c --web
```

Por padrão, o Expo Web pode abrir em:

```text
http://localhost:8081
```

A API continua rodando separadamente em:

```text
http://localhost:8080
```

---

## Rodando com a API local

Para testar no navegador usando Expo Web, a variável pode apontar para:

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

Importante:

```text
A URL gerada pelo LocalTunnel é temporária e não deve ser commitada.
```

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
POST /api/rag/ask
```

A autenticação é feita via JWT.

Após o login, o token é salvo localmente e enviado automaticamente nas próximas requisições por meio do header:

```text
Authorization: Bearer {token}
```

---

## Usuários de demonstração

Quando o back-end está com seed de demonstração habilitado, é possível utilizar:

```text
Admin
E-mail: gustavo@aruje.com
Senha: Aruje123@

Manager
E-mail: manager@aruje.com
Senha: Aruje123@

Operator
E-mail: operator@aruje.com
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
        ↓
Usuário pergunta para a Arujé IA
        ↓
Back-end responde usando RAG
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
* Usuário logado e perfil de acesso
* Última temperatura
* Última umidade do ar
* Última umidade do solo
* Última luminosidade
* Total de leituras
* Total de alertas
* Total de análises IA
* Atalho para análise temporal
* Última recomendação inteligente

---

### Sensores

Lista os sensores cadastrados na plataforma.

A aba é exibida apenas para perfis com permissão adequada.

---

### Detalhe de sensor

Exibe informações completas de um sensor cadastrado.

---

### Leituras

Lista as leituras IoT recebidas e exibe gráficos com análise temporal.

A tela mostra:

* Cards de leitura
* Status normal ou risco
* Gráficos de evolução
* Mínimo, máximo e variação
* Botão para perguntar para a Arujé IA sobre a evolução das leituras

---

### Detalhe de leitura

Exibe os dados completos de uma leitura IoT.

A tela possui integração com a Arujé IA para explicar a leitura e indicar possíveis riscos.

---

### Alertas

Lista os alertas gerados automaticamente pelo Worker.

---

### Detalhe de alerta

Exibe informações completas do alerta.

A tela possui integração com a Arujé IA para explicar o alerta e sugerir próximas ações.

---

### Análises

Lista as análises inteligentes e recomendações geradas a partir dos alertas.

---

### Detalhe de análise

Exibe detalhes da análise inteligente.

A tela possui integração com a Arujé IA para explicar a recomendação.

---

### Arujé IA

Tela de chat com o assistente virtual agrícola.

Permite perguntar em linguagem natural sobre:

* Alertas
* Riscos da lavoura
* Sensores
* Leituras recentes
* Evolução temporal
* Recomendações
* Próximas ações

## Visual e identidade

O app utiliza uma identidade visual inspirada no contexto agrícola.

Principais características:

* Tons verdes e terrosos
* Cards arredondados
* Layout limpo
* Navegação inferior
* Ícones temáticos
* Interface focada em leitura rápida dos dados
* Chat com visual amigável e acessível
* Gráficos com visual leve e limpo
* Microinterações sutis
* Loading premium
* Botões com feedback visual

A partir da versão `v1.0.7`, o app recebeu melhorias de experiência visual, incluindo:

* Botão flutuante da Arujé IA com pulso leve
* Status Online do Dashboard pulsando quando a API está saudável
* Ícone do botão “Perguntar para Arujé IA” com pulso sutil
* Loading premium no Dashboard
* Loading premium na tela de Leituras
* Botão Atualizar girando enquanto carrega
* Empty state melhorado na tela de Leituras

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

Rodar no navegador:

```bash
npx expo start --web
```

Rodar limpando cache:

```bash
npx expo start -c
```

Rodar no navegador limpando cache:

```bash
npx expo start -c --web
```

Validar TypeScript:

```bash
npx tsc --noEmit
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

## Testes sugeridos do mobile

### Teste 1 — Login

1. Abrir o app
2. Informar usuário demo
3. Entrar no sistema
4. Confirmar que as telas protegidas aparecem

Usuário demo:

```text
E-mail: gustavo@aruje.com
Senha: Aruje123@
```

---

### Teste 2 — Dashboard

1. Abrir o painel principal
2. Verificar saúde da API
3. Conferir cards de temperatura, umidade, luminosidade, alertas e análises

---

### Teste 3 — Leituras IoT

1. Rodar Wokwi
2. Enviar leitura para a API
3. Abrir tela de leituras
4. Confirmar que a nova leitura aparece

---

### Teste 4 — Alertas e análises

1. Enviar uma leitura crítica
2. Aguardar o Worker processar
3. Abrir tela de alertas
4. Abrir tela de análises
5. Confirmar que alerta e análise foram gerados

---

### Teste 5 — Arujé IA / Saudação

No chat, enviar:

```text
oi
```

Resultado esperado:

```text
Resposta simples do assistente.
Não deve exibir risco, recomendação ou fontes.
```

---

### Teste 6 — Arujé IA / Pergunta com RAG

No chat, enviar:

```text
Por que minha lavoura está em risco?
```

Resultado esperado:

```text
Resposta gerada pelo RAG.
Deve exibir nível de risco, recomendação e fontes consultadas.
```

---

### Teste 7 — Arujé IA / Continuação com histórico

Depois da pergunta anterior, enviar:

```text
E agora, o que eu faço?
```

Resultado esperado:

```text
O assistente deve entender que a pergunta se refere ao risco anterior.
A resposta deve considerar o histórico recente da conversa.
```

---

### Teste 8 — Perfis de acesso

1. Entrar com o usuário Admin
2. Confirmar que a aba Sensores aparece
3. Fazer logout
4. Entrar com o usuário Manager
5. Confirmar que a aba Sensores aparece
6. Fazer logout
7. Entrar com o usuário Operator
8. Confirmar que a aba Sensores não aparece
9. Confirmar que Leituras, Alertas, Análises e Arujé IA continuam disponíveis

---

### Teste 9 — Análise temporal

1. Abrir a tela Leituras
2. Confirmar que o resumo temporal aparece
3. Conferir gráficos de temperatura, umidade do ar, umidade do solo e luminosidade
4. Conferir mínimo, máximo e variação
5. Clicar em “Perguntar para Arujé IA”
6. Confirmar que o chat abre com uma pergunta contextual sobre evolução temporal

---

### Teste 10 — Microinterações

1. Confirmar o botão flutuante da Arujé IA pulsando
2. Confirmar o status Online pulsando no Dashboard
3. Confirmar o loading premium no Dashboard
4. Confirmar o loading premium na tela de Leituras
5. Confirmar o botão Atualizar girando durante carregamento

---

## Git Flow

O projeto segue um fluxo baseado em branches:

```text
main        → versão estável
develop     → desenvolvimento
feature/*   → novas funcionalidades
release/*   → preparação de release
hotfix/*     → correções urgentes
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
git commit -m "feat: descricao da funcionalidade"
```

Merge na develop:

```bash
git checkout develop
git pull origin develop
git merge --no-ff feature/nome-da-feature -m "merge: nome da feature"
git push origin develop
```

---

## Releases

Exemplo de criação de release:

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.7
npx tsc --noEmit
git push origin release/v1.0.7
```

Merge na main:

```bash
git checkout main
git pull origin main
git merge --no-ff release/v1.0.7 -m "release: v1.0.7 mobile"
git push origin main
```

Criar tag:

```bash
git tag -a v1.0.3 -m "v1.0.7 - Experiencia visual e microinteracoes"
git push origin v1.0.3
```

Voltar a release para develop:

```bash
git checkout develop
git merge --no-ff release/v1.0.7 -m "merge: release v1.0.3 em develop"
git push origin develop
```

---

## Histórico de versões

### v1.0.7

Principais entregas:

* Botão flutuante da Arujé IA com pulso leve
* Status Online do Dashboard pulsando quando a API está saudável
* Ícone do botão “Perguntar para Arujé IA” com microanimação
* Loading premium no Dashboard
* Loading premium na tela de Leituras
* Botão Atualizar girando enquanto carrega
* Empty state melhorado na tela de Leituras
* Refinamento geral da experiência visual do app

### v1.0.6

Principais entregas:

* Gráficos das leituras IoT
* Resumo temporal das últimas leituras
* Tendência de temperatura
* Tendência de umidade do solo
* Identificação da última leitura como normal ou em risco
* Identificação do pior ponto recente
* Gráficos com linha suavizada
* Área preenchida abaixo dos gráficos
* Último ponto destacado
* Exibição de mínimo, máximo e variação
* Correção da luminosidade para unidade `lux`
* Botão para perguntar para a Arujé IA sobre a evolução das leituras
* Card no Dashboard apontando para a análise temporal

### v1.0.5

Principais entregas:

* Telas de detalhes conectadas com a Arujé IA
* Detalhe de alerta com pergunta contextual para o assistente
* Detalhe de análise com pergunta contextual para o assistente
* Detalhe de leitura com pergunta contextual para o assistente
* Chat aceitando pergunta inicial por parâmetro de navegação
* Dashboard exibindo usuário logado
* Dashboard exibindo perfil do usuário
* Experiência diferenciada por perfil

### v1.0.4

Principais entregas:

* Controle de acesso por perfil no mobile
* Suporte aos perfis Admin, Manager e Operator
* Persistência dos dados do usuário autenticado
* Exibição condicional da aba Sensores
* Operador sem acesso à tela de sensores
* Ajustes de navegação conforme perfil
* Integração com RBAC do back-end

### v1.0.3

Principais entregas:

* Chat Arujé IA atualizado
* Envio de histórico real da conversa para o back-end
* Integração com endpoint `POST /api/rag/ask`
* Exibição direta do `answer` retornado pela API
* Exibição de fontes apenas quando houver resposta RAG
* Correção para respostas conversacionais sem fontes
* Integração com RAG avançado do back-end

### v1.0.2

Principais entregas:

* Primeira versão da tela Arujé IA
* Botão flutuante para acesso ao chat
* Integração inicial com o RAG
* Exibição de fontes, risco e recomendação
* Tratamento local inicial para mensagens conversacionais

### v1.0.1

Principais entregas:

* Melhorias de integração com back-end
* Ajustes visuais
* Correções de navegação
* Refinamentos nas telas principais

### v1.0.0

Principais entregas:

* MVP inicial do aplicativo
* Login com API
* Sessão persistida
* Dashboard
* Sensores
* Leituras
* Alertas
* Análises IA
* Navegação inferior
* Configuração por ambiente

---

## Solução de problemas

### App não conecta na API

Verifique o `.env.local`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Teste a API:

```bash
curl http://localhost:8080/health
```

Reinicie o Expo limpando cache:

```bash
npx expo start -c
```

---

### Celular não acessa localhost

Em celular físico, `localhost` aponta para o próprio celular, não para o computador.

Use LocalTunnel:

```bash
npx localtunnel --port 8080
```

Depois configure:

```env
EXPO_PUBLIC_API_BASE_URL=https://sua-url-temporaria.loca.lt
```

---

### Alterei o .env.local e não mudou

Reinicie o Expo limpando cache:

```bash
npx expo start -c
```

---

### Erro de TypeScript

Validar o projeto:

```bash
npx tsc --noEmit
```

---

### Chat não responde

Verifique:

* API está online
* Endpoint `/api/rag/ask` responde no Swagger
* `EXPO_PUBLIC_API_BASE_URL` está correto
* Token JWT está válido, caso a rota esteja protegida
* Back-end está com containers rodando

---

### RAG não usa Gemini

Verifique no back-end:

* `GEMINI_API_KEY`
* `GEMINI_MODEL`
* Logs da API
* Resposta do endpoint `/api/rag/ask`

Se a Gemini falhar, o back-end pode responder usando fallback.

---

## Próximas melhorias

Possíveis melhorias futuras:

* README final do back-end
* Documentação completa da arquitetura
* Roteiro de demonstração
* Prints das telas no README
* Splash screen personalizada
* Ícone do app
* Tema escuro
* Pull to refresh nativo
* Histórico persistido do chat
* Sugestões inteligentes no chat
* Filtros por período nas leituras
* Filtros por severidade nos alertas
* Tela de detalhes das fontes usadas pelo RAG
* Build Android com EAS
* Build iOS com EAS

---

## Autor

Desenvolvido por **Gustavo Gomes**.

GitHub: [@gugomesx10](https://github.com/gugomesx10)

Projeto criado para fins acadêmicos, estudo de arquitetura, integração mobile, IoT, mensageria, observabilidade, inteligência artificial e composição de portfólio na área de desenvolvimento de software.

---

## Licença

Este projeto é de uso acadêmico e demonstrativo.
