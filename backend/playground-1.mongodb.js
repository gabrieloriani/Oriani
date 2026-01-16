/* global use, db */
// MongoDB Playground para Oriani Multissoluções

// 1. SELECIONE O BANCO DE DADOS
// IMPORTANTE: Verifique no seu arquivo .env qual nome você colocou em DB_NAME.
// Se não souber, tente 'oriani_db' ou 'test'.
use('oriani_db'); 

// 2. LIMPEZA (Opcional - remove dados antigos para não duplicar nos testes)
db.getCollection('albums').drop();
db.getCollection('photos').drop();

console.log('--- Iniciando inserção de dados de teste ---');

// IDs fixos para garantir que as fotos fiquem vinculadas aos álbuns certos
const idEletrica = 'album-eletrica-demo';
const idPintura = 'album-pintura-demo';

// 3. CRIAR ÁLBUNS
// Baseado no modelo Album do seu server.py
db.getCollection('albums').insertMany([
  { 
    'id': idEletrica,
    'name': 'Instalação Residencial Completa', 
    'description': 'Troca de fiação, quadro de força e iluminação LED.', 
    'category': 'Elétrica', 
    'created_at': new Date() 
  },
  { 
    'id': idPintura, 
    'name': 'Renovação de Fachada', 
    'description': 'Pintura externa com tinta emborrachada.', 
    'category': 'Pintura', 
    'created_at': new Date() 
  },
  { 
    'id': 'album-moveis-demo', 
    'name': 'Montagem de Cozinha Planejada', 
    'description': 'Montagem completa de armários e bancadas.', 
    'category': 'Montagem de Móveis', 
    'created_at': new Date() 
  }
]);

// 4. CRIAR FOTOS
// Baseado no modelo Photo do seu server.py
// Usamos uma string curta em image_data apenas para teste (no real seria uma imagem grande)
db.getCollection('photos').insertMany([
  {
    'id': 'foto-01',
    'album_id': idEletrica, // Vincula a foto ao álbum de Elétrica
    'title': 'Quadro de Disjuntores',
    'description': 'Organização e identificação dos circuitos.',
    'image_data': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 
    'created_at': new Date()
  },
  {
    'id': 'foto-02',
    'album_id': idEletrica,
    'title': 'Iluminação de Sanca',
    'description': 'Fitas de LED instaladas no gesso.',
    'image_data': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mnk5+dQAwAEHgHB44w5sgAAAABJRU5ErkJggg==',
    'created_at': new Date()
  },
  {
    'id': 'foto-03',
    'album_id': idPintura, // Vincula a foto ao álbum de Pintura
    'title': 'Antes e Depois',
    'description': 'Detalhe do acabamento.',
    'image_data': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'created_at': new Date()
  }
]);

// 5. VERIFICAÇÃO FINAL
// Conta quantos álbuns e fotos foram criados
const totalAlbums = db.getCollection('albums').countDocuments();
const totalPhotos = db.getCollection('photos').countDocuments();

console.log(`Sucesso! Foram criados ${totalAlbums} álbuns e ${totalPhotos} fotos.`);

// Mostra um exemplo de álbum com suas fotos
db.getCollection('albums').aggregate([
  {
    $lookup: {
      from: 'photos',
      localField: 'id',
      foreignField: 'album_id',
      as: 'fotos_do_album'
    }
  }
]);