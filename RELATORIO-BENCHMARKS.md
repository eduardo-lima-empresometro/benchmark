# Relatório comparativo: Codex e Gemini

## 1. Resumo executivo

Os dois benchmarks entregaram uma calculadora React + TypeScript + Vite funcional, com histórico persistente, testes, lint e build passando. No cenário avaliado, o **Codex apresentou o melhor equilíbrio entre produtividade, consumo de recursos e qualidade final**.

| Indicador principal | Codex | Gemini | Leitura |
|---|---:|---:|---|
| Tempo total | 7m25s | 21m56s | Codex foi 2,96x mais rápido |
| Chamadas de ferramenta | 28 | 80 | Codex usou 65% menos ciclos |
| Tokens sem cache | 119.628 | 711.102 | Gemini consumiu 5,94x mais |
| Tokens incluindo cache | 744.268 | 4.510.926 | Gemini processou 6,06x mais |
| Falhas relevantes de validação | 2 | 4 | Codex exigiu metade das correções |
| Código e configuração relevantes | 719 linhas | 1.136 linhas | Base do Codex foi 36,7% menor |
| Testes finais | 14 | 23 | Gemini teve maior quantidade bruta |
| Nota ponderada | **9,1** | **6,6** | Eficiência operacional tem peso de 20% |

O Codex também apresentou melhor acessibilidade, robustez do histórico e acabamento visual. O Gemini se destacou pela documentação mais extensa, separação explícita entre hooks e componentes e maior número de testes, mas deixou problemas de interface, teclado e acessibilidade.

Esta é uma amostra única, sem preços de licença ou medição de tempo humano ativo. Os números indicam produtividade e capacidade operacional, não ROI financeiro definitivo.

## 2. Condições do benchmark

### Escopo e fontes

Foram analisados prompts, código, configurações, lockfiles, testes, documentação, registros de execução e históricos das conversas. `node_modules`, builds gerados e ferramentas instaladas posteriormente foram excluídos.

Sessões oficiais usadas:

- **Codex:** `019eefc0-d6c6-7ac3-96a6-af0949afdd24`, referenciada por `codex-output.txt`.
- **Gemini:** `8256c040-b517-40ff-9bc0-2b2bbb89a496`, presente em `.gemini/tmp`, `logs.json` e `1-gemini-output.txt`.

Duas sessões preliminares do Codex foram desconsideradas das métricas principais porque o artefato final seleciona outra sessão, única a conter as duas fases da entrega comparada.

### Produto bruto e modelos

O teste considera a experiência padrão, sem plugins, extensões ou skills adicionados depois. Esses recursos poderiam melhorar ambos os resultados com revisão de acessibilidade, depuração sistemática, testes, auditoria de dependências, análise visual e consulta de documentação, mas introduziriam uma variável adicional.

- **Codex:** manteve `gpt-5.5` com configuração padrão (`reasoning_effort: null`). O modo de maior consumo para priorizar velocidade não foi utilizado.
- **Gemini:** usou seleção automática. O trabalho principal ficou no `gemini-2.5-pro`, com modelos auxiliares para roteamento, resumo e detecção de loop.

O benchmark compara, portanto, o resultado padrão de cada produto, não modelos ou orçamentos computacionais rigorosamente equalizados.

### Método e limitações

1. Inspeção estática de todo o código relevante.
2. Execução de lint, testes e build nos dois projetos.
3. Revisão funcional, arquitetural, visual e de acessibilidade.
4. Reconstrução de tempo, chamadas, falhas e tokens pelos históricos.

Não foi executada auditoria axe/Lighthouse. A avaliação visual combina DOM/CSS com observação manual: o visor do Gemini fica parcialmente quebrado no tamanho padrão, e seu acabamento é mais simples.

## 3. Resultado entregue

### Validação final

| Projeto | Lint | Testes | Build | JS gzip | CSS gzip |
|---|---:|---:|---:|---:|---:|
| Codex | Passou | 14/14 | Passou | 62,11 kB | 1,61 kB |
| Gemini | Passou | 23/23 | Passou | 61,84 kB | 1,64 kB |

### Aderência funcional

| Grupo de requisitos | Codex | Gemini | Ressalva principal |
|---|---:|---:|---|
| Quatro operações e divisão por zero | Atende | Atende | Gemini exibe o erro em inglês |
| Decimal, porcentagem e sinal | Atende | Atende parcial | Gemini não aceita `%` pelo teclado |
| Limpar e apagar caractere | Atende parcial | Atende | Codex só oferece apagar via `Backspace` |
| Entrada por teclado | Atende | Atende com ressalva | Gemini bloqueia o padrão de todas as teclas |
| Histórico, persistência e limpeza | Atende | Atende | Ambos preservam cálculos após recarga |
| Reutilização de resultado | Atende | Atende parcial | A ação do Gemini não é acessível por teclado |
| Erros fora do histórico | Atende | Atende | Coberto por testes nos dois |
| Responsividade | Atende | Atende parcial | Visor do Gemini quebra parcialmente no tamanho padrão |

Problemas residuais mais relevantes:

- **Codex:** após `2 + 2 = 4`, digitar `3` produz `43`; falta estado de substituição após resultado.
- **Codex:** apagar último caractere não possui botão visível.
- **Gemini:** o resultado reutilizável é um `<strong onClick>`, sem foco ou ativação por teclado.
- **Gemini:** JSON estruturalmente inválido no `localStorage` pode quebrar `history.map`; o Codex valida os itens.
- **Gemini:** `preventDefault()` é chamado até para teclas não tratadas.
- **Ambos:** o histórico não possui limite de retenção.

## 4. Qualidade técnica

| Aspecto | Codex | Gemini |
|---|---|---|
| Arquitetura | Reducer puro e persistência isolada; `App.tsx` concentra a orquestração | Boa separação entre hooks e componentes, com mais abstrações |
| Robustez | Valida armazenamento, trata exceções e usa IDs estáveis | Não valida o JSON persistido e usa índice como chave |
| Acessibilidade | Elementos semânticos, `aria-live`, nomes claros, foco e `prefers-reduced-motion` | Foco nos botões, mas histórico não navegável e visor não anunciado |
| Visual | Acabamento mais consistente e responsivo | Visual mais simples e quebra parcial observada no visor |
| Dependências | Uso de `latest` e ferramentas de build em `dependencies` | Faixas versionadas mais previsíveis |
| Limpeza do projeto | Sem resíduos relevantes do scaffold | CSS, imagens e SVGs aparentemente não utilizados |
| Documentação | Objetiva, mas pouco detalhada nas decisões | Mais completa, com pequenas inconsistências |
| Testes | Menos testes, porém cobre as quatro operações e encadeamento | Mais testes, distribuídos entre hooks e componentes |

Nenhum projeto testa entrada após resultado, dados corrompidos no armazenamento ou acessibilidade do histórico. O Gemini não cobre diretamente todas as operações nem encadeamento; o Codex não testa especificamente botão de apagar porque ele não existe.

## 5. Processo e eficiência

| Métrica | Codex | Gemini |
|---|---:|---:|
| Prompt 1 | 4m47s | 14m44s |
| Prompt 2 | 2m38s | 7m12s |
| **Total** | **7m25s** | **21m56s** |
| Chamadas na fase 1 | 20 | 52 |
| Chamadas na fase 2 | 8 | 28 |
| Falhas relevantes na fase 1 | 2 | 4 |
| Falhas na fase 2 | 0 | 0 |
| Prompts adicionais do usuário | 0 | 0 |
| Correções manuais | 0 | 0 |

O Codex corrigiu configuração TypeScript/Vitest e globais de teste. Uma terceira falha, de consulta Git fora de repositório, não afetou o produto. O Gemini teve três rodadas de testes com falhas decrescentes e uma execução de lint com erros. Ambos terminaram sem intervenção manual.

Em dez tarefas equivalentes, a diferença de tempo seria aproximadamente 2h25min. Isso não equivale necessariamente a horas humanas, mas reduz espera e aumenta throughput.

## 6. Tokens e cota

### Tokens normalizados

O Codex separa input sem cache e trata raciocínio como parte do output. O Gemini inclui cache no input e soma `thoughts` separadamente. Após normalização e remoção de eventos duplicados:

| Métrica acumulada | Codex | Gemini | Razão Gemini/Codex |
|---|---:|---:|---:|
| Input não armazenado em cache | 105.272 | 668.498 | 6,35x |
| Input lido do cache | 624.640 | 3.799.824 | 6,08x |
| Tokens gerados | 14.356 | 42.604 | 2,97x |
| **Total sem cache** | **119.628** | **711.102** | **5,94x** |
| **Total incluindo cache** | **744.268** | **4.510.926** | **6,06x** |

O total do Gemini é conservador: modelos utilitários da fase 1 adicionaram 24.590 tokens de input e 285 de output, mas não há decomposição equivalente da fase 2. Volume processado não equivale diretamente a custo, pois cache, modelos e planos podem ter pesos distintos.

### Consumo e projeção de cota

Para comparação gerencial, um benchmark completo foi tratado como consumo diário. Os 5 p.p. da janela de cinco horas do Codex são usados como proxy diário; a projeção semanal multiplica ambos por sete.

| Ferramenta | Antes | Após fase 1 | Após fase 2 | Consumo diário normalizado | Projeção em 7 dias | Capacidade semanal equivalente |
|---|---:|---:|---:|---:|---:|---:|
| Codex | 3% | 6% | 8% | 5 p.p. | 35 p.p., ou 0,35 cota | ~140 execuções |
| Gemini | 18% | 39% | 51% | 33 p.p. | 231 p.p., ou 2,31 cotas | ~21 execuções |

Na normalização, o Gemini usa 6,6 vezes mais cota por benchmark. A projeção é aproximada: o Gemini renova a cota diariamente, enquanto o Codex usa uma janela móvel de cinco horas e possui limite adicional de sete dias. Esse limite semanal permaneceu em 1% durante a sessão oficial, sem precisão suficiente para medir a variação; logo, 140 execuções não são garantia de capacidade real.

As sessões preliminares levaram a janela de cinco horas do Codex de 1% a 3%. Se fossem incluídas, o projeto completo teria usado 7 p.p.; o relatório mantém 5 p.p. para ser coerente com a sessão oficial.

## 7. Pontuação

A eficiência operacional é calculada de forma relativa, usando o Codex como referência `10`. Para cada indicador do Gemini, a nota é `10 / razão de consumo`; depois aplica-se a ponderação abaixo:

| Componente de eficiência | Peso interno | Razão Gemini/Codex | Nota relativa do Gemini |
|---|---:|---:|---:|
| Tempo | 30% | 2,96x | 3,38 |
| Tokens sem cache | 25% | 5,94x | 1,68 |
| Cota normalizada | 25% | 6,60x | 1,52 |
| Chamadas de ferramenta | 10% | 2,86x | 3,50 |
| Falhas de validação | 10% | 2,00x | 5,00 |
| **Eficiência resultante** | **100%** |  | **2,7** |

Essa fórmula dá maior peso a tempo, tokens e cota, que afetam diretamente throughput e capacidade disponível. A cota continua sendo uma aproximação por usar janelas diferentes.

| Critério | Peso | Codex | Gemini |
|---|---:|---:|---:|
| Aderência funcional | 20% | 9,0 | 8,5 |
| Qualidade do código | 15% | 9,0 | 7,5 |
| Testabilidade | 10% | 8,5 | 8,5 |
| Acessibilidade | 10% | 9,0 | 6,5 |
| Robustez | 10% | 9,0 | 7,0 |
| Responsividade/visual | 10% | 9,0 | 6,5 |
| Documentação | 5% | 7,5 | 8,5 |
| Eficiência operacional | 20% | 10,0 | 2,7 |
| **Nota ponderada** | **100%** | **9,1** | **6,6** |

A eficiência recebe peso maior por reunir tempo, consumo, iterações e previsibilidade. A nota visual considera inspeção estática e observação manual, sem auditoria automatizada.

## 8. Conclusão

No cenário padrão avaliado, o Codex apresentou a melhor relação entre produtividade, recursos consumidos e qualidade entregue. Os dados justificam colocá-lo como primeira opção em uma próxima etapa para tarefas semelhantes.

O Gemini continua sendo uma alternativa válida: entregou um produto funcional, mais testes e documentação mais detalhada. Uma nova rodada com seleção manual de modelo e plugins equivalentes pode mostrar quanto da diferença pertence ao produto bruto e quanto pode ser reduzido por configuração, mas o esforço para tal pode não compensar o custo operacional.

## 9. Reprodutibilidade

Na raiz do repositório:

```bash
npm run validate  # lint, testes e build dos dois projetos
npm start         # instala, compila e inicia ambos lado a lado
```

- Codex: <http://localhost:5173>
- Gemini: <http://localhost:5174>

As validações terminaram com código zero: 14 testes no Codex e 23 no Gemini.
