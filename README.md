# 🔧 Oriani Multissoluções - Site Profissional (Python Full-Stack)

Site profissional para serviços de Marido de Aluguel com sistema completo de gerenciamento de portfólio.

## 🚀 Arquitetura

### **Python Full-Stack (FastAPI + Jinja2)**
- ✅ **Backend e Frontend unificados** - Um único servidor Python serve todo o site
- ✅ **Sem APIs separadas** - Comunicação direta entre templates e banco de dados
- ✅ **Simples de hospedar** - Apenas um serviço para configurar no Render
- ✅ **Sem problemas de CORS** - Tudo no mesmo domínio

## 🎨 Design Aprimorado

### Novidades Visuais
- **Gradientes animados** no hero e seções de destaque
- **Efeitos hover** em cards com animações suaves
- **Transições CSS** profissionais em todo o site
- **Fundos decorativos** com blur e formas geométricas
- **Lightbox moderno** para visualização de fotos
- **Design responsivo** otimizado para todos os dispositivos

### Cores da Marca
- Laranja (#FF8C42) - Cor primária
- Azul Navy (#1E3A5F) - Cor secundária

## 📋 Categorias de Serviço

1. **Elétrica** - Instalações e reparos elétricos
2. **Hidráulica** - Encanamentos e consertos
3. **Pintura** - Pintura residencial e comercial
4. **Montagem de Móveis** - Montagem profissional
5. **Instalações** - Instalações diversas
6. **Alvenaria e Drywall** - 🆕 Paredes, divisórias e reparos

## 🔐 Área Administrativa

### Acesso
- **URL**: `/login`
- **Email**: Configurado em `ADMIN_EMAIL` (backend/.env)
- **Senha**: Configurado em `ADMIN_PASSWORD` (backend/.env)

### Funcionalidades
- ✅ Criar, editar e excluir álbuns
- ✅ Upload de fotos (JPG, PNG, WEBP até 5MB)
- ✅ Organizar por categorias
- ✅ Autenticação via cookies HTTP-only

## 📁 Estrutura do Projeto

```
/app/backend/
├── server.py              # FastAPI + rotas + Jinja2
├── .env                   # Variáveis de ambiente
├── requirements.txt       # Dependências Python
├── templates/             # Templates HTML (Jinja2)
│   ├── base.html          # Template base
│   ├── home.html          # Homepage
│   ├── gallery.html       # Galeria de fotos
│   ├── service.html       # Página de serviço
│   ├── orcamento.html     # Solicitação de orçamento
│   ├── login.html         # Login admin
│   └── admin.html         # Painel administrativo
└── static/
    ├── css/
    │   └── styles.css     # Estilos customizados + animações
    └── assets/
        └── logo.png       # Logo Oriani
```

## 🌐 URLs do Site

### Páginas Públicas
- `/` - Homepage
- `/galeria` - Galeria completa
- `/galeria/{categoria}` - Galeria filtrada
- `/servicos/{nome}` - Página de serviço
- `/orcamento` - Solicitar orçamento

### Área Administrativa
- `/login` - Login
- `/admin` - Painel de gerenciamento
- `/logout` - Sair

### APIs (mantidas para compatibilidade)
- `GET /api/albums` - Lista álbuns
- `GET /api/photos` - Lista fotos
- `GET /api/categories` - Lista categorias
- `POST /api/auth/login` - Login via API

## 🚀 Deploy no Render

### Configuração Simplificada
1. **Serviço**: Web Service
2. **Build Command**: `pip install -r backend/requirements.txt`
3. **Start Command**: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Variáveis de ambiente**:
   - `MONGO_URL` - URL do MongoDB Atlas
   - `DB_NAME` - Nome do banco de dados
   - `JWT_SECRET_KEY` - Chave secreta para JWT
   - `JWT_ALGORITHM` - HS256
   - `ACCESS_TOKEN_EXPIRE_MINUTES` - 1440
   - `ADMIN_EMAIL` - Email do admin
   - `ADMIN_PASSWORD` - Senha do admin

### Cloudflare (opcional)
- Use apenas como proxy DNS para o Render
- Não precisa de Pages ou Workers
- Benefícios: CDN, SSL, proteção DDoS

## 📊 Tecnologias

### Backend
- **FastAPI** - Framework web Python
- **Jinja2** - Templates HTML
- **Motor** - Driver async MongoDB
- **Python-Jose** - JWT
- **Passlib** - Hash de senhas

### Frontend (via Templates)
- **Tailwind CSS** (via CDN) - Estilização
- **Lucide Icons** - Ícones SVG
- **JavaScript Vanilla** - Interatividade

### Banco de Dados
- **MongoDB** - Armazenamento de dados
- Imagens em **Base64** no MongoDB

## 📞 Informações de Contato

Atualize nos templates:
- **Telefone**: Em `home.html`, `orcamento.html`
- **Email**: Em `home.html`, `orcamento.html`
- **WhatsApp**: Em `home.html`, `orcamento.html`, `service.html`

## ✅ Funcionalidades Implementadas

- ✅ Site Python full-stack (FastAPI + Jinja2)
- ✅ Design profissional com animações CSS
- ✅ 6 categorias de serviço (incluindo Alvenaria e Drywall)
- ✅ Sistema de álbuns e fotos
- ✅ Área administrativa protegida
- ✅ Galeria com filtros por categoria
- ✅ Lightbox para visualização de fotos
- ✅ Página de orçamento com WhatsApp
- ✅ SEO otimizado
- ✅ 100% responsivo

---

**Desenvolvido para Oriani Multissoluções** 🔧
*Transformando casas e empresas com qualidade e profissionalismo*
