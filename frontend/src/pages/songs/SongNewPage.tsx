import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { songsApi, performersApi } from '@/api';
import type { SongSearchResult } from '@/api/songs';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { QuestionBuilder } from '@/components/ui/QuestionBuilder';
import type { SongFormData, QuestionAndChoice } from '@/types';

// Helper to format datetime for input (UTC -> local)
function formatDateTimeLocal(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

// Helper to convert local datetime-local value to ISO string for server (local -> UTC)
function toISOString(localDateTimeString: string): string {
  if (!localDateTimeString) return '';
  const date = new Date(localDateTimeString);
  return date.toISOString();
}

export function SongNewPage() {
  const { id: eventId, songId } = useParams<{ id: string; songId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!songId;

  const [formData, setFormData] = useState<SongFormData>({
    name: '',
    composer_name: '',
    description: '',
    start_at: '',
    length_in_minute: 5,
    enable_textbox: true,
    questions_and_choices: [],
    performer_ids: [],
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showNewPerformerModal, setShowNewPerformerModal] = useState(false);
  const [newPerformerName, setNewPerformerName] = useState('');
  const [newPerformerDescription, setNewPerformerDescription] = useState('');
  const [newPerformerBio, setNewPerformerBio] = useState('');
  const [newPerformerImages, setNewPerformerImages] = useState<string[]>([]);
  const [performerSearch, setPerformerSearch] = useState('');
  const [viewingPerformer, setViewingPerformer] = useState<{ id: number; name: string; description?: string | null; bio?: string | null; images?: string[] } | null>(null);

  // Song search autocomplete
  const [showSongSuggestions, setShowSongSuggestions] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const songNameInputRef = useRef<HTMLInputElement>(null);

  // Composer search autocomplete
  const [showComposerSuggestions, setShowComposerSuggestions] = useState(false);
  const [composerSearchQuery, setComposerSearchQuery] = useState('');

  // Fetch existing song data when in edit mode
  const { data: existingSong, isLoading: isLoadingSong } = useQuery({
    queryKey: ['song', eventId, songId],
    queryFn: () => songsApi.getById(Number(eventId), Number(songId)),
    enabled: isEditMode,
  });

  // Search for existing songs (for autocomplete)
  const { data: songSuggestions } = useQuery({
    queryKey: ['songs', 'search', songSearchQuery],
    queryFn: () => songsApi.search(songSearchQuery),
    enabled: !isEditMode && showSongSuggestions,
    staleTime: 30000,
  });

  // Search for existing composers (for autocomplete)
  const { data: composerSuggestions } = useQuery({
    queryKey: ['songs', 'composers', composerSearchQuery],
    queryFn: () => songsApi.searchComposers(composerSearchQuery),
    enabled: showComposerSuggestions,
    staleTime: 30000,
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingSong) {
      setFormData({
        name: existingSong.name || '',
        composer_name: existingSong.composer_name || '',
        description: existingSong.description || '',
        start_at: formatDateTimeLocal(existingSong.start_at),
        length_in_minute: existingSong.length_in_minute || 5,
        enable_textbox: existingSong.enable_textbox ?? true,
        questions_and_choices: existingSong.questions_and_choices || [],
        performer_ids: existingSong.performers?.map((p) => p.id) || [],
      });
      setImageUrls(existingSong.images || []);
    }
  }, [existingSong]);

  const { data: performers, refetch: refetchPerformers } = useQuery({
    queryKey: ['performers'],
    queryFn: () => performersApi.getAll(),
  });

  const createPerformerMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; bio?: string; image_urls?: string[] }) =>
      performersApi.create(data),
    onSuccess: (newPerformer) => {
      refetchPerformers();
      setFormData({
        ...formData,
        performer_ids: [...formData.performer_ids, newPerformer.id],
      });
      setShowNewPerformerModal(false);
      setNewPerformerName('');
      setNewPerformerDescription('');
      setNewPerformerBio('');
      setNewPerformerImages([]);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: SongFormData) => songsApi.create(Number(eventId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      navigate(`/events/${eventId}/dashboard`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SongFormData) => songsApi.update(Number(eventId), Number(songId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['song', eventId, songId] });
      navigate(`/events/${eventId}/dashboard`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    });
  };

  const handlePerformerChange = (performerId: number) => {
    const newIds = formData.performer_ids.includes(performerId)
      ? formData.performer_ids.filter((id) => id !== performerId)
      : [...formData.performer_ids, performerId];
    setFormData({ ...formData, performer_ids: newIds });
  };

  // Handle selecting a song from suggestions
  const handleSongSelect = (song: SongSearchResult) => {
    setFormData({
      ...formData,
      name: song.name,
      composer_name: song.composer_name || '',
      description: song.description || '',
      length_in_minute: song.length_in_minute || 5,
      enable_textbox: song.enable_textbox ?? true,
      questions_and_choices: song.questions_and_choices || [],
      performer_ids: song.performers?.map((p) => p.id) || [],
    });
    setImageUrls(song.images || []);
    setShowSongSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert local datetime to ISO string for server
    const dataToSend = {
      ...formData,
      start_at: toISOString(formData.start_at),
      image_urls: imageUrls,
    };
    if (isEditMode) {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const mutation = isEditMode ? updateMutation : createMutation;

  if (isEditMode && isLoadingSong) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {isEditMode ? 'Edit Song' : 'Add New Song'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mutation.error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
            Failed to {isEditMode ? 'update' : 'create'} song. Please try again.
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-lg">Song Details</h2>
          </div>
          <div className="card-content space-y-4">
            <div className="space-y-2 relative">
              <label htmlFor="name" className="label">Song Title *</label>
              <input
                ref={songNameInputRef}
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  handleChange(e);
                  setSongSearchQuery(e.target.value);
                }}
                onFocus={() => !isEditMode && setShowSongSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSongSuggestions(false), 200)}
                className="input"
                required
                autoComplete="off"
              />
              {/* Song suggestions dropdown */}
              {!isEditMode && showSongSuggestions && songSuggestions && songSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                    Past songs
                  </div>
                  {songSuggestions.map((song) => (
                    <button
                      key={song.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center gap-3"
                      onMouseDown={() => handleSongSelect(song)}
                    >
                      {song.images && song.images[0] ? (
                        <img
                          src={song.images[0]}
                          alt={song.name}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{song.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {song.composer_name}
                          {song.event_name && <span className="text-xs"> • {song.event_name}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="composer_name" className="label">Composer *</label>
              <input
                id="composer_name"
                name="composer_name"
                type="text"
                value={formData.composer_name}
                onChange={(e) => {
                  handleChange(e);
                  setComposerSearchQuery(e.target.value);
                }}
                onFocus={() => setShowComposerSuggestions(true)}
                onBlur={() => setTimeout(() => setShowComposerSuggestions(false), 200)}
                className="input"
                required
                autoComplete="off"
              />
              {/* Composer suggestions dropdown */}
              {showComposerSuggestions && composerSuggestions && composerSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                    Past composers
                  </div>
                  {composerSuggestions.map((composer) => (
                    <button
                      key={composer}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-foreground"
                      onMouseDown={() => {
                        setFormData({ ...formData, composer_name: composer });
                        setShowComposerSuggestions(false);
                      }}
                    >
                      {composer}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start_at" className="label">Start Time *</label>
                <input
                  id="start_at"
                  name="start_at"
                  type="datetime-local"
                  value={formData.start_at}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="length_in_minute" className="label">Duration (minutes) *</label>
                <input
                  id="length_in_minute"
                  name="length_in_minute"
                  type="number"
                  min="1"
                  value={formData.length_in_minute}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-lg">Images</h2>
          </div>
          <div className="card-content">
            <ImageUploader
              images={imageUrls}
              onChange={setImageUrls}
              maxImages={5}
            />
          </div>
        </div>

        <div className="card">
          <div className="p-6 pb-0 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Performers</h2>
            <button
              type="button"
              onClick={() => setShowNewPerformerModal(true)}
              className="btn-outline text-sm"
            >
              + Add New
            </button>
          </div>
          <div className="card-content">
            {performers && performers.length > 0 ? (
              <div className="space-y-3">
                {/* Search box */}
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search performers..."
                    value={performerSearch}
                    onChange={(e) => setPerformerSearch(e.target.value)}
                    className="input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>

                {/* Selected performers */}
                {formData.performer_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {performers
                      .filter((p) => formData.performer_ids.includes(p.id))
                      .map((performer) => (
                        <span
                          key={performer.id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          <button
                            type="button"
                            onClick={() => setViewingPerformer(performer)}
                            className="hover:underline"
                          >
                            {performer.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePerformerChange(performer.id)}
                            className="hover:bg-primary/20 rounded-full p-0.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                  </div>
                )}

                {/* Performer list */}
                <div className="max-h-48 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                  {performers
                    .filter((p) =>
                      p.name.toLowerCase().includes(performerSearch.toLowerCase())
                    )
                    .map((performer) => (
                      <div
                        key={performer.id}
                        className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors ${
                          formData.performer_ids.includes(performer.id) ? 'bg-primary/5' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.performer_ids.includes(performer.id)}
                          onChange={() => handlePerformerChange(performer.id)}
                          className="rounded border-border cursor-pointer"
                        />
                        {performer.images && performer.images[0] ? (
                          <img
                            src={performer.images[0]}
                            alt={performer.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-violet flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {performer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setViewingPerformer(performer)}
                          className="text-sm hover:underline text-left flex-1"
                        >
                          {performer.name}
                          {performer.description && (
                            <span className="text-xs text-muted-foreground ml-1">- {performer.description}</span>
                          )}
                        </button>
                      </div>
                    ))}
                  {performers.filter((p) =>
                    p.name.toLowerCase().includes(performerSearch.toLowerCase())
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No performers found for "{performerSearch}"
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No performers yet. Click "Add New" to create one.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-lg">Review Settings</h2>
          </div>
          <div className="card-content space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="enable_textbox"
                checked={formData.enable_textbox}
                onChange={handleChange}
                className="rounded border-border"
              />
              <span className="text-sm">Enable comment text box for reviews</span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title text-lg">Custom Questions</h2>
            <p className="card-description">Add custom questions for this song's feedback</p>
          </div>
          <div className="card-content">
            <QuestionBuilder
              questions={formData.questions_and_choices}
              onChange={(questions: QuestionAndChoice[]) =>
                setFormData({ ...formData, questions_and_choices: questions })
              }
              maxQuestions={5}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? (isEditMode ? 'Updating...' : 'Adding...')
              : (isEditMode ? 'Update Song' : 'Add Song')}
          </button>
        </div>
      </form>

      {/* New Performer Modal */}
      {showNewPerformerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="card max-w-lg w-full mx-4 my-8">
            <div className="card-header">
              <h2 className="card-title">Add New Performer</h2>
            </div>
            <div className="card-content space-y-4">
              <div className="space-y-2">
                <label htmlFor="new_performer_name" className="label">Performer Name *</label>
                <input
                  id="new_performer_name"
                  type="text"
                  value={newPerformerName}
                  onChange={(e) => setNewPerformerName(e.target.value)}
                  className="input"
                  placeholder="Enter performer name"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="new_performer_description" className="label">Role / Instrument</label>
                <input
                  id="new_performer_description"
                  type="text"
                  value={newPerformerDescription}
                  onChange={(e) => setNewPerformerDescription(e.target.value)}
                  className="input"
                  placeholder="e.g., Piano, Violin, Soprano"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="new_performer_bio" className="label">Bio</label>
                <textarea
                  id="new_performer_bio"
                  value={newPerformerBio}
                  onChange={(e) => setNewPerformerBio(e.target.value)}
                  className="input min-h-[80px]"
                  rows={3}
                  placeholder="Brief biography..."
                />
              </div>
              <div className="space-y-2">
                <label className="label">Profile Image</label>
                <ImageUploader
                  images={newPerformerImages}
                  onChange={setNewPerformerImages}
                  maxImages={3}
                />
              </div>
            </div>
            <div className="card-footer justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowNewPerformerModal(false);
                  setNewPerformerName('');
                  setNewPerformerDescription('');
                  setNewPerformerBio('');
                  setNewPerformerImages([]);
                }}
                className="btn-outline"
                disabled={createPerformerMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newPerformerName.trim()) {
                    createPerformerMutation.mutate({
                      name: newPerformerName.trim(),
                      description: newPerformerDescription.trim() || undefined,
                      bio: newPerformerBio.trim() || undefined,
                      image_urls: newPerformerImages.length > 0 ? newPerformerImages : undefined,
                    });
                  }
                }}
                className="btn-primary"
                disabled={!newPerformerName.trim() || createPerformerMutation.isPending}
              >
                {createPerformerMutation.isPending ? 'Adding...' : 'Add Performer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Performer Modal */}
      {viewingPerformer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewingPerformer(null)}>
          <div className="card w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div className="flex items-center gap-4">
                {viewingPerformer.images && viewingPerformer.images[0] ? (
                  <img
                    src={viewingPerformer.images[0]}
                    alt={viewingPerformer.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-purple to-violet rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {viewingPerformer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="card-title text-xl">{viewingPerformer.name}</h2>
                  {viewingPerformer.description && (
                    <p className="text-muted-foreground">{viewingPerformer.description}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="card-content space-y-4">
              {/* Images gallery */}
              {viewingPerformer.images && viewingPerformer.images.length > 1 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Photos</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {viewingPerformer.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${viewingPerformer.name} ${idx + 1}`}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}
              {viewingPerformer.bio ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bio</h3>
                  <p className="text-foreground whitespace-pre-wrap">{viewingPerformer.bio}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No bio added yet.</p>
              )}
            </div>
            <div className="card-footer justify-end">
              <button onClick={() => setViewingPerformer(null)} className="btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongNewPage;
