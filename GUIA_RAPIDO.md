# 🚀 Guia Rápido - Oriani Multissoluções

## Acesso Rápido

### 🌐 Site Público
**URL:** https://python-image-flow.preview.emergentagent.com

### 🔐 Painel Admin
**URL:** https://python-image-flow.preview.emergentagent.com/login
- **Email:** admin@oriani.com.br
- **Senha:** admin123

## ⚡ Primeiros Passos

### 1. Fazer Login
1. Acesse `/login`
2. Use as credenciais acima
3. Você será redirecionado para o painel admin

### 2. Criar Álbum
1. No painel, clique em **"Novo Álbum"**
2. Preencha:
   - **Nome:** Ex: "Instalação Elétrica - Residência Silva"
   - **Descrição:** Ex: "Projeto completo de instalação elétrica"
   - **Categoria:** Escolha entre: Elétrica, Hidráulica, Montagem de Móveis, Instalações, Pintura
3. Clique em **"Salvar"**

### 3. Adicionar Fotos
1. Clique em **"Upload de Foto"**
2. Selecione o álbum criado
3. Adicione:
   - **Título:** Nome descritivo da foto
   - **Descrição:** Detalhes do trabalho (opcional)
   - **Imagem:** Selecione o arquivo
4. Clique em **"Upload"**

### 4. Visualizar no Site
1. Volte à homepage (botão "Ver Site")
2. As fotos aparecerão automaticamente na seção "Trabalhos Realizados"
3. Acesse `/galeria` para ver a galeria completa
4. Filtre por categoria clicando nos botões

## 🎯 Dicas para Melhor SEO

### Títulos de Fotos
✅ **BOM:** "Instalação de lustres e tomadas - Apartamento Jardins"
❌ **RUIM:** "foto1.jpg"

### Descrições
✅ **BOM:** "Projeto completo de instalação elétrica em apartamento de 80m², incluindo quadro de distribuição, pontos de tomada e iluminação LED"
❌ **RUIM:** "trabalho feito"

### Categorias
Use as 5 categorias principais:
- **Elétrica:** Instalações, reparos, quadros elétricos
- **Hidráulica:** Encanamentos, torneiras, registros
- **Montagem de Móveis:** Guarda-roupas, cozinhas, estantes
- **Instalações:** Suportes de TV, cortinas, prateleiras
- **Pintura:** Pintura interna, externa, textura

## 📊 Álbuns já Criados (Exemplo)

Já criamos 4 álbuns de exemplo:
1. ✅ Instalações Elétricas Residenciais
2. ✅ Reparos Hidráulicos
3. ✅ Montagem de Móveis Planejados
4. ✅ Pintura Interna e Externa

**Agora é só adicionar fotos reais dos seus trabalhos!**

## 🎨 Personalização

### Atualizar Informações de Contato
Edite o arquivo: `/app/frontend/src/pages/Home.js`

Procure por:
```javascript
<p className="text-orange-100">(11) 99999-9999</p>
<p className="text-orange-100">contato@oriani.com.br</p>
<p className="text-orange-100">São Paulo - SP</p>
```

Substitua pelos seus dados reais.

### Alterar Descrição SEO
Edite: `/app/frontend/public/index.html`

Procure pela tag `<meta name="description"...` e atualize o texto.

## 🌟 Funcionalidades Principais

### Galeria
- ✅ Lightbox para visualizar fotos em tela cheia
- ✅ Navegação entre fotos (setas)
- ✅ Filtro por categoria
- ✅ Design responsivo

### Admin
- ✅ CRUD completo de álbuns
- ✅ Upload de múltiplas fotos
- ✅ Organização por categoria
- ✅ Exclusão de fotos individuais
- ✅ Edição de álbuns

### SEO
- ✅ Meta tags otimizadas
- ✅ Structured data (Schema.org)
- ✅ Sitemap XML
- ✅ Robots.txt
- ✅ Open Graph (compartilhamento em redes sociais)

## 🔧 Comandos Úteis

### Verificar Status dos Serviços
```bash
sudo supervisorctl status
```

### Reiniciar Serviços
```bash
sudo supervisorctl restart all
```

### Ver Logs do Backend
```bash
tail -f /var/log/supervisor/backend.out.log
```

### Ver Logs do Frontend
```bash
tail -f /var/log/supervisor/frontend.out.log
```

## 📱 Teste o Site

1. ✅ Homepage → Deve mostrar logo, serviços e seções
2. ✅ Galeria → Deve mostrar álbuns e fotos
3. ✅ Login → Deve permitir acesso ao admin
4. ✅ Admin → Deve permitir gerenciar álbuns e fotos
5. ✅ Responsivo → Teste em mobile, tablet e desktop

## 🎉 Pronto para Uso!

Seu site está 100% funcional e otimizado para SEO. 

**Próximo passo:** Adicione fotos reais dos seus trabalhos e compartilhe o link!

---

💡 **Dica:** Quanto mais fotos de qualidade você adicionar, melhor será o ranqueamento no Google!
