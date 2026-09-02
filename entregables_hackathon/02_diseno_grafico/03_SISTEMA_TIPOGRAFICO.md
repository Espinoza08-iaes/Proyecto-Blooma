# 03. Sistema Tipográfico y Escala Jerárquica
### Proyecto Blooma — Legibilidad y Estética Digital

---

## 1. Familia Tipográfica Dual

Para balancear la calidez humana con el rigor científico y la legibilidad en pantallas compactas:

1. **Tipografía de Display y Títulos:** `Outfit` (Google Fonts)
 * *Características:* Geométrica, terminaciones amables, proporciones modernas y balance visual impecable en números y fechas.
 * *Pesos utilizados:* Bold (700), ExtraBold (800).
2. **Tipografía de Lectura y Formularios:** `Inter` (Google Fonts)
 * *Características:* Diseñada específicamente para interfaces de usuario y pantallas móviles, con excelente altura de x que previene fatiga visual.
 * *Pesos utilizados:* Regular (400), Medium (500), SemiBold (600), Bold (700).

---

## 2. Escala Tipográfica y Jerarquía (Tokens CSS)

| Nivel Jerárquico | Elemento HTML | Tamaño (rem / px) | Line Height | Peso (Weight) | Fuente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `h1.hero` | `1.875rem` (30px) | `2.25rem` (36px) | ExtraBold (800) | `Outfit` |
| **Título de Sección** | `h2` | `1.25rem` (20px) | `1.75rem` (28px) | Bold (700) | `Outfit` |
| **Subtítulo de Tarjeta** | `h3` | `1.0rem` (16px) | `1.5rem` (24px) | Bold (700) | `Outfit` |
| **Cuerpo de Texto** | `p`, `span` | `0.875rem` (14px) | `1.375rem` (22px) | Regular (400) | `Inter` |
| **Etiquetas de Botón** | `button` | `0.75rem` (12px) | `1.0rem` (16px) | ExtraBold (800) | `Inter` |
| **Leyendas / Badges** | `small`, `badge` | `0.6875rem` (11px) | `0.875rem` (14px) | SemiBold (600) | `Inter` |

---

## 3. Modo de Accesibilidad Tipográfica (Modo Lectura Aumentada)

La aplicación incluye un selector en Ajustes que incrementa automáticamente un **15% la escala tipográfica global** (`themeTextSize: 'large'`) para usuarias con dificultades visuales o personas de la tercera edad en etapa de menopausia.
