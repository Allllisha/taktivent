import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi, songsApi, collaboratorsApi } from '@/api';
import { format } from 'date-fns';
import type { Collaborator } from '@/api/collaborators';

export function EventDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showQrModal, setShowQrModal] = useState(false);
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<number | null>(null);
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState<'editor' | 'viewer'>('editor');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id, 'dashboard'],
    queryFn: () => eventsApi.getDashboard(Number(id)),
    refetchInterval: 10000, // Poll every 10 seconds for real-time updates
  });

  const { data: qrCode } = useQuery({
    queryKey: ['event', id, 'qr_code'],
    queryFn: () => eventsApi.getQrCode(Number(id)),
    enabled: showQrModal,
  });

  const { data: collaborators } = useQuery({
    queryKey: ['event', id, 'collaborators'],
    queryFn: () => collaboratorsApi.getAll(Number(id)),
    enabled: showCollaboratorsModal,
  });

  const addCollaboratorMutation = useMutation({
    mutationFn: ({ email, role }: { email: string; role: 'editor' | 'viewer' }) =>
      collaboratorsApi.add(Number(id), email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id, 'collaborators'] });
      setNewCollaboratorEmail('');
      setNewCollaboratorRole('editor');
    },
  });

  const removeCollaboratorMutation = useMutation({
    mutationFn: (collaboratorId: number) => collaboratorsApi.remove(Number(id), collaboratorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id, 'collaborators'] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: () => eventsApi.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/dashboard');
    },
  });

  const deleteSongMutation = useMutation({
    mutationFn: (songId: number) => songsApi.delete(Number(id), songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id, 'dashboard'] });
      setSongToDelete(null);
    },
  });

  const duplicateEventMutation = useMutation({
    mutationFn: () => eventsApi.duplicate(Number(id)),
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate(`/events/${newEvent.id}/dashboard`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
        Failed to load event dashboard.
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
          <p className="text-muted-foreground">
            {format(new Date(event.start_at), 'PPP')}{event.venue?.name ? ` - ${event.venue.name}` : ''}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Link to={`/events/${event.id}/analytics`} className="btn-primary">
            View Analytics
          </Link>
          <Link to={`/events/${event.id}/edit`} className="btn-outline">
            Edit
          </Link>
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Show QR Code"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                  <button
                    onClick={() => {
                      setShowCollaboratorsModal(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors rounded-t-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Manage Team
                  </button>
                  <button
                    onClick={() => {
                      duplicateEventMutation.mutate();
                      setShowMoreMenu(false);
                    }}
                    disabled={duplicateEventMutation.isPending}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {duplicateEventMutation.isPending ? 'Duplicating...' : 'Duplicate'}
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Programme
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => {
                      setShowDeleteEventModal(true);
                      setShowMoreMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors rounded-b-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Event
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <div className="text-2xl font-bold text-primary">{event.songs_count}</div>
          <div className="text-sm text-muted-foreground">Songs</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-primary">{event.reviews_count}</div>
          <div className="text-sm text-muted-foreground">Reviews</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-primary">
            {event.average_rating ? `${Number(event.average_rating).toFixed(1)} ★` : 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </div>
      </div>

      {/* Programme Management */}
      <div className="card">
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Programme</h2>
          {event.songs && event.songs.length > 0 && (
            <Link to={`/events/${event.id}/songs/new`} className="btn-primary">
              Add Song
            </Link>
          )}
        </div>
        <div className="card-content">
          {event.songs && event.songs.length > 0 ? (
            <div className="space-y-3">
              {event.songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {song.images[0] && (
                      <img
                        src={song.images[0]}
                        alt={song.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium text-foreground">{song.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {song.composer_name} • {format(new Date(song.start_at), 'HH:mm')} • {song.length_in_minute} min
                      </div>
                      {song.performers.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Performers: {song.performers.map((p) => p.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/events/${event.id}/songs/${song.id}/edit`}
                      className="btn-ghost text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setSongToDelete(song.id)}
                      className="btn-ghost text-sm text-danger hover:bg-danger/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No songs added yet</p>
              <Link to={`/events/${event.id}/songs/new`} className="btn-primary">
                Add First Song
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-sm w-full mx-4">
            <div className="card-header text-center">
              <h2 className="card-title">Event QR Code</h2>
              <p className="card-description">Scan to view the event</p>
            </div>
            <div className="card-content flex flex-col items-center justify-center">
              {qrCode ? (
                <>
                  <div
                    dangerouslySetInnerHTML={{ __html: qrCode.svg }}
                    className="w-48 h-48 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  />
                  <p className="text-sm text-muted-foreground mt-6 text-center break-all px-4">
                    {qrCode.url}
                  </p>
                </>
              ) : (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              )}
            </div>
            <div className="card-footer justify-center">
              <button
                onClick={() => setShowQrModal(false)}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {showDeleteEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <div className="card-header">
              <h2 className="card-title text-danger">Delete Event</h2>
              <p className="card-description">
                Are you sure you want to delete "{event.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="card-footer justify-end gap-2">
              <button
                onClick={() => setShowDeleteEventModal(false)}
                className="btn-outline"
                disabled={deleteEventMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteEventMutation.mutate()}
                className="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-md font-medium"
                disabled={deleteEventMutation.isPending}
              >
                {deleteEventMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Song Confirmation Modal */}
      {songToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <div className="card-header">
              <h2 className="card-title text-danger">Delete Song</h2>
              <p className="card-description">
                Are you sure you want to delete this song? This action cannot be undone.
              </p>
            </div>
            <div className="card-footer justify-end gap-2">
              <button
                onClick={() => setSongToDelete(null)}
                className="btn-outline"
                disabled={deleteSongMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSongMutation.mutate(songToDelete)}
                className="bg-danger hover:bg-danger/90 text-white px-4 py-2 rounded-md font-medium"
                disabled={deleteSongMutation.isPending}
              >
                {deleteSongMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collaborators Modal */}
      {showCollaboratorsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-lg w-full mx-4">
            <div className="card-header">
              <h2 className="card-title">Manage Team</h2>
              <p className="card-description">Add collaborators to help manage this event</p>
            </div>
            <div className="card-content space-y-4">
              {/* Add collaborator form */}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="input flex-1"
                />
                <select
                  value={newCollaboratorRole}
                  onChange={(e) => setNewCollaboratorRole(e.target.value as 'editor' | 'viewer')}
                  className="input w-28"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  onClick={() => {
                    if (newCollaboratorEmail.trim()) {
                      addCollaboratorMutation.mutate({
                        email: newCollaboratorEmail.trim(),
                        role: newCollaboratorRole,
                      });
                    }
                  }}
                  disabled={!newCollaboratorEmail.trim() || addCollaboratorMutation.isPending}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>

              {addCollaboratorMutation.error && (
                <p className="text-sm text-danger">User not found or already a collaborator</p>
              )}

              {/* Collaborators list */}
              <div className="border border-border rounded-lg divide-y divide-border">
                {collaborators && collaborators.length > 0 ? (
                  collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple to-violet flex items-center justify-center text-white text-sm font-bold">
                          {collab.user.first_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {collab.user.first_name} {collab.user.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">{collab.user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          collab.role === 'editor' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {collab.role}
                        </span>
                        <button
                          onClick={() => removeCollaboratorMutation.mutate(collab.id)}
                          className="text-danger hover:bg-danger/10 p-1 rounded"
                          disabled={removeCollaboratorMutation.isPending}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No collaborators yet
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                <strong>Editor:</strong> Can edit event details and songs<br />
                <strong>Viewer:</strong> Can only view analytics and dashboard
              </div>
            </div>
            <div className="card-footer justify-end">
              <button
                onClick={() => setShowCollaboratorsModal(false)}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDashboardPage;
