import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer l'affichage/masquage d'un overlay avec la touche Espace
 * @returns isVisible - État de visibilité de l'overlay
 * @returns setIsVisible - Fonction pour changer manuellement la visibilité
 */
export function useChatOverlay() {
  // Tous les hooks de création d'état en premier
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  // Callbacks stables
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const closeOverlay = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Synchroniser le ref avec l'état
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  // Gestionnaire d'événements clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si on est dans un input, textarea ou autre élément éditable
      const target = event.target as HTMLElement;
      const isEditableElement =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Basculer la visibilité avec Espace (vérifier key et code pour compatibilité)
      if ((event.key === ' ' || event.code === 'Space') && !isEditableElement) {
        event.preventDefault(); // Empêcher le scroll de la page
        toggleVisibility();
      }

      // Fermer avec Escape
      if (event.key === 'Escape' || event.code === 'Escape') {
        event.preventDefault();
        closeOverlay();
      }
    };

    // Utiliser capture: true pour capturer l'événement avant les autres handlers
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [toggleVisibility, closeOverlay]);

  return { isVisible, setIsVisible };
}
