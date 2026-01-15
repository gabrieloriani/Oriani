# 🔧 Troubleshooting Netlify - Erros Comuns

## ❌ ERRO: "Build failed" no Netlify

### Sintoma
O deploy falha com mensagens de erro no log

### Soluções

#### 1. Verifique a configuração de build
No Netlify, vá em "Site settings" → "Build & deploy" → "Build settings"

Deve estar EXATAMENTE assim:
```
Base directory: frontend
Build command: yarn build
Publish directory: frontend/build
```

#### 2. Verifique o package.json
O arquivo `/app/frontend/package.json` deve ter:
```json
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test"
}
```

#### 3. Verifique Node version
No Netlify, crie o arquivo `netlify.toml` na raiz do projeto:

```toml
[build]
  base = "frontend"
  command = "yarn build"
  publish = "frontend/build"

[build.environment]
  NODE_VERSION = "18"
```

---

## ❌ ERRO: "Module not found" durante build

### Sintoma
```
Module not found: Error: Can't resolve '@/components/...'
```

### Solução
Esse erro não deve acontecer porque seu projeto já tem `jsconfig.json` configurado.

Se acontecer, verifique se existe `/app/frontend/jsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

---

## ❌ ERRO: Site carrega mas mostra erro "Failed to fetch" ou "Network Error"

### Sintoma
- Site abre
- Mas não carrega dados
- Console mostra erro de CORS ou network

### Solução

#### 1. Verifique a variável REACT_APP_BACKEND_URL
No Netlify, vá em "Site settings" → "Environment variables"

Deve ter:
```
REACT_APP_BACKEND_URL = https://seu-backend.up.railway.app
```

**IMPORTANTE:** 
- ❌ NÃO coloque `/api` no final
- ❌ NÃO coloque barra `/` no final
- ✅ CORRETO: `https://seu-backend.up.railway.app`

#### 2. Verifique CORS no backend (Railway)
No Railway, nas variáveis de ambiente, verifique:
```
CORS_ORIGINS = https://oriani.com.br
```

Se você está testando com a URL do Netlify antes de configurar o domínio, use:
```
CORS_ORIGINS = https://seu-site.netlify.app,https://oriani.com.br
```

#### 3. Rebuild
Depois de mudar variáveis:
- Netlify: "Deploys" → "Trigger deploy" → "Clear cache and deploy"
- Railway: "Deployments" → Clique nos 3 pontos → "Redeploy"

---

## ❌ ERRO: Página 404 quando recarrega ou acessa URL direta

### Sintoma
- Homepage funciona
- Mas ao acessar `/galeria` ou `/orcamento` diretamente → 404

### Solução
Crie o arquivo `/app/frontend/public/_redirects` (já criado!) com:
```
/*    /index.html   200
```

Se já existe, faça novo deploy no Netlify.

---

## ❌ ERRO: "Environment variable not set"

### Sintoma
Site carrega mas aparece `undefined` onde deveria ter a URL do backend

### Solução

#### 1. No Netlify
Adicione a variável:
```
Key: REACT_APP_BACKEND_URL
Value: https://seu-backend.up.railway.app
```

#### 2. Faça rebuild
"Deploys" → "Trigger deploy" → "Clear cache and deploy"

---

## ❌ ERRO: DNS não resolve (oriani.com.br não abre)

### Sintoma
Domínio não funciona mesmo depois de configurar

### Soluções

#### 1. Aguarde propagação
DNS pode levar até 48h para propagar. Teste em:
https://dnschecker.org

#### 2. Verifique configuração no Registro.br

**Opção 1 - DNS do Netlify (RECOMENDADO):**

No Netlify, vá em "Domain settings" → "DNS & HTTPS"
Copie os name servers (algo como):
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

No Registro.br:
1. Vá em "Meus Domínios"
2. Clique em oriani.com.br
3. "Alterar servidores DNS"
4. Cole os DNS do Netlify
5. Salve

**Opção 2 - Registro A:**

No Registro.br, adicione:
```
Tipo: A
Nome: @
Valor: 75.2.60.5
TTL: 3600

Tipo: CNAME
Nome: www
Valor: seu-site.netlify.app
TTL: 3600
```

#### 3. No Netlify
"Domain settings" → "Add custom domain" → Digite `oriani.com.br`

---

## ❌ ERRO: HTTPS não funciona (certificado SSL)

### Sintoma
Site só abre em HTTP, não em HTTPS

### Solução

No Netlify:
1. Vá em "Domain settings" → "HTTPS"
2. Aguarde DNS verificar (pode levar 1-2 horas)
3. Clique em "Verify DNS configuration"
4. Clique em "Provision certificate"

Se não funcionar:
- Remova o domínio custom
- Aguarde 5 minutos
- Adicione novamente

---

## ❌ ERRO: Build passa mas site fica em branco

### Sintoma
Build é sucesso, mas site mostra tela branca

### Soluções

#### 1. Verifique o console do navegador
Abra DevTools (F12) e veja se tem erros

#### 2. Verifique o Publish directory
Deve ser `frontend/build` (não só `build`)

#### 3. Limpe cache e rebuild
"Deploys" → "Trigger deploy" → "Clear cache and deploy"

---

## ✅ COMO TESTAR SE ESTÁ TUDO CERTO

### Backend (Railway)
```bash
curl https://seu-backend.up.railway.app/api/
```

Deve retornar:
```json
{"message":"Oriani Multissoluções API"}
```

### Frontend (Netlify)
1. Abra: https://oriani.com.br
2. Abra DevTools (F12) → Console
3. Não deve ter erros em vermelho

### Admin
1. Vá em: https://oriani.com.br/login
2. Login: `admin@oriani.com.br` / `admin123`
3. Deve entrar no painel

---

## 🆘 ÚLTIMA OPÇÃO: Deploy Manual (Temporário)

Se nada funcionar, você pode fazer deploy manual enquanto resolve:

```bash
cd /app/frontend
yarn install
yarn build
```

No Netlify:
1. "Sites" → "Add new site" → "Deploy manually"
2. Arraste a pasta `/app/frontend/build` para a área
3. Pronto! (mas não será automático no futuro)

---

## 📧 Precisa de Ajuda?

Me envie:
1. URL do seu site no Netlify
2. Print do erro que está aparecendo
3. Em qual etapa você está

E eu te ajudo a resolver! 🚀
