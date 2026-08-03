# Questionário só no cadastro + app funcional sem banco

## Problema atual

O fluxo de login hoje não sabe quais contas existem: qualquer e-mail entra, e a decisão de mostrar o questionário depende de uma chave genérica (`nakor_onboarding`) que é apagada em cada cadastro. Resultado: o questionário pode reaparecer para quem já respondeu, e o app tem várias telas com dados fixos que não reagem ao uso.

## Parte 1 — Questionário uma única vez por conta

- Criar um "banco local" de contas no navegador: lista de contas com e-mail, nome, senha (só para teste) e um marcador `onboardingCompleto` + as respostas do questionário.
- **Criar conta**: se o e-mail já existir, mostrar erro "conta já existe". Se for novo, cria a conta e vai para o questionário.
- **Login**: valida e-mail/senha contra as contas locais (erro claro quando não existe ou senha errada). Se a conta já respondeu o questionário, vai direto para a Home; nunca mais mostra o questionário.
- Concluir o questionário grava as respostas na conta e marca como concluído para sempre.
- Logout mantém a conta salva — ao logar de novo, entra direto na Home.
- "Refazer questionário" continua disponível pelo perfil (ação manual), mas nunca automático.

## Parte 2 — App funcional para testes (sem banco)

Toda a informação passa a viver em um único armazenamento local por conta, compartilhado entre as telas:

- **Atividades**: criar em "Nova atividade" → executar no modo foco → diário pós-sessão → resultado. A sessão concluída entra no histórico de verdade.
- **Home**: tempo de foco do dia, círculo de progresso, nota média e "atividades recentes" calculados a partir das sessões reais, não de valores fixos.
- **Histórico**: lista real das sessões, com abertura dos detalhes.
- **Tarefas e desafios**: criar, concluir, excluir; progresso dos desafios avança conforme o foco acumulado.
- **Moedas / Loja (Trocas)**: saldo real, ganho de moedas ao concluir sessões e desafios, resgate desconta o saldo e registra o item.
- **Conquistas**: desbloqueio conforme metas reais atingidas.
- **Notificações e configurações** (tema, tempo de foco, cores dos cards, conta): preferências salvas por conta e aplicadas ao voltar.
- Botão de "limpar dados de teste" na tela de conta, para reiniciar tudo rapidamente.

Quando o banco de dados entrar depois, essa camada é substituída sem mexer nas telas.

## Detalhes técnicos

- Novo módulo `src/nakor/lib/localStore.ts`: tipos (`Account`, `Session`, `Task`, `Prefs`), leitura/escrita em `localStorage` sob a chave `nakor_db_v1`, com migração leve das chaves antigas (`nakor_user_email`, `nakor_onboarding*`) para não perder o estado atual.
- Hook `useNakorStore` (contexto React em `src/nakor/lib/store-context.tsx`) expondo estado + ações (`register`, `login`, `logout`, `completeOnboarding`, `addSession`, `addTask`, `toggleTask`, `spendCoins`, `setPrefs`). Escrita com debounce e leitura só depois da hidratação, para não quebrar o SSR.
- `App.tsx`: substituir os `localStorage` espalhados e o `handleAuthSuccess` pela lógica do store; roteamento inicial passa a ser `landing` → `auth` → (`onboarding` só se `!onboardingCompleto`) → `home`.
- `AuthScreen.tsx`: receber erros do store (e-mail já cadastrado, credenciais inválidas) e exibi-los nos campos já existentes.
- Demais telas (`HomeScreen`, `HistoryScreen`, `TasksScreen`, `LojaScreen`, `ResultScreen`, `AchievementsScreen`, `NotificationsScreen`, `AccountScreen`, `FocusTimeScreen`, `CardColorsScreen`) passam a ler/escrever pelo hook, mantendo o visual atual intacto.
- Aviso: senhas ficam só no navegador, apenas para teste — sem segurança real até o banco entrar.
