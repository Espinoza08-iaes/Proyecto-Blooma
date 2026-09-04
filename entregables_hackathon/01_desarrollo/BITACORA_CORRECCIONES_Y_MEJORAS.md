# Bitácora de Correcciones, Mejoras y Nuevas Funcionalidades
**Proyecto Blooma — Hackathon Nicaragua 2026**

Este documento registra de manera ordenada y detallada todos los puntos detectados, correcciones de interfaz (UI/UX), optimizaciones técnicas y nuevas funciones institucionales implementadas en el sistema.

---

## 1. Correcciones de Enlaces y Navegación del Repositorio
* [x] **Enlaces externos en pestaña nueva (`target="_blank"`):**
  * **Problema:** Al hacer clic en el enlace de la app en producción (`https://proyecto-blooma.vercel.app/`) dentro del `README.md` en GitHub, el navegador reemplazaba la página del repositorio.
  * **Solución Aplicada:** Reemplazados todos los enlaces por `<a href="https://proyecto-blooma.vercel.app/" target="_blank" rel="noopener noreferrer">` en `README.md` y `entregables_hackathon/README.md`.

---

## 2. Correcciones en el Calendario (`FullCalendarModal.tsx`)
* [x] **Implementar Vista Anual ("Año"):**
  * **Problema:** Al alternar entre *"Mes"* y *"Año"*, la pantalla no cambiaba; se mantenían únicamente los 3 meses estáticos.
  * **Solución Aplicada:** Desarrollada la vista anual completa con la matriz de 12 meses (Enero a Diciembre 2026), mini-calendarios y marcadores de ciclo, ovulación y ventana fértil.
* [x] **Aislamiento de Scroll y Fondo 100% Opaco:**
  * **Problema:** Al bajar de más (overscroll) en los meses, el dashboard principal se traslucía por detrás y se movía hacia arriba (*scroll chaining* y gradiente alfa `/80`, `/50`).
  * **Solución Aplicada:** Aplicado fondo sólido y opaco (`bg-[#FFF9F9]`), `overscroll-contain`, y bloqueo del scroll del `body` (`document.body.style.overflow = 'hidden'`) mientras el modal está activo.

---

## 3. Correcciones en la Ficha de Registro de Síntomas (`SymptomLoggingSheet.tsx`)
* [x] **Ajuste del Selector de Fecha (Día Actual):**
  * **Problema:** Las flechas `<` y `>` permitían retroceder a fechas pasadas o avanzar a fechas futuras de forma confusa.
  * **Solución Aplicada:** Fijado el selector limpiamente a **"Hoy — [Fecha actual]"**, bloqueando fechas futuras y simplificando el flujo de captura rápida sin desajustes temporales.

---

## 4. Correcciones en los Botones del Dock Flotante (`FloatingActionDock.tsx`) y Modos de Salud
* [x] **Conectar Sincronización Biométrica / Reloj y Anillo en los 4 Dashboards:**
  * **Problema:** Al presionar el botón *"Reloj / Anillo"* en el dock flotante (en Embarazo, Planificación, Menopausia y Ciclo), no hacía nada (`() => {}`).
  * **Solución Aplicada:** Conectado el disparador `onWearableSync` al modal interactivo `WearableTelemetryModal` en todas las etapas, permitiendo simular y sincronizar la telemetría según el objetivo (temperatura cutánea para ovulación, confort térmico para sofocos, y signos vitales en gestación).
* [x] **Rediseño y Portalizado de Modales en Embarazo Activo (`PregnancyDashboard.tsx`):**
  * **Problema:** Los modales de *Contador de Pataditas*, *Cronómetro de Contracciones*, *Maleta Hospitalaria* y *Triaje Obstétrico MINSA* aparecían desajustados y la barra de navegación inferior (`HOY | REGISTRAR | BITÁCORA`) se superponía tapando los botones de acción ("Cancelar" / "Evaluar").
  * **Solución Aplicada:**
    1. Renderizados todos los modales de embarazo con `createPortal(..., document.body)` en capa superior (`z-[99999]`).
    2. Homogeneizado el diseño visual con backdrop blur oscuro (`bg-slate-950/75 backdrop-blur-md`), botón de cierre `X` en cabecera y márgenes seguros.
    3. Habilitada la bitácora completa de síntomas diaria (`SymptomLoggingSheet`) también en modo embarazo.
* [x] **Correcciones y Portalizado en el Dashboard de Menopausia (`MenopauseDashboard.tsx`):**
  * **Problema:** El botón de síntomas en el dock solo abría la respiración breve en vez de la bitácora completa, el botón de reloj/anillo no hacía nada (`() => {}`), y el modal de respiración TCC se renderizaba inline con riesgo de ser tapado por la barra inferior.
  * **Solución Aplicada:**
    1. Conectado *"Reloj / Anillo"* a la telemetría biométrica de bochornos nocturnos y calidad de sueño.
    2. Conectado *"Síntomas"* a `SymptomLoggingSheet` con tags de bienestar, sofocos y confort.
    3. Portalizado el modal de Respiración TCC con `createPortal` y `z-[99999]`.

---

## 5. Correcciones en la Pantalla de Ajustes (`ProfileSettingsDrawer.tsx`)
* [x] **Traspaso de Fondo y Desborde de Scroll en Ajustes:**
  * **Problema:** Al llegar al final de la pantalla de ajustes (*"Reiniciar aplicación y datos locales"*), el dashboard de fondo se traslucía y se asomaba por debajo.
  * **Solución Aplicada:** Fondo 100% opaco y sólido (`bg-[#FFF9F9]`), `overscroll-contain` y bloqueo del scroll del `body` mientras el drawer está abierto.
* [x] **Activar "Ayuda y Soporte Clínico MINSA":**
  * **Problema:** Al presionar el botón *"Ayuda y Soporte Clínico MINSA"*, no ocurría ninguna acción porque no tenía evento `onClick`.
  * **Solución Aplicada:** Creado y conectado el modal oficial `MinsaSupportModal.tsx` con el Directorio de Emergencias y Acompañamiento a la Mujer (*Línea 118, MINSA 102, MIFAMILIA 133, PDDH 2264-1519 y 2264-3244, y portal "Mi Denuncia"*).

---

## 6. Funcionalidades Clínicas e Institucionales (MINSA)
* [x] **Alerta de Ingreso Preventivo a Casas Maternas en Semana 32 (8° Mes):**
  * **Fuente:** Cartilla Oficial MINSA *"Embarazo y Partos Saludables"*.
  * **Comportamiento:** En `PregnancyDashboard.tsx`, cuando la edad gestacional alcanza `gestationWeeks >= 32`, se activa automáticamente la tarjeta prioritaria con el protocolo de traslado preventivo, datos de la Casa Materna asignada y botón de llamada telefónica directa (1-Tap).

---

## 7. Inclusión Lingüística Territorial Multi-Étnica (Miskito / Creole / Español Comunitario)
* [x] **Motor de Traducción e Inclusión de Lenguas Originarias (`frontend/src/i18n/`):**
  * **Problema:** La aplicación estaba redactada exclusivamente en español estándar, limitando su adopción y comprensión en comunidades indígenas y afrodescendientes de la Costa Caribe de Nicaragua (RACCN y RACCS) y zonas rurales de baja alfabetización digital.
  * **Solución Aplicada:**
    1. Creado el diccionario multilingüe `translations.ts` con traducciones contextuales para **Español Comunitario**, **Miskitu (*Miskitu Yapu* - RACCN)** e **Inglés Criollo (*Nicaraguan Creole English* - RACCS)**.
    2. Traducidas las alertas vitales de señales de peligro obstétrico (*Tala takan / Sangrado*, *Duku saura / Dolor de cabeza*, *Tawan / Fiebre*, *Kuhbi aukan apu / Falta de movimiento fetal*).
    3. Traducido el protocolo de Casas Maternas (*Upla Nani Baiki Sakanka*) y el directorio de auxilio institucional.
    4. Integrado selector de lengua en `Onboarding.tsx` (Paso 1) y en `ProfileSettingsDrawer.tsx` con guardado instantáneo en la base de datos local `IndexedDB`.

---

## 8. Profundización Clínica en las 5 Etapas del Climaterio y Escala MRS
* [x] **Superación del Modelo Binario de Menopausia:**
  * **Problema:** El módulo de menopausia únicamente diferenciaba entre perimenopausia y postmenopausia mediante una condición genérica (`monthsSincePeriod >= 12`), sin reflejar las etapas fisiológicas de la OMS y el protocolo STRAW+10.
  * **Solución Aplicada:**
    1. Modeladas las **5 etapas clínicas completas del climaterio** en `menopauseService.ts`:
       * *Premenopausia / Transición Inicial* (40-45 años).
       * *Perimenopausia Temprana* (44-48 años, irregularidad de ciclo).
       * *Perimenopausia Tardía* (47-51 años, amenorrea $\ge 60$ días).
       * *Menopausia Fisiológica* (Hito clínico de los 12 meses de amenorrea confirmada).
       * *Postmenopausia Estable* (50+ años, foco en salud ósea y cardiovascular).
    2. Desarrollado el **Test de Evaluación del Climaterio (Escala MRS - *Menopause Rating Scale*)** en `MRSEvaluationModal.tsx` con 11 ítems en 3 dimensiones (Somática, Psicológica y Urogenital).
    3. Creada la tabla local `mrsEvaluations` en Dexie (`version(4)`) para registrar el historial clínico de evaluaciones sin requerir internet.
    4. Adaptadas las tarjetas de TCC y checklists según la fase activa (sofocos/sueño en perimenopausia vs densidad ósea/suelo pélvico en postmenopausia).

---

## 9. Fortalecimiento de la Arquitectura Local-First
* [x] **Garantía de Soberanía y Operación Off-Grid:**
  * Todas las nuevas funciones (idiomas, evaluaciones MRS, selección de etapas, llamadas a Casas Maternas) operan de forma 100% autónoma en el navegador del dispositivo mediante Dexie.js / IndexedDB.
  * Cero bloqueos de red o fugas de telemetría a servidores centralizados.

---

## 10. Georreferenciación Territorial y Red de Hospitales MINSA por Proximidad (Fórmula Haversine 100% Offline)
* [x] **Detección y Ordenamiento de Centros de Salud por Ubicación:**
  * **Problema:** Las usuarias embarazadas o en situación de urgencia médica en zonas rurales no contaban con un cálculo de proximidad ni sabían qué hospital contaba con quirófano activo para emergencias obstétricas (Código Rojo).
  * **Solución Aplicada:**
    1. Creado el servicio `locationService.ts` con el catálogo territorial oficial de los 15 departamentos y 2 regiones autónomas (RACCN y RACCS), coordenadas de cabeceras departamentales y municipios.
    2. Implementada la **Fórmula de Haversine** para calcular la distancia en kilómetros entre el teléfono y cualquier establecimiento de salud sin requerir internet ni APIs externas con costo.
    3. Integrado selector territorial y botón de detección GPS satelital en `Onboarding.tsx` y en `ProfileSettingsDrawer.tsx`.
    4. En `PregnancyDashboard.tsx`, la Alerta Preventiva de Semana 32 y el Directorio muestran la distancia real calculada (ej. *"A 2.3 km"*), SILAIS de adscripción y badges de servicio (*[Quirófano / Cesárea 24h]*, *[Ambulancia]*).
    5. En `MinsaSupportModal.tsx`, se listan automáticamente los establecimientos de salud más cercanos a la usuaria con llamada telefónica directa.

---

## 11. Elevación de la Base de Datos a Estándar Clínico v2.1.0
* [x] **Actualización de Esquemas IndexedDB (Dexie v5) y Supabase PostgreSQL:**
  * Creada la tabla `birth_plans` / `birthPlans` para registrar el **Plan de Parto Familiar Comunitario MINSA** (semana de traslado a Casa Materna, medio de transporte: ambulancia/panga/vehículo/carreta, acompañante, partera comunitaria y brigadista de salud).
  * Creada la tabla `prenatal_appointments` / `prenatalAppointments` para el seguimiento del **Carnet de Control Prenatal MINSA** (presión arterial sistólica/diastólica, peso, altura uterina, FCF - frecuencia cardíaca fetal y suplementación con hierro/ácido fólico).
  * Enriquecida la tabla `maternal_houses` con `latitude`, `longitude`, `silais`, `type`, `has_obstetric_surgery` y `has_ambulance`.
  * Diseñados índices compuestos y políticas de seguridad RLS con aislamiento por usuaria y lectura pública del catálogo de salud nacional.

---

*Estado: Todas las tareas de ingeniería, georreferenciación, base de datos y diseño clínico implementadas, documentadas y verificadas con éxito.*
