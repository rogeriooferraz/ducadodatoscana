# Site do Condomínio Ducado da Toscana

Este repositório contém uma landing page estática simples do
Condomínio Ducado da Toscana. A página apresenta o nome do condomínio
sobre uma imagem de fundo em tela cheia e oferece dois links para
transmissões ao vivo.

O projeto não usa framework, mas agora possui uma etapa simples de
build para montar uma pasta `dist/` pronta para publicação. O site
continua sendo servido diretamente a partir de arquivos estáticos.

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
- `assets/images/camera-iniciando.webp`: imagem de fundo do
  estado de carregamento da página de câmera.
- `camera.html`: página local de visualização em tela inteira para as
  transmissões, com seleção de câmera via parâmetro na URL.
- `camera.css`: estilos da página local de visualização das câmeras.
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
- `scripts/build.js`: montagem da pasta `dist/` para publicação.
- `dist/`: saída gerada pelo build com os arquivos públicos do site.

## Comportamento atual

A página inicial:

- exibe o nome do condomínio como texto sobreposto acima das câmeras;
- usa `assets/images/fachada.webp` como imagem de fundo principal;
- mostra dois cartões de câmera com rótulos de direção;
- abre cada câmera em uma página local de visualização em tela inteira;
- mostra um cartão de carregamento com visual próprio enquanto a
  transmissão do YouTube inicializa;
- inicia cada transmissão automaticamente com o áudio silenciado;
- oferece um botão próprio de tela cheia e um botão de volta dentro da
  página de cada câmera;
- permite indexação da página principal com metadados de SEO,
  Open Graph, Twitter Card e dados estruturados;
- usa `assets/images/fachada.jpg` como imagem de prévia de link;
- expõe `robots.txt`, `sitemap.xml` e `llms.txt` para descoberta por
  crawlers;
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

Monte a pasta de publicação:

```bash
npm run build
```

Se quiser testar otimização opcional de imagens durante o build:

```bash
npm run build:images
```

Os testes com Playwright cobrem tamanhos representativos de celular e
tablet e verificam:

- visibilidade e posicionamento do título;
- presença das referências de favicon e manifesto no `<head>`;
- existência local do conjunto esperado de ícones e metadados;
- presença dos metadados de SEO, Open Graph, Twitter Card e JSON-LD;
- existência local da imagem de prévia de link usada nas metatags;
- existência local de `robots.txt`, `sitemap.xml` e `llms.txt`;
- navegação da home para as páginas locais das câmeras;
- funcionamento da navegação de volta pelo histórico do navegador;
- carregamento da imagem de fundo principal;
- carregamento real das duas imagens das câmeras;
- presença do player incorporado com o vídeo esperado em cada página;
- presença do cartão de carregamento temporário da página de câmera;
- ausência do link externo do YouTube e dos textos auxiliares removidos
  na página de câmera;
- layout responsivo dos cartões de câmera;
- disposição horizontal dos botões da câmera em telas largas e vertical
  em telas estreitas;
- presença e posicionamento dos rótulos das câmeras;
- tamanho do título em telas pequenas;
- regressões de overflow horizontal.

O build de produção:

- recria a pasta `dist/`;
- valida a presença dos arquivos públicos obrigatórios;
- minifica `index.html`, `camera.html`, `styles.css` e `camera.css`;
- gera variantes pré-comprimidas `.gz` e `.br` para HTML, CSS,
  manifesto e arquivos de descoberta em texto;
- copia HTML, CSS, favicons, manifestos, metadados e `assets/`;
- pode otimizar imagens de forma opcional com `npm run build:images`;
- gera um pacote estático pronto para upload na hospedagem.

## Edições comuns

### Atualizar os links das câmeras

Edite os valores de `href` em `index.html` nas duas âncoras das
transmissões se quiser alterar o destino local. Para mudar o vídeo do
YouTube exibidos, atualize o objeto `cameraConfigs` em `camera.html`.
O player atual abre com `autoplay=1` e `mute=1`, então preserve esse
comportamento se alterar a montagem da URL incorporada.

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
- Execute `npm run build` antes de publicar para garantir uma saída
  limpa em `dist/`.
- Se quiser reduzir também o peso das imagens, execute
  `npm run build:images` e compare o resultado antes de publicar.
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
2. executar `npm test`;
3. executar `npm run build`;
4. publicar o conteúdo da pasta `dist/` na hospedagem;
5. validar a página publicada, os links e o layout responsivo.

Se a hospedagem suportar entrega de arquivos pré-comprimidos, as
variantes `.gz` e `.br` geradas no build podem ser aproveitadas pelo
servidor. Caso contrário, esses arquivos extras podem permanecer sem
uso, sem alterar o funcionamento do site.
