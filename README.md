# Marketplace NFT

Aplicação frontend desenvolvida como parte de um desafio técnico, com foco na implementação de um marketplace de NFTs, 
seus principais fluxos de compra e gerenciamento de conta.

**Repositório do desafio:** [frontend-challenge](https://github.com/junglegaming/frontend-challenge)

## 1. Stack

| Responsabilidade | Tecnologia |
| --- | --- |
| Interface | React |
| Linguagem | TypeScript |
| Roteamento | TanStack Router |
| Estado remoto | TanStack Query |
| Cliente HTTP | Axios |
| Integração de dados | REST APIs |
| Tempo real | Socket.IO |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui |
| Mocking | MSW |
| Testes E2E e regressão visual | Playwright |
| Auditoria de performance e qualidade | Lighthouse |

## 2. Instalação

Clone o repositório e instale as dependências:

```
https://github.com/thainarapenha/Marketplace-NFTs.git
```

Entrar na pasta do projeto:

```
cd Marketplace-NFTs
```

Instalando todos os pacotes:

```
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

## 3. Variáveis de ambiente

A versão entregue não depende de credenciais privadas ou de um backend de produção para executar os fluxos principais.

## 4. Credenciais fictícias

A aplicação utiliza dados fictícios para demonstração dos fluxos de autenticação e compra.

> As credenciais abaixo são exclusivamente para ambiente de demonstração e não representam contas reais.

| Usuário    | E-mail                                     | Senha        |
| ---------- | ------------------------------------------ | ------------ |
| user_teste | user_teste@exemplo.com                     |  Teste@123   |
| user_sedundary_teste | user_sedundary_teste@exemplo.com |  Teste@12345 |

## 5. Mocks

A aplicação utiliza **MSW (Mock Service Worker)** para simular as operações da API durante o desenvolvimento e a execução 
da aplicação sem depender de backend de produção.

O worker do MSW fica em:

```text
public/mockServiceWorker.js
```

Os handlers e cenários de mock ficam no código-fonte do projeto.
> A aplicação pode ser executada utilizando os mocks sem necessidade de serviços privados ou backend de produção.

Os mocks são utilizados nos principais fluxos de:

- autenticação;
- perfil;
- alteração de senha;
- carteiras;
- catálogo de NFTs;
- carrinho;
- checkout;
- pedidos.

## 6. Persistência local

Alguns estados da aplicação são persistidos localmente para reproduzir o comportamento esperado durante a utilização:

-   sessão do usuário;
-   carrinho por usuário;
-   dados de perfil;
-   carteiras;
-   dados relacionados aos mocks.

> Para iniciar novamente os fluxos utilizando um estado limpo, pode ser necessário limpar os dados armazenados pelo navegador
ou utilizar uma nova sessão do navegador.

## 7. Rotas

| **Rota**    | **Descrição** |
| ----------  | ---------     |
| `/`         | Catálogo/Home |
|`/nft/:id`   | Detalhes do NFT |
|`/cart`      | Carrinho |
|`/checkout`  | Checkout e pagamento |
|`/order/:id` | Pedido/estado da compra |
|`/login`     | Login |
|`/register`  | Cadastro |
|`/profile`   | Perfil do usuário |
|`/wallets`   | Gerenciamento de carteiras |

## 8. Fluxo principal de uso

O fluxo principal da aplicação pode ser reproduzido da seguinte forma:

1.  Acesse a Home;
2.  Navegue pelo catálogo;
3.  Utilize filtros, abas e ordenação;
4.  Acesse um NFT;
5.  Selecione a edição e a quantidade;
6.  Adicione o NFT ao carrinho;
7.  Acesse o carrinho;
8.  Revise ou altere as quantidades;
9.  Avance para o checkout;
10.  Selecione uma carteira;
11.  Revise os valores da compra;
12.  Confirme a compra;
13.  Visualize a confirmação do pedido.

## 9. Fluxos autenticados

Após autenticar, o usuário pode acessar e executar os seguintes fluxos:

-   `/profile` — visualização e edição dos dados do perfil;
-   `/wallets` — gerenciamento das carteiras;
-   `/cart` — gerenciamento do carrinho associado ao usuário;
-   `/checkout` — checkout e confirmação da compra;
-   `/order/:id` — acompanhamento e visualização do pedido;
-   alteração de senha;
-   upload e exclusão da imagem de perfil;
-   logout e encerramento da sessão.

> O carrinho é persistido por usuário, e o acesso aos fluxos que exigem autenticação é protegido pela camada de controle de rotas da aplicação.

> Após uma autenticação iniciada a partir de uma rota protegida, o usuário pode ser redirecionado de volta para a rota originalmente solicitada.

## 10. Reprodução de fluxos de falha

Os seguintes fluxos podem ser reproduzidos utilizando a implementação atual:

### Autenticação

-   Login com credenciais inválidas.
-   Cadastro com dados inválidos.
-   Cadastro com e-mail já utilizado.
-   Cadastro com senhas diferentes.
-   Logout.

### Perfil

-   Atualização com campos obrigatórios inválidos.
-   Upload de imagem acima de 5 MB.
-   Exclusão da imagem de perfil.
-   Alteração de senha com campos obrigatórios incompletos.
-   Alteração de senha com senhas diferentes.
-   Alteração de senha com dados inválidos.

### Carteiras

-   Criação com campos obrigatórios incompletos.
-   Edição com campos obrigatórios incompletos.
-   Endereço de carteira duplicado.
-   Erro ao criar ou editar uma carteira.

### Carrinho

-   Adição de NFT ao carrinho.
-   Remoção de NFT do carrinho.
-   Carrinho vazio durante o checkout.

### Checkout e compra

-   Tentativa de finalizar a compra sem carteira selecionada.
-   Compra concluída com sucesso.

## 11. Build

Para gerar a versão de produção:

```bash
npm run build
```

O comando executa a verificação de tipos e o build do Vite.

Para visualizar o build:

```bash
npm run preview
```

## 12. Verificação de código

Lint:

```bash
npm run lint
```

A verificação de tipos é executada durante o build:

```bash
npm run build
```

## 13. Lighthouse

A auditoria Lighthouse foi configurada para avaliar:

-   Home (`/`)
-   Detalhe do NFT (`/nft/1`)
-   Perfil mobile
-   Perfil desktop
-   Performance
-   Accessibility
-   Best Practices
-   SEO
-   LCP
-   CLS
-   TBT  

> Foram configuradas três medições para cada página e perfil, com geração de resultados HTML e JSON e cálculo de medianas.

Executar a auditoria:

```bash
npm run lighthouse
```

A configuração da auditoria está em:

```text
lighthouse.config.mjs
```

Os scripts estão em:

```text
scripts/
```

Os relatórios gerados ficam em:

```text
reports/lighthouse/
```

## 14. Limitações e funcionalidades não implementadas

Os itens abaixo fazem parte do escopo original do desafio, mas não foram implementados na versão 
entregue por limitações de tempo para desenvolvimento do escopo completo.


| **Item**    |
| ----------  |
| Socket.IO   |
| Playwright  |
| Cupom       |

Os cenários acima não dependem de eventos em tempo real. A implementação de cenários relacionados a **Socket.IO, alterações de preço ou disponibilidade em tempo real, desconexão, retomada de pedidos ou eventos duplicados** não faz parte da versão entregue.

O projeto não depende de backend privado ou serviços de produção para executar os fluxos disponibilizados nesta versão.
