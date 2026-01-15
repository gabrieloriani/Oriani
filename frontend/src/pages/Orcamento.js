import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const Orcamento = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const services = [
    { id: 'eletrica', name: 'Elétrica', description: 'Instalações e reparos elétricos' },
    { id: 'hidraulica', name: 'Hidráulica', description: 'Encanamentos e consertos' },
    { id: 'pintura', name: 'Pintura', description: 'Pintura residencial e comercial' },
    { id: 'montagem', name: 'Montagem de Móveis', description: 'Montagem profissional' },
    { id: 'instalacoes', name: 'Instalações', description: 'Instalações diversas' }
  ];

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      alert('Por favor, selecione pelo menos um serviço');
      return;
    }

    const selectedServiceNames = services
      .filter(s => selectedServices.includes(s.id))
      .map(s => s.name)
      .join(', ');

    let message = `Olá! Meu nome é ${name}.\n\nGostaria de solicitar orçamento para os seguintes serviços:\n\n${selectedServiceNames}`;
    
    if (description) {
      message += `\n\nDetalhes: ${description}`;
    }

    const whatsappNumber = '5519971387382';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/logo.png" alt="Oriani Multissoluções" className="h-12" />
          </Link>
          <Link to="/" className="text-gray-700 hover:text-orange-500 transition">
            Voltar ao Início
          </Link>
        </nav>
      </header>

      {/* Orçamento Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Solicite seu Orçamento</h1>
            <p className="text-xl text-gray-600">Selecione os serviços que você precisa e entraremos em contato</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {/* Nome */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Digite seu nome"
                  required
                  data-testid="name-input"
                />
              </div>

              {/* Serviços */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-4">
                  Selecione os Serviços *
                </label>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                        selectedServices.includes(service.id)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      data-testid={`service-${service.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedServices.includes(service.id)
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedServices.includes(service.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
                  Descreva o que você precisa (opcional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="4"
                  placeholder="Ex: Preciso instalar 5 tomadas na sala e trocar o quadro de luz"
                  data-testid="description-input"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition flex items-center justify-center space-x-2"
                data-testid="submit-button"
              >
                <span>Enviar pelo WhatsApp</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Você será redirecionado para o WhatsApp com sua mensagem pronta
              </p>
            </form>
          </div>

          {/* Info adicional */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2">Por que escolher a Oriani?</h3>
            <ul className="space-y-2 text-blue-800">
              <li>✓ Profissionais qualificados e experientes</li>
              <li>✓ Orçamento sem compromisso</li>
              <li>✓ Atendimento rápido e pontual</li>
              <li>✓ Garantia de qualidade nos serviços</li>
              <li>✓ Preços justos e transparentes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orcamento;