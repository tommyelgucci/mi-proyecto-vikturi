// Módulo Kontrollfahrt: preparación para el examen práctico de control
// que deben superar (en un solo intento) muchos titulares de licencias
// extranjeras al canjearlas por la suiza. Contenido 100% original.

export const KF_SECTIONS = [
  {
    id: 'was',
    icon: '🛂',
    title: {
      de: 'Was ist die Kontrollfahrt?',
      es: '¿Qué es la Kontrollfahrt?',
      fr: 'Qu’est-ce que la course de contrôle ?',
      it: 'Cos’è la corsa di controllo?',
      en: 'What is the control drive?',
    },
    bullets: [
      {
        de: 'Wer einen ausländischen Führerausweis umtauscht, muss je nach Herkunftsland eine Kontrollfahrt bestehen: eine praktische Prüfungsfahrt mit einem Verkehrsexperten.',
        es: 'Quien canjea una licencia extranjera debe, según su país de origen, superar una Kontrollfahrt: un examen práctico de conducción con un experto de tráfico.',
        fr: 'Qui échange un permis étranger doit, selon son pays d’origine, réussir une course de contrôle : un trajet d’examen pratique avec un expert de la circulation.',
        it: 'Chi cambia una licenza estera deve, a seconda del paese d’origine, superare una corsa di controllo: un percorso d’esame pratico con un esperto della circolazione.',
        en: 'Anyone exchanging a foreign licence must, depending on their country of origin, pass a control drive: a practical test drive with a traffic expert.',
      },
      {
        de: 'Der Umtausch muss innerhalb von 12 Monaten nach Wohnsitznahme in der Schweiz beantragt werden.',
        es: 'El canje debe solicitarse dentro de los 12 meses siguientes a establecer la residencia en Suiza.',
        fr: 'L’échange doit être demandé dans les 12 mois suivant la prise de domicile en Suisse.',
        it: 'Il cambio va richiesto entro 12 mesi dalla presa di domicilio in Svizzera.',
        en: 'The exchange must be applied for within 12 months of taking up residence in Switzerland.',
      },
      {
        de: 'Bürger der EU/EFTA-Staaten tauschen in der Regel ohne Prüfung um; für viele andere Länder ist die Kontrollfahrt obligatorisch. Massgebend ist die Praxis deines Kantons.',
        es: 'Los ciudadanos de países UE/AELC suelen canjear sin examen; para muchos otros países la Kontrollfahrt es obligatoria. Manda la práctica de tu cantón.',
        fr: 'Les citoyens des États UE/AELE échangent en général sans examen ; pour beaucoup d’autres pays, la course de contrôle est obligatoire. La pratique de ton canton fait foi.',
        it: 'I cittadini degli Stati UE/AELS di regola cambiano senza esame; per molti altri paesi la corsa di controllo è obbligatoria. Fa stato la prassi del tuo cantone.',
        en: 'Citizens of EU/EFTA states usually exchange without a test; for many other countries the control drive is mandatory. Your canton’s practice is decisive.',
      },
      {
        de: 'Es gibt keine vorgeschriebene Anzahl Fahrstunden – aber einige Stunden mit einer Fahrlehrperson, die die Schweizer Prüfungskriterien kennt, sind die beste Investition.',
        es: 'No hay un número de clases obligatorio, pero unas horas con un profesor que conozca los criterios suizos son la mejor inversión.',
        fr: 'Aucun nombre de leçons n’est prescrit – mais quelques heures avec un moniteur qui connaît les critères suisses sont le meilleur investissement.',
        it: 'Non c’è un numero di lezioni prescritto – ma qualche ora con un maestro che conosce i criteri svizzeri è il miglior investimento.',
        en: 'No set number of lessons is required – but a few hours with an instructor who knows the Swiss exam criteria are the best investment.',
      },
    ],
  },
  {
    id: 'einsatz',
    icon: '⚠️',
    title: {
      de: 'Nur EIN Versuch – was steht auf dem Spiel?',
      es: 'Solo UN intento: ¿qué está en juego?',
      fr: 'Un SEUL essai – quel est l’enjeu ?',
      it: 'Un SOLO tentativo – cosa c’è in gioco?',
      en: 'Only ONE attempt – what is at stake?',
    },
    bullets: [
      {
        de: 'Die Kontrollfahrt kann nicht wiederholt werden: Wer sie nicht besteht, verliert das Recht, mit dem ausländischen Ausweis in der Schweiz zu fahren.',
        es: 'La Kontrollfahrt no se puede repetir: quien no la supera pierde el derecho a conducir en Suiza con su licencia extranjera.',
        fr: 'La course de contrôle ne peut pas être répétée : en cas d’échec, tu perds le droit de conduire en Suisse avec ton permis étranger.',
        it: 'La corsa di controllo non si può ripetere: chi non la supera perde il diritto di guidare in Svizzera con la licenza estera.',
        en: 'The control drive cannot be repeated: if you fail, you lose the right to drive in Switzerland with your foreign licence.',
      },
      {
        de: 'Danach gilt der normale Schweizer Weg: Lernfahrausweis, Theorieprüfung und praktische Prüfung von Grund auf.',
        es: 'Después toca el camino suizo completo: permiso de aprendizaje, examen teórico y examen práctico desde cero.',
        fr: 'Ensuite, c’est le parcours suisse complet : permis d’élève, examen théorique et examen pratique depuis le début.',
        it: 'Dopo tocca il percorso svizzero completo: licenza per allievo, esame teorico ed esame pratico da capo.',
        en: 'After that, the full Swiss route applies: learner’s permit, theory exam and practical exam from scratch.',
      },
      {
        de: 'Darum: Nicht unvorbereitet antreten! Die Fahrweise, die in deinem Herkunftsland normal war, kann hier Fehlerpunkte geben.',
        es: 'Por eso: ¡no te presentes sin preparación! La forma de conducir normal en tu país puede puntuar como error aquí.',
        fr: 'Donc : ne te présente pas sans préparation ! La conduite normale dans ton pays d’origine peut compter comme faute ici.',
        it: 'Perciò: non presentarti impreparato! La guida normale nel tuo paese può contare come errore qui.',
        en: 'So: do not turn up unprepared! Driving habits that were normal in your home country can count as mistakes here.',
      },
      {
        de: 'Gute Nachricht: Die Kontrollfahrt ist kürzer als die volle Prüfung und verlangt keine Manöverprüfung – gefragt ist sichere, regelkonforme Fahrt im Verkehr.',
        es: 'La buena noticia: es más corta que el examen completo y no exige prueba de maniobras; lo que cuenta es conducir seguro y conforme a las reglas en el tráfico real.',
        fr: 'Bonne nouvelle : elle est plus courte que l’examen complet et n’exige pas d’épreuve de manœuvres – ce qui compte, c’est une conduite sûre et conforme aux règles.',
        it: 'Buona notizia: è più corta dell’esame completo e non richiede la prova di manovre – conta una guida sicura e conforme alle regole nel traffico.',
        en: 'Good news: it is shorter than the full exam and requires no manoeuvre test – what counts is safe, rule-compliant driving in traffic.',
      },
    ],
  },
  {
    id: 'ablauf',
    icon: '🗺️',
    title: {
      de: 'So läuft die Fahrt ab',
      es: 'Así transcurre el examen',
      fr: 'Déroulement de la course',
      it: 'Come si svolge la corsa',
      en: 'How the drive goes',
    },
    bullets: [
      {
        de: 'Dauer meist 30–60 Minuten, im Fahrzeug des Fahrschulunternehmens oder – je nach Kanton – im eigenen, verkehrssicheren Auto.',
        es: 'Suele durar 30–60 minutos, en el coche de la autoescuela o —según el cantón— en tu propio coche en buen estado.',
        fr: 'Durée en général 30–60 minutes, dans la voiture de l’auto-école ou – selon le canton – dans ta propre voiture en bon état.',
        it: 'Dura di solito 30–60 minuti, nell’auto della scuola guida o – secondo il cantone – nella tua auto in buono stato.',
        en: 'Usually 30–60 minutes, in a driving-school car or – depending on the canton – your own roadworthy car.',
      },
      {
        de: 'Der Experte gibt Anweisungen wie an der normalen Prüfung: abbiegen, einspuren, Kreisel, Autobahn, Innerortsverkehr, Tempo-30-Zonen.',
        es: 'El experto da órdenes como en el examen normal: girar, colocarse en el carril, rotondas, autopista, tráfico urbano, zonas 30.',
        fr: 'L’expert donne des instructions comme à l’examen normal : tourner, se présélectionner, giratoires, autoroute, trafic en ville, zones 30.',
        it: 'L’esperto dà istruzioni come all’esame normale: svoltare, preselezionarsi, rotatorie, autostrada, traffico urbano, zone 30.',
        en: 'The expert gives instructions as in the normal exam: turning, lane positioning, roundabouts, motorway, town traffic, 30 zones.',
      },
      {
        de: 'Bewertet wird wie bei der praktischen Prüfung: Blicktechnik, Vortritt, Geschwindigkeit, Spurführung, vorausschauendes und partnerschaftliches Fahren.',
        es: 'Se evalúa como en el práctico: técnica de mirada, prioridades, velocidad, trazada y conducción anticipada y considerada.',
        fr: 'L’évaluation est celle de l’examen pratique : technique du regard, priorités, vitesse, trajectoire, conduite anticipée et partenariale.',
        it: 'Si valuta come all’esame pratico: tecnica dello sguardo, precedenze, velocità, traiettoria, guida previdente e collaborativa.',
        en: 'Assessment is like the practical exam: observation technique, priority, speed, lane keeping, anticipatory and considerate driving.',
      },
      {
        de: 'Verstanden statt geraten: Wenn du eine Anweisung nicht verstehst, frag ruhig nach – das ist erlaubt und wirkt professionell.',
        es: 'Entender antes que adivinar: si no entiendes una orden, pregunta con calma; está permitido y da buena impresión.',
        fr: 'Comprendre plutôt que deviner : si tu ne comprends pas une instruction, redemande calmement – c’est permis et professionnel.',
        it: 'Capire invece di indovinare: se non capisci un’istruzione, richiedi con calma – è permesso e fa buona impressione.',
        en: 'Understand rather than guess: if you don’t understand an instruction, calmly ask again – it is allowed and looks professional.',
      },
    ],
  },
]

// Los errores que más suspenden a titulares de licencias extranjeras.
// topic → enlaza al modo estudio con ese filtro; maneuver → id en maneuvers.js
export const KF_MISTAKES = [
  {
    id: 'rechtsvortritt',
    icon: '➡️',
    topic: 'vortritt',
    title: { de: 'Rechtsvortritt übersehen', es: 'No respetar la prioridad de la derecha', fr: 'Priorité de droite manquée', it: 'Precedenza da destra ignorata', en: 'Missing priority to the right' },
    detail: {
      de: 'In Quartieren ohne Signale gilt IMMER Rechtsvortritt – auch wenn die Strasse von rechts klein aussieht. Der häufigste Durchfallgrund überhaupt.',
      es: 'En barrios sin señales rige SIEMPRE la prioridad de la derecha, aunque la calle de la derecha parezca pequeña. Es el motivo de suspenso más frecuente.',
      fr: 'Dans les quartiers sans signaux, la priorité de droite s’applique TOUJOURS – même si la rue de droite paraît petite. La cause d’échec la plus fréquente.',
      it: 'Nei quartieri senza segnali vale SEMPRE la precedenza da destra – anche se la strada a destra sembra piccola. Il motivo di bocciatura più frequente.',
      en: 'In residential areas without signs, priority to the right ALWAYS applies – even if the road from the right looks small. The most common reason for failing.',
    },
  },
  {
    id: 'kreisel',
    icon: '🔄',
    topic: 'kreisverkehr',
    title: { de: 'Kreisel: falsch blinken', es: 'Rotondas: intermitentes mal usados', fr: 'Giratoire : clignotants mal utilisés', it: 'Rotatoria: frecce usate male', en: 'Roundabouts: wrong indicating' },
    detail: {
      de: 'Beim Einfahren nie links blinken; beim Verlassen immer rechts. 1. Ausfahrt: rechts blinken schon vor der Einfahrt. Velos im Kreisel nie überholen.',
      es: 'Al entrar nunca intermitente izquierdo; al salir siempre derecho. 1.ª salida: derecho ya antes de entrar. Nunca adelantes a bicis dentro.',
      fr: 'En entrant, jamais le clignotant gauche ; en sortant, toujours à droite. 1re sortie : à droite déjà avant d’entrer. Jamais dépasser un vélo dedans.',
      it: 'Entrando mai freccia a sinistra; uscendo sempre a destra. 1ª uscita: destra già prima di entrare. Mai sorpassare bici dentro.',
      en: 'Never indicate left when entering; always right when leaving. 1st exit: indicate right before entering. Never overtake bikes inside.',
    },
  },
  {
    id: 'blick',
    icon: '👀',
    title: { de: 'Sicherheitsblick nicht sichtbar', es: 'Mirada de seguridad invisible', fr: 'Contrôle épaule invisible', it: 'Controllo spalla invisibile', en: 'Shoulder check not visible' },
    detail: {
      de: 'Der Experte muss deine Kopfbewegung SEHEN: Schulterblick vor jedem Spurwechsel, Abbiegen, Anfahren und an der Kreiselausfahrt. Nur Spiegel genügt nicht.',
      es: 'El experto debe VER tu movimiento de cabeza: mirada por encima del hombro antes de cada cambio de carril, giro, arranque y al salir de la rotonda. Solo el espejo no basta.',
      fr: 'L’expert doit VOIR ton mouvement de tête : contrôle épaule avant chaque changement de voie, virage, démarrage et sortie de giratoire. Le rétroviseur seul ne suffit pas.',
      it: 'L’esperto deve VEDERE il movimento della testa: controllo spalla prima di ogni cambio di corsia, svolta, partenza e all’uscita della rotatoria. Lo specchietto da solo non basta.',
      en: 'The expert must SEE your head movement: shoulder check before every lane change, turn, pull-away and at the roundabout exit. Mirrors alone are not enough.',
    },
  },
  {
    id: 'fussgaenger',
    icon: '🚶',
    topic: 'fussgaenger',
    title: { de: 'Fussgängerstreifen zu forsch', es: 'Pasos de peatones sin respeto', fr: 'Passages piétons pris trop vite', it: 'Passaggi pedonali presi troppo veloci', en: 'Too pushy at pedestrian crossings' },
    detail: {
      de: 'Anhalten, sobald jemand erkennbar queren WILL – nicht erst, wenn er auf der Strasse steht. Vor Streifen nie überholen, bremsbereit anfahren.',
      es: 'Detente en cuanto alguien MUESTRE que quiere cruzar, no cuando ya esté en la calzada. Nunca adelantes antes del paso; llega listo para frenar.',
      fr: 'S’arrêter dès que quelqu’un VEUT manifestement traverser – pas seulement quand il est sur la chaussée. Jamais dépasser avant un passage ; arriver prêt à freiner.',
      it: 'Fermarsi appena qualcuno VUOLE visibilmente attraversare – non solo quando è già sulla carreggiata. Mai sorpassare prima delle strisce; arrivare pronti a frenare.',
      en: 'Stop as soon as someone clearly WANTS to cross – not only once they are on the road. Never overtake before a crossing; approach ready to brake.',
    },
  },
  {
    id: 'tempo',
    icon: '🚦',
    topic: 'geschwindigkeit',
    title: { de: 'Tempo: zu schnell UND zu langsam', es: 'Velocidad: ni rápido NI lento de más', fr: 'Vitesse : ni trop vite NI trop lent', it: 'Velocità: né troppo veloce NÉ troppo lento', en: 'Speed: neither too fast NOR too slow' },
    detail: {
      de: 'Limiten einhalten (30er-Zonen!), aber auch flüssig fahren: Unsicheres Schleichen gilt als Verkehrsbehinderung und kostet ebenfalls Punkte.',
      es: 'Respeta los límites (¡zonas 30!), pero circula fluido: ir demasiado lento e inseguro cuenta como obstaculizar el tráfico y también resta.',
      fr: 'Respecter les limites (zones 30 !), mais rouler avec fluidité : se traîner de façon hésitante compte comme entrave à la circulation et coûte aussi des points.',
      it: 'Rispetta i limiti (zone 30!), ma guida fluido: strisciare insicuri conta come intralcio al traffico e costa punti anche quello.',
      en: 'Keep to the limits (30 zones!), but drive fluently: creeping along insecurely counts as obstructing traffic and also costs points.',
    },
  },
  {
    id: 'tram',
    icon: '🚊',
    topic: 'vortritt',
    title: { de: 'Tram & Bus falsch behandelt', es: 'Tranvías y buses mal gestionados', fr: 'Trams et bus mal gérés', it: 'Tram e bus gestiti male', en: 'Trams & buses handled wrongly' },
    detail: {
      de: 'Tram hat grundsätzlich Vortritt (auch von links). Hält ein Tram ohne Schutzinsel: warten, bis die Fahrgäste in Sicherheit sind. Bussen innerorts das Wegfahren ermöglichen.',
      es: 'El tranvía tiene prioridad por norma (incluso desde la izquierda). Si para sin isleta: espera a que los pasajeros estén a salvo. En ciudad, deja salir a los buses de la parada.',
      fr: 'Le tram a en principe la priorité (même venant de gauche). S’il s’arrête sans îlot : attendre que les passagers soient en sécurité. En localité, laisser repartir les bus.',
      it: 'Il tram ha di norma la precedenza (anche da sinistra). Se ferma senza isola: aspettare che i passeggeri siano al sicuro. Nei centri abitati lasciar ripartire i bus.',
      en: 'Trams generally have priority (even from the left). If a tram stops without an island: wait until passengers are safe. In town, let buses pull out.',
    },
  },
  {
    id: 'einspuren',
    icon: '↔️',
    topic: 'einspuren',
    maneuver: 'links_abbiegen_einspuren',
    title: { de: 'Einspuren vergessen', es: 'No colocarse en el carril (Einspuren)', fr: 'Présélection oubliée', it: 'Preselezione dimenticata', en: 'Forgetting lane positioning' },
    detail: {
      de: 'Vor dem Linksabbiegen an die Mittellinie rücken, vor dem Rechtsabbiegen an den rechten Rand. Einspurpfeile sind verbindlich – in der Verzweigung nie die Spur wechseln.',
      es: 'Antes de girar a la izquierda, pégate a la línea central; antes de girar a la derecha, al borde derecho. Las flechas de carril son vinculantes: nunca cambies de carril dentro del cruce.',
      fr: 'Avant de tourner à gauche, se rapprocher de la ligne médiane ; avant de tourner à droite, du bord droit. Les flèches sont contraignantes – jamais changer de voie dans l’intersection.',
      it: 'Prima di svoltare a sinistra avvicinati alla linea mediana; prima di svoltare a destra al bordo destro. Le frecce sono vincolanti – mai cambiare corsia nell’intersezione.',
      en: 'Before turning left, move to the centre line; before turning right, to the right edge. Lane arrows are binding – never change lanes inside the junction.',
    },
  },
  {
    id: 'sicherheitslinie',
    icon: '⛔',
    topic: 'signale',
    title: { de: 'Sicherheitslinie touchiert', es: 'Pisar la línea de seguridad', fr: 'Ligne de sécurité touchée', it: 'Linea di sicurezza toccata', en: 'Touching the safety line' },
    detail: {
      de: 'Die weisse durchgezogene Linie darf weder überfahren noch überquert werden – auch nicht «nur kurz» beim Vorbeifahren an einem parkierten Auto.',
      es: 'La línea blanca continua no se pisa ni se cruza, tampoco «solo un momento» para esquivar un coche aparcado.',
      fr: 'La ligne blanche continue ne doit être ni chevauchée ni franchie – pas même « juste un instant » pour contourner une voiture parquée.',
      it: 'La linea bianca continua non va né toccata né attraversata – nemmeno «solo un attimo» per aggirare un’auto parcheggiata.',
      en: 'The solid white line may be neither driven on nor crossed – not even "just briefly" to pass a parked car.',
    },
  },
  {
    id: 'abstand',
    icon: '📏',
    topic: 'abstand',
    maneuver: 'abstand_2sekunden',
    title: { de: 'Zu wenig Abstand', es: 'Distancia insuficiente', fr: 'Distance insuffisante', it: 'Distanza insufficiente', en: 'Too little distance' },
    detail: {
      de: 'Mindestens 2 Sekunden zum Vordermann («halber Tacho»), seitlich ca. 1,5 m zu Velos. Bei Nässe mehr – der Experte achtet konsequent darauf.',
      es: 'Mínimo 2 segundos con el de delante («medio velocímetro»), y ~1,5 m lateral con las bicis. Con lluvia, más: el experto lo vigila siempre.',
      fr: 'Au moins 2 secondes avec le véhicule devant (« demi-compteur »), env. 1,5 m latéralement avec les vélos. Par pluie, davantage – l’expert y veille systématiquement.',
      it: 'Almeno 2 secondi da chi precede («mezzo tachimetro»), circa 1,5 m laterali dalle bici. Con pioggia di più – l’esperto ci fa sempre attenzione.',
      en: 'At least 2 seconds from the car ahead ("half your speedo"), about 1.5 m laterally from bikes. More in the wet – the expert watches this closely.',
    },
  },
  {
    id: 'autobahn',
    icon: '🛣️',
    topic: 'autobahn',
    title: { de: 'Autobahn: zögerlich einfahren', es: 'Autopista: incorporación dubitativa', fr: 'Autoroute : insertion hésitante', it: 'Autostrada: immissione esitante', en: 'Motorway: hesitant merging' },
    detail: {
      de: 'Auf dem Beschleunigungsstreifen zügig auf Verkehrstempo beschleunigen und in eine Lücke einfädeln – am Ende anhalten ist ein schwerer Fehler. Rechts fahren, links überholen.',
      es: 'En el carril de aceleración, acelera con decisión al ritmo del tráfico y entra en un hueco; pararte al final es un error grave. Circula por la derecha, adelanta por la izquierda.',
      fr: 'Sur la voie d’accélération, accélérer franchement au rythme du trafic et s’insérer dans un créneau – s’arrêter au bout est une faute grave. Rouler à droite, dépasser à gauche.',
      it: 'Sulla corsia di accelerazione accelera deciso al ritmo del traffico e inseriti in un varco – fermarsi alla fine è un errore grave. Guida a destra, sorpassa a sinistra.',
      en: 'On the slip road, accelerate briskly to traffic speed and merge into a gap – stopping at the end is a serious mistake. Keep right, overtake left.',
    },
  },
  {
    id: 'zonen',
    icon: '🏘️',
    topic: 'signale',
    title: { de: 'Zonen nicht erkannt (30 / Begegnung)', es: 'No reconocer las zonas (30 / encuentro)', fr: 'Zones non reconnues (30 / rencontre)', it: 'Zone non riconosciute (30 / incontro)', en: 'Zones not recognised (30 / encounter)' },
    detail: {
      de: 'Tempo-30-Zone: 30 km/h und meist Rechtsvortritt. Begegnungszone: 20 km/h und Fussgänger haben überall Vortritt. Die Zonentafeln gelten bis zum Ende-Signal.',
      es: 'Zona 30: 30 km/h y normalmente prioridad de la derecha. Zona de encuentro: 20 km/h y peatones con prioridad en toda la superficie. Las placas valen hasta la señal de fin.',
      fr: 'Zone 30 : 30 km/h et le plus souvent priorité de droite. Zone de rencontre : 20 km/h et piétons prioritaires partout. Les panneaux valent jusqu’au signal de fin.',
      it: 'Zona 30: 30 km/h e di solito precedenza da destra. Zona d’incontro: 20 km/h e pedoni con precedenza ovunque. I cartelli valgono fino al segnale di fine.',
      en: 'Zone 30: 30 km/h and usually priority to the right. Encounter zone: 20 km/h and pedestrians have priority everywhere. Zone signs apply until the end sign.',
    },
  },
  {
    id: 'rueckwaerts',
    icon: '↩️',
    maneuver: 'laengere_strecke_rueckwaerts',
    title: { de: 'Rückwärtsfahren ohne Blicktechnik', es: 'Marcha atrás sin técnica de mirada', fr: 'Marche arrière sans technique du regard', it: 'Retromarcia senza tecnica dello sguardo', en: 'Reversing without proper observation' },
    detail: {
      de: 'Auch wenn keine Manöverprüfung verlangt ist: Ein kurzes Rückwärtsfahren oder Parkieren kann vorkommen. Oberkörper drehen, durch die Heckscheibe schauen, Schritttempo.',
      es: 'Aunque no haya prueba de maniobras, puede caer una marcha atrás corta o aparcar. Gira el torso, mira por la luneta trasera y ve a paso de peatón.',
      fr: 'Même sans épreuve de manœuvres, une courte marche arrière ou un stationnement peut arriver. Tourner le buste, regarder par la lunette, allure au pas.',
      it: 'Anche senza prova di manovre, può capitare una breve retromarcia o un parcheggio. Gira il busto, guarda dal lunotto, passo d’uomo.',
      en: 'Even without a manoeuvre test, a short reverse or parking task can come up. Turn your body, look through the rear window, walking pace.',
    },
  },
]

export const KF_CHECKLIST = [
  { id: 'k1', text: { de: 'Einige Fahrstunden mit Schweizer Fahrlehrperson gemacht (Prüfungsrouten!)', es: 'He hecho algunas clases con un profesor suizo (¡rutas de examen!)', fr: 'Quelques leçons prises avec un moniteur suisse (parcours d’examen !)', it: 'Fatte alcune lezioni con un maestro svizzero (percorsi d’esame!)', en: 'Took a few lessons with a Swiss instructor (exam routes!)' } },
  { id: 'k2', text: { de: 'Rechtsvortritt, Kreisel und Fussgängerstreifen sitzen automatisch', es: 'Prioridad de la derecha, rotondas y pasos de peatones salen automáticos', fr: 'Priorité de droite, giratoires et passages piétons sont devenus automatiques', it: 'Precedenza da destra, rotatorie e passaggi pedonali sono automatici', en: 'Priority to the right, roundabouts and crossings are automatic' } },
  { id: 'k3', text: { de: 'Sicherheitsblick trainiert – deutlich sichtbare Kopfbewegung', es: 'Mirada de seguridad entrenada, con movimiento de cabeza bien visible', fr: 'Contrôle épaule entraîné – mouvement de tête bien visible', it: 'Controllo spalla allenato – movimento della testa ben visibile', en: 'Shoulder check trained – clearly visible head movement' } },
  { id: 'k4', text: { de: 'Sitz, Spiegel, Gurt: Einstellung vor der Abfahrt gehört zur Prüfung', es: 'Asiento, espejos, cinturón: el ajuste antes de salir es parte del examen', fr: 'Siège, rétroviseurs, ceinture : le réglage avant de partir fait partie de l’examen', it: 'Sedile, specchietti, cintura: la regolazione prima di partire fa parte dell’esame', en: 'Seat, mirrors, belt: adjusting before setting off is part of the exam' } },
  { id: 'k5', text: { de: 'Ausweis, Aufgebot und (falls eigenes Auto) Fahrzeugausweis dabei', es: 'Llevo la licencia, la convocatoria y (si es mi coche) el permiso de circulación', fr: 'Permis, convocation et (si voiture propre) permis de circulation sur moi', it: 'Licenza, convocazione e (se auto propria) licenza di circolazione con me', en: 'Licence, invitation and (if own car) registration document with me' } },
  { id: 'k6', text: { de: 'Anweisungen auf Deutsch/Französisch/Italienisch verstanden oder Dolmetscher-Frage vorab geklärt', es: 'Entiendo las órdenes en alemán/francés/italiano o he aclarado antes el tema del intérprete', fr: 'Je comprends les instructions en allemand/français/italien ou la question de l’interprète est réglée', it: 'Capisco le istruzioni in tedesco/francese/italiano o ho chiarito prima la questione dell’interprete', en: 'I understand instructions in German/French/Italian or clarified the interpreter question beforehand' } },
  { id: 'k7', text: { de: 'Gut geschlafen, nüchtern, Handy aus', es: 'He dormido bien, voy sereno y con el móvil apagado', fr: 'Bien dormi, à jeun, téléphone éteint', it: 'Dormito bene, sobrio, telefono spento', en: 'Well rested, sober, phone off' } },
  { id: 'k8', text: { de: 'Plan B bekannt: Was passiert bei Nichtbestehen (Schweizer Ausbildung ab Theorie)', es: 'Conozco el plan B: qué pasa si suspendo (formación suiza desde la teoría)', fr: 'Plan B connu : ce qui se passe en cas d’échec (formation suisse depuis la théorie)', it: 'Piano B noto: cosa succede se non passo (formazione svizzera dalla teoria)', en: 'Plan B known: what happens if I fail (Swiss training from theory onwards)' } },
]

export const KF_LINKS = [
  {
    url: 'https://www.ch.ch/de/fuehrerausweis-auslaendische/',
    label: {
      de: 'ch.ch – Ausländischen Führerausweis umtauschen',
      es: 'ch.ch – Canjear la licencia de conducir extranjera',
      fr: 'ch.ch – Échanger un permis de conduire étranger',
      it: 'ch.ch – Cambiare la licenza di condurre estera',
      en: 'ch.ch – Exchanging a foreign driving licence',
    },
  },
  {
    url: 'https://www.strassenverkehrsamt.ch/',
    label: {
      de: 'Adressen der kantonalen Strassenverkehrsämter',
      es: 'Direcciones de las oficinas de tráfico cantonales',
      fr: 'Adresses des services cantonaux des automobiles',
      it: 'Indirizzi degli uffici cantonali della circolazione',
      en: 'Addresses of the cantonal road traffic offices',
    },
  },
]
