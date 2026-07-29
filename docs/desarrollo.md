# Marea — Etapas de Desarrollo e Implementación

Este documento complementa a los dos anteriores (especificación de pantallas, y plan de seguridad/fallos). Acá se detalla **cómo se construye, en qué orden, y qué depende de qué** — desde el setup del entorno hasta el deploy final.

---

## Fase 0 — Preparación (antes del día del hackathon, si es posible)

Todo esto se puede dejar listo con anticipación sin que cuente como "trampa" — es configuración de herramientas, no código de la solución:

- Crear el proyecto en **Supabase** (cuenta gratuita, tier free alcanza de sobra para un hackathon).
- Crear el repositorio en GitHub con estructura base (Vite + React + Tailwind ya inicializado).
- Instalar dependencias base: `@supabase/supabase-js`, `dexie` (IndexedDB), `recharts` o `chart.js` (gráficos), `date-fns` (manejo de fechas sin dolores de cabeza).
- Tener la cuenta del VPS lista y PM2 configurado (ya lo tenés de BAES, es reutilizar conocimiento).
- Descargar de antemano el dataset de Kaggle de duración de ciclos menstruales (buscar "menstrual cycle length dataset kaggle"), para no depender de internet lento el día del evento.
- Tener Figma o similar con la paleta de colores ya cargada como estilos guardados (si van a hacer mockups antes de codear).

**Checkpoint de Fase 0:** el equipo puede hacer `npm run dev` y ver una pantalla en blanco con el branding base, y Supabase responde a una consulta de prueba.

---

## Fase 1 — Fundamentos (primeras 3-4 horas del hackathon)

Esto es lo que todo lo demás necesita para existir:

1. **Configurar Tailwind** con la paleta de colores definida (tierra/teal) como `theme.extend.colors` en `tailwind.config.js`.
2. **Crear el esquema de Supabase** (las tablas del documento anterior: `perfiles`, `ciclos`, `predicciones`, `registros_embarazo`, `casas_maternas`, `registros_menopausia`) y activar Row Level Security en cada una.
3. **Sembrar (seed) la tabla `casas_maternas`** con datos reales o representativos de al menos 5-10 departamentos, para que el módulo de triaje tenga con qué mostrar resultados desde el primer momento.
4. **Configurar Supabase Auth** (correo/contraseña, y opcionalmente Google OAuth) y probar que un usuario de prueba se puede registrar y loguear.
5. **Configurar IndexedDB con Dexie** — definir el esquema local que espeja las tablas clave (ciclos, registros) para que la app funcione offline desde el día 1, no como algo que se agrega al final.
6. **Armar el esqueleto de navegación** (las 4 pestañas fijas + rutas de cada módulo) usando React Router, aunque las pantallas estén vacías todavía.

**Checkpoint de Fase 1:** un usuario de prueba puede registrarse, loguearse, y navegar entre las 4 pestañas vacías. La base de datos existe y tiene RLS activo. Esto es la "columna vertebral" — nada del resto avanza si esto no funciona.

---

## Fase 2 — Onboarding + Módulo Ciclo (siguiente bloque, el núcleo no-negociable)

Este es el módulo que **sí o sí** debe quedar terminado y demostrable.

1. Construir las 5 pantallas de onboarding (splash, selección de etapa, registro de cuenta, perfil básico, carga inicial de ciclos).
2. Implementar la función de cálculo: mediana + desviación estándar sobre los ciclos ingresados (JavaScript puro, sin librerías de ML todavía — esto es lo que garantiza que "algo funciona" pase lo que pase con el tiempo restante).
3. Construir el Dashboard de ciclo: calendario visual, tarjeta de predicción, barra de confianza.
4. Construir la pantalla de Registro diario (flujo, ánimo, dolor, temperatura basal — todo opcional).
5. Construir el Historial con gráfico de duración de ciclos.
6. Conectar todo a Supabase + Dexie: guardar local primero, sincronizar si hay conexión.
7. **Probar el flujo completo offline** (modo avión) antes de seguir a la siguiente fase — si esto falla, se arregla ahora, no se arrastra el problema.

**Checkpoint de Fase 2:** una usuaria de prueba puede completar el onboarding, cargar 3-6 ciclos, ver una predicción con nivel de confianza, registrar un día de síntomas, y ver su historial en un gráfico — todo funcionando sin internet.

Este es el punto en el que, si el hackathon tiene una demo intermedia o checkpoint de jueces, ya tienen algo sólido que mostrar aunque no avancen más.

---

## Fase 3 — Módulo Embarazo (triaje y Casas Maternas)

1. Pantalla de carga inicial (semana de gestación).
2. Formulario de síntomas de alerta con la lógica de árbol de decisión (normal / vigilar / urgente) — recordar el principio de "ante la duda, sube de nivel" del plan de seguridad.
3. Pantalla de resultado con los 3 estados visuales diferenciados.
4. Directorio de Casas Maternas: selector de departamento + lista con datos de la tabla `casas_maternas` ya sembrada en Fase 1.
5. Botón de llamada directa si hay teléfono de contacto.
6. Probar los 3 casos de prueba (normal, vigilar, urgente) con datos ficticios.

**Checkpoint de Fase 3:** el flujo de síntomas → clasificación → Casa Materna más cercana funciona de punta a punta con los datos sembrados.

---

## Fase 4 — Módulo Menopausia

1. Pantalla de carga inicial (tiempo sin período regular).
2. Registro diario (sofocos, sueño, ansiedad).
3. Carrusel de tarjetas TCC (contenido estático, se puede escribir el texto mientras se codean las otras fases — es un buen bloque de trabajo paralelo para quien no esté programando en ese momento).
4. Sección de educación sobre osteoporosis + checkbox de chequeo de densidad ósea.
5. Historial con gráficos de sofocos/sueño/ansiedad.

**Si el tiempo aprieta**, este es el módulo que se recorta primero (como ya se definió en el documento de pantallas): dejar solo carga inicial + registro diario + las tarjetas TCC, y mockear el resto en Figma o slides.

---

## Fase 5 — Seguridad y pulido (transversal, no esperar al final)

Idealmente estas cosas se van intercalando desde la Fase 1, pero si se dejaron pendientes, este es el momento de cerrarlas antes del pitch:

1. PIN/biometría de acceso a la app.
2. Modo discreto de notificaciones (contenido genérico en pantalla de bloqueo).
3. Botón de "eliminar mi cuenta y todos mis datos" — probarlo de verdad contra Supabase.
4. Toggle de sincronización opt-in (apagado por defecto).
5. Botón de exportar historial (PDF/CSV).
6. Pasada de accesibilidad: tamaños de fuente, contraste, modo de lectura simple.

**Checkpoint de Fase 5:** las 6 pruebas de QA del documento de seguridad están hechas y documentadas (aunque sea con una captura de pantalla o video corto como evidencia).

---

## Fase 6 — Integración de IA (solo si sobra tiempo real)

Este bloque es "bonus", no núcleo — no debe arrancar hasta que las Fases 1-3 estén sólidas:

1. Entrenar (o usar pre-entrenado) un modelo simple de regresión con TensorFlow.js usando el dataset de Kaggle descargado en Fase 0.
2. Exportar el modelo como archivo `.json` liviano e integrarlo en el cliente.
3. Implementar el fallback automático: si el modelo tarda más de X segundos en cargar o falla, usar el cálculo estadístico simple de la Fase 2 sin que la usuaria note un error.
4. Si hay tiempo para el nivel más ambicioso: Supabase Edge Function que llama a la API de Claude para generar explicaciones en lenguaje simple de por qué se dio tal predicción o alerta.

**Checkpoint de Fase 6:** el modelo de IA mejora la predicción sin nunca romper la experiencia si falla — el fallback siempre funciona.

---

## Fase 7 — Deploy y demo final

1. Build de producción de la PWA (`npm run build`).
2. Deploy en el VPS con PM2 (mismo flujo que ya usás para BAES) o alternativamente en un hosting estático rápido (Vercel/Netlify) si el VPS no es necesario para este proyecto.
3. Probar la instalación de la PWA en un celular real (no solo en el navegador de la laptop) — confirmar que el ícono, el modo offline, y las notificaciones funcionan en un dispositivo real.
4. Preparar el dispositivo de demo con datos de prueba ya cargados (las "personas sintéticas" mencionadas en el plan de seguridad) para no tener que registrar todo en vivo frente al jurado — eso consume tiempo valioso del pitch y es donde más fallan las demos en vivo.
5. Tener un plan B sin internet: si el wifi del venue falla, la demo debe poder correr completamente en modo offline, ya que la arquitectura está pensada para eso desde la Fase 1.

**Checkpoint de Fase 7:** la app está deployada, instalada en al menos un celular real, con datos de prueba precargados, y funciona sin depender del wifi del lugar.

---

## Resumen visual de dependencias entre fases

```
Fase 0 (prep) 
    │
    ▼
Fase 1 (fundamentos: DB, Auth, IndexedDB, navegación)
    │
    ├──────────────┬──────────────┐
    ▼              ▼              ▼
Fase 2          Fase 3         Fase 4
(Ciclo)       (Embarazo)    (Menopausia)
[núcleo]      [importante]   [recortable]
    │              │              │
    └──────────────┴──────────────┘
                   │
                   ▼
         Fase 5 (Seguridad/pulido)
                   │
                   ▼
      Fase 6 (IA — opcional, solo si sobra tiempo)
                   │
                   ▼
         Fase 7 (Deploy y demo)
```

Las Fases 2, 3 y 4 pueden trabajarse en paralelo por distintos miembros del equipo una vez que la Fase 1 esté lista, ya que todas dependen de la misma base (Auth + DB + navegación) pero no dependen entre sí. Esto es clave para no cuellos de botella: mientras una persona hace el algoritmo de ciclo, otra puede estar armando el árbol de decisión de triaje, y otra escribiendo el contenido de las tarjetas TCC.

---

## Señales de alerta durante el desarrollo (cuándo replanificar)

- Si a la mitad del tiempo total del hackathon la Fase 1 no está cerrada → recortar directamente Fase 4 (menopausia) a solo mockups, sin negociar.
- Si el algoritmo de IA (Fase 6) no carga en menos de 3 segundos en pruebas → descartarlo de la demo en vivo, quedarse solo con el cálculo estadístico (Fase 2) y mencionar el modelo de IA como "prueba de concepto" en las slides, no en la demo funcional.
- Si quedan menos de 2 horas antes del pitch y la Fase 5 (seguridad) no está probada → priorizar solo el PIN de acceso y el botón de borrado real (los dos puntos que más impactan en el pitch), dejar el resto documentado como roadmap.
