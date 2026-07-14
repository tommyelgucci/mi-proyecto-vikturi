export const TOPICS = [
  { id: 'vortritt', label: { de: 'Vortritt', es: 'Prioridad' } },
  { id: 'kreisverkehr', label: { de: 'Kreisverkehr', es: 'Rotondas' } },
  { id: 'signale', label: { de: 'Signale', es: 'Señales' } },
  { id: 'geschwindigkeit', label: { de: 'Geschwindigkeit', es: 'Velocidad' } },
  { id: 'abstand', label: { de: 'Abstand', es: 'Distancia' } },
  { id: 'alkohol', label: { de: 'Alkohol & Drogen', es: 'Alcohol y drogas' } },
  { id: 'autobahn', label: { de: 'Autobahn', es: 'Autopista' } },
  { id: 'parkieren', label: { de: 'Parkieren', es: 'Estacionar' } },
  { id: 'umwelt', label: { de: 'Umwelt', es: 'Medio ambiente' } },
  { id: 'motorrad', label: { de: 'Motorrad', es: 'Moto' } },
]

export function topicLabel(topicId, lang) {
  const t = TOPICS.find((t) => t.id === topicId)
  return t ? t.label[lang] : topicId
}
