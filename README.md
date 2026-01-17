# 🔧 Oriani Multissoluções - Site Profissional

Site profissional para serviços de Marido de Aluguel com sistema completo de gerenciamento de portfólio.

## 🚀 Funcionalidades

### Website Público
- **Homepage Profissional** com design moderno e atrativo
- **Seções Otimizadas para SEO:**
  - Hero section com call-to-action
  - Serviços organizados por categoria (Elétrica, Hidráulica, Montagem de Móveis, Instalações, Pintura)
  - Galeria de trabalhos realizados
  - Seção sobre a empresa
  - Formulário de contato
  - Footer completo

- **Galeria de Fotos:**
  - Visualização por categoria
  - Lightbox para visualizar fotos em tela cheia
  - Navegação entre fotos
  - Design responsivo

### Painel Administrativo
- **Autenticação Segura:** Login com email e senha (JWT)
- **Gerenciamento de Álbuns:**
  - Criar, editar e excluir álbuns
  - Organizar por categorias
  - Adicionar descrições

- **Gerenciamento de Fotos:**
  - Upload de imagens
  - Adicionar títulos e descrições
  - Organizar por álbum
  - Exclusão de fotos
  - Armazenamento em base64 no MongoDB

## 🎨 Design
- **Cores da Marca:**
  - Laranja (#FF8C42) - Cor primária
  - Azul (#1E3A5F) - Cor secundária
- **Logo:** Integrada no site
- **UI Framework:** Tailwind CSS + shadcn/ui
- **Responsivo:** Design otimizado para mobile, tablet e desktop

## 🔍 Otimização SEO

### Meta Tags Completas
- Títulos e descrições otimizados
- Open Graph para redes sociais
- Twitter Cards
- Keywords relevantes

### Structured Data (Schema.org)
- LocalBusiness markup
- Informações de contato
- Avaliações
- Horário de funcionamento

### Arquivos SEO
- ✅ `robots.txt` - Configurado para permitir indexação
- ✅ `sitemap.xml` - Mapa do site completo
- ✅ Meta tags otimizadas
- ✅ Alt texts em todas as imagens

## 🛠 Stack Tecnológica

### Backend
- **Framework:** FastAPI (Python)
- **Banco de Dados:** MongoDB
- **Autenticação:** JWT com bcrypt
- **Upload de Imagens:** Base64 encoding

### Frontend
- **Framework:** React 19
- **Roteamento:** React Router DOM
- **UI:** Tailwind CSS + shadcn/ui components
- **Ícones:** Lucide React
- **HTTP Client:** Axios

## 📋 Como Usar

### 1. Acessar o Site
- Acesse o site público em: `https://python-image-flow.preview.emergentagent.com`

### 2. Login Admin (Primeira Vez)
- Acesse: `https://python-image-flow.preview.emergentagent.com/login`
- Clique em "Primeira vez? Criar conta admin"
- **Email criado:** `admin@oriani.com.br`
- **Senha criada:** `admin123`

### 3. Gerenciar Conteúdo

#### Criar Álbuns:
1. No painel admin, clique em "Novo Álbum"
2. Preencha nome, descrição e categoria
3. Salve

#### Upload de Fotos:
1. Clique em "Upload de Foto"
2. Selecione o álbum
3. Adicione título e descrição
4. Escolha a imagem
5. Clique em "Upload"

#### Organizar Portfólio:
- Crie álbuns para cada tipo de serviço
- Adicione fotos de qualidade dos trabalhos realizados
- Use títulos descritivos para SEO

## 🗂 Estrutura do Projeto

```
/app/
├── backend/
│   ├── server.py          # API FastAPI completa
│   ├── requirements.txt   # Dependências Python
│   └── .env              # Variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Componente principal
│   │   ├── pages/
│   │   │   ├── Home.js    # Homepage
│   │   │   ├── Gallery.js # Galeria
│   │   │   ├── Login.js   # Login
│   │   │   └── Admin.js   # Painel admin
│   │   └── App.css
│   │
│   └── public/
│       ├── assets/
│       │   └── logo.png   # Logo Oriani
│       ├── robots.txt     # SEO
│       ├── sitemap.xml    # SEO
│       └── index.html     # Meta tags SEO
```

## 📊 APIs Disponíveis

### Públicas
- `GET /api/` - Status da API
- `GET /api/categories` - Lista de categorias
- `GET /api/albums` - Lista todos os álbuns
- `GET /api/photos` - Lista todas as fotos
- `GET /api/photos?album_id={id}` - Fotos de um álbum específico

### Autenticadas (requer JWT)
- `POST /api/auth/register` - Criar admin
- `POST /api/auth/login` - Login
- `POST /api/albums` - Criar álbum
- `PUT /api/albums/{id}` - Editar álbum
- `DELETE /api/albums/{id}` - Excluir álbum
- `POST /api/photos/upload` - Upload de foto
- `PUT /api/photos/{id}` - Editar foto
- `DELETE /api/photos/{id}` - Excluir foto

## 🔐 Segurança
- Senhas hash com bcrypt
- Autenticação JWT
- CORS configurado
- Validação de dados com Pydantic

## 📱 Responsividade
- Design mobile-first
- Breakpoints otimizados
- Imagens responsivas
- Menu adaptável

## 🎯 Próximos Passos Recomendados

### Para Produção no Netlify:
1. **Build do Frontend:**
   ```bash
   cd frontend
   yarn build
   ```

2. **Deploy no Netlify:**
   - Conecte o repositório GitHub
   - Build command: `cd frontend && yarn build`
   - Publish directory: `frontend/build`
   - Environment variables: `REACT_APP_BACKEND_URL`

3. **Backend:**
   - Deploy em serviço como Railway, Render ou Heroku
   - Configure MongoDB Atlas (cloud)
   - Atualize REACT_APP_BACKEND_URL com URL do backend em produção

### Melhorias Futuras:
- [ ] Integração com Google Analytics
- [ ] Formulário de contato funcional com envio de email
- [ ] Integração com WhatsApp Business
- [ ] Sistema de agendamento online
- [ ] Blog para conteúdo SEO
- [ ] Otimização de imagens (WebP, lazy loading avançado)
- [ ] PWA (Progressive Web App)

## 📞 Informações de Contato (Atualize no código)
- **Telefone:** (11) 99999-9999 → Atualize em `Home.js`
- **Email:** contato@oriani.com.br → Atualize em `Home.js`
- **Endereço:** São Paulo - SP → Atualize em `Home.js`

## 🎉 Recursos Implementados
- ✅ Design profissional e moderno
- ✅ Sistema completo de gerenciamento
- ✅ Autenticação segura
- ✅ Upload de imagens
- ✅ Galeria com lightbox
- ✅ SEO otimizado
- ✅ Responsivo
- ✅ Structured data
- ✅ Sitemap e robots.txt
- ✅ Logo integrada
- ✅ Cores da marca

## 📈 Performance
- Lazy loading de imagens
- CSS otimizado com Tailwind
- Código minificado em produção
- API eficiente com MongoDB

---

**Desenvolvido para Oriani Multissoluções** 🔧
*Transformando casas e empresas com qualidade e profissionalismo*
