# Backend Node.js

Backend Express para receber o formulario da landing page, salvar cliente e pedido no MongoDB via Prisma, e opcionalmente enviar email para `kathelengomes3000@gmail.com`.

## Como rodar

```powershell
cd backend-optional\node
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

API local:

```text
http://127.0.0.1:3000
```

Endpoint do formulario:

```text
POST /api/pedidos
```

## Variaveis obrigatorias

Configure `backend-optional/node/.env`:

```env
DATABASE_URL="mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/padaria_inove?retryWrites=true&w=majority"
FRONTEND_ORIGINS=http://127.0.0.1:8080
ADMIN_ROUTES_ENABLED=false
ADMIN_TOKEN=gere-um-token-longo-com-32-caracteres-ou-mais
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app-do-gmail
MAIL_FROM="Padaria Inove <seu-email@gmail.com>"
MAIL_TO=kathelengomes3000@gmail.com
```

Se voce nao tiver senha de app, deixe `MAIL_ENABLED=false`. O formulario continua funcionando e o pedido fica salvo no MongoDB.

## Consultar pedidos sem email

Defina `ADMIN_ROUTES_ENABLED=true` e um token forte em `ADMIN_TOKEN` no `.env`.

Depois rode:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/pedidos" -Headers @{ "x-admin-token" = "SEU_TOKEN" } -UseBasicParsing
```

Ou abra uma interface visual do banco:

```powershell
npm run prisma:studio
```

Se ativar email depois, para Gmail use senha de app, nao a senha normal da conta.

## Banco de dados

Prisma cria as colecoes:

- `usuarios`
- `pedidos`

Cada pedido tem `usuarioId`, ligando o pedido ao cliente.

## Producao

- Use HTTPS.
- Configure segredos no painel da hospedagem, nao em arquivo.
- Configure `FRONTEND_ORIGINS` com o dominio real do site.
- Restrinja IPs no MongoDB Atlas quando possivel.
- Mantenha `ADMIN_ROUTES_ENABLED=false` se nao precisar consultar pedidos pela API.
- Rotacione a senha do MongoDB se ela foi compartilhada fora de um cofre de segredos.
