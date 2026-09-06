import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/**
 * La scène 3D de l’acte du produit — une tablette posée dans la nuit.
 *
 * Rien n'est importé d'un fichier de modèle : la géométrie est faite ici, en
 * quelques primitives. Un modèle exporté d'un logiciel de 3D aurait pesé
 * plusieurs mégaoctets pour un objet que trois boîtes décrivent aussi bien — et
 * ces mégaoctets se paient sur la 4G d'un chantier.
 *
 * Le mouvement est lent et continu. On tourne de quelques degrés, on ne fait
 * jamais tournoyer : l'objet doit avoir l'air posé, pas exposé sur un présentoir.
 *
 * Ce module n'est jamais dans le paquet de départ — il est importé à la demande,
 * et seulement quand l'appareil a de quoi le supporter.
 */

const TURQUOISE = '#4DD9D9'
// Un bleu un peu plus clair que l'ardoise du site : l'écran doit se détacher
// du corps de la tablette, sinon l'objet n'est qu'un rectangle uni.
const ECRAN = '#1E3450'
const NUIT = '#05070A'

/** Les lignes du devis qui se remplissent : c'est le sujet, pas la tablette. */
function LignesDeDevis({ progression }) {
  const groupe = useRef()
  const lignes = useMemo(() => [0.82, 0.64, 0.9, 0.55, 0.74, 0.42], [])

  useFrame(() => {
    if (!groupe.current) return
    groupe.current.children.forEach((ligne, i) => {
      // Chaque ligne apparaît à son tour, au rythme du défilement. Le seuil
      // décalé fait qu'on lit un devis qui se remplit, pas six barres qui
      // s'allument ensemble.
      const seuil = i / lignes.length
      // On part de 0.22 : a l'arret, l'ecran doit montrer un devis commence.
      // Vide, la tablette n'est qu'un rectangle noir et ne raconte rien.
      const avance = 0.22 + progression.current * 0.85
      const part = THREE.MathUtils.clamp((avance - seuil) * 3.2, 0, 1)
      ligne.scale.x = Math.max(0.001, part)
      // L'échelle part du bord gauche : sans ce recentrage, la barre grandirait
      // par le milieu et le devis aurait l'air de se déplier au lieu de s'écrire.
      ligne.position.x = -0.62 + (lignes[i] * part) / 2
      ligne.material.opacity = part
    })
  })

  return (
    <group ref={groupe} position={[0, 0.34, 0.031]}>
      {lignes.map((largeur, i) => (
        <mesh key={i} position={[0, -i * 0.15, 0]}>
          <planeGeometry args={[largeur, 0.045]} />
          <meshBasicMaterial
            color={i === 0 ? TURQUOISE : '#8FA7B8'}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function Tablette({ progression }) {
  const groupe = useRef()

  useFrame(({ clock }) => {
    if (!groupe.current) return
    const t = clock.getElapsedTime()
    // Une respiration très lente, plus une inclinaison qui suit le défilement.
    groupe.current.rotation.y = -0.42 + Math.sin(t * 0.22) * 0.05 + progression.current * 0.5
    groupe.current.rotation.x = 0.14 + Math.sin(t * 0.17) * 0.03
    groupe.current.position.y = Math.sin(t * 0.3) * 0.03
  })

  return (
    <group ref={groupe}>
      {/* Le corps */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 2.05, 0.055]} />
        <meshStandardMaterial color={NUIT} roughness={0.32} metalness={0.65} />
      </mesh>
      {/* L'écran, légèrement en avant pour éviter que les deux faces
          se disputent le même plan et papillotent. */}
      <mesh position={[0, 0, 0.029]}>
        <planeGeometry args={[1.38, 1.92]} />
        <meshBasicMaterial color={ECRAN} toneMapped={false} />
      </mesh>
      {/* Le filet turquoise de l'en-tête : la signature de la marque, jusqu'ici. */}
      <mesh position={[-0.52, 0.56, 0.031]}>
        <planeGeometry args={[0.3, 0.02]} />
        <meshBasicMaterial color={TURQUOISE} toneMapped={false} />
      </mesh>
      <LignesDeDevis progression={progression} />
      {/* Le total, en bas : la seule zone pleine de l'écran. */}
      <mesh position={[0.36, -0.66, 0.031]}>
        <planeGeometry args={[0.55, 0.1]} />
        <meshBasicMaterial color={TURQUOISE} transparent opacity={0.9} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function Scene3D({ progression }) {
  return (
    <Canvas
      // `alpha` : le dégradé du site reste le fond, la scène ne pose pas le sien.
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      // Plafonné à 2 : au-delà, on quadruple le nombre de pixels à calculer pour
      // une différence que personne ne voit, sur les écrans les plus denses,
      // c'est-à-dire les téléphones — ceux qui ont le moins de marge.
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4.6], fov: 38 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <directionalLight position={[-4, -1, 2]} intensity={0.5} color={TURQUOISE} />
      <Tablette progression={progression} />
    </Canvas>
  )
}
