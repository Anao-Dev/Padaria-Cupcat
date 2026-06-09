# Performance

## Metas

- LCP abaixo de 2.5s.
- INP abaixo de 200ms.
- CLS abaixo de 0.1.
- Lighthouse alvo acima de 95 em Performance, Acessibilidade, Boas Praticas e SEO.

## Praticas aplicadas

- Hero com `fetchpriority="high"`.
- Imagens abaixo do fold com `loading="lazy"`.
- Dimensoes `width` e `height` declaradas em imagens.
- Assets visuais em WebP.
- CSS modular sem framework pesado.
- JS nativo com `type="module"`.
- Animacoes restritas a `opacity` e `transform`.
- `IntersectionObserver` para reveals, evitando scroll handlers pesados.
- Efeitos de scroll sincronizados com `requestAnimationFrame`.
- Animações em `transform` e `opacity`, sem animar layout.
- `font-display=swap` via Google Fonts.

## Recomendacoes de deploy

- Servir assets com Brotli ou Gzip.
- Configurar cache longo para `assets/`.
- Usar CDN ou hosting com HTTP/2/HTTP/3.
- Rodar Lighthouse em 375px, 768px, 1024px e 1440px.
