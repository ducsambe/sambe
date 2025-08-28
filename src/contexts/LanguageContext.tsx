import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations object
const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.properties': 'Nos Biens',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.profile': 'Mon Profil',
    'nav.admin': 'Administration',
    'nav.notifications': 'Notifications',
    
    // Hero Section
    'hero.title': 'Trouvez Votre Propriété de Rêve',
    'hero.subtitle': 'Découvrez les meilleures opportunités immobilières en Côte d\'Ivoire avec GEOCASA GROUP',
    'hero.cta': 'Explorer Maintenant',
    'hero.search.placeholder': 'Rechercher par localisation...',
    
    // Property Types
    'property.terrain': 'Terrains',
    'property.house': 'Maisons',
    'property.lot': 'Lots',
    'property.apartment': 'Appartements',
    
    // Property Details
    'property.price': 'Prix',
    'property.location': 'Localisation',
    'property.surface': 'Surface',
    'property.bedrooms': 'Chambres',
    'property.bathrooms': 'Salles de bain',
    'property.details': 'Détails',
    'property.contact': 'Contacter',
    'property.favorite': 'Ajouter aux favoris',
    'property.reserve': 'Réserver',
    
    // Filters
    'filter.all': 'Tous',
    'filter.price.min': 'Prix minimum',
    'filter.price.max': 'Prix maximum',
    'filter.location': 'Localisation',
    'filter.type': 'Type de bien',
    'filter.apply': 'Appliquer les filtres',
    'filter.reset': 'Réinitialiser',
    
    // About Page
    'about.title': 'À Propos de GEOCASA GROUP',
    'about.description': 'Votre partenaire de confiance pour tous vos projets immobiliers et Fonciers au Cameroun. Plus de 15 ans d\'expérience à votre service.',
    'about.mission': 'Notre Mission',
    'about.vision': 'Notre Vision',
    'about.values': 'Nos Valeurs',
    
    // Footer
    'footer.company': 'GEOCASA GROUP',
    'footer.description': 'Votre partenaire de confiance pour tous vos projets immobiliers et Fonciers au Cameroun. Plus de 15 ans d\'expérience à votre service.',
    'footer.quickLinks': 'Liens Rapides',
    'footer.contact': 'Contact',
    'footer.address': 'Abidjan, Cocody Riviera',
    'footer.phone': '+225 07 123 456 78',
    'footer.email': 'contact@geocasagroup.com',
    'footer.rights': 'Tous droits réservés.',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.close': 'Fermer',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.profile': 'My Profile',
    'nav.admin': 'Administration',
    'nav.notifications': 'Notifications',
    
    // Hero Section
    'hero.title': 'Find Your Dream Property',
    'hero.subtitle': 'Discover the best real estate opportunities in Ivory Coast with GEOCASA GROUP',
    'hero.cta': 'Explore Now',
    'hero.search.placeholder': 'Search by location...',
    
    // Property Types
    'property.terrain': 'Land',
    'property.house': 'Houses',
    'property.lot': 'Lots',
    'property.apartment': 'Apartments',
    
    // Property Details
    'property.price': 'Price',
    'property.location': 'Location',
    'property.surface': 'Surface',
    'property.bedrooms': 'Bedrooms',
    'property.bathrooms': 'Bathrooms',
    'property.details': 'Details',
    'property.contact': 'Contact',
    'property.favorite': 'Add to favorites',
    'property.reserve': 'Reserve',
    
    // Filters
    'filter.all': 'All',
    'filter.price.min': 'Min price',
    'filter.price.max': 'Max price',
    'filter.location': 'Location',
    'filter.type': 'Property type',
    'filter.apply': 'Apply filters',
    'filter.reset': 'Reset',
    
    // About Page
    'about.title': 'About GEOCASA GROUP',
    'about.description': 'Your trusted partner for all your real estate projects in Ivory Coast. Over 15 years of experience at your service.',
    'about.mission': 'Our Mission',
    'about.vision': 'Our Vision',
    'about.values': 'Our Values',
    
    // Footer
    'footer.company': 'GEOCASA GROUP',
    'footer.description': 'Your trusted partner for all your real estate projects in Ivory Coast. Over 15 years of experience at your service.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.address': 'Abidjan, Cocody Riviera',
    'footer.phone': '+225 07 123 456 78',
    'footer.email': 'contact@geocasagroup.com',
    'footer.rights': 'All rights reserved.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.close': 'Close',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr'); // Default to French for Cameroon

  useEffect(() => {
    const savedLanguage = localStorage.getItem('geocasa_language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('geocasa_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
