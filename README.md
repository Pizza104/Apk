# Rotina em Dia

Um app de organização de estudos feito com Expo, React Native e Expo Router. A antiga tela de demonstração de botões foi ampliada para uma lista funcional de tarefas com acompanhamento de progresso.

## Funcionalidades

- Criar tarefas e classificá-las como **Estudo**, **Pessoal** ou **Trabalho**.
- Marcar tarefas como concluídas ou reabri-las, e excluir itens.
- Filtrar a lista por todas, pendentes ou concluídas.
- Ver o progresso geral, resumo por categoria e atividade dos últimos sete dias.
- Manter a lista salva no próprio dispositivo com AsyncStorage, inclusive após fechar e abrir o app.
- Interface responsiva para Android, iOS e web.

## Executar

Requer Node.js e npm. Na pasta do projeto:

```bash
npm install
npx expo start
```

Use os atalhos do Expo para abrir o app no Android, iOS ou navegador. Para abrir diretamente a versão web:

```bash
npm run web
```

## Publicar na Vercel

O projeto está configurado para exportação web estática do Expo Router. Para testar o build localmente:

```bash
npm ci
npm run build:web
```

O site gerado fica na pasta `dist/`. Para publicar, importe este repositório na Vercel e mantenha a raiz do projeto na pasta que contém este `package.json`. O arquivo `vercel.json` define o comando de build, a pasta de saída e URLs sem a extensão `.html`; não é necessário configurar uma API ou servidor Node.

As tarefas continuam salvas localmente no navegador de cada usuário e não são compartilhadas entre dispositivos ou navegadores.

## Privacidade e escopo

Os dados das tarefas são armazenados localmente no dispositivo; não existe conta, sincronização na nuvem ou servidor. Remover os dados do app/navegador pode apagar a lista. O projeto não envia tarefas para terceiros.
