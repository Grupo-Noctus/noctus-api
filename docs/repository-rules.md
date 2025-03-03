# 🚀 Regras do Repositório no GitHub

Este documento descreve as regras configuradas no repositório do GitHub e explica o impacto de cada uma delas. 

## 🔒 1. Restrict deletions
**(Restringir exclusão de branches)**
- 🚫 Impede que branches protegidas sejam excluídas acidentalmente ou intencionalmente.
- 🔐 Mantém a história do projeto segura e evita perdas de informação.

## 🔎 2. Require approval of the most recent reviewable push
**(Exigir aprovação do push mais recente revisável)**
- 📌 Assegura que a versão mais recente do código tenha sido revisada antes do merge.
- 🚧 Evita que alterações não revisadas sejam incluídas.

## 💬 3. Require conversation resolution before merging
**(Exigir resolução de conversas antes do merge)**
- 🔁 Impede que um pull request seja mesclado enquanto houver discussões abertas.
- 📢 Garante que feedbacks e dúvidas sejam tratados antes da fusão.

## 🔀 4. Allowed merge methods: Merge, Squash, Rebase
**(Métodos permitidos para merge: Merge, Squash, Rebase)**
- 🔧 **Merge:** Junta as alterações mantendo o histórico completo dos commits.
- 🔄 **Squash:** Condensa todos os commits de um pull request em um único commit antes do merge.
- 🔃 **Rebase:** Aplica os commits da branch de feature no topo da branch de destino, mantendo a história linear.

## 🛑 5. Block force pushes
**(Bloquear "force push")**
- ❌ Impede que um push forçado sobrescreva o histórico do repositório.
- 🔐 Protege contra a perda de commits e evita problemas de sincronização entre os desenvolvedores.
