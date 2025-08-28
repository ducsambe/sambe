import React from 'react';
import { Calendar, User, ArrowRight, TrendingUp, Home, Calculator } from 'lucide-react';

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      id: '1',
      title: 'Guide Complet pour Investir dans l\'Immobilier au Sénégal',
      excerpt: 'Découvrez les meilleures stratégies pour réussir votre investissement immobilier au Sénégal. De l\'achat du terrain à la construction.',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Amadou Diallo',
      date: '2024-01-15',
      category: 'Investissement',
      readTime: '8 min'
    },
    {
      id: '2',
      title: 'Les Zones les Plus Prometteuses pour l\'Immobilier à Dakar',
      excerpt: 'Analyse des quartiers en pleine expansion et des opportunités d\'investissement les plus rentables dans la capitale sénégalaise.',
      image: 'https://images.pexels.com/photos/2182863/pexels-photo-2182863.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Fatou Sall',
      date: '2024-01-12',
      category: 'Marché',
      readTime: '6 min'
    },
    {
      id: '3',
      title: 'Comment Financer Votre Projet Immobilier : Options et Conseils',
      excerpt: 'Tour d\'horizon des solutions de financement disponibles pour votre projet immobilier, des prêts bancaires aux investisseurs privés.',
      image: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Moussa Ba',
      date: '2024-01-10',
      category: 'Finance',
      readTime: '10 min'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Investissement':
        return <TrendingUp className="h-4 w-4" />;
      case 'Marché':
        return <Home className="h-4 w-4" />;
      case 'Finance':
        return <Calculator className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Investissement':
        return 'bg-emerald-100 text-emerald-800';
      case 'Marché':
        return 'bg-blue-100 text-blue-800';
      case 'Finance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conseils & Actualités Immobilières
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Restez informé des dernières tendances du marché immobilier et découvrez nos conseils d'experts 
            pour réussir vos investissements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                    {getCategoryIcon(post.category)}
                    <span className="ml-1">{post.category}</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{new Date(post.date).toLocaleDateString('fr-FR')}</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <button className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                  Lire la suite
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Restez Informé des Dernières Opportunités
          </h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir en exclusivité les nouveaux biens, 
            nos conseils d'experts et les meilleures opportunités d'investissement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 outline-none"
            />
            <button className="bg-white text-emerald-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;