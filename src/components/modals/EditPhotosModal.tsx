import React, { useEffect, useRef, useState } from 'react';
import { CameraIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';


interface EditPhotosModalProps {
  currentPhotos: string[];
  onSave: (photos: string[]) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

interface SortablePhotoProps {
  url: string;
  index: number;
  onRemove: () => void;
  onMakePrimary: (url: string) => void; 
}

const SortablePhoto: React.FC<SortablePhotoProps> = ({ 
  url, 
  index, 
  onRemove, 
  onMakePrimary 
}) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes} 
      {...listeners} 
      className={`relative aspect-square group animate-fade-in cursor-grab active:cursor-grabbing rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-accent ${
        index === 0 ? 'ring-4 ring-bluvi-purple rounded-2xl' : ''
      }`}
    >
      <img src={url} alt="" className="w-full h-full object-cover rounded-2xl shadow-sm border border-app-soft" />
      
      <div className={`absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold shadow-lg border border-white/50 ${
        index === 0 ? 'bg-bluvi-purple text-white' : 'bg-app-surface-strong text-app-secondary border-app-soft'
      }`}>
        {index + 1}
      </div>

      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none">
        </div>

        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          {index !== 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                onMakePrimary(url);
              }}
              className="bg-white text-bluvi-purple p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
              title="Poner como primera"
              aria-label="Poner como primera foto"
            >
              <CameraIcon className="w-3.5 h-3.5" weight="bold" aria-hidden="true" />
            </button>
          )}

          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onRemove();
            }}
            className="bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent"
            title="Eliminar foto"
            aria-label={`Eliminar foto ${index + 1}`}
          >
            <TrashIcon className="w-3.5 h-3.5" weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
  );
};

export const EditPhotosModal: React.FC<EditPhotosModalProps> = ({
  currentPhotos,
  onSave,
  onClose,
  isSaving
}) => {
  const [photos, setPhotos] = useState<string[]>(currentPhotos);
  const [activeUrl, setActiveUrl] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const getFocusableElements = () => {
      const dialog = dialogRef.current;
      if (!dialog) return [];

      return Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (!isSaving) onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSaving, onClose]);

  const makePrimary = (url: string) => {
    setPhotos((prev) => {
      const remaining = prev.filter(p => p !== url);
      return [url, ...remaining]; 
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), 
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        if (!photos.includes(base64String)) {
            setPhotos([...photos, base64String]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (url: string) => {
    setPhotos(photos.filter(p => p !== url));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveUrl(null); 

    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragStart = (event: any) => {
    setActiveUrl(event.active.id); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/60 backdrop-blur-sm">
    
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-photos-modal-title"
        tabIndex={-1}
        className="bg-app-surface-strong text-app-primary w-full max-w-md rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-app-soft"
      >
        
        <div className="p-6 flex justify-between items-center bg-app-surface-strong z-10">
          <h2 id="edit-photos-modal-title" className="text-xl font-bold text-app-primary flex items-center gap-2">
            <CameraIcon className="text-app-accent" weight="bold" /> Mis Fotos
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            disabled={isSaving}
            aria-label="Cerrar editor de fotos"
            className="p-2 hover:bg-app-surface-soft rounded-full transition-colors disabled:opacity-50"
          >
            <XIcon className="w-5 h-5 text-app-muted" weight="bold" aria-hidden="true" />
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
          <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-app-surface-strong">
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-app-strong flex flex-col items-center justify-center gap-2 hover:border-bluvi-purple hover:bg-app-surface-soft transition-all group bg-app-surface">
                <PlusIcon className="w-6 h-6 text-app-muted group-hover:text-bluvi-purple" weight="bold" />
                <span className="text-[10px] font-bold text-app-secondary group-hover:text-bluvi-purple uppercase">Añadir</span>
              </button>

              <SortableContext items={photos} strategy={rectSortingStrategy}>
                {photos.map((url, i) => (
                  <SortablePhoto 
                    key={url} 
                    url={url} 
                    index={i} 
                    onRemove={() => removePhoto(url)} 
                    onMakePrimary={makePrimary} 
                  />
                ))}
              </SortableContext>
            </div>

            <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
              {activeUrl ? (
                <div className="aspect-square rounded-2xl ring-4 ring-bluvi-purple/50 shadow-2xl overflow-hidden cursor-grabbing">
                  <img src={activeUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </DragOverlay>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </DndContext>

        <div className="p-6 bg-app-surface-soft flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 px-6 rounded-full border border-app-soft border-b-2 border-black/10 bg-app-surface text-app-secondary font-semibold shadow-sm hover:text-app-primary hover:bg-app-surface-strong hover:-translate-y-0.5 active:translate-y-0 transition-all">
            Cancelar
          </button>
          <button 
            onClick={() => onSave(photos)}
            disabled={isSaving || photos.length === 0}
            className="flex-1 py-2.5 px-6 bg-bluvi-purple text-white rounded-full font-semibold shadow-md shadow-bluvi-purple/20 border-b-2 border-black/10 disabled:opacity-50 transition-all hover:brightness-105 hover:-translate-y-0.5 active:scale-95"
          >
            {isSaving ? 'Subiendo...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
