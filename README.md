# Site do Condomínio Ducado da Toscana

Este repositório contém uma landing page estática simples do
Condomínio Ducado da Toscana. A página apresenta o nome do condomínio
sobre uma imagem de fundo em tela cheia e oferece dois links para
transmissões ao vivo.

O projeto não usa framework nem etapa de build. O site é servido
diretamente a partir de arquivos estáticos.

O conteúdo público da página e desta documentação permanece em
português (Brasil).

## Estrutura do projeto

- `index.html`: documento principal e conteúdo da página.
- `styles.css`: estilos da página e regras de responsividade.
- `assets/images/fachada.webp`: imagem de fundo principal.
- `assets/images/fachada.jpg`: imagem de prévia de link usada em
  WhatsApp e outros aplicativos e serviços de compartilhamento.
- `assets/images/camera-esquerda.webp`: imagem da câmera de descida.
- `assets/images/camera-direita.webp`: imagem da câmera de subida.
- `favicon.ico` e demais arquivos `favicon-*`, `apple-touch-icon.png`,
  `android-chrome-*.png`, `icon-maskable-*.png`, `mstile-150x150.png`,
  `site.webmanifest` e `browserconfig.xml`: ícones do site e metadados
  para navegadores, atalhos móveis e instalação.
- `robots.txt`, `sitemap.xml` e `llms.txt`: arquivos de descoberta para
  mecanismos de busca e crawlers de LLM.
- `tests/responsive.spec.js`: testes de regressão visual e responsiva
  com Playwright.
- `playwright.config.js`: configuração do Playwright.
- `package.json`: script de teste e dependências de desenvolvimento.

## Comportamento atual

A página inicial:

- exibe o nome do condomínio como texto sobreposto acima das câmeras;
- usa `assets/images/fachada.webp` como imagem de fundo principal;
- mostra dois cartões de câmera com rótulos de direção;
- abre cada transmissão do YouTube em uma nova aba;
- permite indexação da página principal com metadados de SEO,
  Open Graph, Twitter Card e dados estruturados;
- usa `assets/images/fachada.jpg` como imagem de prévia de link;
- expõe `robots.txt`, `sitemap.xml` e `llms.txt` para descoberta por
  crawlers;
- marca os links externos do YouTube com `rel="nofollow"` para evitar
  que sejam tratados como links editoriais para indexação;
- adapta o layout para celulares, tablets e telas maiores.
- expõe favicon, ícone para iOS, manifesto web e metadados de tile
  para plataformas compatíveis.

## Visualização local

Para uma verificação rápida, basta abrir `index.html` no navegador.

Se preferir usar um servidor local, execute no diretório do projeto:

```bash
python3 -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Testes

Instale as dependências:

```bash
npm install
```

Execute a suíte de regressão responsiva:

```bash
npm test
```

Os testes com Playwright cobrem tamanhos representativos de celular e
tablet e verificam:

- visibilidade e posicionamento do título;
- presença das referências de favicon e manifesto no `<head>`;
- existência local do conjunto esperado de ícones e metadados;
- presença dos metadados de SEO, Open Graph, Twitter Card e JSON-LD;
- existência local da imagem de prévia de link usada nas metatags;
- existência local de `robots.txt`, `sitemap.xml` e `llms.txt`;
- uso de `rel="nofollow"` nos links externos do YouTube;
- carregamento da imagem de fundo principal;
- carregamento real das duas imagens das câmeras;
- layout responsivo dos cartões de câmera;
- presença e posicionamento dos rótulos das câmeras;
- tamanho do título em telas pequenas;
- regressões de overflow horizontal.

## Edições comuns

### Atualizar os links das câmeras

Edite os valores de `href` em `index.html` nas duas âncoras das
transmissões. Preserve `rel="nofollow noopener noreferrer external"`
para manter o comportamento atual de crawler.

### Atualizar as imagens das câmeras

Substitua os arquivos dentro de `assets/images/`, mantendo os mesmos
nomes, ou ajuste os atributos `src` em `index.html` se os nomes dos
arquivos mudarem.

### Atualizar a imagem de fundo

Substitua `assets/images/fachada.webp` ou ajuste a regra
`background-image` em `styles.css`.

### Atualizar a imagem de prévia de link

Substitua `assets/images/fachada.jpg` mantendo o formato JPEG e,
de preferência, a proporção `1200x630`. Se o nome do arquivo mudar,
atualize em conjunto as metatags `og:image`, `og:image:secure_url` e
`twitter:image` em `index.html`.

### Atualizar os favicons

Substitua o conjunto de arquivos de favicon na raiz do projeto,
mantendo os mesmos nomes, e confirme em `index.html` se as referências
no `<head>` continuam apontando para os arquivos corretos.

### Atualizar metadados de SEO e crawler

Edite em conjunto:

- o bloco de metadados no `<head>` de `index.html`;
- o JSON-LD em `index.html`;
- `robots.txt`;
- `sitemap.xml`;
- `llms.txt`.

Se a URL canônica do site mudar, atualize todos esses pontos na mesma
alteração.

### Atualizar rótulos ou estilos do título

A maior parte das mudanças visuais deve ser feita em `styles.css`. O
texto do título fica em `index.html`, enquanto as regras de tamanho,
espaçamento e responsividade ficam na folha de estilos.

## Orientações de manutenção

- Mantenha os nomes dos arquivos alinhados com as referências em
  `index.html`, `styles.css`, `site.webmanifest`, `robots.txt`,
  `sitemap.xml` e `llms.txt`.
- Execute `npm test` após mudanças funcionais ou de layout.
- Verifique a renderização em desktop e mobile após alterações visuais.
- Após atualizar favicons, valide também `favicon.ico`,
  `apple-touch-icon.png` e `site.webmanifest`.
- Após alterar SEO ou descoberta por crawler, valide também a URL
  canônica, os metadados de prévia de link,
  `assets/images/fachada.jpg` e os arquivos `robots.txt`,
  `sitemap.xml` e `llms.txt`.
- Se o comportamento público do site mudar, atualize este README antes
  de finalizar.

## Publicação

Este repositório não inclui automação de deploy. A publicação depende
do ambiente de hospedagem usado para o site.

Em termos práticos, o fluxo mínimo costuma ser:

1. atualizar os arquivos estáticos;
2. publicar ou enviar os arquivos alterados para a hospedagem;
3. validar a página publicada, os links e o layout responsivo.
