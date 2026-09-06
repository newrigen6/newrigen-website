import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    /**
     * Ne pas precharger ce qu'on a pris soin de differer.
     *
     * Vite ajoute de lui-meme un `<link rel="modulepreload">` dans le HTML pour
     * les paquets partages. Il y mettait `trois-d` : 223 Ko de three.js
     * telecharges des la huitieme milliseconde, par tout le monde, y compris le
     * telephone en 4G pour lequel on avait justement decide de ne jamais charger
     * la 3D. Le chargement differe etait parfaitement ecrit, et parfaitement
     * inutile — le mal etait fait dans l'en-tete.
     *
     * On retire donc ces deux paquets de la liste de prechargement. Ils restent
     * demandes normalement, au moment ou le code les importe.
     */
    modulePreload: {
      resolveDependencies: (_url, deps) =>
        deps.filter(d => !/\/(trois-d|animation)-/.test(`/${d}`)),
    },
    rollupOptions: {
      output: {
        /**
         * Trois paquets séparés, pour trois vitesses de changement.
         *
         * `three` pèse à lui seul plus que tout le reste du site et ne bouge
         * qu'aux mises à jour ; `animation` bouge un peu plus ; le code du site
         * change tous les jours. Mélangés, la moindre correction de texte
         * ferait retélécharger la 3D à tous ceux qui l'avaient déjà en cache.
         *
         * Ces deux paquets ne sont de toute façon demandés qu'après le premier
         * affichage : les isoler garantit qu'aucune importation distraite ne les
         * ramène dans le chemin critique sans qu'on s'en aperçoive.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // React d'abord, et c'est le point important : sans cette ligne,
          // Rollup le range avec three — parce que la 3D en depend — et
          // l'entree se met alors a importer le paquet 3D pour aller y chercher
          // React. Resultat : 223 Ko de three.js charges des la vingtieme
          // milliseconde chez tout le monde, y compris sur le telephone ou l'on
          // avait decide de ne jamais afficher de 3D. Le differe etait juste,
          // le decoupage le trahissait.
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) return 'react'
          if (/[\\/]node_modules[\\/](three|@react-three)[\\/]/.test(id)) return 'trois-d'
          if (/[\\/]node_modules[\\/](gsap|lenis)[\\/]/.test(id)) return 'animation'
        },
      },
    },
  },
})
