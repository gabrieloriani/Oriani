import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { ArrowRight, Check } from 'lucide-react';

const serviceContent = {
  'Elétrica': {
    title: 'Serviços de Elétrica em São Paulo',
    description: 'Eletricista profissional para instalações, manutenções e reparos elétricos residenciais e comerciais',
    longDescription: 'A Oriani Multissoluções oferece serviços elétricos completos com profissionais qualificados e experientes. Realizamos desde pequenos reparos até instalações elétricas completas, sempre com segurança e qualidade garantida.',
    services: [
      'Instalação de tomadas e interruptores',
      'Troca de disjuntores e quadros elétricos',
      'Instalação de lustres e luminárias',
      'Instalação de chuveiros elétricos',
      'Reparo de curto-circuito',
      'Adequação de carga elétrica',
      'Instalação de ventiladores de teto',
      'Manutenção elétrica preventiva'
    ],
    benefits: [
      'Eletricistas certificados',
      'Atendimento de emergência',
      'Garantia dos serviços',
      'Materiais de qualidade'
    ],
    keywords: 'eletricista, instalação elétrica, reparo elétrico, tomadas, disjuntores, quadro elétrico'
  },
  'Hidráulica': {
    title: 'Serviços de Hidráulica e Encanamento',
    description: 'Encanador profissional para reparos, instalações e manutenção hidráulica residencial e comercial',
    longDescription: 'Soluções completas em hidráulica com encanadores especializados. Atendemos vazamentos, entupimentos, instalações e reformas hidráulicas com agilidade e eficiência.',
    services: [
      'Reparo de vazamentos',
      'Desentupimento de pias e ralos',
      'Instalação de torneiras e registros',
      'Troca de sifões e válvulas',
      'Instalação de aquecedores',
      'Reparo em caixas d\'água',
      'Instalação de filtros',
      'Manutenção de tubulações'
    ],
    benefits: [
      'Atendimento rápido',
      'Equipamentos modernos',
      'Diagnóstico preciso',
      'Preços competitivos'
    ],
    keywords: 'encanador, hidráulica, vazamento, desentupimento, torneira, registro'
  },
  'Pintura': {
    title: 'Serviços de Pintura Residencial e Comercial',
    description: 'Pintor profissional para pintura interna, externa, residencial e comercial em São Paulo',
    longDescription: 'Transforme seus ambientes com nossos serviços de pintura profissional. Trabalhamos com tintas de qualidade e técnicas modernas para garantir acabamento perfeito e durabilidade.',
    services: [
      'Pintura interna de residências',
      'Pintura externa de fachadas',
      'Pintura de apartamentos',
      'Aplicação de textura',
      'Pintura de portões e grades',
      'Grafiato e texturas especiais',
      'Preparação de paredes',
      'Pintura comercial'
    ],
    benefits: [
      'Pintores experientes',
      'Tintas de primeira linha',
      'Acabamento impecável',
      'Ambiente protegido'
    ],
    keywords: 'pintor, pintura residencial, pintura comercial, textura, grafiato'
  },
  'Montagem de Móveis': {
    title: 'Montagem de Móveis Profissional',
    description: 'Montador de móveis especializado para montagem e desmontagem de todos os tipos de móveis',
    longDescription: 'Montagem profissional de móveis planejados e modulados. Garantimos montagem correta, rápida e segura de seus móveis, preservando a integridade e prolongando a vida útil.',
    services: [
      'Montagem de guarda-roupas',
      'Montagem de cozinhas planejadas',
      'Montagem de estantes e racks',
      'Montagem de escrivaninhas',
      'Montagem de berços e cômodas',
      'Montagem de armários',
      'Desmontagem e remontagem',
      'Ajustes e correções'
    ],
    benefits: [
      'Montadores experientes',
      'Ferramentas adequadas',
      'Cuidado com acabamentos',
      'Rapidez na execução'
    ],
    keywords: 'montador de móveis, montagem de guarda-roupa, montagem de cozinha, móveis planejados'
  },
  'Instalações': {
    title: 'Serviços de Instalações Diversas',
    description: 'Instalação profissional de suportes, cortinas, prateleiras e muito mais',
    longDescription: 'Serviços especializados de instalação para deixar sua casa ou escritório completo. Instalamos desde suportes de TV até sistemas de organização com segurança e precisão.',
    services: [
      'Instalação de suportes de TV',
      'Instalação de cortinas e persianas',
      'Instalação de prateleiras',
      'Instalação de quadros e espelhos',
      'Instalação de ar-condicionado split',
      'Instalação de ventiladores',
      'Instalação de trilhos e varões',
      'Fixação de objetos em geral'
    ],
    benefits: [
      'Instalação segura',
      'Conhecimento técnico',
      'Ferramentas profissionais',
      'Garantia de fixação'
    ],
    keywords: 'instalação, suporte de tv, cortinas, prateleiras, ar condicionado'
  }
};

const ServicePage = () => {
  const { category } = useParams();
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const content = serviceContent[category] || {};

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const [albumsRes, photosRes] = await Promise.all([
        axios.get(`${API}/albums`),
        axios.get(`${API}/photos`)
      ]);
      setAlbums(albumsRes.data);
      
      const categoryPhotos = photosRes.data.filter(photo => {
        const album = albumsRes.data.find(a => a.id === photo.album_id);
        return album && album.category === category;
      });
      setPhotos(categoryPhotos);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!content.title) {
    return <div>Serviço não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/logo.png" alt="Oriani Multissoluções" className="h-12" />
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition">Início</Link>
            <Link to="/orcamento" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
              Solicitar Orçamento
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{content.description}</p>
            <Link 
              to="/orcamento" 
              className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition shadow-lg"
            >
              <span>Solicitar Orçamento Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Service */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre Nossos Serviços de {category}</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{content.longDescription}</p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">O Que Fazemos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.services.map((service, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm">
                  <Check className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Por Que Escolher a Oriani?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="font-semibold text-gray-900">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {photos.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trabalhos Realizados</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square overflow-hidden rounded-lg shadow-md">
                  <img 
                    src={photo.image_data} 
                    alt={photo.title}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to={`/galeria/${category}`} className="text-orange-500 hover:text-orange-600 font-semibold">
                Ver Galeria Completa →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="text-xl text-orange-100 mb-8">Solicite seu orçamento sem compromisso</p>
          <Link 
            to="/orcamento" 
            className="inline-flex items-center space-x-2 bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            <span>Solicitar Orçamento Agora</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;