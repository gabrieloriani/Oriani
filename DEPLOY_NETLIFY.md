# 🌐 Guia: Configurar Domínio oriani.com.br no Netlify

## ✅ Como Manter Seu Domínio Próprio no Netlify

### Passo 1: Build do Projeto

No seu computador local, após fazer pull do GitHub:

```bash
cd frontend
yarn install
yarn build
```

Isso criará a pasta `frontend/build` com os arquivos otimizados para produção.

### Passo 2: Deploy no Netlify

#### Opção A: Deploy Manual (Mais Rápido)
1. Acesse [app.netlify.com](https://app.netlify.com)
2. Faça login na sua conta
3. Clique em **"Add new site"** → **"Deploy manually"**
4. Arraste a pasta `frontend/build` para a área de upload
5. Aguarde o deploy completar

#### Opção B: Deploy via GitHub (Recomendado)
1. Acesse [app.netlify.com](https://app.netlify.com)
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Escolha **GitHub** e selecione seu repositório
4. Configure as opções de build:
   - **Base directory:** `frontend`
   - **Build command:** `yarn build`
   - **Publish directory:** `frontend/build`
5. Adicione variáveis de ambiente:
   - `REACT_APP_BACKEND_URL`: URL do seu backend em produção
6. Clique em **"Deploy site"**

### Passo 3: Configurar Domínio Personalizado

1. No painel do Netlify, vá em **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Digite: `oriani.com.br`
4. Clique em **"Verify"**

#### Se Você JÁ Possui o Domínio:
5. O Netlify mostrará as configurações DNS necessárias
6. Copie os registros DNS fornecidos

### Passo 4: Configurar DNS no Registro.br (ou seu provedor)

Se seu domínio foi registrado no **Registro.br**:

1. Acesse [registro.br](https://registro.br)
2. Faça login
3. Vá em **"Meus Domínios"** → Selecione `oriani.com.br`
4. Clique em **"Alterar Servidores DNS"**

**Opção 1 - Apontar para Netlify DNS (Recomendado):**
- Mude para os name servers do Netlify:
  ```
  dns1.p01.nsone.net
  dns2.p01.nsone.net
  dns3.p01.nsone.net
  dns4.p01.nsone.net
  ```
  (Os name servers específicos estarão no seu painel Netlify)

**Opção 2 - Manter DNS no Registro.br:**
- Adicione um registro **A** apontando para o IP do Netlify
- Adicione um registro **CNAME** para `www` apontando para seu site Netlify
- Os valores exatos estarão em "Domain settings" no Netlify

### Passo 5: Configurar HTTPS

No Netlify:
1. Vá em **"Domain settings"** → **"HTTPS"**
2. Clique em **"Verify DNS configuration"**
3. Após verificação, clique em **"Provision certificate"**
4. Aguarde alguns minutos para o certificado SSL ser emitido

### Passo 6: Configurar Redirects e Rewrites

Crie o arquivo `frontend/public/_redirects` com:

```
# Redirecionar www para non-www
https://www.oriani.com.br/* https://oriani.com.br/:splat 301!

# SPA routing - todas as rotas para index.html
/*    /index.html   200
```

### Passo 7: Backend em Produção

Você precisa hospedar o backend FastAPI. Opções recomendadas:

#### Railway (Recomendado - Fácil)
1. Acesse [railway.app](https://railway.app)
2. Conecte seu GitHub
3. Selecione o repositório
4. Configure:
   - **Root Directory:** `/app/backend`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Adicione variáveis de ambiente:
   - `MONGO_URL`: URL do MongoDB Atlas
   - `DB_NAME`: oriani_database
   - `JWT_SECRET_KEY`: (gere uma chave segura)
   - `JWT_ALGORITHM`: HS256
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: 1440
   - `CORS_ORIGINS`: https://oriani.com.br

6. O Railway fornecerá uma URL, exemplo: `https://seu-projeto.railway.app`

#### MongoDB Atlas (Banco de Dados)
1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie conta gratuita
3. Crie um cluster (free tier)
4. Crie um database user
5. Configure IP whitelist (0.0.0.0/0 para permitir todos)
6. Copie a connection string
7. Use no `MONGO_URL` no Railway

### Passo 8: Atualizar REACT_APP_BACKEND_URL

No Netlify, adicione a variável de ambiente:
- **Key:** `REACT_APP_BACKEND_URL`
- **Value:** `https://seu-projeto.railway.app` (URL do Railway)

Faça um novo deploy para aplicar.

### Passo 9: Testar o Site

Após a propagação DNS (pode levar até 48h, mas geralmente 1-2 horas):

1. Acesse `https://oriani.com.br`
2. Teste todas as funcionalidades
3. Faça login no admin
4. Adicione fotos

## ✅ Checklist Final

- [ ] Frontend no Netlify
- [ ] Backend no Railway (ou similar)
- [ ] MongoDB no Atlas
- [ ] Domínio oriani.com.br configurado
- [ ] HTTPS ativo
- [ ] Variáveis de ambiente configuradas
- [ ] Site testado e funcionando
- [ ] Admin funcionando
- [ ] Upload de fotos funcionando

## 🔧 Troubleshooting

### Site não carrega após mudança de DNS
- **Solução:** Aguarde até 48h para propagação completa
- Teste em: [dnschecker.org](https://dnschecker.org)

### Erro CORS
- **Solução:** Verifique se `CORS_ORIGINS` no backend inclui `https://oriani.com.br`

### Backend não conecta ao MongoDB
- **Solução:** Verifique se IP está liberado no MongoDB Atlas (0.0.0.0/0)

### Fotos não fazem upload
- **Solução:** Verifique se o token JWT está sendo enviado corretamente

## 💡 Dicas de Performance

1. **Otimizar imagens antes de upload:**
   - Use ferramentas como TinyPNG
   - Mantenha imagens abaixo de 500KB

2. **Monitorar uso:**
   - Netlify free: 100GB/mês
   - Railway free: 500h/mês

3. **Backup:**
   - Configure backups automáticos no MongoDB Atlas
   - Exporte fotos periodicamente

## 📞 Suporte

Se tiver dúvidas:
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- MongoDB: [docs.mongodb.com](https://docs.mongodb.com)

---

**Seu site estará no ar em oriani.com.br! 🚀**
