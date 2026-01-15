import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '@/App';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Wrench, Droplet, Package, Zap, PaintBucket } from 'lucide-react';

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [albumsRes, photosRes] = await Promise.all([
        axios.get(`${API}/albums`),
        axios.get(`${API}/photos`)
      ]);
      setAlbums(albumsRes.data);
      setPhotos(photosRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const services = [
    { name: 'Elétrica', icon: Zap, description: 'Instalações e reparos elétricos' },
    { name: 'Hidráulica', icon: Droplet, description: 'Encanamentos e consertos' },
    { name: 'Pintura', icon: PaintBucket, description: 'Pintura residencial e comercial' },
    { name: 'Montagem de Móveis', icon: Package, description: 'Montagem profissional' },
    { name: 'Instalações', icon: Wrench, description: 'Instalações diversas' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/logo.png" alt="Oriani Multissoluções" className="h-12" />
          </Link>
          <div className="hidden md:flex space-x-6">
            <a href="#servicos" className="text-gray-700 hover:text-orange-500 transition">Serviços</a>
            <a href="#galeria" className="text-gray-700 hover:text-orange-500 transition">Galeria</a>
            <a href="#sobre" className="text-gray-700 hover:text-orange-500 transition">Sobre</a>
            <a href="#contato" className="text-gray-700 hover:text-orange-500 transition">Contato</a>
          </div>
          <a href="#contato" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
            Solicitar Orçamento
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-blue-50 py-20" data-testid="hero-section">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Soluções Completas para sua Casa ou Empresa
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Serviços profissionais de manutenção, instalação e reformas. Qualidade e confiança em cada trabalho.
            </p>
            <a href="/orcamento" className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition shadow-lg" data-testid="cta-button">
              Solicite seu Orçamento Grátis
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-white" data-testid="services-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Nossos Serviços</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Oferecemos uma ampla gama de serviços especializados para atender todas as suas necessidades
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link 
                  key={index}
                  to={`/servicos/${service.name}`}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition group border border-gray-100"
                  data-testid={`service-card-${service.name.toLowerCase()}`}
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 transition">
                    <Icon className="w-8 h-8 text-orange-500 group-hover:text-white transition" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-orange-500 font-semibold mt-4 group-hover:text-orange-600">Saiba mais →</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="galeria" className="py-20 bg-gray-50" data-testid="gallery-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Trabalhos Realizados</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Confira alguns dos nossos projetos concluídos com excelência
          </p>
          {photos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {photos.slice(0, 8).map((photo) => (
                  <div key={photo.id} className="aspect-square overflow-hidden rounded-lg shadow-md group">
                    <img 
                      src={photo.image_data} 
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link to="/galeria" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition">
                  Ver Galeria Completa
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>Em breve, galeria de fotos dos nossos trabalhos!</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-white" data-testid="about-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Sobre a Oriani Multissoluções</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-center mb-6">
                Somos especialistas em serviços residenciais e comerciais, oferecendo soluções completas em elétrica, hidráulica, montagem de móveis, instalações e pintura.
              </p>
              <p className="text-center mb-6">
                Com anos de experiência no mercado, nossa missão é proporcionar serviços de qualidade com profissionalismo, pontualidade e preços justos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
                  <div className="text-gray-600">Clientes Satisfeitos</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">5+</div>
                  <div className="text-gray-600">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">100%</div>
                  <div className="text-gray-600">Satisfação Garantida</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white" data-testid="contact-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Entre em Contato</h2>
            <p className="text-center text-orange-100 mb-12">Solicite seu orçamento sem compromisso</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Telefone</h3>
                <p className="text-orange-100">(11) 99999-9999</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-orange-100">contato@oriani.com.br</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Atendimento</h3>
                <p className="text-orange-100">São Paulo - SP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/assets/logo.png" alt="Oriani" className="h-12 mb-4 brightness-0 invert" />
              <p className="text-gray-400">Soluções completas para sua casa ou empresa</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                {services.map(service => (
                  <li key={service.name}>
                    <Link to={`/galeria/${service.name}`} className="hover:text-orange-500 transition">{service.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#servicos" className="hover:text-orange-500 transition">Serviços</a></li>
                <li><a href="#galeria" className="hover:text-orange-500 transition">Galeria</a></li>
                <li><a href="#sobre" className="hover:text-orange-500 transition">Sobre</a></li>
                <li><a href="#contato" className="hover:text-orange-500 transition">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Oriani Multissoluções. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;