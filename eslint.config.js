// Meme filet de securite que devis-track et l'admin : le build Vite ne verifie
// pas que les references existent. C'est ce qui avait laisse passer un
// composant utilise sans etre importe.
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-undef': 'error',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      // Les `catch {}` vides sont voulus : navigation privee, localStorage
      // indisponible, JSON illisible — on retombe sur une valeur par defaut.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Reinitialiser un etat quand la langue change EST le comportement voulu
      // (sinon le contenu de la langue precedente reste affiche). Simple
      // avertissement de performance, pas une erreur.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]
