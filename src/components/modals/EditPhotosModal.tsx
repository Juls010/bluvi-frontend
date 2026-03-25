import React, { useState, useRef } from 'react';
import { Camera, Trash2, Plus, X } from 'lucide-react';

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
      className={`relative aspect-square group animate-fade-in cursor-grab active:cursor-grabbing ${
        index === 0 ? 'ring-4 ring-bluvi-purple rounded-2xl' : ''
      }`}
    >
      <img src={url} alt="" className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-100" />
      
      <div className={`absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold shadow-lg border border-white/50 ${
        index === 0 ? 'bg-bluvi-purple text-white' : 'bg-white/90 text-gray-500'
      }`}>
        {index + 1}
      </div>

      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none">
        </div>

        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {index !== 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                onMakePrimary(url);
              }}
              className="bg-white text-bluvi-purple p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto"
              title="Poner como primera"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}

          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onRemove();
            }}
            className="bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto"
            title="Eliminar foto"
          >
            <Trash2 className="w-3.5 h-3.5" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Camera className="text-bluvi-purple" /> Mis Fotos
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-bluvi-purple hover:bg-purple-50 transition-all group">
                <Plus className="w-6 h-6 text-gray-300 group-hover:text-bluvi-purple" />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-bluvi-purple uppercase">Añadir</span>
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

        <div className="p-6 bg-gray-50 flex gap-3 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:text-gray-700">
            Cancelar
          </button>
          <button 
            onClick={() => onSave(photos)}
            disabled={isSaving || photos.length === 0}
            className="flex-1 py-3 bg-bluvi-purple text-white rounded-2xl font-bold shadow-lg shadow-bluvi-purple/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSaving ? 'Subiendo...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};