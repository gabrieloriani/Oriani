# 🚀 Deploy Netlify - Guia Simplificado para oriani.com.br

## ⚠️ IMPORTANTE: Você precisa de 2 coisas no ar:
1. **Frontend** (React) → Netlify
2. **Backend** (FastAPI) → Railway ou Render

Vou te guiar nos dois!

---

## PASSO 1: Colocar o Backend no Ar (Railway - GRÁTIS)

### 1.1 Criar conta no Railway
1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Faça login com GitHub

### 1.2 Criar banco MongoDB (GRÁTIS no Atlas)
1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie conta gratuita
3. Clique em "Build a Database" → FREE (Shared)
4. Escolha região (São Paulo ou Virginia)
5. Clique em "Create"

### 1.3 Configurar MongoDB
1. Clique em "Database Access" → "Add New Database User"
   - Username: `oriani_admin`
   - Password: `(crie uma senha forte e ANOTE)`
   - Clique em "Add User"

2. Clique em "Network Access" → "Add IP Address"
   - Clique em "Allow Access from Anywhere"
   - Clique em "Confirm"

3. Clique em "Database" → "Connect" → "Connect your application"
   - Copie a connection string, vai parecer com:
   ```
   mongodb+srv://oriani_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - SUBSTITUA `<password>` pela senha que você criou
   - ANOTE essa string completa!

### 1.4 Deploy do Backend no Railway

1. No Railway, clique em "New Project" → "Deploy from GitHub repo"
2. Selecione seu repositório do GitHub
3. Clique no serviço criado
4. Vá em "Settings":
   - **Root Directory:** `/app/backend` ← IMPORTANTE!
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
   
5. Vá em "Variables" e adicione:
   ```
   MONGO_URL = (cole aqui a string do MongoDB que você anotou)
   DB_NAME = oriani_database
   JWT_SECRET_KEY = oriani_secret_prod_2025_xyz123
   JWT_ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 1440
   CORS_ORIGINS = https://oriani.com.br
   ```

6. Clique em "Deploy"

7. Após o deploy, clique em "Settings" → "Networking" → "Generate Domain"
   - Vai gerar algo como: `https://seu-projeto.up.railway.app`
   - **COPIE ESSA URL E ANOTE!** ← Essa é a URL do seu backend

---

## PASSO 2: Deploy do Frontend no Netlify

### 2.1 Preparar o Repositório GitHub

Primeiro, certifique-se que seu código está no GitHub:

```bash
git add .
git commit -m "Preparando para deploy"
git push origin main
```

### 2.2 Deploy no Netlify

1. Acesse: https://app.netlify.com
2. Faça login (use GitHub)
3. Clique em "Add new site" → "Import an existing project"
4. Escolha "GitHub" e autorize o acesso
5. Selecione seu repositório

### 2.3 Configurações de Build no Netlify

**COPIE E COLE EXATAMENTE ISSO:**

```
Base directory: frontend
Build command: yarn build
Publish directory: frontend/build
```

### 2.4 Variáveis de Ambiente

Clique em "Show advanced" → "New variable"

Adicione:
```
Key: REACT_APP_BACKEND_URL
Value: (cole aqui a URL do Railway que você anotou, ex: https://seu-projeto.up.railway.app)
```

**NÃO coloque barra no final!**

### 2.5 Deploy

1. Clique em "Deploy site"
2. Aguarde 2-5 minutos
3. Quando terminar, você terá uma URL tipo: `https://random-name-123.netlify.app`

---

## PASSO 3: Configurar seu Domínio oriani.com.br

### 3.1 No Netlify

1. Vá em "Site settings" → "Domain management"
2. Clique em "Add custom domain"
3. Digite: `oriani.com.br`
4. Clique em "Verify"

### 3.2 No Registro.br (onde você registrou o domínio)

1. Acesse: https://registro.br
2. Faça login
3. Vá em "Meus Domínios" → Clique em `oriani.com.br`
4. Vá em "Editar Zona"

**Adicione estes registros DNS:**

**Tipo A:**
```
Nome: @
Tipo: A
Valor: 75.2.60.5
```

**Tipo CNAME (para www):**
```
Nome: www
Tipo: CNAME
Valor: (nome do seu site).netlify.app
```

**Exemplo real:**
Se sua URL do Netlify é `random-name-123.netlify.app`, coloque isso no CNAME.

5. Salve as alterações

### 3.3 De volta no Netlify

1. Aguarde 10-20 minutos para DNS propagar
2. Vá em "Domain settings" → "HTTPS"
3. Clique em "Verify DNS configuration"
4. Clique em "Provision certificate"

---

## PASSO 4: Testar Tudo

Após 20-30 minutos, teste:

1. Acesse `https://oriani.com.br`
2. Navegue pelas páginas
3. Teste a página de orçamento
4. Tente fazer login no admin: `https://oriani.com.br/login`
   - Email: `admin@oriani.com.br`
   - Senha: `admin123`

---

## 🆘 PROBLEMAS COMUNS

### "Site não carrega"
- Aguarde até 48h para DNS propagar completamente
- Teste em: https://dnschecker.org

### "Erro CORS" ou "Failed to fetch"
- Verifique se `CORS_ORIGINS` no Railway inclui `https://oriani.com.br`
- Reinicie o backend no Railway

### "Backend não conecta"
- Verifique se a `MONGO_URL` está correta
- Confirme que liberou IP `0.0.0.0/0` no MongoDB Atlas

### "Admin não faz upload de fotos"
- Faça logout e login novamente
- Verifique se o backend está rodando no Railway

---

## 📊 RESUMO DAS URLs

Anote aqui depois de configurar:

```
Backend (Railway):    https://__________.up.railway.app
Frontend (Netlify):   https://oriani.com.br
MongoDB (Atlas):      mongodb+srv://oriani_admin:____@cluster0.xxxxx.mongodb.net
Admin:                https://oriani.com.br/login
```

---

## ✅ CHECKLIST FINAL

- [ ] Backend no Railway rodando
- [ ] MongoDB Atlas configurado
- [ ] Frontend no Netlify rodando
- [ ] Domínio oriani.com.br apontando para Netlify
- [ ] HTTPS ativo
- [ ] Login admin funcionando
- [ ] Upload de fotos funcionando
- [ ] WhatsApp funcionando

---

## 💰 CUSTOS

- **Netlify:** GRÁTIS (até 100GB/mês)
- **Railway:** GRÁTIS ($5/mês de crédito, suficiente para começar)
- **MongoDB Atlas:** GRÁTIS (512MB)

**Total: R$ 0,00/mês para começar! 🎉**

---

## 📞 Dúvidas?

Se algo não funcionar, me avise qual erro está aparecendo e em qual etapa você está!
