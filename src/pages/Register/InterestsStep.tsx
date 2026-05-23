import {
    useState,
    useEffect } from 'react'; 
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AnimatedStep } from '../../components/AnimatedStep';
import { useRegister } from '../../context/RegisterContext';
import { authService } from '../../services/auth.service';
import { RegisterStepHeader } from '../../components/RegisterStepHeader';
import { 
    BookOpenIcon,
    CompassIcon,
    HeartIcon,
    MusicNotesIcon,
    PaletteIcon,
    QuestionIcon,
} from '@phosphor-icons/react';

interface Interest {
    id: number;
    name: string;
}

export const InterestsStep = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useRegister();
    
    const [interests, setInterests] = useState<Interest[]>([]); 
    const MIN_SELECTION = 2;

    const CATEGORIES_MAPPING: Record<string, string[]> = {
        'Cultura y Ocio': ['Anime', 'Música', 'Videojuegos', 'Ciencia ficción', 'Lectura', 'Comics', 'Humor', 'Deporte'],
        'Creatividad': ['Diseño', 'Moda', 'Fotografía', 'Cosplay', 'Muñecos', 'Maquetas'],
        'Naturaleza y Viajes': ['Naturaleza', 'Mascotas', 'Playa', 'Montaña', 'Viajes', 'Paseos', 'Picnic'],
        'Conocimiento': ['Historia', 'Matemáticas', 'Tecnología', 'Puzzles', 'Magia', 'Trenes'],
        'Comunidad y Valores': ['Feminismo', 'Veganismo', 'LGTBIQ+', 'Poliamor', 'Religión']
    };

    const CATEGORY_ICONS: Record<string, React.ReactNode> = {
        'Cultura y Ocio': <MusicNotesIcon size={16} weight="bold" />,
        'Creatividad': <PaletteIcon size={16} weight="bold" />,
        'Naturaleza y Viajes': <CompassIcon size={16} weight="bold" />,
        'Conocimiento': <BookOpenIcon size={16} weight="bold" />,
        'Comunidad y Valores': <HeartIcon size={16} weight="bold" />,
        'Otros': <QuestionIcon size={16} weight="bold" />
    };

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await authService.getMetadata();
                if (response.success) {
                    setInterests(response.data.interests);
                }
            } catch (err) {
                console.error("Error cargando intereses desde el servicio:", err);
            }
        };

        fetchInterests();
    }, []);

    const handleNext = () => {
        if (formData.interests.length >= MIN_SELECTION) {
            navigate('/register/description');
        }
    };

    const toggleInterest = (id: number) => {
        const currentInterests = formData.interests || [];
        const isSelected = currentInterests.includes(id);

        if (isSelected) {
            updateFormData({ interests: currentInterests.filter(i => i !== id) });
        } else if (currentInterests.length < 5) {
            updateFormData({ interests: [...currentInterests, id] });
        }
    };

    const groupedInterests = Object.keys(CATEGORIES_MAPPING).reduce((acc, catName) => {
        const catInterests = interests.filter(i => CATEGORIES_MAPPING[catName].includes(i.name));
        if (catInterests.length > 0) acc[catName] = catInterests;
        return acc;
    }, {} as Record<string, Interest[]>);

    const mappedIds = new Set(Object.values(groupedInterests).flat().map(i => i.id));
    const others = interests.filter(i => !mappedIds.has(i.id));
    if (others.length > 0) groupedInterests['Otros'] = others;

    return (
        <AnimatedStep>
            <div className="w-full h-full flex flex-col items-center px-4 animate-fade-in min-h-0">
                <div className="max-w-2xl w-full h-full min-h-0 flex flex-col justify-between pt-14 pb-12 md:pt-40 md:pb-24 md:[@media(max-height:1000px)]:pt-10 md:[@media(max-height:1000px)]:pb-8">

                    <div className="shrink-0">
                        <RegisterStepHeader
                            title="Elige tus intereses"
                            subtitle="Selecciona entre 2 y 5 intereses"
                            align="left"
                            compactOnShort
                            className="mb-12 md:mb-10"
                        />
                    </div>

                    <div 
                        className="flex-grow min-h-0 overflow-y-auto overflow-x-visible no-scrollbar py-4 px-1"
                        role="group" 
                        aria-label="Lista de intereses"
                    >
                        <div className="flex flex-col gap-6 md:gap-10 pb-6">
                            {Object.entries(groupedInterests).map(([catName, items]) => (
                                <div key={catName} className="flex flex-col gap-3 md:gap-5">
                                    <h3 className="text-bluvi-purple/60 text-xs font-bold uppercase tracking-widest pl-1 flex items-center gap-2">
                                        <span className="text-bluvi-purple/40">
                                            {CATEGORY_ICONS[catName] || <QuestionIcon size={16} weight="bold" />}
                                        </span>
                                        {catName}
                                    </h3>
                                    <div className="grid grid-cols-2 grid-flow-dense md:flex md:flex-wrap justify-left gap-2.5 md:gap-3">
                                        {items.map((interest) => {
                                            const isSelected = formData.interests.includes(interest.id);
                                            const isDisabled = !isSelected && formData.interests.length >= 5;
                                            const isLongName = interest.name.length > 18;

                                            return (
                                                <button
                                                    key={interest.id}
                                                    type="button"
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    onClick={() => toggleInterest(interest.id)}
                                                    disabled={isDisabled}
                                                    className={`
                                                        px-4 md:px-6 py-3 rounded-full border-2 text-sm md:text-base font-medium transition-all duration-300 text-left md:text-center
                                                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-bluvi-purple/40
                                                        ${isLongName ? 'col-span-2' : 'col-span-1'}
                                                        ${isSelected 
                                                            ? 'bg-bluvi-purple/20 border-bluvi-purple text-bluvi-purple font-bold shadow-md scale-105' 
                                                            : 'bg-white/40 border-white/60 text-bluvi-purple hover:bg-white/60'}
                                                        ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                                                    `}
                                                >
                                                    {interest.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 shrink-0 w-full flex justify-center">
                        <Button
                            aria-label="Confirmar intereses y continuar"
                            onClick={handleNext}
                            disabled={formData.interests.length < MIN_SELECTION}
                            className={`w-full max-w-sm py-4 rounded-full text-base md:text-lg shadow-xl shadow-bluvi-purple/10 transition-all duration-300
                            ${formData.interests.length >= MIN_SELECTION ? 'bg-bluvi-purple text-white hover:scale-102 active:scale-98' : 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed'}`}
                        >
                            Siguiente {formData.interests.length > 0 ? `(${formData.interests.length}/5)` : ''}
                        </Button>
                    </div>

                </div>
            </div>
        </AnimatedStep> 
    );
};
