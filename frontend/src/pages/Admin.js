import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API, AuthContext } from '@/App';
import { Plus, Trash2, Edit2, LogOut, Image as ImageIcon, FolderPlus } from 'lucide-react';

const Admin = () => {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const [albumForm, setAlbumForm] = useState({
    name: '',
    description: '',
    category: ''
  });

  const [photoForm, setPhotoForm] = useState({
    album_id: '',
    title: '',
    description: '',
    file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAlbumModal = (album = null) => {
    if (album) {
      setEditingAlbum(album);
      setAlbumForm({
        name: album.name,
        description: album.description,
        category: album.category
      });
    } else {
      setEditingAlbum(null);
      setAlbumForm({ name: '', description: '', category: '' });
    }
    setShowAlbumModal(true);
  };

  const saveAlbum = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingAlbum) {
        await axios.put(`${API}/albums/${editingAlbum.id}`, albumForm, config);
      } else {
        await axios.post(`${API}/albums`, albumForm, config);
      }
      setShowAlbumModal(false);
      fetchData();
    } catch (error) {
      alert('Erro ao salvar álbum');
    }
  };

  const deleteAlbum = async (albumId) => {
    if (!window.confirm('Tem certeza? Todas as fotos deste álbum serão excluídas.')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API}/albums/${albumId}`, config);
      fetchData();
    } catch (error) {
      alert('Erro ao excluir álbum');
    }
  };

  const openPhotoModal = (albumId = null) => {
    setPhotoForm({
      album_id: albumId || albums[0]?.id || '',
      title: '',
      description: '',
      file: null
    });
    setShowPhotoModal(true);
  };

  const handleFileChange = (e) => {
    setPhotoForm({ ...photoForm, file: e.target.files[0] });
  };

  const uploadPhoto = async () => {
    if (!photoForm.file) {
      alert('Selecione uma imagem');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('album_id', photoForm.album_id);
      formData.append('title', photoForm.title);
      formData.append('description', photoForm.description);
      formData.append('file', photoForm.file);

      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      await axios.post(`${API}/photos/upload`, formData, config);
      setShowPhotoModal(false);
      fetchData();
    } catch (error) {
      alert('Erro ao fazer upload da foto');
    }
  };

  const deletePhoto = async (photoId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API}/photos/${photoId}`, config);
      fetchData();
    } catch (error) {
      alert('Erro ao excluir foto');
    }
  };

  const getAlbumPhotos = (albumId) => {
    return photos.filter(p => p.album_id === albumId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/assets/logo.png" alt="Oriani" className="h-12" />
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              Ver Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              data-testid="logout-button"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => openAlbumModal()}
            className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            data-testid="create-album-button"
          >
            <FolderPlus size={20} />
            <span>Novo Álbum</span>
          </button>
          <button
            onClick={() => openPhotoModal()}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            data-testid="upload-photo-button"
          >
            <ImageIcon size={20} />
            <span>Upload de Foto</span>
          </button>
        </div>

        {/* Albums Grid */}
        <div className="space-y-8">
          {albums.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">Nenhum álbum criado ainda</p>
              <button
                onClick={() => openAlbumModal()}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Criar Primeiro Álbum
              </button>
            </div>
          ) : (
            albums.map((album) => {
              const albumPhotos = getAlbumPhotos(album.id);
              return (
                <div key={album.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{album.name}</h2>
                      <p className="text-gray-600">{album.description}</p>
                      <span className="inline-block bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full mt-2">
                        {album.category}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openPhotoModal(album.id)}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                        title="Adicionar foto"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => openAlbumModal(album)}
                        className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition"
                        title="Editar álbum"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => deleteAlbum(album.id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                        title="Excluir álbum"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Photos in Album */}
                  {albumPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {albumPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.image_data}
                            alt={photo.title}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => deletePhoto(photo.id)}
                              className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">{photo.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">Nenhuma foto neste álbum</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Album Modal */}
      {showAlbumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAlbumModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{editingAlbum ? 'Editar Álbum' : 'Novo Álbum'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nome</label>
                <input
                  type="text"
                  value={albumForm.name}
                  onChange={(e) => setAlbumForm({ ...albumForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="album-name-input"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
                <textarea
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Categoria</label>
                <select
                  value={albumForm.category}
                  onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="album-category-select"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={saveAlbum}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                data-testid="save-album-button"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowAlbumModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPhotoModal(false)}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Upload de Foto</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Álbum</label>
                <select
                  value={photoForm.album_id}
                  onChange={(e) => setPhotoForm({ ...photoForm, album_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="photo-album-select"
                >
                  <option value="">Selecione um álbum</option>
                  {albums.map((album) => (
                    <option key={album.id} value={album.id}>{album.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Título</label>
                <input
                  type="text"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="photo-title-input"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
                <input
                  type="text"
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  data-testid="photo-file-input"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={uploadPhoto}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                data-testid="upload-photo-submit"
              >
                Upload
              </button>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
