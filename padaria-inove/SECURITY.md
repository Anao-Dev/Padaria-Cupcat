# Segurança

## Implementado no frontend

- Nenhum dado de usuario é inserido com `innerHTML`.
- Sanitizacao leve no navegador para remover tags, handlers e payloads suspeitos.
- Honeypot oculto no formulario.
- Tempo minimo de preenchimento para reduzir envio automatizado.
- Links externos com `rel="noopener noreferrer"`.
- Sem chaves de API, storage sensivel ou dependencias JavaScript externas.
- Em producao, o formulario usa `/api/pedidos` no mesmo dominio ou por proxy/rewrite, evitando expor endpoint local no HTML.

## Implementado no backend

- Helmet com headers defensivos.
- `x-powered-by` desativado.
- CORS por allowlist via `FRONTEND_ORIGINS`.
- Limite de JSON em `8kb`.
- Rejeicao de `Content-Type` diferente de `application/json` em metodos com corpo.
- Rate limit global em `/api`.
- Validacao server-side com Zod em modo `strict`.
- Sanitizacao e normalizacao de texto/telefone.
- Rota administrativa desativada por padrao com `ADMIN_ROUTES_ENABLED=false`.
- Token administrativo comparado com `crypto.timingSafeEqual`.
- Erros sem vazamento de stack trace em producao.
- Email opcional; pedido nao falha se email estiver desativado.

## Segredos e MongoDB

- Nunca versionar `.env`.
- Rotacione a senha do MongoDB se ela ja foi compartilhada em chat, print, log ou commit.
- Use um usuario MongoDB exclusivo para esta aplicacao.
- Use uma senha longa e aleatoria.
- Restrinja IPs permitidos no MongoDB Atlas quando souber onde o backend vai rodar.
- Em producao, configure `DATABASE_URL`, `ADMIN_TOKEN` e demais segredos no painel da hospedagem.
- `ADMIN_TOKEN` deve ter pelo menos 32 caracteres em producao.

## Headers recomendados em producao

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

## Para formulario real

Antes de enviar email ou gravar dados em servidor:

- Validar e sanitizar novamente no backend.
- Usar CSRF token.
- Aplicar rate limiting por IP.
- Limitar tamanho do payload.
- Nao expor erros tecnicos ao usuario.
- Guardar credenciais apenas em variaveis de ambiente.
- Usar HTTPS.
