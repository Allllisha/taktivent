import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventsApi, eventTemplatesApi } from '@/api';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { QuestionBuilder } from '@/components/ui/QuestionBuilder';
import type { EventFormData, QuestionAndChoice } from '@/types';
import type { EventTemplate } from '@/api/eventTemplates';

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
  // datetime-local returns "YYYY-MM-DDTHH:mm" in local time
  // Create a Date object which interprets it as local time
  const date = new Date(localDateTimeString);
  return date.toISOString();
}

export function EventNewPage() {
  const { id: eventId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!eventId;

  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    start_at: '',
    end_at: '',
    enable_textbox: true,
    questions_and_choices: [],
    venue_attributes: {
      name: '',
      address: '',
    },
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Fetch templates
  const { data: templates } = useQuery({
    queryKey: ['event_templates'],
    queryFn: () => eventTemplatesApi.getAll(),
    enabled: !isEditMode,
  });

  // Apply template
  const applyTemplate = (template: EventTemplate) => {
    setFormData({
      ...formData,
      enable_textbox: template.template_data.enable_textbox ?? true,
      questions_and_choices: template.template_data.questions_and_choices || [],
      venue_attributes: {
        name: template.template_data.venue_name || '',
        address: formData.venue_attributes.address,
      },
    });
    setShowTemplateModal(false);
  };

  // Save as template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: (data: { name: string; template_data: EventTemplate['template_data'] }) =>
      eventTemplatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_templates'] });
    },
  });

  // Fetch existing event data when in edit mode
  const { data: existingEvent, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getById(Number(eventId)),
    enabled: isEditMode,
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        name: existingEvent.name || '',
        description: existingEvent.description || '',
        start_at: formatDateTimeLocal(existingEvent.start_at),
        end_at: formatDateTimeLocal(existingEvent.end_at),
        enable_textbox: existingEvent.enable_textbox ?? true,
        questions_and_choices: existingEvent.questions_and_choices || [],
        venue_attributes: {
          name: existingEvent.venue?.name || '',
          address: existingEvent.venue?.address || '',
        },
      });
      setImageUrls(existingEvent.images || []);
    }
  }, [existingEvent]);

  const createMutation = useMutation({
    mutationFn: eventsApi.create,
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate(`/events/${event.id}/dashboard`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: EventFormData) => eventsApi.update(Number(eventId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      navigate(`/events/${eventId}/dashboard`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('venue_')) {
      const venueField = name.replace('venue_', '');
      setFormData({
        ...formData,
        venue_attributes: {
          ...formData.venue_attributes,
          [venueField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert local datetime to ISO string for server
    const dataToSend = {
      ...formData,
      start_at: toISOString(formData.start_at),
      end_at: toISOString(formData.end_at),
      image_urls: imageUrls,
    };

    // Save as template if requested
    if (saveAsTemplate && templateName.trim()) {
      const startDate = new Date(formData.start_at);
      const endDate = new Date(formData.end_at);
      const durationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

      saveTemplateMutation.mutate({
        name: templateName.trim(),
        template_data: {
          duration_minutes: durationMinutes,
          enable_textbox: formData.enable_textbox,
          questions_and_choices: formData.questions_and_choices,
          venue_name: formData.venue_attributes.name,
        },
      });
    }

    if (isEditMode) {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const mutation = isEditMode ? updateMutation : createMutation;

  if (isEditMode && isLoadingEvent) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        {!isEditMode && templates && templates.length > 0 && (
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="btn-outline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            Use Template
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mutation.error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded">
            Failed to {isEditMode ? 'update' : 'create'} event. Please try again.
          </div>
        )}

        <div id="basic-info" className="card scroll-mt-24">
          <div className="card-header">
            <h2 className="card-title text-lg">Event Details</h2>
          </div>
          <div className="card-content space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="label">Event Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[100px]"
                rows={4}
              />
            </div>

            <div id="datetime" className="grid grid-cols-2 gap-4 scroll-mt-24">
              <div className="space-y-2">
                <label htmlFor="start_at" className="label">Start Date & Time *</label>
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
                <label htmlFor="end_at" className="label">End Date & Time *</label>
                <input
                  id="end_at"
                  name="end_at"
                  type="datetime-local"
                  value={formData.end_at}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div id="venue" className="card scroll-mt-24">
          <div className="card-header">
            <h2 className="card-title text-lg">Venue</h2>
          </div>
          <div className="card-content space-y-4">
            <div className="space-y-2">
              <label htmlFor="venue_name" className="label">Venue Name *</label>
              <input
                id="venue_name"
                name="venue_name"
                type="text"
                value={formData.venue_attributes.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="venue_address" className="label">Address</label>
              <input
                id="venue_address"
                name="venue_address"
                type="text"
                value={formData.venue_attributes.address}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        </div>

        <div id="images" className="card scroll-mt-24">
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

        <div id="questions" className="card scroll-mt-24">
          <div className="card-header">
            <h2 className="card-title text-lg">Custom Questions</h2>
            <p className="card-description">Add custom questions for audience feedback</p>
          </div>
          <div className="card-content">
            <QuestionBuilder
              questions={formData.questions_and_choices}
              onChange={(questions: QuestionAndChoice[]) =>
                setFormData({ ...formData, questions_and_choices: questions })
              }
              maxQuestions={10}
            />
          </div>
        </div>

        {/* Save as Template Option */}
        {!isEditMode && (
          <div className="card">
            <div className="card-content">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-sm">Save as template for future events</span>
              </label>
              {saveAsTemplate && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                    className="input"
                  />
                </div>
              )}
            </div>
          </div>
        )}

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
              ? (isEditMode ? 'Updating...' : 'Creating...')
              : (isEditMode ? 'Update Event' : 'Create Event')}
          </button>
        </div>
      </form>

      {/* Template Selection Modal */}
      {showTemplateModal && templates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-lg w-full mx-4">
            <div className="card-header">
              <h2 className="card-title">Select Template</h2>
              <p className="card-description">Choose a template to pre-fill event settings</p>
            </div>
            <div className="card-content">
              {templates.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium text-foreground">{template.name}</div>
                      {template.description && (
                        <div className="text-sm text-muted-foreground mt-1">{template.description}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {template.template_data.venue_name && (
                          <span className="mr-3">Venue: {template.template_data.venue_name}</span>
                        )}
                        {template.template_data.questions_and_choices && (
                          <span>{template.template_data.questions_and_choices.length} custom questions</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No templates available</p>
              )}
            </div>
            <div className="card-footer justify-end">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventNewPage;
