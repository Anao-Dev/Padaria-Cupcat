# Cupcat - Landing Page Premium

Landing page estatica em HTML5, CSS3 modular e JavaScript ES6 com modulos nativos para a Cupcat.

## Estrutura

```text
cupcat/
  index.html
  assets/css/
  assets/js/
  assets/images/
  README.md
  SECURITY.md
  PERFORMANCE.md
  DESIGN-SYSTEM.md
  robots.txt
  sitemap.xml
```

## Como abrir

Como o projeto e estatico, abra `index.html` diretamente no navegador ou sirva a pasta com um servidor local:

```powershell
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Backend do formulario

O backend Node.js fica em `backend-optional/node`. Ele salva `usuarios` e `pedidos` no MongoDB usando Prisma e envia email para `kathelengomes3000@gmail.com`.

Em producao, o backend tambem pode servir o front inteiro. Assim voce pode subir tudo como um unico Web Service.

Resumo:

```powershell
cd backend-optional\node
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

Configure o `.env` com `DATABASE_URL` antes de rodar `prisma:push` e `dev`.

Se voce nao tiver senha de app do Gmail, deixe `MAIL_ENABLED=false`. O pedido ainda sera salvo no MongoDB e podera ser consultado pela rota administrativa `GET /api/pedidos` com `x-admin-token`.

## Decisoes tecnicas

- Sem Bootstrap, Tailwind, jQuery ou framework JavaScript.
- CSS separado por base, layout, componentes e utilitarios.
- JavaScript orientado a objetos para navbar, animacoes, filtros, lightbox, formulario e toast.
- Camada de motion com progresso de scroll, texto cinetico, parallax leve, tilt nos cards e spotlight do cursor.
- Formulario sem envio real por padrao. Ele valida no frontend, aplica honeypot e mostra feedback acessivel.
- Imagens locais originais em WebP, geradas para o projeto e com PNGs mantidos como fonte local.

## Checklist final

- HTML semantico com um unico `h1`.
- Skip link e foco visivel.
- Menu mobile com `aria-expanded`.
- Imagens com `alt`, dimensoes e lazy loading abaixo do fold.
- `prefers-reduced-motion` respeitado.
- Sem `innerHTML`, `outerHTML`, `document.write`, `eval` ou `new Function`.
- `robots.txt`, `sitemap.xml` e JSON-LD Bakery incluidos.
