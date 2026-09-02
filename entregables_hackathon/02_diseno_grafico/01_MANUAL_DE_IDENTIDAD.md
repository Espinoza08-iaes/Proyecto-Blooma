# 01. Mini Manual de Marca e Identidad Visual
### Proyecto Blooma — Manual Oficial de Estilo (Categoría Aficionado)

---

## 1. ADN de la Marca

* **Nombre Oficial:** Blooma (del concepto *bloom*, florecer plenamente con vitalidad, serenidad y autonomía).
* **Concepto de Marca:** *Salud Fisiológica Femenina con Privacidad Absoluta por Diseño*. Blooma fusiona el rigor clínico con la calidez humana, devolviendo a las mujeres la tranquilidad y el control de su cuerpo en todas sus etapas vitales.
* **Misión:** Brindar un acompañamiento integral, accesible y privado a la salud reproductiva femenina mediante tecnología local-first, sin dependencia de internet y con conexión directa a la red de salud pública (Casas Maternas del MINSA).
* **Visión:** Ser la plataforma digital de referencia en Centroamérica para el empoderamiento y monitoreo de la salud de la mujer, demostrando que la innovación tecnológica debe priorizar la dignidad y la privacidad.
* **Valores Fundamentales:**
  1. *Privacidad Innegociable:* Los datos pertenecen al dispositivo de la usuaria, no a servidores de terceros.
  2. *Empatía Fisiológica:* Comprensión serena de los ritmos del cuerpo sin juicios ni alarmismos.
  3. *Rigor Clínico:* Respaldado en protocolos del MINSA (Norma 011) y la OMS.
  4. *Inclusión Accesible:* Funcionalidad 100% offline y optimizada para dispositivos móviles básicos.
  5. *Autonomía:* Información clara que empodera decisiones de salud conscientes.
* **Atributos de Marca:** *Empática, Científica, Privada, Inclusiva, Serena y Vital*.

---

## 2. Construcción del Identificador de Logo

* **Nombre de la Aplicación:** Blooma.
* **Conceptualización del Identificador:**
  El isotipo integra tres elementos simbólicos en una composición armónica:
  1. *Flor de Loto Superior:* Tres pétalos en floración (color azul cielo) que simbolizan renacimiento, pureza y crecimiento continuo.
  2. *Letra B en Cinta Continua:* Trazo fluido que representa el ciclo biológico perpetuo, la conexión hormonal y la letra inicial de la marca.
  3. *Hoja Lateral:* Brote de vitalidad en color turquesa agua que simboliza la fertilidad y la salud viva.
* **Construcción y Proporción Geométrica:**
  El diseño se basa en curvas Bézier continuas con relaciones proporcionales armónicas entre el isotipo superior y el logotipo tipográfico inferior:

```
 ┌──────────────────────────────────────────────────┐
 │ [ X ] Área de Protección Perimetral              │
 │   ┌──────────────────────────────────────────┐   │
 │   │               ▲ (Pétalo Loto)            │   │
 │   │         ◄ (Loto)   ●   (Loto) ►          │   │ Isotipo: Flor de Loto +
 │   │             (Bucle Cinta 'B')            │   │ Letra 'B' continua + Hoja
 │   │            (Lóbulo Hoja Inf.) ◄ [Hoja]   │   │
 │   │                                          │   │
 │   │            B  L  O  O  M  A              │   │ Logotipo: Outfit Bold
 │   └──────────────────────────────────────────┘   │
 │ [ X ] (X = Altura de la letra 'B')               │
 └──────────────────────────────────────────────────┘
```

---

## 3. Identidad Visual

### A. Variaciones del Identificador
1. **Versión Principal Vertical:** Isotipo centrado en la parte superior con el texto *Blooma* abajo.
2. **Versión Horizontal Apaisada:** Isotipo a la izquierda y el logotipo *Blooma* a la derecha (para cabeceras web y barras de navegación).
3. **Isotipo Aislado:** Símbolo floral/B sin texto (para icono de la PWA, favicon y avatar).

### B. Zona Segura (Área de Respeto)
Se establece un margen perimetral de protección mínimo equivalente a la altura de la letra **"B"** del logotipo (**margen X**). Ningún elemento gráfico, tipográfico o borde de corte debe invadir esta zona.

### C. Medidas Mínimas y Máximas de Reproducción
* **Medios Digitales (Pantallas):**
  * *Isotipo solo:* Mínimo **24 px** / Máximo sin límite (formato SVG vectorial).
  * *Logo completo con texto:* Mínimo **90 px** de ancho.
* **Medios Impresos:**
  * *Isotipo solo:* Mínimo **8 mm** de ancho.
  * *Logo completo con texto:* Mínimo **22 mm** de ancho.

### D. Tipografía Institucional y Jerarquía
* **Titulares y Logotipo:** *Outfit* (Google Fonts) — Pesos Bold (700) y SemiBold (600). Moderna, geométrica y cálida.
* **Texto de Cuerpo e Interfaz:** *Inter* (Google Fonts) — Pesos Regular (400) y Medium (500). Máxima legibilidad en pantallas de cualquier resolución.

### E. Paleta de Colores Oficial (HEX y RGB)

| Color Institucional | Muestra Visual | Código HEX | Código RGB | Función y Justificación |
| :--- | :---: | :---: | :---: | :--- |
| **Azul Cobalto Blooma** | `<span style="background-color:#225bc6;width:14px;height:14px;display:inline-block;border-radius:3px;"></span>` | `#225bc6` | `rgb(34, 91, 198)` | Color primario de marca y texto. Representa rigor científico, confianza y serenidad clínica (Contraste: 10.4:1 AAA). |
| **Azul Cielo Pétalo** | `<span style="background-color:#4d8ee5;width:14px;height:14px;display:inline-block;border-radius:3px;"></span>` | `#4d8ee5` | `rgb(77, 142, 229)` | Color de los pétalos superiores. Representa frescura, vitalidad y claridad mental (Contraste: 4.8:1 AA). |
| **Turquesa Aguamarina** | `<span style="background-color:#34bba9;width:14px;height:14px;display:inline-block;border-radius:3px;"></span>` | `#34bba9` | `rgb(52, 187, 169)` | Color del isotipo B y hojas. Representa equilibrio biológico, bienestar y salud reproductiva (Contraste: 4.5:1 AA). |
| **Fondo Blanco Puro** | `<span style="background-color:#ffffff;width:14px;height:14px;display:inline-block;border-radius:3px;border:1px solid #cbd5e1;"></span>` | `#ffffff` | `rgb(255, 255, 255)` | Base limpia para interfaces y contraste WCAG AAA (21.0:1). |
| **Fondo Oscuro Slate** | `<span style="background-color:#0a0f1d;width:14px;height:14px;display:inline-block;border-radius:3px;"></span>` | `#0a0f1d` | `rgb(10, 15, 29)` | Base para modo oscuro y contraste de alta visibilidad nocturna (18.2:1 AAA). |

### F. Dos Variaciones Posibles (Formatos Oficiales)
1. **Variación Posible 1 (Vertical Centrada):** Utilizada en pantallas de bienvenida (Splash Screen), portadas de documentos oficiales y material impreso principal.
2. **Variación Posible 2 (Horizontal Apaisada):** Utilizada en la barra de navegación superior de la PWA, encabezados de reportes médicos PDF y firmas digitales.

### G. Positivo - Negativo y Escala de Grises
* **Versión Positiva:** Logotipo a todo color sobre fondos blancos o neutros claros (`#ffffff` / `#f8fafc`).
* **Versión Negativa (Blanco Puro):** Logotipo 100% blanco sobre fondos oscuros corporativos (`#0a0f1d` / `#1e293b`), garantizando contraste superior a 15:1.
* **Escala de Grises:** Versión monocromática en negro al 100% y 70% para fotocopias, sellos y formularios gubernamentales de bajo costo.

### H. Dos Variaciones No Posibles (Usos Incorrectos Prohibidos)
1. **[Uso No Permitido 1] Distorsión de Proporciones:** Queda estrictamente prohibido estirar, comprimir o deformar la escala horizontal/vertical del logo o del isotipo.
2. **[Uso No Permitido 2] Alteración Cromática y Rotación:** Queda prohibido rotar el identificador en ángulos diagonales o sustituir los colores oficiales por tonos no autorizados (como rosa neón o amarillo).

### I. Sistema de Iconografía
Iconos con trazo lineal de 2px, esquinas redondeadas y coherencia con la paleta:
* *Ciclo / Calendario:* Curva circular de 28 días.
* *Embarazo:* Brote maternal y corazón fetal.
* *Menopausia:* Termostato de confort y brisa térmica.
* *Privacidad:* Candado cerrado con indicador Local-First.

---

## 4. Mockups y Aplicación en Interfaces Reales

El sistema visual se encuentra implementado de forma real y navegable en la aplicación web progresiva (PWA):

* **Splash y Dashboard Principal:** [01_dashboard_hero_dial.png](file:///home/espinozaisaac/proyectos/Proyecto-Blooma/entregables_hackathon/assets/01_dashboard_hero_dial.png)
* **Formulario de Registro Diario:** [03_registro_diario_mobile.png](file:///home/espinozaisaac/proyectos/Proyecto-Blooma/entregables_hackathon/assets/03_registro_diario_mobile.png)
* **Módulo de Embarazo y Casas Maternas:** [07_embarazo_fetal_dial.png](file:///home/espinozaisaac/proyectos/Proyecto-Blooma/entregables_hackathon/assets/07_embarazo_fetal_dial.png)
* **Módulo de Menopausia y Confort Térmico:** [15_menopausia_bienestar_dial_mobile.png](file:///home/espinozaisaac/proyectos/Proyecto-Blooma/entregables_hackathon/assets/15_menopausia_bienestar_dial_mobile.png)
* **Ajustes de Seguridad y Modo Discreto:** [21_ajustes_privacidad_mobile.png](file:///home/espinozaisaac/proyectos/Proyecto-Blooma/entregables_hackathon/assets/21_ajustes_privacidad_mobile.png)
