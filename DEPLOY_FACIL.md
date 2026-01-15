# 🎯 DEPLOY SUPER SIMPLES - Apenas 10 Passos!

## Vou te guiar de forma DIRETA, sem enrolação!

---

## PASSO 1: MongoDB (5 minutos)

**Por que preciso?** Seu site precisa de um banco de dados para guardar fotos e álbuns.

1. Entre em: https://www.mongodb.com/cloud/atlas/register
2. Crie conta com Google (1 clique)
3. Clique em "Create" (aceite tudo padrão)
4. Aguarde 2 minutos criar o banco...

### Copiar a URL do banco:

1. Clique em "Connect"
2. Clique em "Drivers" 
3. Copie a string (vai ser tipo):
   ```
   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/
   ```

**⚠️ ANOTE ESSA URL!** Você vai usar no passo 3.

---

## PASSO 2: Render (Backend) - 5 minutos

**Por que preciso?** Para o sistema de admin (login, upload de fotos) funcionar.

1. Entre em: https://render.com
2. Faça login com GitHub
3. Clique em "New +" → "Web Service"
4. Clique em "Connect" no seu repositório
5. Preencha:

```
Name: oriani-backend
Region: Oregon (qualquer um serve)
Branch: main
Root Directory: /app/backend
Runtime: Python 3

Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

6. Role para baixo e escolha: **Free** (grátis)

7. Clique em "Advanced" e adicione estas variáveis:

```
MONGO_URL = (cole aqui a URL do MongoDB do passo 1)
DB_NAME = oriani_database
JWT_SECRET_KEY = oriani2025secret
JWT_ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
CORS_ORIGINS = *
```

8. Clique em "Create Web Service"

**⏳ Aguarde 5-10 minutos...**

Quando terminar, vai aparecer uma URL tipo:
```
https://oriani-backend.onrender.com
```

**⚠️ ANOTE ESSA URL!** Você vai usar no passo 4.

---

## PASSO 3: Testar se o Backend Funcionou

Abra no navegador:
```
https://sua-url-do-render.onrender.com/api/
```

Se aparecer:
```
{"message":"Oriani Multissoluções API"}
```

**✅ FUNCIONOU! Continue para o passo 4.**

Se deu erro, me avise!

---

## PASSO 4: Netlify (Frontend) - 5 minutos

1. Entre em: https://app.netlify.com
2. Faça login com GitHub
3. Clique em "Add new site" → "Import an existing project"
4. Escolha GitHub e selecione seu repositório

5. Preencha EXATAMENTE assim:

```
Base directory: frontend
Build command: yarn build
Publish directory: frontend/build
```

6. Clique em "Show advanced" → "New variable"

```
Key: REACT_APP_BACKEND_URL
Value: (cole aqui a URL do Render - SEM barra no final!)
```

Exemplo: `https://oriani-backend.onrender.com`

7. Clique em "Deploy"

**⏳ Aguarde 3-5 minutos...**

Pronto! Você terá uma URL tipo:
```
https://seu-site.netlify.app
```

**🎉 SEU SITE JÁ ESTÁ NO AR!**

---

## PASSO 5: Testar o Site

1. Abra a URL do Netlify
2. Navegue pelo site
3. Vá em `/login`
4. Entre com:
   - Email: `admin@oriani.com.br`
   - Senha: `admin123`

Se conseguir entrar e criar álbum:
**✅ TUDO FUNCIONANDO!**

---

## PASSO 6: Adicionar seu Domínio oriani.com.br (10 minutos)

### No Netlify:

1. Vá em "Domain settings"
2. Clique em "Add domain"
3. Digite: `oriani.com.br`
4. Clique em "Verify" → "Add domain"

### No Registro.br:

1. Entre em: https://registro.br
2. Faça login
3. Vá em "Meus Domínios" → Clique em `oriani.com.br`
4. Clique em "Editar Zona DNS"

**Adicione estes 2 registros:**

```
Registro 1:
Tipo: A
Nome: @
Dados: 75.2.60.5

Registro 2:
Tipo: CNAME
Nome: www
Dados: seu-site.netlify.app
```

5. Salve

---

## PASSO 7: Ativar HTTPS (10 minutos)

**Aguarde 30 minutos** após configurar DNS.

Depois:
1. No Netlify, vá em "Domain settings" → "HTTPS"
2. Clique em "Verify DNS"
3. Clique em "Provision certificate"

**⏳ Aguarde mais 5-10 minutos...**

**🎉 PRONTO! Seu site está em https://oriani.com.br**

---

## PASSO 8: Atualizar CORS no Backend

Agora que você tem o domínio, precisa atualizar:

1. No Render, vá em seu web service
2. Clique em "Environment"
3. Edite `CORS_ORIGINS`:
   ```
   CORS_ORIGINS = https://oriani.com.br
   ```
4. Salve (vai fazer redeploy automático)

---

## PASSO 9: Adicionar Fotos

1. Entre em `https://oriani.com.br/login`
2. Login: `admin@oriani.com.br` / `admin123`
3. Crie álbuns por categoria
4. Faça upload das fotos dos trabalhos
5. Pronto! Elas aparecem no site automaticamente

---

## PASSO 10: Google Search Console (SEO)

Para aparecer no Google:

1. Entre em: https://search.google.com/search-console
2. Adicione `https://oriani.com.br`
3. Verifique propriedade (Netlify faz automático)
4. Envie o sitemap: `https://oriani.com.br/sitemap.xml`

**🎉 SITE COMPLETO NO AR!**

---

## 💰 CUSTOS:

- MongoDB Atlas: **GRÁTIS** (512MB)
- Render: **GRÁTIS** (750h/mês - suficiente!)
- Netlify: **GRÁTIS** (100GB/mês)

**Total: R$ 0,00/mês!**

---

## ⚠️ Atenção com o Render Grátis:

O plano grátis do Render "dorme" após 15 minutos sem uso.
Quando alguém acessa, demora 30-60 segundos para "acordar".

**Solução:**
- Para manter sempre ativo: Upgrade para $7/mês
- OU use um serviço como https://uptimerobot.com (grátis) para pingar seu site a cada 5 minutos

---

## 🆘 Problemas?

**Backend não subiu no Render:**
- Vá em "Logs" no Render
- Me mande um print do erro

**Frontend não buildo no Netlify:**
- Vá em "Deploys" → Último deploy → "Deploy log"
- Me mande um print do erro

**Site não abre:**
- Aguarde até 2 horas para DNS propagar
- Teste em: https://dnschecker.org

---

## ✅ Resumo das URLs:

Anote aqui depois:

```
Backend (Render):  https://_________.onrender.com
Frontend (Netlify): https://oriani.com.br
MongoDB:           mongodb+srv://________
Admin:             https://oriani.com.br/login
```

---

**Muito mais simples que o Railway, né? 😊**

**Qualquer dúvida, me avise em qual passo travou!**
