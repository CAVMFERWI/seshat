# Seshat — Mangás & Raridades

Loja virtual (e-commerce) de mangás feita para a atividade avaliativa de **Criação de Sites**.
A Seshat vende mangás de todos os gêneros e edições raras para colecionadores, com identidade visual própria criada no Figma.

🔗 **Site online:** https://cavmferwi.github.io/seshat/

## Como executar

Não precisa instalar nada.

- **Opção 1:** abra o arquivo `index.html` no navegador.
- **Opção 2 (recomendada):** no VS Code, use *Arquivo > Abrir Pasta* e escolha **esta pasta** (a que tem o `index.html`). Depois clique com o botão direito no `index.html` e escolha **Open with Live Server**.

> Se o Live Server mostrar só uma lista de pastas, é porque foi aberta a pasta de cima. Clique na pasta `seshat` ou abra direto a pasta do projeto no VS Code.

## Páginas

| Página | Arquivo |
|---|---|
| Página inicial (destaques, gêneros, lançamentos, raridades, mais vendidos) | `index.html` |
| Categorias / gêneros com filtros e ordenação | `categoria.html?g=shounen` |
| Busca de produtos | `busca.html?q=naruto` |
| Detalhes do produto (descrição, ficha técnica, frete) | `produto.html?id=frieren-01` |
| Favoritos | `favoritos.html` |
| Carrinho de compras | `carrinho.html` |
| Finalização da compra (dados do cliente, entrega e pagamento) | `checkout.html` |
| Compra realizada com sucesso | `confirmado.html` |
| Login e cadastro | `login.html` |
| Minha conta (pedidos, dados, endereços) | `conta.html` |
| Acompanhamento de pedido | `pedido.html?id=SSH-2026-1042` |
| Ajuda e informações institucionais | `info.html` |

## Funcionalidades

**Obrigatórias**
- Menu de navegação e menu de gêneros funcionando (também no celular).
- Produtos com imagem, nome, descrição e preço, organizados por categorias.
- Carrinho: adicionar, alterar quantidade, remover e cálculo do total (subtotal, desconto, frete).
- Checkout com formulário do cliente (nome, e-mail, CPF, celular, endereço).
- Formas de pagamento: **Pix** (10% OFF), **cartão de crédito** com escolha de **parcelamento em até 6x**, **cartão de débito** (à vista) e boleto.
- Mensagem de compra realizada com sucesso mostrando a forma de pagamento escolhida.

**Extras**
- Campo de pesquisa, filtros por editora e preço, ordenação.
- Produtos favoritos, cupom de desconto (`BEMVINDO10`), cálculo de frete por CEP.
- Login de usuário, histórico e acompanhamento de pedidos.
- Modo escuro.
- Carrinho, favoritos e tema salvos no navegador (`localStorage`).
- Validação de CPF e de cartão (algoritmo de Luhn), máscaras nos campos, busca de endereço pelo CEP (ViaCEP) e bandeira do cartão detectada automaticamente.
- Layout responsivo para computador, tablet e celular.

> O pagamento é **apenas uma simulação**: nenhum dado é enviado para lugar nenhum. Para testar o cartão use um número de teste, como `4111 1111 1111 1111`. Um número inválido mostra a mensagem de "Pagamento recusado".

## Estrutura de pastas

```
├── index.html, categoria.html, produto.html, ...   páginas do site
├── css/
│   └── style.css      cores, fontes, componentes e responsividade
├── js/
│   ├── data.js        catálogo de produtos, categorias e pedidos
│   └── app.js         funções compartilhadas: carrinho, favoritos, cabeçalho, rodapé, cards
└── img/
    ├── simbolo.svg    logo da Seshat
    └── capas/         capas dos mangás
```

## Tecnologias

- **HTML5** para a estrutura das páginas
- **CSS3** (variáveis, Flexbox, Grid e media queries) para o visual, o modo escuro e a responsividade
- **JavaScript** puro para carrinho, cálculos, formas de pagamento, validações e interações
- **Git** e **GitHub** para controle de versão

Projeto acadêmico, sem fins comerciais. As capas pertencem às suas respectivas editoras.
