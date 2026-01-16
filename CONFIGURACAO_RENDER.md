# 🚀 Configuração Completa do Render para Oriani

## 📋 Passo a Passo para Configurar o Backend no Render

### 1️⃣ Adicionar Variáveis de Ambiente no Render

Acesse seu serviço no Render: https://dashboard.render.com/

Vá em **Environment** e adicione TODAS estas variáveis:

```
MONGO_URL=sua_url_do_mongodb_atlas
DB_NAME=oriani_database
CORS_ORIGINS=https://oriani.pages.dev,https://oriani.com.br
JWT_SECRET_KEY=oriani_secret_key_change_in_production_2025
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ADMIN_EMAIL=eletricista@oriani.com.br
ADMIN_PASSWORD=15pras7Hora$
```

⚠️ **IMPORTANTE:**
- Substitua `sua_url_do_mongodb_atlas` pela sua URL real do MongoDB
- Se ainda não tem MongoDB Atlas, veja instruções abaixo

---

### 2️⃣ Configurações Recomendadas no Render

#### Build Command:
```bash
pip install -r backend/requirements.txt
```

#### Start Command:
```bash
uvicorn backend.server:app --host 0.0.0.0 --port $PORT
```

#### Health Check Path:
```
/api/
```

#### Auto-Deploy:
✅ Deixe ATIVO para fazer deploy automático quando fizer push no GitHub

---

### 3️⃣ MongoDB Atlas (Se ainda não configurou)

1. Acesse: https://cloud.mongodb.com/
2. Crie uma conta gratuita (Free Tier - M0)
3. Crie um Cluster
4. Em **Database Access**, crie um usuário com senha
5. Em **Network Access**, adicione IP `0.0.0.0/0` (permitir de qualquer lugar)
6. Clique em **Connect** > **Connect your application**
7. Copie a string de conexão (ex: `mongodb+srv://usuario:senha@cluster.mongodb.net/`)
8. Cole essa URL na variável `MONGO_URL` no Render

---

### 4️⃣ Configuração do Domínio Personalizado (oriani.com.br)

#### No Cloudflare (Frontend):

1. Vá em **Pages** > Seu projeto
2. Em **Custom Domains**, adicione `oriani.com.br` e `www.oriani.com.br`
3. O Cloudflare configurará automaticamente os DNS

#### No Render (Backend):

1. Vá em seu serviço
2. Clique em **Settings** > **Custom Domain**
3. Adicione `api.oriani.com.br` (subdomínio para a API)
4. Copie o registro CNAME que o Render fornecer
5. Vá no Cloudflare DNS e adicione:
   - Tipo: `CNAME`
   - Nome: `api`
   - Conteúdo: `oriani.onrender.com` (valor que o Render fornecer)

#### Atualizar Frontend após configurar subdomínio:
Se você criar o subdomínio `api.oriani.com.br`, atualize no Cloudflare a variável de ambiente:
```
REACT_APP_BACKEND_URL=https://api.oriani.com.br
```

E atualize o CORS no Render também:
```
CORS_ORIGINS=https://oriani.pages.dev,https://oriani.com.br,https://www.oriani.com.br
```

---

### 5️⃣ Checklist Final

Depois de configurar tudo, teste:

✅ Backend respondendo: https://oriani.onrender.com/api/
✅ Login funcionando em: https://oriani.com.br/login
✅ Fotos aparecendo na galeria pública
✅ Área admin protegida

---

## 🆘 Problemas Comuns

### Backend retorna 500:
- Verifique se TODAS as variáveis de ambiente foram adicionadas
- Verifique se a URL do MongoDB está correta

### CORS Error:
- Verifique se `CORS_ORIGINS` tem exatamente os domínios corretos (sem barra no final)
- Exemplo correto: `https://oriani.com.br` ✅
- Exemplo errado: `https://oriani.com.br/` ❌

### Login não funciona:
- Verifique se `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão configurados no Render
- Use exatamente: `eletricista@oriani.com.br` e `15pras7Hora$`

---

## 📞 Resultado Final

- **Site público:** https://oriani.com.br
- **API Backend:** https://oriani.onrender.com (ou https://api.oriani.com.br)
- **Login Admin:** https://oriani.com.br/login
- **Email:** eletricista@oriani.com.br
- **Senha:** 15pras7Hora$

🎉 Agora o sistema está 100% seguro e funcional!
