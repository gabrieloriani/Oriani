import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const { category } = useParams();
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (category) {
      const filtered = photos.filter(photo => {
        const album = albums.find(a => a.id === photo.album_id);
        return album && album.category === category;
      });
      setFilteredPhotos(filtered);
    } else {
      setFilteredPhotos(photos);
    }
  }, [category, photos, albums]);

  const fetchData = async () => {
    try {
      const [albumsRes, photosRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/albums`),
        axios.get(`${API}/photos`),
        axios.get(`${API}/categories`)
      ]);
      setAlbums(albumsRes.data);
      setPhotos(photosRes.data);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const prevPhoto = () => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
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

      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          {category ? `Galeria - ${category}` : 'Galeria Completa'}
        </h1>
        <p className="text-center text-gray-600 mb-8">Confira nossos trabalhos realizados</p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to="/galeria"
            className={`px-6 py-2 rounded-full transition ${
              !category
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
            }`}
          >
            Todas
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/galeria/${cat}`}
              className={`px-6 py-2 rounded-full transition ${
                category === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-100'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => {
              const album = albums.find(a => a.id === photo.album_id);
              return (
                <div
                  key={photo.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
                  onClick={() => openLightbox(photo)}
                  data-testid={`photo-${photo.id}`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.image_data}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{photo.title}</h3>
                    {album && (
                      <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                        {album.category}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Nenhuma foto encontrada nesta categoria.</p>
            <Link to="/galeria" className="text-orange-500 hover:text-orange-600 mt-4 inline-block">
              Ver todas as fotos
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeLightbox}>
          <button
            className="absolute top-4 right-4 text-white hover:text-orange-500 transition"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          <button
            className="absolute left-4 text-white hover:text-orange-500 transition"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            <ChevronLeft size={48} />
          </button>
          <button
            className="absolute right-4 text-white hover:text-orange-500 transition"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            <ChevronRight size={48} />
          </button>
          <div className="max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.image_data}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <div className="text-white text-center mt-4">
              <h3 className="text-xl font-bold">{selectedPhoto.title}</h3>
              {selectedPhoto.description && <p className="text-gray-300 mt-2">{selectedPhoto.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;