import { tr } from '../i18n'

export const TOPICS = [
  { id: 'vortritt', label: { de: 'Vortritt', es: 'Prioridad', fr: 'Priorité', it: 'Precedenza', en: 'Right of way' } },
  { id: 'einspuren', label: { de: 'Einspuren', es: 'Einspuren (posición de carril)', fr: 'Présélection (voie)', it: 'Preselezione (corsia)', en: 'Lane positioning' } },
  { id: 'kreisverkehr', label: { de: 'Kreisverkehr', es: 'Rotondas', fr: 'Giratoires', it: 'Rotatorie', en: 'Roundabouts' } },
  { id: 'signale', label: { de: 'Signale', es: 'Señales', fr: 'Signaux', it: 'Segnali', en: 'Signs' } },
  { id: 'geschwindigkeit', label: { de: 'Geschwindigkeit', es: 'Velocidad', fr: 'Vitesse', it: 'Velocità', en: 'Speed' } },
  { id: 'abstand', label: { de: 'Abstand', es: 'Distancia', fr: 'Distance', it: 'Distanza', en: 'Distance' } },
  { id: 'alkohol', label: { de: 'Fahrfähigkeit', es: 'Aptitud (alcohol, fatiga…)', fr: 'Aptitude (alcool, fatigue…)', it: 'Idoneità (alcol, stanchezza…)', en: 'Fitness to drive (alcohol, fatigue…)' } },
  { id: 'beleuchtung', label: { de: 'Beleuchtung', es: 'Luces', fr: 'Éclairage', it: 'Illuminazione', en: 'Lights' } },
  { id: 'ueberholen', label: { de: 'Überholen', es: 'Adelantar', fr: 'Dépassement', it: 'Sorpasso', en: 'Overtaking' } },
  { id: 'fussgaenger', label: { de: 'Fussgänger & Kinder', es: 'Peatones y niños', fr: 'Piétons et enfants', it: 'Pedoni e bambini', en: 'Pedestrians & children' } },
  { id: 'pannen', label: { de: 'Panne & Unfall', es: 'Averías y accidentes', fr: 'Panne et accident', it: 'Guasti e incidenti', en: 'Breakdowns & accidents' } },
  { id: 'fahrzeug', label: { de: 'Fahrzeug & Dokumente', es: 'Vehículo y documentos', fr: 'Véhicule et documents', it: 'Veicolo e documenti', en: 'Vehicle & documents' } },
  { id: 'autobahn', label: { de: 'Autobahn', es: 'Autopista', fr: 'Autoroute', it: 'Autostrada', en: 'Motorway' } },
  { id: 'parkieren', label: { de: 'Parkieren', es: 'Estacionar', fr: 'Stationnement', it: 'Parcheggio', en: 'Parking' } },
  { id: 'umwelt', label: { de: 'Umwelt', es: 'Medio ambiente', fr: 'Environnement', it: 'Ambiente', en: 'Environment' } },
  { id: 'motorrad', label: { de: 'Motorrad', es: 'Moto', fr: 'Moto', it: 'Moto', en: 'Motorcycle' } },
]

export function topicLabel(topicId, lang) {
  const t = TOPICS.find((t) => t.id === topicId)
  return t ? tr(t.label, lang) : topicId
}
