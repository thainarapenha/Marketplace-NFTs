# Architecture

## 1\. Visão geral

O projeto é uma aplicação frontend de um marketplace de NFTs desenvolvida em React + TypeScript.

A aplicação utiliza APIs simuladas por MSW para reproduzir os principais fluxos de catálogo, autenticação, gerenciamento de conta, carrinho e compra.

Não existe backend de produção integrado à versão entregue.

## 2\. Arquitetura da aplicação

A aplicação está organizada por responsabilidades:

-   `src/components` — componentes reutilizáveis da interface;
-   `src/pages` — telas e fluxos principais;
-   `src/routes` — configuração das rotas;
-   `src/services` — comunicação com as APIs simuladas;
-   `src/types` — contratos e tipos utilizados pela aplicação;
-   `src/mocks` — handlers e dados utilizados pelo MSW;
-   `src/lib` — contextos, estado compartilhado e utilitários.

O roteamento é realizado pelo TanStack Router.

O estado remoto utiliza TanStack Query, enquanto Axios é utilizado para as requisições HTTP.

## 3\. Decisões de UX

### Responsividade

A interface foi adaptada para os breakpoints definidos no desafio:

-   390px — mobile;
-   768px — tablet;
-   1440px — desktop.
    
## 4\. Desvios do Figma

A implementação buscou preservar a identidade visual e a estrutura apresentadas no Figma.

Algumas adaptações foram necessárias para transformar o layout em uma interface funcional e responsiva. Entre os ajustes realizados estão:

| **Adaptação** | **Motivo** |
| ---------- | --------- |
| Ausência de bottom menu | Estrutura especifica em app nativo |
| Adição de icones no header no mobile | Suprir a ausência do bottom bar |
| Reordenação dos elementos da tela de checkout | Destacar informação principal (Resumo da compra) |
| formulários e modais adaptados à largura disponível | Melhor visualização das informações dispostas |
| Formulários dedicados na tela de wallet | Melhor organização, visualização e inserção de dados |
| Inclusão de toast no projeto | Retornos visuais mais claros |

Essas alterações foram realizadas para manter a hierarquia visual e a usabilidade sem alterar os principais fluxos definidos pelo desafio.

## 5\. Limitações da versão entregue

Os itens abaixo fazem parte do escopo original do desafio, mas não foram implementados na versão 
entregue por limitações de tempo para desenvolvimento do escopo completo.

| **Item** |
| ---------- |
| Socket.IO |
| Playwright |
| Cupom |
| Busca de NFTs |
| Tela de Favoritos |

## 6\. Considerações finais

A arquitetura foi mantida focada no escopo do desafio, priorizando a implementação dos fluxos principais do marketplace, autenticação, gerenciamento de conta, carrinho e compra.

As funcionalidades não implementadas estão explicitamente registradas neste documento e no `README.md`, sem depender de serviços externos para executar a versão entregue.