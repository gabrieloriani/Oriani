# 🎯 PASSO A PASSO VISUAL - Deploy Completo

## 📋 Checklist Antes de Começar

- [ ] Código está no GitHub
- [ ] Tenho acesso ao Registro.br (onde registrei oriani.com.br)
- [ ] 30 minutos disponíveis

---

## 🚀 PARTE 1: BACKEND (10 minutos)

### Etapa 1.1: MongoDB Atlas (Banco de Dados)

```
1. Acesse: mongodb.com/cloud/atlas/register
2. [Botão] "Sign Up" → Use Google
3. [Botão] "Build a Database"
4. [Escolha] "FREE" → [Botão] "Create"
5. Aguarde 2 minutos...

✅ Tela vai mostrar: "Cluster0" criado
```

### Etapa 1.2: Criar Usuário do Banco

```
1. [Aba] "Database Access"
2. [Botão] "Add New Database User"
3. Preencha:
   Username: oriani_admin
   Password: (crie uma senha forte)
   [✓] Anote a senha em algum lugar seguro!
4. [Botão] "Add User"
```

### Etapa 1.3: Liberar Acesso

```
1. [Aba] "Network Access"  
2. [Botão] "Add IP Address"
3. [Botão] "Allow Access from Anywhere"
4. [Botão] "Confirm"
```

### Etapa 1.4: Copiar Connection String

```
1. [Aba] "Database"
2. [Botão] "Connect" no Cluster0
3. [Escolha] "Connect your application"
4. [Copiar] a string que aparece:

mongodb+srv://oriani_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

5. [✓] Substitua <password> pela senha que você criou
6. [✓] Anote essa string completa!
```

### Etapa 1.5: Railway (Hospedar Backend)

```
1. Acesse: railway.app
2. [Botão] "Start a New Project"
3. [Login] com GitHub
4. [Escolha] "Deploy from GitHub repo"
5. [Selecione] seu repositório oriani
6. Aguarde deploy inicial...
```

### Etapa 1.6: Configurar Railway

```
Clique no serviço que foi criado:

1. [Aba] "Settings":
   
   Root Directory: /app/backend
   [Salvar]
   
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   [Salvar]

2. [Aba] "Variables" → [Botão] "New Variable"
   
   Adicione uma por vez:
   
   MONGO_URL = (cole aqui a string do MongoDB)
   DB_NAME = oriani_database
   JWT_SECRET_KEY = oriani_secret_prod_2025
   JWT_ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 1440
   CORS_ORIGINS = https://oriani.com.br

3. [Aba] "Settings" → "Networking"
   [Botão] "Generate Domain"
   
   ✅ Vai gerar: https://seu-projeto-xxxx.up.railway.app
   [✓] COPIE E ANOTE ESSA URL!
```

---

## 🎨 PARTE 2: FRONTEND (5 minutos)

### Etapa 2.1: Netlify

```
1. Acesse: app.netlify.com
2. [Login] com GitHub
3. [Botão] "Add new site"
4. [Escolha] "Import an existing project"
5. [Escolha] "GitHub"
6. [Selecione] seu repositório oriani
```

### Etapa 2.2: Configurar Build

```
NA TELA DE CONFIGURAÇÃO:

Site name: oriani (ou qualquer nome)

Build settings:
├─ Base directory: frontend
├─ Build command: yarn build
└─ Publish directory: frontend/build

[Expandir] "Advanced build settings"
[Botão] "New variable"

Key: REACT_APP_BACKEND_URL
Value: (cole aqui a URL do Railway que você anotou)

Exemplo: https://seu-projeto-xxxx.up.railway.app

[Botão] "Deploy site"
```

### Etapa 2.3: Aguardar Build

```
⏳ Aguarde 2-5 minutos...

✅ Quando aparecer: "Site is live"

Você terá uma URL temporária:
https://random-name.netlify.app

[✓] Teste essa URL para ver se está funcionando!
```

---

## 🌐 PARTE 3: DOMÍNIO oriani.com.br (15 minutos)

### Etapa 3.1: Adicionar Domínio no Netlify

```
No Netlify:

1. [Aba] "Domain management"
2. [Botão] "Add custom domain"
3. Digite: oriani.com.br
4. [Botão] "Verify"
5. [Botão] "Add domain"

Netlify vai te mostrar instruções de DNS.
Deixe essa aba aberta!
```

### Etapa 3.2: Configurar DNS no Registro.br

```
1. Acesse: registro.br
2. [Login] com CPF/CNPJ e senha
3. [Menu] "Meus Domínios"
4. [Clique] em oriani.com.br
```

**ESCOLHA UMA OPÇÃO:**

#### OPÇÃO A: Name Servers do Netlify (MAIS FÁCIL)

```
No Netlify (aba que você deixou aberta):
[Copie] os 4 name servers que aparecem:
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net

No Registro.br:
1. [Botão] "Alterar Servidores DNS"
2. [Cole] os 4 DNS do Netlify
3. [Salvar]

✅ PRONTO! Aguarde 1-24h
```

#### OPÇÃO B: Registro A (MAIS RÁPIDO)

```
No Registro.br:
1. [Botão] "Editar Zona"
2. [Adicionar] dois registros:

Registro 1:
   Tipo: A
   Nome: @
   Valor: 75.2.60.5
   TTL: 3600

Registro 2:
   Tipo: CNAME
   Nome: www
   Valor: seu-site-netlify.netlify.app
   TTL: 3600

3. [Salvar]

✅ PRONTO! Aguarde 30min-2h
```

### Etapa 3.3: Ativar HTTPS

```
No Netlify:

1. Aguarde 30 minutos após configurar DNS
2. [Aba] "Domain management" → "HTTPS"
3. [Botão] "Verify DNS configuration"
4. [Botão] "Provision certificate"

⏳ Aguarde 5-10 minutos...

✅ Quando aparecer "Certificate provisioned"
   Seu site estará em: https://oriani.com.br
```

---

## ✅ PARTE 4: TESTAR (5 minutos)

### Teste 1: Homepage
```
Acesse: https://oriani.com.br
✅ Deve carregar a página inicial
```

### Teste 2: Orçamento
```
Acesse: https://oriani.com.br/orcamento
✅ Deve carregar formulário
✅ Selecione serviços
✅ Preencha nome
✅ Clique em "Enviar pelo WhatsApp"
✅ Deve abrir WhatsApp com mensagem
```

### Teste 3: Admin
```
Acesse: https://oriani.com.br/login
Login: admin@oriani.com.br
Senha: admin123
✅ Deve entrar no painel
✅ Crie um álbum de teste
✅ Faça upload de uma foto
✅ Verifique se aparece na homepage
```

### Teste 4: Páginas de Serviços (SEO)
```
Acesse: https://oriani.com.br/servicos/Elétrica
✅ Deve carregar página com conteúdo rico
✅ Teste outros serviços também
```

---

## 🎉 PRONTO!

Seu site está no ar em **oriani.com.br**!

### Próximos Passos:

1. **Adicione fotos reais:**
   - Login em /admin
   - Crie álbuns por categoria
   - Upload de fotos dos trabalhos

2. **Atualize informações:**
   - Se precisar mudar telefone/email, me avise
   - Adicione mais categorias se necessário

3. **SEO:**
   - Google Search Console: https://search.google.com/search-console
   - Adicione seu site
   - Envie o sitemap: https://oriani.com.br/sitemap.xml

---

## 🆘 Algo Deu Errado?

**Leia:** `/app/TROUBLESHOOTING_NETLIFY.md`

**Ou me avise em qual etapa travou que eu te ajudo!**

### Logs Úteis:

- **Netlify:** "Deploys" → Clique no último deploy → Veja os logs
- **Railway:** "Deployments" → Clique no deploy → Veja os logs
- **Browser:** F12 → Console → Veja os erros

---

## 💰 Custos Finais

- Netlify: **R$ 0/mês** (free tier)
- Railway: **R$ 0/mês** ($5 crédito grátis)
- MongoDB: **R$ 0/mês** (free tier)

**Total: R$ 0/mês! 🎉**

Quando seu site crescer:
- Netlify Pro: $19/mês (300GB)
- Railway: ~$5-20/mês conforme uso

Mas para começar, tudo GRÁTIS! 🚀
