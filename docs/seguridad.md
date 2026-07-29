# Marea — Plan Integral: Seguridad, Casos Límite y Mitigación de Fallos de la Competencia

Este documento complementa la especificación de pantallas. Acá se detalla todo lo que normalmente se queda "para después" y termina hundiendo a las apps de este rubro: seguridad real (no solo discurso), qué pasa cuando algo sale mal, y punto por punto, cómo cada falla documentada de la competencia tiene una solución concreta y verificable en Marea.

---

## 1. Tabla maestra: falla de la competencia → solución en Marea

| # | Falla documentada en apps existentes | Fuente del problema | Solución concreta en Marea |
|---|---|---|---|
| 1 | Ciclo de 28 días asumido, ovulación fija en día 14 | Clue, apps genéricas | Mediana + desviación estándar de ciclos reales de la usuaria; rango de fertilidad, nunca fecha única |
| 2 | Datos vendidos a redes publicitarias sin consentimiento claro | Flo Health (demanda de Meta, 2025), Maya, MIA | Local-first: los datos crudos nunca salen del dispositivo salvo opt-in explícito; cero SDKs de publicidad/analytics de terceros en el código |
| 3 | Datos centralizados vulnerables a órdenes judiciales / subpoenas | Ovia, la mayoría de apps con backend en la nube | Arquitectura local-first: si Marea no tiene el dato, no hay nada que entregar. Row Level Security en Supabase como capa adicional si se sincroniza |
| 4 | Falta de "modo sigiloso" ante vigilancia de pareja (IPV) | Documentado en investigación de Privacy International y CDT sobre surveillance íntima | PIN/biometría de acceso a la app + **modo discreto**: notificaciones sin contenido explícito ("Tenés una actualización" en vez de "Se acerca tu período"), ícono de app camuflable |
| 5 | Retención indefinida de datos, sin control real del usuario | Auditoría GDPR de Flo/Clue/Eve (2023-2025) | Botón visible de "Eliminar mi cuenta y todos mis datos" que borra en cascada (local + Supabase) de forma inmediata y verificable, no solo "desactivar cuenta" |
| 6 | Consentimiento estático (se acepta una vez y ya) | Estudio de "intimate privacy" (ScienceDirect, 2025) que pide "dynamic consent" | Cada vez que se activa una función nueva que implica compartir datos (ej. sincronizar a la nube, compartir con acompañante de embarazo) se pide consentimiento específico para ESA función, no uno genérico al inicio |
| 7 | Interfaz "pinkificada", infantilizante | Queja transversal en UX de FemTech | Paleta clínica neutra definida desde el inicio (ver especificación de estilo) |
| 8 | Asume pareja heterosexual, excluye personas no binarias/trans | Sesgo de diseño en la mayoría de apps | Lenguaje neutro en toda la app ("tu pareja", nunca "tu novio"); campo de género/pronombres opcional y no obligatorio para usar la app |
| 9 | Interfaz sobrecargada, exige registrar demasiadas variables (fatiga de registro) | Bearable | Todos los campos de síntomas son opcionales excepto la fecha de inicio del período; UI de un toque (iconos, no formularios largos) |
| 10 | Lenguaje de nivel universitario en apps de menopausia | Estudio con escala MARS sobre apps de menopausia | Modo de "lectura simple" activable, todo el copy escrito a nivel de lectura básico desde el diseño, no como opción secundaria |
| 11 | Solo 57% de apps de menopausia cubren osteoporosis | Revisión sistemática (PMC, 2023) | Módulo de educación sobre osteoporosis y recordatorio de chequeo de densidad ósea incluido desde el MVP, no como función futura |
| 12 | Exclusión de mujeres con ciclos irregulares de los ensayos/algoritmos (ej. Natural Cycles) | Reportado en estudios de precisión de apps de fertilidad | El algoritmo está diseñado desde cero pensando en la variabilidad como la norma, no como la excepción; muestra nivel de confianza explícito en vez de fingir precisión absoluta |
| 13 | Ausencia de registro puede malinterpretarse como "período perdido" y generar sospecha en contextos hostiles | Privacy International, 2025 | Los datos jamás se interpretan ni se muestran como inferencia de embarazo/aborto; la app no genera alertas ni etiquetas basadas en ausencia de registro — la ausencia de datos se trata como falta de información, no como una señal |
| 14 | Apps de triaje médico dan diagnósticos tajantes que generan pánico o falsa tranquilidad | Común en apps de síntomas genéricas | El resultado del triaje de embarazo siempre incluye lenguaje que no reemplaza a un profesional: "esto no es un diagnóstico, es una guía para decidir si buscar atención" |
| 15 | Falta de opción de exportar/portar los datos propios | Común en el sector | Botón de exportar historial en PDF/CSV desde el día 1, para que la usuaria pueda llevarlo a consulta médica y no dependa de la app para siempre |

---

## 2. Seguridad: lo que no se puede dejar para "después"

### 2.1 Bloqueo de acceso a la app
- PIN de 4 dígitos o biometría (huella/rostro) obligatorio para abrir la app, configurable en el primer uso — no opcional escondido en ajustes.
- Tiempo de bloqueo automático tras 2 minutos de inactividad.

### 2.2 Modo discreto (mitigación directa de IPV / vigilancia de pareja)
- Nombre de la app y su ícono deben poder configurarse como algo neutro (ej. "Notas" o un ícono genérico) — esto es factible en PWA instalada vía manifest personalizado, o vale la pena documentarlo como roadmap si no alcanza el tiempo técnico.
- Notificaciones push **sin contenido sensible visible en pantalla de bloqueo**: "Tenés una actualización en tu app" en vez de "Se acerca tu período" o "Alerta de embarazo".
- Función de "salida rápida": un botón o gesto que cierra la app instantáneamente y muestra la pantalla de inicio del teléfono.

### 2.3 Minimización de datos (data minimization real, no solo en el discurso)
- No se solicita nombre legal, ni número de identificación, ni ubicación exacta por GPS — solo departamento/municipio manual.
- No se integra ningún SDK de terceros de publicidad, analítica de comportamiento (tipo Meta Pixel, Google Analytics de comportamiento profundo) ni "growth" trackers. Si se necesita analítica básica de uso, usar algo minimalista y sin PII (ej. conteo de eventos anónimos).
- Cifrado de datos en tránsito (HTTPS/TLS, estándar con Supabase) y en reposo (Supabase ya cifra at-rest; para el campo de notas libres, considerar cifrado adicional a nivel de aplicación si el tiempo lo permite).

### 2.4 Eliminación de cuenta real, no cosmética
- El botón "Eliminar mi cuenta" debe:
  1. Borrar todas las filas asociadas en Supabase (ciclos, registros, predicciones) — no solo marcar `activo = false`.
  2. Borrar el IndexedDB local.
  3. Confirmar con un mensaje simple: "Tus datos fueron eliminados. No queda ningún registro."
- Este es un punto que pueden literalmente demostrar en vivo durante el pitch — es un diferenciador fuerte y fácil de verificar ante el jurado.

### 2.5 Row Level Security (ya definido en el esquema anterior)
- Reforzar en el pitch: ni el equipo desarrollador puede consultar los datos de una usuaria sin su sesión autenticada. Practicar decir esto con un ejemplo concreto (mostrar una query fallando sin auth).

---

## 3. Casos límite y qué hacer cuando algo falla

### 3.1 Datos insuficientes o contradictorios
- Menos de 3 ciclos registrados → la app no oculta la predicción, pero la etiqueta claramente como "Predicción preliminar, baja confianza" en vez de fingir precisión.
- Ciclo reportado absurdamente corto (<15 días) o largo (>90 días) → validación en el formulario que pide confirmar ("¿Confirmás que este ciclo duró X días?") en vez de rechazar el dato silenciosamente o aceptarlo sin más.
- Dos registros de "fecha de inicio de período" muy cercanos (posible error de tipeo) → advertencia suave, no bloqueo.

### 3.2 Sin conexión a internet
- Toda la funcionalidad de registro y predicción de ciclo debe funcionar 100% offline (IndexedDB local + cálculo en JS).
- Si no hay conexión, el directorio de Casas Maternas debe mostrar la última copia cacheada localmente (se descarga una vez y se guarda).
- Indicador visual simple ("Sin conexión — tus datos se guardan y se sincronizan cuando vuelva el internet") en vez de fallar silenciosamente o mostrar errores técnicos.

### 3.3 Conflictos de sincronización
- Si la usuaria registra algo en dos dispositivos sin conexión y luego sincroniza ambos, usar "last write wins" con timestamp, y avisar si se detecta un conflicto real de datos (ej. dos duraciones distintas para el mismo ciclo).

### 3.4 Resultado de triaje ambiguo
- Si los síntomas ingresados no encajan claramente en ninguna categoría, el sistema **nunca debe defaultear a "normal"** por seguridad — ante la duda, sube a "vigilar" como mínimo. Esto es un principio de diseño de seguridad clínica: falsos positivos son preferibles a falsos negativos en un sistema de triaje.

### 3.5 Usuaria sin smartphone de gama alta
- El Ryzen/gama-alta no es el público objetivo real — probar la PWA en un dispositivo Android de gama baja o en modo de simulación de CPU limitada en Chrome DevTools, para asegurar que no se congele con el modelo de TensorFlow.js si lo implementan. Si el rendimiento es un problema, usar solo el cálculo estadístico simple (mediana/desviación) como fallback automático.

### 3.6 Usuaria con baja alfabetización digital
- Cada pantalla nueva debe tener máximo una acción principal clara (botón grande, un solo propósito por pantalla).
- Nada de jerga técnica ("sincronizar", "backend", "algoritmo") en el copy visible — usar lenguaje cotidiano ("guardar", "tu predicción", "cómo lo calculamos").
- Considerar iconografía redundante con texto (nunca solo ícono, nunca solo texto) para quienes tienen menor lectura pero reconocen símbolos.

---

## 4. Validación del algoritmo (para que el jurado no lo cuestione)

- Documentar de dónde sale el dataset de prueba (Kaggle, dataset público de duración de ciclos) y cuántos registros tiene.
- Tener preparado un ejemplo reproducible: mismos datos de entrada → misma predicción, para poder mostrarlo en vivo sin sorpresas.
- Si usan TensorFlow.js, tener un plan B: que la app caiga automáticamente al cálculo estadístico simple si el modelo tarda más de X segundos en cargar (para no quedar pegados en la demo en vivo).
- Preparar 2-3 "personas sintéticas" con perfiles de prueba (ciclo regular, ciclo con SOP/irregular, perimenopausia) para mostrar que el sistema se comporta distinto y correctamente en cada caso — esto ataca directamente la crítica de que Natural Cycles excluyó a mujeres con ciclos irregulares de sus pruebas.

---

## 5. Notificaciones — estrategia completa

| Tipo de notificación | Contenido visible en pantalla de bloqueo | Frecuencia |
|---|---|---|
| Recordatorio de registro diario | Genérico ("Tenés una actualización en Marea") | 1 vez al día, configurable, apagable |
| Predicción de próximo período (2-3 días antes) | Genérico, nunca explícito | Solo si la usuaria activó esta notificación explícitamente |
| Alerta de triaje urgente (embarazo) | Puede ser más directo ya que es momento crítico, pero configurable | Inmediata, no pospuesta |
| Recordatorio de chequeo de densidad ósea | Genérico | Cada 6 meses |

Todas las notificaciones son opt-in desde Ajustes, apagadas por defecto salvo la de triaje urgente (que sí recomendamos activada por defecto dado que es información de seguridad, pero con opción de desactivar).

---

## 6. Plan de pruebas (QA) mínimo antes del pitch

1. **Prueba offline real**: poner el dispositivo en modo avión y completar un ciclo completo de registro + ver predicción.
2. **Prueba de datos límite**: ingresar un ciclo de 45 días y otro de 21 días seguidos, verificar que la predicción se ajusta y no se rompe.
3. **Prueba de triaje**: probar los 3 casos (normal, vigilar, urgente) con datos de prueba y confirmar que cada uno lleva al flujo correcto.
4. **Prueba de borrado de cuenta**: crear una cuenta de prueba, cargar datos, eliminarla, y confirmar en Supabase (dashboard) que no queda ningún registro.
5. **Prueba en dispositivo de gama baja**: correr la PWA en el celular más viejo que consigan del equipo, no solo en la laptop de desarrollo.
6. **Prueba de lectura en voz alta del copy**: leer todos los textos de la app en voz alta a alguien fuera del equipo — si algo no se entiende a la primera, se reescribe.

---

## 7. División de roles sugerida para el equipo durante el hackathon

| Rol | Responsabilidad | Entregable |
|---|---|---|
| Frontend / UI | Pantallas React + Tailwind, estilo, accesibilidad | Componentes de las 23 pantallas |
| Backend / Datos | Esquema Supabase, RLS, Edge Functions, seed de Casas Maternas | Base de datos funcional + políticas de seguridad |
| Algoritmo / IA | Cálculo estadístico, integración TensorFlow.js si alcanza el tiempo | Módulo de predicción testeado con dataset |
| Producto / Pitch | Narrativa, wireframes iniciales, ensayo del pitch, QA de copy simple | Guion de pitch + checklist de QA |

Si el equipo es más chico, combinar Backend+Algoritmo y Frontend+Producto es lo más natural dado tu experiencia previa con Node/Supabase.

---

## 8. Lo que se dice en el pitch sobre estos puntos (líneas clave, no guion completo)

- Sobre privacidad: *"A diferencia de Flo o Ovia, que fueron demandadas por compartir datos íntimos con terceros, Marea no puede filtrar lo que no tiene — los datos viven primero en tu teléfono."*
- Sobre inclusión de ciclos irregulares: *"Natural Cycles excluyó a mujeres con ciclos irregulares de sus pruebas. Nosotros construimos pensando en ellas desde el primer día."*
- Sobre seguridad ante vigilancia: *"Sabemos que en algunos casos, la persona en riesgo no es de un gobierno o una corporación, sino de alguien en su propia casa. Por eso Marea tiene modo discreto."*
- Sobre menopausia: *"Solo el 57% de las apps de menopausia hablan de osteoporosis. Marea lo incluye desde el MVP, no como función premium."*

Cada una de estas líneas tiene una fuente real detrás (documentada en el informe original y en este plan), así que si el jurado pregunta "¿de dónde sacan eso?", el equipo puede responder con seguridad.
