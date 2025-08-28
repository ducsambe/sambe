import React from 'react';
import { Award, Users, TrendingUp, MapPin, Phone, Mail, Clock, Shield, Heart, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  const stats = [
    {
      icon: Award,
      number: '15+',
      label: language === 'en' ? 'Years of Excellence' : 'Années d\'Excellence'
    },
    {
      icon: Users,
      number: '1200+',
      label: language === 'en' ? 'Happy Clients' : 'Clients Satisfaits'
    },
    {
      icon: TrendingUp,
      number: '500+',
      label: language === 'en' ? 'Properties Sold' : 'Propriétés Vendues'
    },
    {
      icon: MapPin,
      number: '50+',
      label: language === 'en' ? 'Locations Covered' : 'Localisations Couvertes'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: language === 'en' ? 'Trust & Transparency' : 'Confiance & Transparence',
      description: language === 'en' 
        ? 'We believe in honest dealings and transparent processes in every transaction.'
        : 'Nous croyons en des transactions honnêtes et des processus transparents dans chaque transaction.'
    },
    {
      icon: Heart,
      title: language === 'en' ? 'Client-Centered Service' : 'Service Centré Client',
      description: language === 'en'
        ? 'Your satisfaction is our priority. We go above and beyond to meet your needs.'
        : 'Votre satisfaction est notre priorité. Nous faisons tout pour répondre à vos besoins.'
    },
    {
      icon: Star,
      title: language === 'en' ? 'Excellence in Quality' : 'Excellence en Qualité',
      description: language === 'en'
        ? 'We maintain the highest standards in property selection and customer service.'
        : 'Nous maintenons les plus hauts standards dans la sélection de propriétés et le service client.'
    },
    {
      icon: TrendingUp,
      title: language === 'en' ? 'Innovation & Growth' : 'Innovation & Croissance',
      description: language === 'en'
        ? 'We continuously evolve and adopt new technologies to serve you better.'
        : 'Nous évoluons continuellement et adoptons de nouvelles technologies pour mieux vous servir.'
    }
  ];

  const team = [
    {
      name: 'Jean-Claude Mbarga',
      position: language === 'en' ? 'Founder & CEO' : 'Fondateur & PDG',
      image: '/placeholder.svg?height=300&width=300&text=JCM',
      description: language === 'en'
        ? '15+ years experience in Cameroon real estate market'
        : '15+ années d\'expérience sur le marché immobilier camerounais'
    },
    {
      name: 'Marie Fotso',
      position: language === 'en' ? 'Sales Director' : 'Directrice des Ventes',
      image: '/placeholder.svg?height=300&width=300&text=MF',
      description: language === 'en'
        ? 'Expert in luxury properties and client relations'
        : 'Experte en propriétés de luxe et relations clients'
    },
    {
      name: 'Paul Nkomo',
      position: language === 'en' ? 'Investment Advisor' : 'Conseiller en Investissement',
      image: '/placeholder.svg?height=300&width=300&text=PN',
      description: language === 'en'
        ? 'Specialist in real estate investment strategies'
        : 'Spécialiste en stratégies d\'investissement immobilier'
    },
    {
      name: 'Aminata Diallo',
      position: language === 'en' ? 'Legal Advisor' : 'Conseillère Juridique',
      image: '/placeholder.svg?height=300&width=300&text=AD',
      description: language === 'en'
        ? 'Ensures all transactions are legally compliant'
        : 'Assure que toutes les transactions sont légalement conformes'
    }
  ];

  const milestones = [
    {
      year: '2009',
      title: language === 'en' ? 'Company Founded' : 'Fondation de l\'Entreprise',
      description: language === 'en'
        ? 'GEOCASA GROUP was established in Douala with a vision to transform Cameroon\'s real estate market.'
        : 'GEOCASA GROUP a été établi à Douala avec la vision de transformer le marché immobilier camerounais.'
    },
    {
      year: '2012',
      title: language === 'en' ? 'Expansion to Yaoundé' : 'Expansion à Yaoundé',
      description: language === 'en'
        ? 'Opened our second office in the capital city to serve the growing demand.'
        : 'Ouverture de notre deuxième bureau dans la capitale pour répondre à la demande croissante.'
    },
    {
      year: '2016',
      title: language === 'en' ? 'Digital Transformation' : 'Transformation Numérique',
      description: language === 'en'
        ? 'Launched our online platform making property search easier for clients.'
        : 'Lancement de notre plateforme en ligne facilitant la recherche de propriétés pour les clients.'
    },
    {
      year: '2020',
      title: language === 'en' ? 'Regional Expansion' : 'Expansion Régionale',
      description: language === 'en'
        ? 'Extended services to Bafoussam, Bamenda, and other major cities.'
        : 'Extension des services à Bafoussam, Bamenda et autres grandes villes.'
    },
    {
      year: '2024',
      title: language === 'en' ? 'Market Leadership' : 'Leadership du Marché',
      description: language === 'en'
        ? 'Became the leading real estate company in Cameroon with 500+ properties.'
        : 'Devenu la première entreprise immobilière au Cameroun avec 500+ propriétés.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {language === 'en' ? 'About GEOCASA GROUP' : 'À Propos de GEOCASA GROUP'}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Your trusted partner in Cameroon real estate for over 15 years. We connect dreams with reality through exceptional properties and unmatched service.'
                : 'Votre partenaire de confiance dans l\'immobilier camerounais depuis plus de 15 ans. Nous connectons les rêves à la réalité grâce à des propriétés exceptionnelles et un service inégalé.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Our Mission' : 'Notre Mission'}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {language === 'en'
                  ? 'To provide exceptional real estate services that exceed client expectations while contributing to the development of Cameroon\'s property market. We strive to make property ownership accessible and profitable for all Cameroonians.'
                  : 'Fournir des services immobiliers exceptionnels qui dépassent les attentes des clients tout en contribuant au développement du marché immobilier camerounais. Nous nous efforçons de rendre la propriété accessible et rentable pour tous les Camerounais.'
                }
              </p>
              <div className="flex items-center text-geocasa-blue">
                <Award className="h-6 w-6 mr-2" />
                <span className="font-semibold">
                  {language === 'en' ? 'Excellence in Service' : 'Excellence dans le Service'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Our Vision' : 'Notre Vision'}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {language === 'en'
                  ? 'To be the leading real estate company in Central Africa, known for innovation, integrity, and exceptional customer service. We envision a future where every Cameroonian has access to quality housing and investment opportunities.'
                  : 'Être la première entreprise immobilière en Afrique Centrale, reconnue pour l\'innovation, l\'intégrité et un service client exceptionnel. Nous envisageons un avenir où chaque Camerounais a accès à un logement de qualité et à des opportunités d\'investissement.'
                }
              </p>
              <div className="flex items-center text-geocasa-orange">
                <TrendingUp className="h-6 w-6 mr-2" />
                <span className="font-semibold">
                  {language === 'en' ? 'Future-Focused Growth' : 'Croissance Axée sur l\'Avenir'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Our Core Values' : 'Nos Valeurs Fondamentales'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'en' 
                ? 'The principles that guide everything we do'
                : 'Les principes qui guident tout ce que nous faisons'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Our Journey' : 'Notre Parcours'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'en' 
                ? 'Key milestones in our growth story'
                : 'Étapes clés de notre histoire de croissance'
              }
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-600 to-red-600"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="text-2xl font-bold text-geocasa-blue mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-geocasa-blue rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Meet Our Team' : 'Rencontrez Notre Équipe'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'en' 
                ? 'The experts behind your real estate success'
                : 'Les experts derrière votre succès immobilier'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-semibold mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 bg-gradient-to-r from-geocasa-blue to-geocasa-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {language === 'en' ? 'Ready to Work With Us?' : 'Prêt à Travailler Avec Nous ?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {language === 'en' 
              ? 'Let our experienced team help you find your perfect property or investment opportunity in Cameroon.'
              : 'Laissez notre équipe expérimentée vous aider à trouver votre propriété parfaite ou opportunité d\'investissement au Cameroun.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-geocasa-blue hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Call Us Today' : 'Appelez-Nous Aujourd\'hui'}
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-geocasa-blue px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Send Message' : 'Envoyer un Message'}
            </button>
          </div>
        </div>
      </div>

      {/* Office Hours */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center">
              <Clock className="h-6 w-6 text-geocasa-blue mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'en' ? 'Office Hours' : 'Heures d\'Ouverture'}
                </h4>
                <p className="text-gray-600">
                  {language === 'en' ? 'Mon - Fri: 8AM - 6PM' : 'Lun - Ven: 8h - 18h'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Phone className="h-6 w-6 text-geocasa-blue mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'en' ? 'Phone Support' : 'Support Téléphonique'}
                </h4>
                <p className="text-gray-600">+237 6XX XXX XXX</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <Mail className="h-6 w-6 text-geocasa-blue mr-3" />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {language === 'en' ? 'Email Support' : 'Support Email'}
                </h4>
                <p className="text-gray-600">contact@geocasagroup.cm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;