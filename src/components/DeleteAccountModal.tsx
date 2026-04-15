import React, { useState, useEffect, useRef } from 'react';
import { deleteMyAccount } from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// ─── Icons ────────────────────────────────────────────────────────────────────

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
    <path d="M10.748 13.93l2.523 2.523a10.003 10.003 0 01-9.07-5.611 1.651 1.651 0 010-1.185 10.003 10.003 0 011.945-2.878l2.526 2.525a4 4 0 005.076 5.126z" />
  </svg>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface DeleteAccountModalProps {
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Foco automático al cambiar de paso
  useEffect(() => {
    if (step === 2) passwordRef.current?.focus();
    else cancelRef.current?.focus();
  }, [step]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDeleting, onClose]);

  const handleDelete = async () => {
    if (!password) {
      setError('Escribe tu contraseña para continuar.');
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      await deleteMyAccount(password);
      logout();
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg === 'Contraseña incorrecta'
        ? 'La contraseña no es correcta. Inténtalo de nuevo.'
        : 'Ha ocurrido un error. Inténtalo más tarde.'
      );
      setIsDeleting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => !isDeleting && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl pointer-events-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
                🗑️
              </div>
              <h2 id="delete-modal-title" className="text-lg font-bold text-gray-800">
                Eliminar cuenta
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              aria-label="Cerrar"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <XIcon />
            </button>
          </div>

          <div className="h-px bg-gray-100 mx-6" />

          {/* Paso 1 — Confirmación */}
          {step === 1 && (
            <div className="px-6 py-6 space-y-5">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-2">
                <p className="text-sm font-semibold text-red-700">
                  Esto borrará tu cuenta de forma permanente.
                </p>
                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                  <li>Tu perfil dejará de ser visible</li>
                  <li>Perderás todos tus datos y fotos</li>
                  <li>No se puede deshacer</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                Si quieres tomarte un descanso, puedes pausar tu cuenta desde ajustes sin borrar nada.
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  ref={cancelRef}
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Paso 2 — Contraseña */}
          {step === 2 && (
            <div className="px-6 py-6 space-y-5">
              <p className="text-sm text-gray-600">
                Para confirmar, escribe tu contraseña actual.
              </p>

              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  className={`${inputCls} pr-12 ${error ? 'border-red-400 focus:ring-red-300' : ''}`}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                  autoComplete="current-password"
                  disabled={isDeleting}
                  aria-describedby={error ? 'delete-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {error && (
                <p id="delete-error" role="alert" className="text-sm text-red-600 font-medium -mt-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setStep(1); setError(null); setPassword(''); }}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Atrás
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting || !password}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Eliminando...
                    </>
                  ) : 'Eliminar mi cuenta'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};
