import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { performersApi } from '@/api';
import type { Performer } from '@/types';

export function PerformersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPerformer, setViewingPerformer] = useState<Performer | null>(null);
  const [editingPerformer, setEditingPerformer] = useState<Performer | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', bio: '' });

  const { data: performers, isLoading } = useQuery({
    queryKey: ['performers'],
    queryFn: performersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: performersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performers'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description?: string; bio?: string } }) =>
      performersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performers'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: performersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performers'] });
    },
  });

  const openViewModal = (performer: Performer) => {
    setViewingPerformer(performer);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingPerformer(null);
  };

  const openCreateModal = () => {
    setEditingPerformer(null);
    setFormData({ name: '', description: '', bio: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (performer: Performer) => {
    setEditingPerformer(performer);
    setFormData({
      name: performer.name,
      description: performer.description || '',
      bio: performer.bio || '',
    });
    setIsModalOpen(true);
  };

  const openEditFromView = () => {
    if (viewingPerformer) {
      closeViewModal();
      openEditModal(viewingPerformer);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPerformer(null);
    setFormData({ name: '', description: '', bio: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerformer) {
      updateMutation.mutate({ id: editingPerformer.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (performer: Performer) => {
    if (window.confirm(`Are you sure you want to delete "${performer.name}"?`)) {
      deleteMutation.mutate(performer.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Performers</h1>
          <p className="text-muted-foreground mt-1">Manage your performers and musicians</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Performer
        </button>
      </div>

      {/* Performers List */}
      {performers && performers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {performers.map((performer) => (
            <div
              key={performer.id}
              className="card cursor-pointer hover:border-primary/50"
              onClick={() => openViewModal(performer)}
            >
              <div className="card-content pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple to-violet rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {performer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{performer.name}</h3>
                    {performer.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {performer.description}
                      </p>
                    )}
                    {performer.bio && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">
                        {performer.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-footer gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(performer);
                  }}
                  className="btn-outline flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(performer);
                  }}
                  className="btn-ghost text-danger hover:bg-danger/10"
                  disabled={deleteMutation.isPending}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="card-content text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No performers yet</h3>
            <p className="text-muted-foreground mb-4">Add your first performer to get started</p>
            <button onClick={openCreateModal} className="btn-primary">
              Add Performer
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingPerformer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeViewModal}>
          <div className="card w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple to-violet rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                  {viewingPerformer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="card-title text-xl">{viewingPerformer.name}</h2>
                  {viewingPerformer.description && (
                    <p className="text-muted-foreground">{viewingPerformer.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="card-content">
              {viewingPerformer.bio ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bio</h3>
                  <p className="text-foreground whitespace-pre-wrap">{viewingPerformer.bio}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No bio added yet.</p>
              )}
            </div>
            <div className="card-footer gap-2 justify-end">
              <button onClick={closeViewModal} className="btn-outline">
                Close
              </button>
              <button onClick={openEditFromView} className="btn-primary">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-md">
            <div className="card-header">
              <h2 className="card-title">
                {editingPerformer ? 'Edit Performer' : 'Add New Performer'}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-content space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="label">Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="label">Role / Instrument</label>
                  <input
                    id="description"
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    placeholder="e.g., Piano, Violin, Lead Singer..."
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bio" className="label">Bio</label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input min-h-[100px]"
                    rows={4}
                    placeholder="A brief biography or background about the performer..."
                  />
                </div>
              </div>
              <div className="card-footer gap-2 justify-end">
                <button type="button" onClick={closeModal} className="btn-outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingPerformer
                    ? 'Update'
                    : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformersPage;
