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

## Privacidade e escopo

Os dados das tarefas são armazenados localmente no dispositivo; não existe conta, sincronização na nuvem ou servidor. Remover os dados do app/navegador pode apagar a lista. O projeto não envia tarefas para terceiros.
