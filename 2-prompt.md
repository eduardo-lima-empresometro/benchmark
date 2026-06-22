Agora implemente uma nova funcionalidade na calculadora existente: histórico persistente de cálculos.

Leia o projeto atual antes de alterar qualquer arquivo.

Requisitos funcionais:

1. Toda vez que o usuário calcular um resultado com sucesso, adicionar um item ao histórico.
2. Cada item do histórico deve mostrar:
   - Expressão original
   - Resultado
   - Data e horário local em formato legível
3. O histórico deve persistir em localStorage.
4. Ao recarregar a página, o histórico deve continuar disponível.
5. Deve existir uma ação para limpar todo o histórico.
6. Deve existir uma ação para reutilizar um resultado do histórico como valor atual da calculadora.
7. Erros, como divisão por zero, não devem ser adicionados ao histórico.
8. O layout deve continuar responsivo.
9. A implementação deve preservar as funcionalidades existentes.
10. Atualizar ou criar testes cobrindo:
    - Adição de item ao histórico
    - Persistência em localStorage
    - Limpeza do histórico
    - Reutilização de resultado
    - Garantia de que erros não entram no histórico
11. Atualizar README documentando a nova funcionalidade.

Critérios importantes:

- Não reescreva a aplicação inteira sem necessidade.
- Preserve a arquitetura existente quando ela for adequada.
- Não quebre os testes anteriores.
- Rode lint, testes e build ao final.
- Se algum comando falhar, corrija antes de finalizar.
- Ao final, entregue um resumo objetivo do que foi alterado, arquivos principais alterados e comandos de validação executados.