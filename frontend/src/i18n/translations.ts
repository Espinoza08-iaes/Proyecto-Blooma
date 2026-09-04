export type SupportedLanguage = 'es' | 'miskito' | 'creole';

export interface TranslationDictionary {
  // Navigation & General
  nav: {
    dashboard: string;
    symptoms: string;
    history: string;
    calendar: string;
    settings: string;
    today: string;
    save: string;
    cancel: string;
    close: string;
    loading: string;
    offlineMode: string;
    monthView: string;
    yearView: string;
    day: string;
    edit: string;
    back: string;
    next: string;
    finish: string;
  };

  // Language selector labels
  langNames: {
    es: string;
    miskito: string;
    creole: string;
  };

  // Profile Settings Drawer
  settings: {
    title: string;
    userTitle: string;
    privateMode: string;
    linkedAccount: string;
    customAvatar: string;
    changeAvatar: string;
    languageSectionTitle: string;
    languageSectionDesc: string;
    locationSectionTitle: string;
    locationSectionDesc: string;
    getGpsBtn: string;
    detectingGps: string;
    departmentLabel: string;
    municipalityLabel: string;
    avatarCollectionTitle: string;
    cloudBackupTitle: string;
    cloudBackupDesc: string;
    emailLabel: string;
    passwordLabel: string;
    linkAccountBtn: string;
    stageGoalTitle: string;
    stageGoalDesc: string;
    cycleStageName: string;
    cycleStageDesc: string;
    conceptionStageName: string;
    conceptionStageDesc: string;
    pregnancyStageName: string;
    pregnancyStageDesc: string;
    menopauseStageName: string;
    menopauseStageDesc: string;
    securityTitle: string;
    securityDesc: string;
    noPinDirect: string;
    withPinOption: string;
    enablePinLabel: string;
    pinCodeLabel: string;
    discreetModeTitle: string;
    discreetModeDesc: string;
    discreetActive: string;
    discreetInactive: string;
    climactericSectionTitle: string;
    climactericSectionDesc: string;
    logoSectionTitle: string;
    logoSectionDesc: string;
    smartwatchOption: string;
    smartwatchSub: string;
    discreetModeOption: string;
    minsaSupportOption: string;
    minsaSupportBtn: string;
    resetAppTitle: string;
    resetAppDesc: string;
    resetAppBtn: string;
  };

  // Dashboards & Common Features
  dashboards: {
    cycleHeroStatus: string;
    fertileWindowStatus: string;
    ovulationDayStatus: string;
    periodStatus: string;
    lutealPhaseStatus: string;
    follicularPhaseStatus: string;
    confidenceScore: string;
    hormoneSimulatorTitle: string;
    estrogenCurve: string;
    progesteroneCurve: string;
    dayCountLabel: string;
    nextPeriodIn: string;
    wearableSyncTitle: string;
    wearableSyncDesc: string;
    syncWearableBtn: string;
    pregnancyWeekBadge: string;
    trimester1: string;
    trimester2: string;
    trimester3: string;
    kickCounterTitle: string;
    contractionTimerTitle: string;
    hospitalBagTitle: string;
    triageObstetricTitle: string;
    doctorReportTitle: string;
    conceptionPlannerTitle: string;
    chancesHigh: string;
    chancesPeak: string;
    chancesLow: string;
    delayedTitle: string;
    delayedDaysLabel: string;
    delayedSub: string;
    logPeriodAction: string;
    editPeriodDatesAction: string;
    gestationDialTitle: string;
    trimesterDial: string;
    hotFlashesDialTitle: string;
    cycleLengthCardTitle: string;
    periodLengthCardTitle: string;
    daysUnit: string;
    normalBadge: string;
    regularBadge: string;
    medGuidelineTitle: string;
    doctorReportCardTitle: string;
    doctorReportCardSub: string;
    exportButton: string;
    babyKicksBtn: string;
    hotFlashesBtn: string;
    logSymptomsBtn: string;
    wearableBtn: string;
    ageLabel: string;
    yearsUnit: string;
    notSpecified: string;
    stageSummaryTitle: string;
    dailyTipTitle: string;
    dailyTipDesc: string;
    minsaLineTitle: string;
    minsaMaternalLine: string;
    navHoy: string;
    navRegistrar: string;
    navBitacora: string;
  };

  // Obstetric Emergency & Danger Signs
  obstetricAlerts: {
    maternalHouse: string;
    maternalHouseSub: string;
    week32Notice: string;
    week32Desc: string;
    callMaternalHouse: string;
    dangerSignsTitle: string;
    dangerSignsSubtitle: string;
    dangerBleeding: string;
    dangerBleedingDesc: string;
    dangerHeadache: string;
    dangerHeadacheDesc: string;
    dangerFever: string;
    dangerFeverDesc: string;
    dangerBabyMovement: string;
    dangerBabyMovementDesc: string;
    dangerWaterLeak: string;
    dangerWaterLeakDesc: string;
    dangerSeizures: string;
    dangerSeizuresDesc: string;
    immediateAction: string;
  };

  // Institutional Support Directory
  supportDirectory: {
    title: string;
    subtitle: string;
    bannerText: string;
    policeLine: string;
    policeDesc: string;
    ambulanceLine: string;
    ambulanceDesc: string;
    familyLine: string;
    familyDesc: string;
    callAction: string;
    nearbyFacilitiesTitle: string;
    nearbyFacilitiesSubtitle: string;
  };

  // Climacteric & Menopause
  menopause: {
    title: string;
    stagesTitle: string;
    premenopause: string;
    earlyPerimenopause: string;
    latePerimenopause: string;
    menopauseMilestone: string;
    postmenopause: string;
    thermalComfort: string;
    hotFlashesLogged: string;
    comfortScore: string;
    mrsAssessmentTitle: string;
    mrsAssessmentDesc: string;
    startMrsTest: string;
    tccTitle: string;
    boneHealthTitle: string;
    kegelTracker: string;
  };

  // Onboarding Flow
  onboarding: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    chooseLanguageTitle: string;
    chooseLanguageSubtitle: string;
    chooseGoalTitle: string;
    chooseGoalSubtitle: string;
    territoryTitle: string;
    territorySubtitle: string;
    securitySetupTitle: string;
    securitySetupSubtitle: string;
    startAppBtn: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  es: {
    nav: {
      dashboard: 'Panel Principal',
      symptoms: 'Registrar Síntomas',
      history: 'Historial Clínico',
      calendar: 'Calendario',
      settings: 'Ajustes de Perfil',
      today: 'Hoy',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      loading: 'Cargando Blooma...',
      offlineMode: 'Modo Local-First Desconectado',
      monthView: 'Mes',
      yearView: 'Año',
      day: 'Día',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      finish: 'Finalizar'
    },
    langNames: {
      es: 'Español (Nicaragua)',
      miskito: 'Miskitu (RACCN)',
      creole: 'Creole English (RACCS)'
    },
    settings: {
      title: 'Ajustes de Perfil',
      userTitle: 'Usuario de Blooma',
      privateMode: 'Modo Privado Off-grid (Local-First)',
      linkedAccount: 'Cuenta Vinculada',
      customAvatar: 'Cargar Foto de Perfil Personalizada',
      changeAvatar: 'Cambiar',
      languageSectionTitle: 'Lengua e Inclusión Territorial (Nicaragua)',
      languageSectionDesc: 'Adapta la interfaz y las alertas de emergencia obstétricas a tu lengua originaria o comunitaria:',
      locationSectionTitle: 'Ubicación Territorial y Red MINSA',
      locationSectionDesc: 'Permite a Blooma calcular de forma 100% desconectada la distancia exacta a las Casas Maternas y Hospitales con quirófano más cercanos a tu comunidad.',
      getGpsBtn: 'Obtener GPS',
      detectingGps: 'Detectando coordenadas...',
      departmentLabel: 'Departamento / Región:',
      municipalityLabel: 'Municipio de Residencia:',
      avatarCollectionTitle: 'Colección de Iconos de Perfil Predefinidos:',
      cloudBackupTitle: 'Vincular Cuenta (Respaldo en Nube)',
      cloudBackupDesc: 'Vincula un correo y contraseña para respaldar de forma cifrada tus ciclos en Supabase o continúa disfrutando del almacenamiento 100% privado en tu dispositivo.',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña (mínimo 6 caracteres)',
      linkAccountBtn: 'Registrar / Vincular Cuenta',
      stageGoalTitle: 'Mi Objetivo Principal',
      stageGoalDesc: 'Selecciona tu etapa actual para personalizar los algoritmos de predicción y las herramientas clínicas:',
      cycleStageName: 'Seguir mi ciclo',
      cycleStageDesc: 'Monitoreo de periodo y predicciones habituales.',
      conceptionStageName: 'Planificar embarazo',
      conceptionStageDesc: 'Ventana fértil, ovulación e indicadores de concepción.',
      pregnancyStageName: 'Monitorear embarazo',
      pregnancyStageDesc: 'Semanas gestacionales y triaje obstétrico MINSA.',
      menopauseStageName: 'Gestionar menopausia',
      menopauseStageDesc: 'Sofocos, TCC, evaluación MRS y confort térmico.',
      securityTitle: 'Modo de Acceso a la Aplicación',
      securityDesc: 'Decide si deseas solicitar un PIN / Contraseña de acceso cada vez que se abra la app o permitir entrada directa sin contraseña.',
      noPinDirect: 'Sin Contraseña (Entrada Directa)',
      withPinOption: 'Con PIN / Contraseña de 4 dígitos',
      enablePinLabel: 'Habilitar Bloqueo por PIN al Iniciar',
      pinCodeLabel: 'Código PIN (4 dígitos):',
      discreetModeTitle: 'Modo Discreto (Privacidad & IPV)',
      discreetModeDesc: 'Camufla los términos explícitos en pantalla para resguardar tu intimidad.',
      discreetActive: 'Modo Discreto Activo',
      discreetInactive: 'Modo Normal Explícito',
      climactericSectionTitle: 'Fase Específica del Climaterio (STRAW+10 / MINSA)',
      climactericSectionDesc: 'Selecciona tu fase actual para personalizar los consejos médicos y pautas de autocuidado:',
      logoSectionTitle: 'Identificador y Logo de la Aplicación',
      logoSectionDesc: 'Personaliza el isotipo de Blooma mostrado en la aplicación:',
      smartwatchOption: 'Reloj y Anillo Inteligente',
      smartwatchSub: 'Android Health Connect, Apple HealthKit o BLE',
      discreetModeOption: 'Modo discreto (Ocultar términos explícitos)',
      minsaSupportOption: 'Ayuda y Soporte Clínico MINSA',
      minsaSupportBtn: 'Ayuda y Soporte Clínico MINSA',
      resetAppTitle: 'Zona de Peligro: Reiniciar Datos',
      resetAppDesc: 'Borra todos los ciclos, síntomas y configuraciones de forma irreversible en este dispositivo.',
      resetAppBtn: 'Reiniciar aplicación y datos locales'
    },
    dashboards: {
      cycleHeroStatus: 'Día del Ciclo',
      fertileWindowStatus: 'Ventana Fértil Abierta',
      ovulationDayStatus: 'Día Estimado de Ovulación',
      periodStatus: 'Fase de Menstruación Activa',
      lutealPhaseStatus: 'Fase Lútea en Progreso',
      follicularPhaseStatus: 'Fase Folicular',
      confidenceScore: 'Confianza Algorítmica',
      hormoneSimulatorTitle: 'Simulador Hormonal Fisiológico',
      estrogenCurve: 'Estrógeno (Estradiol)',
      progesteroneCurve: 'Progesterona',
      dayCountLabel: 'Día del Ciclo',
      nextPeriodIn: 'Próximo periodo estimado en',
      wearableSyncTitle: 'Sincronización Biométrica Wearable',
      wearableSyncDesc: 'Lectura continua de temperatura basal y HRV para precisión ovulatoria.',
      syncWearableBtn: 'Sincronizar Reloj / Anillo',
      pregnancyWeekBadge: 'Semana de Gestación',
      trimester1: 'Primer Trimestre',
      trimester2: 'Segundo Trimestre',
      trimester3: 'Tercer Trimestre',
      kickCounterTitle: 'Contador de Movimientos Fetales',
      contractionTimerTitle: 'Cronómetro de Contracciones',
      hospitalBagTitle: 'Maleta para Casa Materna / Hospital',
      triageObstetricTitle: 'Triaje Obstétrico MINSA (Norma 011)',
      doctorReportTitle: 'Generar Reporte Clínico en PDF',
      conceptionPlannerTitle: 'Planificador y Pronóstico de Fertilidad',
      chancesHigh: 'Probabilidad Alta',
      chancesPeak: 'Probabilidad Máxima (Pico LH)',
      chancesLow: 'Probabilidad Baja',
      delayedTitle: 'Modo Retraso Sereno',
      delayedDaysLabel: 'Retraso de',
      delayedSub: 'Ciclo actual acumulado: {days} días. La variabilidad es normal.',
      logPeriodAction: 'Registrar periodo',
      editPeriodDatesAction: 'Editar fechas de periodo',
      gestationDialTitle: 'Semana',
      trimesterDial: 'Trimestre',
      hotFlashesDialTitle: 'Sofocos Hoy',
      cycleLengthCardTitle: 'Duración del Ciclo',
      periodLengthCardTitle: 'Duración del Sangrado',
      daysUnit: 'días',
      normalBadge: 'NORMAL',
      regularBadge: 'REGULAR',
      medGuidelineTitle: 'Según guías clínicas del MINSA y OMS',
      doctorReportCardTitle: 'Reporte Médico Resumido',
      doctorReportCardSub: 'Genera un PDF con tus datos para tu ginecóloga.',
      exportButton: 'Exportar',
      babyKicksBtn: 'Pataditas',
      hotFlashesBtn: 'Sofocos',
      logSymptomsBtn: 'Síntomas',
      wearableBtn: 'Reloj / Anillo',
      ageLabel: 'Edad:',
      yearsUnit: 'años',
      notSpecified: 'No especificada',
      stageSummaryTitle: 'Resumen de Etapa',
      dailyTipTitle: 'Consejo del Día',
      dailyTipDesc: 'Beber suficiente agua y caminar 30 minutos al día ayuda a regular el balance hormonal.',
      minsaLineTitle: 'Línea de Asistencia MINSA',
      minsaMaternalLine: 'Línea Materna MINSA (102)',
      navHoy: 'Hoy',
      navRegistrar: 'Registrar',
      navBitacora: 'Bitácora'
    },
    obstetricAlerts: {
      maternalHouse: 'Casa Materna MINSA',
      maternalHouseSub: 'Red Nacional de Parto Seguro',
      week32Notice: 'Alerta Preventiva — Semana 32 de Gestación',
      week32Desc: 'Por residir en zona rural o alejada, el MINSA te recomienda acudir a tu Casa Materna asignada para garantizar un parto seguro y asistido.',
      callMaternalHouse: 'Llamar a Casa Materna',
      dangerSignsTitle: 'Señales de Peligro en el Embarazo',
      dangerSignsSubtitle: 'Si presentas uno de estos signos, acude de inmediato al centro de salud o Casa Materna más cercana:',
      dangerBleeding: 'Sangrado Vaginal',
      dangerBleedingDesc: 'Cualquier pérdida de sangre, abundante o en manchas.',
      dangerHeadache: 'Dolor de Cabeza Intenso y Zumbidos',
      dangerHeadacheDesc: 'Dolor fuerte en la frente o nuca, ver lucecitas o zumbidos en los oídos.',
      dangerFever: 'Fiebre y Escalofríos',
      dangerFeverDesc: 'Cuerpo caliente o temblores intensos.',
      dangerBabyMovement: 'Falta de Movimiento del Bebé',
      dangerBabyMovementDesc: 'El bebé no se mueve o sus pataditas disminuyen notablemente.',
      dangerWaterLeak: 'Salida de Líquido por la Vagina',
      dangerWaterLeakDesc: 'Ruptura prematura de fuente antes de tiempo.',
      dangerSeizures: 'Convulsiones o Hinchazón Severa',
      dangerSeizuresDesc: 'Ataques, cara o manos sumamente hinchadas (posible preeclampsia).',
      immediateAction: 'Acudir Inmediatamente al Puesto de Salud'
    },
    supportDirectory: {
      title: 'Directorio de Asistencia y Derechos',
      subtitle: 'Red Institucional de Protección y Salud Femenina',
      bannerText: 'Líneas gratuitas y confidenciales activas 24/7 en toda Nicaragua para orientación clínica, acompañamiento en salud y resguardo de tus derechos.',
      policeLine: 'Policía Nacional / Comisarías de la Mujer (118)',
      policeDesc: 'Atención ante situaciones de riesgo, auxilio inmediato y recepción de denuncias.',
      ambulanceLine: 'Emergencias Médicas y Ambulancias MINSA (102)',
      ambulanceDesc: 'Traslados de urgencia obstétrica, canalización a Casas Maternas y centros de salud.',
      familyLine: 'Línea de la Niñez y Familia - MIFAMILIA (133)',
      familyDesc: 'Orientación psicológica, protección a madres gestantes, adolescentes e infantes.',
      callAction: 'Llamar',
      nearbyFacilitiesTitle: 'Hospitales y Casas Maternas Cercanas',
      nearbyFacilitiesSubtitle: 'Establecimientos de salud ordenados por distancia calculada desde tu ubicación.'
    },
    menopause: {
      title: 'Monitoreo de Menopausia & Climaterio',
      stagesTitle: 'Etapas del Climaterio (STRAW+10 / MINSA)',
      premenopause: 'Premenopausia / Transición Inicial',
      earlyPerimenopause: 'Perimenopausia Temprana',
      latePerimenopause: 'Perimenopausia Tardía',
      menopauseMilestone: 'Menopausia Fisiológica (12 Meses)',
      postmenopause: 'Postmenopausia Estable',
      thermalComfort: 'Confort Térmico',
      hotFlashesLogged: 'Sofocos Registrados Hoy',
      comfortScore: 'Índice de Confort',
      mrsAssessmentTitle: 'Evaluación del Climaterio (Escala MRS)',
      mrsAssessmentDesc: 'Test clínico estandarizado por la OMS y el MINSA para medir el impacto somático, psicológico y urogenital.',
      startMrsTest: 'Realizar Evaluación MRS',
      tccTitle: 'Terapia Cognitivo-Conductual (TCC)',
      boneHealthTitle: 'Prevención de Osteoporosis & Salud Ósea',
      kegelTracker: 'Entrenamiento del Suelo Pélvico (Kegel)'
    },
    onboarding: {
      welcomeTitle: 'Bienvenida a Blooma',
      welcomeSubtitle: 'Tu plataforma de salud fisiológica femenina, 100% privada, desconectada y comunitaria.',
      step1Title: 'Lengua & Territorio',
      step2Title: 'Objetivo de Salud',
      step3Title: 'Datos Biológicos',
      step4Title: 'Seguridad & PIN',
      chooseLanguageTitle: 'Selecciona tu Lengua Materna',
      chooseLanguageSubtitle: 'Blooma adapta todos sus módulos a las lenguas territoriales de Nicaragua:',
      chooseGoalTitle: '¿Cuál es tu objetivo actual?',
      chooseGoalSubtitle: 'Personalizaremos los algoritmos según tu etapa fisiológica:',
      territoryTitle: 'Tu Ubicación Territorial',
      territorySubtitle: 'Para geolocalizar Casas Maternas y hospitales cercanos sin necesidad de internet:',
      securitySetupTitle: 'Protección de Privacidad',
      securitySetupSubtitle: 'Tus datos íntimos viven únicamente en tu teléfono. Define tu código de acceso:',
      startAppBtn: 'Comenzar a Usar Blooma'
    }
  },

  miskito: {
    nav: {
      dashboard: 'Daskuku Pasin (Panel)',
      symptoms: 'Síntomas Paskaya',
      history: 'Klinik Sturi (Historial)',
      calendar: 'Kati Kalendarka',
      settings: 'Prufail Nani (Ajustes)',
      today: 'Naiwa',
      save: 'Swaki Sakan',
      cancel: 'Taki',
      close: 'Pruki',
      loading: 'Blooma balisa...',
      offlineMode: 'Local-First Desconectado Laka',
      monthView: 'Kati',
      yearView: 'Mani',
      day: 'Yua',
      edit: 'Paskaya',
      back: 'Ninara',
      next: 'Kainara',
      finish: 'Tikan / Aprobado'
    },
    langNames: {
      es: 'Español (Nicaragua)',
      miskito: 'Miskitu (RACCN)',
      creole: 'Creole English (RACCS)'
    },
    settings: {
      title: 'Prufail Nani (Ajustes)',
      userTitle: 'Blooma Upla',
      privateMode: 'Modo Privado Off-grid (Local-First)',
      linkedAccount: 'Account Laka',
      customAvatar: 'Prufail Poto Paskaya',
      changeAvatar: 'Sensi Paskaya',
      languageSectionTitle: 'Laka & Tasba Lalka (Nicaragua Multiétnica)',
      languageSectionDesc: 'App lalka ani sturi nani mairin luhpia baikaia dukiara man yapu lalka ra lakaya:',
      locationSectionTitle: 'Tasba Pliska & MINSA Network',
      locationSectionDesc: 'Blooma ra sip sa internet apu pliska distansiaka kaikaya Upla Nani Baiki Sakanka hospitalkira ra.',
      getGpsBtn: 'GPS Kaikaya',
      detectingGps: 'Pliska Plikisa...',
      departmentLabel: 'Departamento / Región:',
      municipalityLabel: 'Municipio Pliska:',
      avatarCollectionTitle: 'Prufail Aikan Paskanka Nani:',
      cloudBackupTitle: 'Account Laka (Cloud Respaldo)',
      cloudBackupDesc: 'Email wal password paski supabasera resguardo paskaya apia kaka tilifunra 100% privado paskaya.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password (karnika 6 namba)',
      linkAccountBtn: 'Account Paskaya / Respaldo',
      stageGoalTitle: 'Yang Karnika Aima (Mi Objetivo)',
      stageGoalDesc: 'Man aima kaikan paskanka sturi lakaya dukiara:',
      cycleStageName: 'Kati Ciclo Kaikaya',
      cycleStageDesc: 'Kati aima wal predicciones kaikanka.',
      conceptionStageName: 'Luhpia Paskanka Plikaya',
      conceptionStageDesc: 'Ventana fértil karnika wal ovulación test paskaya.',
      pregnancyStageName: 'Luhpia Kalka Kaikaya',
      pregnancyStageDesc: 'Wiki nani wal triaje obstétrico MINSA.',
      menopauseStageName: 'Menopause Laka Kaikaya',
      menopauseStageDesc: 'Plun klalka, TCC wal MRS skala kaikanka.',
      securityTitle: 'Blooma Access & PIN Karnika',
      securityDesc: 'Decide PIN 4 namba wal lakaya apia kaka direct entry paskaya.',
      noPinDirect: 'PIN Apu (Direct Entry)',
      withPinOption: '4 Namba PIN Wal',
      enablePinLabel: 'PIN Lock Paskaya Taim Balira',
      pinCodeLabel: 'PIN Namba (4 namba):',
      discreetModeTitle: 'Modo Discreto (Mairin Karnika & IPV)',
      discreetModeDesc: 'Ciclo wal luhpia sturi tilifun screendra kamulaya dukiara.',
      discreetActive: 'Modo Discreto Activo',
      discreetInactive: 'Modo Normal Explícito',
      climactericSectionTitle: 'Climaterio Aima Nani (STRAW+10 / MINSA)',
      climactericSectionDesc: 'Man aima kaikan paskanka sturi laka:',
      logoSectionTitle: 'Blooma Isotipo & Iconka',
      logoSectionDesc: 'Blooma isotipo tilifunra laka:',
      smartwatchOption: 'Smartwatch & Ring Kaikanka',
      smartwatchSub: 'Android Health, Apple HealthKit apia BLE',
      discreetModeOption: 'Modo discreto (Karnika kamulaya)',
      minsaSupportOption: 'MINSA Helpla & Directorio',
      minsaSupportBtn: 'MINSA Helpla Sturi & Directorio',
      resetAppTitle: 'Peligro Zone: Sturi Paskaya',
      resetAppDesc: 'Sturi, ciclo nani sut tilifun wina sauhkaya dukiara.',
      resetAppBtn: 'Blooma Sturi Sauhkaya'
    },
    dashboards: {
      cycleHeroStatus: 'Kati Yua (Día del Ciclo)',
      fertileWindowStatus: 'Aima Fértil Kwalan',
      ovulationDayStatus: 'Ovulación Yua Kaikanka',
      periodStatus: 'Kati Tala Takan (Menstruación)',
      lutealPhaseStatus: 'Fase Lútea Kaikanka',
      follicularPhaseStatus: 'Fase Folicular',
      confidenceScore: 'Confianza Algorítmica',
      hormoneSimulatorTitle: 'Hormonal Fisiológico Simulator',
      estrogenCurve: 'Estrógeno (Estradiol)',
      progesteroneCurve: 'Progesterona',
      dayCountLabel: 'Kati Yua',
      nextPeriodIn: 'Kati aima balira yua',
      wearableSyncTitle: 'Smartwatch / Ring Laka Biométrico',
      wearableSyncDesc: 'Temperatura basal wal HRV kaikanka ovulación dukiara.',
      syncWearableBtn: 'Reloj / Anillo Sincronizar',
      pregnancyWeekBadge: 'Luhpia Kalka Kati Wiki',
      trimester1: 'Pasin Trimestre',
      trimester2: 'Wali Trimestre',
      trimester3: 'Yumpa Trimestre',
      kickCounterTitle: 'Luhpia Aukan Kaikanka (Pataditas)',
      contractionTimerTitle: 'Contracciones Cronómetro',
      hospitalBagTitle: 'Hospital / Casa Materna Maletaya',
      triageObstetricTitle: 'MINSA Triaje Obstétrico (Norma 011)',
      doctorReportTitle: 'Doctor Report PDF Paskaya',
      conceptionPlannerTitle: 'Fertilidad & Luhpia Plikanka',
      chancesHigh: 'Karna Paskanka (Alta)',
      chancesPeak: 'Pico LH (Máxima)',
      chancesLow: 'Karna Paskanka Sirpi',
      delayedTitle: 'Modo Retraso Sereno',
      delayedDaysLabel: 'Retraso Yua',
      delayedSub: 'Ciclo naiwa: {days} yua. Variabilidad ba normal sa.',
      logPeriodAction: 'Kati periodo paskaya',
      editPeriodDatesAction: 'Periodo yuaka paskaya',
      gestationDialTitle: 'Wiki',
      trimesterDial: 'Trimestre',
      hotFlashesDialTitle: 'Plun Klalka Naiwa',
      cycleLengthCardTitle: 'Ciclo Yua Kalka',
      periodLengthCardTitle: 'Tala Takan Yua',
      daysUnit: 'yua',
      normalBadge: 'NORMAL',
      regularBadge: 'REGULAR',
      medGuidelineTitle: 'MINSA & OMS Klinik Sturi Wal',
      doctorReportCardTitle: 'Klinik Report PDF',
      doctorReportCardSub: 'Doctor dukiara PDF paskaya.',
      exportButton: 'Exportar',
      babyKicksBtn: 'Pataditas',
      hotFlashesBtn: 'Plun Klalka',
      logSymptomsBtn: 'Síntomas',
      wearableBtn: 'Reloj / Anillo',
      ageLabel: 'Mani (Edad):',
      yearsUnit: 'mani',
      notSpecified: 'Apu laka',
      stageSummaryTitle: 'Aima Sturi (Resumen)',
      dailyTipTitle: 'Naiwa Sturi (Consejo)',
      dailyTipDesc: 'Li sim paski wal 30 minuts wapaia hormonal balance dukiara.',
      minsaLineTitle: 'MINSA Helpla Line',
      minsaMaternalLine: 'MINSA Maternal Line (102)',
      navHoy: 'Naiwa',
      navRegistrar: 'Paskaya',
      navBitacora: 'Sturi'
    },
    obstetricAlerts: {
      maternalHouse: 'Upla Nani Baiki Sakanka (Casa Materna)',
      maternalHouseSub: 'Red Nacional MINSA Parto Seguro',
      week32Notice: 'Karna Kaikan Sturi — 32 Wiki Gestación',
      week32Desc: 'Man tasba kalka kumi ra iwisma dukiara, MINSA man ra wisa Upla Nani Baiki Sakanka ra wapaia luhpia baikaia dukiara.',
      callMaternalHouse: 'Upla Nani Baiki Sakanka ra Wisa (Llamar)',
      dangerSignsTitle: 'Mairin Luhpia Kalka Karna Kaikan Sturi',
      dangerSignsSubtitle: 'Naha wina kumi kaikaram kaka, hospitalkira apia Upla Nani Baiki Sakanka ra wapa:',
      dangerBleeding: 'Tala Takan (Sangrado Vaginal)',
      dangerBleedingDesc: 'Tala takisa taim, sirpi apia kau karna.',
      dangerHeadache: 'Duku Saura Wal Lal Kalka (Cefalea Severa)',
      dangerHeadacheDesc: 'Lal duku saura, mihta wina lapat baikaia.',
      dangerFever: 'Tawan Wal Lapat Saura (Fiebre Alta)',
      dangerFeverDesc: 'Wina plun takisa apia lapat saura.',
      dangerBabyMovement: 'Kuhbi Aukan Apu (Disminución de Movimientos)',
      dangerBabyMovementDesc: 'Luhpia aukan apu apia plun takisa.',
      dangerWaterLeak: 'Li Takan (Salida de Líquido)',
      dangerWaterLeakDesc: 'Li takisa taim luhpia baikaia kainara.',
      dangerSeizures: 'Karna Wina Paskanka (Convulsiones)',
      dangerSeizuresDesc: 'Wina lapat, mihta pura pruki saura.',
      immediateAction: 'Centro de Salud ra Auhya Wapaia'
    },
    supportDirectory: {
      title: 'Helpla Sturi & Rait Nani (Directorio)',
      subtitle: 'Mairin Nani Helpla Karnika MINSA',
      bannerText: 'Naha telefon nani ba fri sa, 24 ora naha Nicaragua tasbaya kumi bani ra.',
      policeLine: 'Pulis Nani / Mairin Komisaríaya (118)',
      policeDesc: 'Wina saura kaikiram taim helpla dukiara.',
      ambulanceLine: 'MINSA Ambulancia Helpla (102)',
      ambulanceDesc: 'Luhpia baikaia taim hospitalkira auhya wapaia dukiara.',
      familyLine: 'MIFAMILIA Tuktan & Dawan Line (133)',
      familyDesc: 'Prugramka mairin nani baikaia dukiara.',
      callAction: 'Wisa (Llamar)',
      nearbyFacilitiesTitle: 'Hospitales & Casas Maternas Lamara',
      nearbyFacilitiesSubtitle: 'Centros de salud man pliska wina distansiaka kaikanka wal.'
    },
    menopause: {
      title: 'Menopause & Climaterio Monitoreo',
      stagesTitle: 'Climaterio Aima Nani (STRAW+10 / MINSA)',
      premenopause: 'Premenopause / Transición Pasin',
      earlyPerimenopause: 'Perimenopause Pasin',
      latePerimenopause: 'Perimenopause Yawan',
      menopauseMilestone: 'Menopause Fisiológica (12 Kati)',
      postmenopause: 'Postmenopause Karnika',
      thermalComfort: 'Plun Klalka Karnika',
      hotFlashesLogged: 'Plun Klalka Naiwa Kaikan',
      comfortScore: 'Confort Paskanka',
      mrsAssessmentTitle: 'MRS Skala Menopause Sturi',
      mrsAssessmentDesc: 'OMS & MINSA testka mairin wina paski kaikanka dukiara.',
      startMrsTest: 'MRS Skala Paskaya',
      tccTitle: 'TCC Helpla Paskanka',
      boneHealthTitle: 'Dusa Karnika & Osteoporosis Swaki Sakan',
      kegelTracker: 'Kegel Wina Karnika'
    },
    onboarding: {
      welcomeTitle: 'Pain Lukma Blooma Ra',
      welcomeSubtitle: 'Mairin nani salud fisiológica lalka, 100% privado, offline wal comunitario.',
      step1Title: 'Laka & Tasba',
      step2Title: 'Salud Aima',
      step3Title: 'Wina Sturi',
      step4Title: 'Karnika & PIN',
      chooseLanguageTitle: 'Man Yapu Lalka Lakaya',
      chooseLanguageSubtitle: 'Blooma naha Nicaragua tasba lalka sut ra laka sa:',
      chooseGoalTitle: '¿Dísa man aima kaikanka naiwa?',
      chooseGoalSubtitle: 'Man salud aima kaikan dukiara algoritmo nani paskisa:',
      territoryTitle: 'Man Tasba Pliska',
      territorySubtitle: 'Upla Nani Baiki Sakanka hospitalkira lamara kaikaya dukiara internet apu:',
      securitySetupTitle: 'Privacidad Karnika',
      securitySetupSubtitle: 'Man sturi tilifunra 100% privado sa. PIN namba lakaya:',
      startAppBtn: 'Blooma Aukan Paskaya'
    }
  },

  creole: {
    nav: {
      dashboard: 'Main Dashboard',
      symptoms: 'Log Symptoms',
      history: 'Medical History',
      calendar: 'Cycle Calendar',
      settings: 'Profile Settings',
      today: 'Today',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      loading: 'Loading Blooma...',
      offlineMode: 'Local-First Offline Mode',
      monthView: 'Month',
      yearView: 'Year',
      day: 'Day',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      finish: 'Finish'
    },
    langNames: {
      es: 'Español (Nicaragua)',
      miskito: 'Miskitu (RACCN)',
      creole: 'Creole English (RACCS)'
    },
    settings: {
      title: 'Profile Settings',
      userTitle: 'Blooma User',
      privateMode: 'Private Off-grid Mode (Local-First)',
      linkedAccount: 'Linked Account',
      customAvatar: 'Upload Custom Profile Picture',
      changeAvatar: 'Change',
      languageSectionTitle: 'Language & Territorial Inclusion (Nicaragua)',
      languageSectionDesc: 'Adapt the app interface and emergency alerts to your native or community language:',
      locationSectionTitle: 'Territorial Location & MINSA Network',
      locationSectionDesc: 'Allows Blooma to calculate 100% offline the exact distance to the nearest Maternity Homes and Emergency Hospitals.',
      getGpsBtn: 'Get GPS',
      detectingGps: 'Detecting coordinates...',
      departmentLabel: 'Department / Region:',
      municipalityLabel: 'Municipality of Residence:',
      avatarCollectionTitle: 'Preset Profile Icons Collection:',
      cloudBackupTitle: 'Link Account (Cloud Backup)',
      cloudBackupDesc: 'Link an email and password to encrypted backup your cycles in Supabase or keep 100% private local storage.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password (min. 6 characters)',
      linkAccountBtn: 'Register / Link Account',
      stageGoalTitle: 'My Main Biological Goal',
      stageGoalDesc: 'Select your current stage to customize predictive algorithms and clinical tools:',
      cycleStageName: 'Track my cycle',
      cycleStageDesc: 'Period tracking and regular predictions.',
      conceptionStageName: 'Plan pregnancy',
      conceptionStageDesc: 'Fertile window, ovulation and conception indicators.',
      pregnancyStageName: 'Track pregnancy',
      pregnancyStageDesc: 'Gestational weeks and MINSA obstetric triage.',
      menopauseStageName: 'Manage menopause',
      menopauseStageDesc: 'Hot flashes, CBT, MRS evaluation and thermal comfort.',
      securityTitle: 'App Access Security Mode',
      securityDesc: 'Decide whether to request a 4-digit PIN code on launch or allow direct access.',
      noPinDirect: 'Direct Access (No PIN)',
      withPinOption: 'With 4-digit PIN / Password',
      enablePinLabel: 'Enable PIN Lock on Startup',
      pinCodeLabel: 'PIN Code (4 digits):',
      discreetModeTitle: 'Discreet Mode (Privacy & Safety)',
      discreetModeDesc: 'Camouflages explicit health terms on the main screen for privacy.',
      discreetActive: 'Discreet Mode Active',
      discreetInactive: 'Standard Explicit Mode',
      climactericSectionTitle: 'Climacteric Phase (STRAW+10 / MINSA)',
      climactericSectionDesc: 'Select your current phase to customize medical advice and self-care guidelines:',
      logoSectionTitle: 'App Logo & Brand Identifier',
      logoSectionDesc: 'Customize the Blooma isotype shown in the app:',
      smartwatchOption: 'Smartwatch & Smart Ring',
      smartwatchSub: 'Android Health Connect, Apple HealthKit or BLE',
      discreetModeOption: 'Discreet mode (Hide explicit terms)',
      minsaSupportOption: 'MINSA Clinical Help & Support',
      minsaSupportBtn: 'MINSA Help & Support Directory',
      resetAppTitle: 'Danger Zone: Reset Data',
      resetAppDesc: 'Permanently deletes all cycles, symptoms and local data from this device.',
      resetAppBtn: 'Reset app and local data'
    },
    dashboards: {
      cycleHeroStatus: 'Cycle Day',
      fertileWindowStatus: 'Fertile Window Open',
      ovulationDayStatus: 'Estimated Ovulation Day',
      periodStatus: 'Active Menstruation Phase',
      lutealPhaseStatus: 'Luteal Phase in Progress',
      follicularPhaseStatus: 'Follicular Phase',
      confidenceScore: 'Algorithmic Confidence',
      hormoneSimulatorTitle: 'Physiological Hormone Simulator',
      estrogenCurve: 'Estrogen (Estradiol)',
      progesteroneCurve: 'Progesterone',
      dayCountLabel: 'Cycle Day',
      nextPeriodIn: 'Next estimated period in',
      wearableSyncTitle: 'Wearable Biometric Sync',
      wearableSyncDesc: 'Continuous basal body temperature and HRV reading for ovulation accuracy.',
      syncWearableBtn: 'Sync Smartwatch / Ring',
      pregnancyWeekBadge: 'Gestation Week',
      trimester1: 'First Trimester',
      trimester2: 'Second Trimester',
      trimester3: 'Third Trimester',
      kickCounterTitle: 'Fetal Movement Kick Counter',
      contractionTimerTitle: 'Contraction Timer',
      hospitalBagTitle: 'Maternity Home / Hospital Bag',
      triageObstetricTitle: 'MINSA Obstetric Triage (Norm 011)',
      doctorReportTitle: 'Generate Doctor PDF Report',
      conceptionPlannerTitle: 'Fertility Planner & Forecast',
      chancesHigh: 'High Chance',
      chancesPeak: 'Peak Chance (LH Surge)',
      chancesLow: 'Low Chance',
      delayedTitle: 'Serene Delay Mode',
      delayedDaysLabel: 'Delay of',
      delayedSub: 'Current cycle accumulated: {days} days. Variability is normal.',
      logPeriodAction: 'Log period',
      editPeriodDatesAction: 'Edit period dates',
      gestationDialTitle: 'Week',
      trimesterDial: 'Trimester',
      hotFlashesDialTitle: 'Hot Flashes Today',
      cycleLengthCardTitle: 'Cycle Length',
      periodLengthCardTitle: 'Period Duration',
      daysUnit: 'days',
      normalBadge: 'NORMAL',
      regularBadge: 'REGULAR',
      medGuidelineTitle: 'According to MINSA and WHO clinical guidelines',
      doctorReportCardTitle: 'Summary Medical Report',
      doctorReportCardSub: 'Generate a PDF with your data for your gynecologist.',
      exportButton: 'Export',
      babyKicksBtn: 'Baby Kicks',
      hotFlashesBtn: 'Hot Flashes',
      logSymptomsBtn: 'Symptoms',
      wearableBtn: 'Watch / Ring',
      ageLabel: 'Age:',
      yearsUnit: 'years',
      notSpecified: 'Not specified',
      stageSummaryTitle: 'Stage Summary',
      dailyTipTitle: 'Tip of the Day',
      dailyTipDesc: 'Drinking enough water and walking 30 minutes a day helps regulate hormonal balance.',
      minsaLineTitle: 'MINSA Assistance Line',
      minsaMaternalLine: 'MINSA Maternal Line (102)',
      navHoy: 'Today',
      navRegistrar: 'Log',
      navBitacora: 'History'
    },
    obstetricAlerts: {
      maternalHouse: 'MINSA Maternity Home',
      maternalHouseSub: 'National Safe Birth Network',
      week32Notice: 'Preventive Notice — Week 32 Gestation',
      week32Desc: 'Living in a rural or remote area, MINSA recommends staying at your assigned Maternity Home for a safe birth.',
      callMaternalHouse: 'Call Maternity Home',
      dangerSignsTitle: 'Pregnancy Danger Signs',
      dangerSignsSubtitle: 'If you present any of these signs, go immediately to the nearest health center or Maternity Home:',
      dangerBleeding: 'Vaginal Bleeding',
      dangerBleedingDesc: 'Any blood loss, heavy or spotting.',
      dangerHeadache: 'Severe Headache & Ringing Ears',
      dangerHeadacheDesc: 'Intense headache, flashing lights or ear ringing.',
      dangerFever: 'Fiebre & Chills',
      dangerFeverDesc: 'High body temperature or intense shaking.',
      dangerBabyMovement: 'Lack of Baby Movement',
      dangerBabyMovementDesc: 'Baby is not moving or kicks decreased noticeably.',
      dangerWaterLeak: 'Water Leak / Fluid from Vagina',
      dangerWaterLeakDesc: 'Premature rupture of membranes before labor.',
      dangerSeizures: 'Seizures or Severe Swelling',
      dangerSeizuresDesc: 'Fits, extremely swollen face or hands (possible preeclampsia).',
      immediateAction: 'Go Immediately to Health Center'
    },
    supportDirectory: {
      title: 'Support Directory & Rights',
      subtitle: 'Institutional Protection & Women Health Network',
      bannerText: 'Toll-free and confidential hotlines active 24/7 across Nicaragua for clinical guidance and rights protection.',
      policeLine: 'National Police / Women Police Stations (118)',
      policeDesc: 'Immediate help in risk situations and reporting.',
      ambulanceLine: 'MINSA Medical Emergencies & Ambulances (102)',
      ambulanceDesc: 'Obstetric transfers, Maternity Homes and hospital referral.',
      familyLine: 'Children and Family Hotline - MIFAMILIA (133)',
      familyDesc: 'Psychological guidance and protection for pregnant women and youth.',
      callAction: 'Call',
      nearbyFacilitiesTitle: 'Nearby Hospitals & Maternity Homes',
      nearbyFacilitiesSubtitle: 'Health facilities sorted by calculated distance from your location.'
    },
    menopause: {
      title: 'Menopause & Climacteric Tracking',
      stagesTitle: 'Climacteric Phases (STRAW+10 / MINSA)',
      premenopause: 'Premenopause / Early Transition',
      earlyPerimenopause: 'Early Perimenopause',
      latePerimenopause: 'Late Perimenopause',
      menopauseMilestone: 'Physiological Menopause (12 Months)',
      postmenopause: 'Stable Postmenopause',
      thermalComfort: 'Thermal Comfort',
      hotFlashesLogged: 'Hot Flashes Logged Today',
      comfortScore: 'Comfort Score',
      mrsAssessmentTitle: 'Climacteric Assessment (MRS Scale)',
      mrsAssessmentDesc: 'Standardized clinical test by WHO and MINSA measuring somatic, psychological and urogenital impact.',
      startMrsTest: 'Take MRS Assessment',
      tccTitle: 'Cognitive Behavioral Therapy (CBT)',
      boneHealthTitle: 'Osteoporosis Prevention & Bone Health',
      kegelTracker: 'Pelvic Floor Kegel Training'
    },
    onboarding: {
      welcomeTitle: 'Welcome to Blooma',
      welcomeSubtitle: 'Your feminine physiological health platform, 100% private, offline and community-focused.',
      step1Title: 'Language & Territory',
      step2Title: 'Health Goal',
      step3Title: 'Biological Data',
      step4Title: 'Security & PIN',
      chooseLanguageTitle: 'Select Your Native Language',
      chooseLanguageSubtitle: 'Blooma adapts all modules to the territorial languages of Nicaragua:',
      chooseGoalTitle: 'What is your current health goal?',
      chooseGoalSubtitle: 'We will personalize the algorithms according to your physiological stage:',
      territoryTitle: 'Your Territorial Location',
      territorySubtitle: 'To geolocate nearby Maternity Homes and hospitals 100% offline:',
      securitySetupTitle: 'Privacy Protection',
      securitySetupSubtitle: 'Your intimate data lives solely on your device. Set your access code:',
      startAppBtn: 'Start Using Blooma'
    }
  }
};
