/**
 * Base de Datos de Recetas Tácticas Ampliada (64 Recetas de Élite)
 * 8 Categorías completas con 8 recetas cada una + Sistema de Recetas Privadas
 * Macros verificados con NutriDB (TACO/USDA) y modo de preparo estandarizado en español
 */
(function() {
  'use strict';

  const RECIPE_CATEGORIES = [
  {
    "id": "todos",
    "label": "Todas"
  },
  {
    "id": "desayuno",
    "label": "☀️ Desayuno"
  },
  {
    "id": "almuerzo",
    "label": "⚡ Almuerzo"
  },
  {
    "id": "cena",
    "label": "🌙 Cena"
  },
  {
    "id": "pre_post",
    "label": "🔥 Pre/Post Entreno"
  },
  {
    "id": "altas_proteinas",
    "label": "🥩 Altas Proteínas"
  },
  {
    "id": "bajas_calorias",
    "label": "🥗 Bajas Calorías"
  },
  {
    "id": "rapidas",
    "label": "⏱️ Rápidas (<15m)"
  },
  {
    "id": "postres",
    "label": "🥑 Postres & Snacks"
  },
  {
    "id": "mis_recetas",
    "label": "🔒 Mis Recetas Privadas"
  }
];

  const SYSTEM_RECIPES = [
  {
    "id": "rec_des_1",
    "title": "Omelette Táctico de Espinacas y Champiñones",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "12 min",
    "servings": "1 porción",
    "calories": 284,
    "protein": 22,
    "carbs": 5,
    "fats": 20,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
    "desc": "Desayuno alto en colina y proteína magra para mantener la insulina baja y acelerar la lipólisis.",
    "ingredients": [
      "3 huevos enteros de campo (150g)",
      "1 taza de espinacas frescas baby (50g)",
      "1/2 taza de champiñones laminados (60g)",
      "1 cucharadita de aceite de oliva (5ml)",
      "Sal marina, pimienta y orégano"
    ],
    "steps": [
      "Bate los 3 huevos en un tazón con una pizca de sal marina y pimienta.",
      "Calienta el aceite de oliva en sartén a fuego medio.",
      "Saltea champiñones y espinacas durante 2 minutos hasta reducir.",
      "Vierte los huevos batidos, tapa y cocina 3 minutos a fuego bajo.",
      "Dobla por la mitad y sirve caliente."
    ]
  },
  {
    "id": "rec_des_2",
    "title": "Tazón de Avena Militar con Frutos Rojos y Canela",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "8 min",
    "servings": "1 porción",
    "calories": 340,
    "protein": 16,
    "carbs": 52,
    "fats": 7,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=500&auto=format&fit=crop&q=80",
    "desc": "Carbohidratos complejos de bajo índice glucémico y antioxidantes para energía sostenida.",
    "ingredients": [
      "50g de avena en copos integrales",
      "200ml de leche de almendras sin azúcar o agua",
      "60g de arándanos o fresas frescas",
      "1 cucharadita de semillas de chía (5g)",
      "Canela de Ceilán en polvo al gusto"
    ],
    "steps": [
      "Cocina la avena con la leche de almendras y canela a fuego lento durante 5 minutos.",
      "Vierte en un tazón hondo.",
      "Corona con los frutos rojos frescos y las semillas de chía."
    ]
  },
  {
    "id": "rec_des_3",
    "title": "Tostadas Integrales con Aguacate y Huevos Pochados",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "10 min",
    "servings": "1 porción",
    "calories": 380,
    "protein": 21,
    "carbs": 32,
    "fats": 19,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
    "desc": "Ácidos grasos monoinsaturados y proteína de alto valor biológico para concentración mental.",
    "ingredients": [
      "2 rebanadas de pan 100% integral (60g)",
      "2 huevos enteros frescos",
      "50g de aguacate maduro triturado",
      "Copos de chile rojo y sal marina"
    ],
    "steps": [
      "Tuesta las rebanadas de pan integral hasta que queden crujientes.",
      "Cocina los huevos pochados en agua hirviendo con una gota de vinagre por 3 minutos.",
      "Unta el aguacate triturado sobre las tostadas y coloca un huevo encima de cada una.",
      "Sazona con copos de chile y sal marina."
    ]
  },
  {
    "id": "rec_des_4",
    "title": "Revuelto de Claras, Jamón de Pavo y Tomate Seco",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "8 min",
    "servings": "1 porción",
    "calories": 260,
    "protein": 34,
    "carbs": 8,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&auto=format&fit=crop&q=80",
    "desc": "Bomba proteica magra de digestión rápida para activar la síntesis proteica matutina.",
    "ingredients": [
      "1 huevo entero + 4 claras de huevo (160ml)",
      "60g de jamón de pechuga de pavo picado",
      "20g de tomates secos o cherry picados",
      "1 cucharadita de aceite de oliva (5ml)"
    ],
    "steps": [
      "Bate el huevo y las 4 claras con una pizca de sal.",
      "Dora el pavo y tomates en sartén con aceite durante 2 minutos.",
      "Vierte las claras y remueve suavemente a fuego lento hasta lograr textura cremosa."
    ]
  },
  {
    "id": "rec_des_5",
    "title": "Pancakes de Requesón y Plátano Sin Harinas Refinadas",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "12 min",
    "servings": "1 porción",
    "calories": 320,
    "protein": 28,
    "carbs": 38,
    "fats": 6,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80",
    "desc": "Desayuno proteico delicioso con carbohidratos naturales de asimilación controlada.",
    "ingredients": [
      "100g de requesón o queso ricotta magro",
      "1 huevo entero + 2 claras",
      "1 plátano maduro pequeño (80g)",
      "25g de harina de avena",
      "Canela en polvo"
    ],
    "steps": [
      "Tritura todos los ingredientes en licuadora hasta lograr mezcla homogénea.",
      "Vierte porciones en sartén antiadherente caliente con spray de aceite.",
      "Cocina 2 minutos por lado hasta que doren.",
      "Sirve tibio."
    ]
  },
  {
    "id": "rec_des_6",
    "title": "Bowl de Yogur Griego, Semillas de Calabaza y Kiwi",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "5 min",
    "servings": "1 porción",
    "calories": 290,
    "protein": 24,
    "carbs": 28,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
    "desc": "Probióticos y vitamina C para reforzar el sistema inmune de atletas en entrenamiento diario.",
    "ingredients": [
      "200g de yogur griego natural sin azúcar",
      "1 kiwi maduro pelado y en rodajas (90g)",
      "15g de semillas de calabaza tostadas",
      "1 cucharadita de semillas de lino molidas"
    ],
    "steps": [
      "Sirve el yogur griego en un cuenco hondo.",
      "Decora con las rodajas de kiwi y espolvorea con semillas de calabaza y lino."
    ]
  },
  {
    "id": "rec_des_7",
    "title": "Shakshuka Táctica (Huevos en Salsa de Tomate y Pimientos)",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "15 min",
    "servings": "1 porción",
    "calories": 310,
    "protein": 22,
    "carbs": 16,
    "fats": 17,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80",
    "desc": "Receta mediterránea antiinflamatoria rica en licopeno y minerales esenciales.",
    "ingredients": [
      "2 huevos grandes de campo",
      "150g de tomate triturado natural",
      "1/2 pimiento rojo en tiras finas (60g)",
      "1/4 cebolla morada picada",
      "Comino, pimentón dulce y perejil fresco"
    ],
    "steps": [
      "Soffríe la cebolla y pimiento en sartén con unas gotas de aceite durante 4 minutos.",
      "Agrega el tomate y especias, dejando hervir suave 5 minutos.",
      "Haz dos huecos con la cuchara y casca los huevos en ellos.",
      "Tapa la sartén y cocina 4 minutos a fuego lento hasta que las claras cuajen con yemas líquidas."
    ]
  },
  {
    "id": "rec_des_8",
    "title": "Waffles Tácticos de Avena y Claras de Huevo",
    "category": "desayuno",
    "categoryLabel": "Desayuno",
    "time": "10 min",
    "servings": "2 waffles",
    "calories": 275,
    "protein": 26,
    "carbs": 32,
    "fats": 4.5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80",
    "desc": "Textura crocante exterior y esponjosa interior con ratio de carbohidrato/proteína ideal.",
    "ingredients": [
      "40g de avena molida",
      "4 claras de huevo (140ml)",
      "1 cucharada de queso cottage desnatado (25g)",
      "Esencia de vainilla y canela"
    ],
    "steps": [
      "Licúa todos los ingredientes por 30 segundos.",
      "Vierte en la gofrera o sartén antiadherente caliente.",
      "Cocina hasta dorar y acompaña con unas gotas de estevia."
    ]
  },
  {
    "id": "rec_alm_1",
    "title": "Bowl Militar de Pollo al Limón, Aguacate y Arroz",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "20 min",
    "servings": "1 porción",
    "calories": 578,
    "protein": 68,
    "carbs": 43,
    "fats": 14,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    "desc": "Comida central de alto rendimiento biológico con absorción limpia de nutrientes.",
    "ingredients": [
      "200g de pechuga de pollo cortada en cubos",
      "120g de arroz jazmín o basmati cocido",
      "40g de aguacate maduro en rodajas",
      "1 taza de brócoli al vapor (80g)",
      "Zumo de 1 limón, ajo en polvo y sal marina"
    ],
    "steps": [
      "Dora el pollo en sartén bien caliente con el ajo, sal y zumo de limón durante 6 minutos.",
      "Cocina el brócoli al vapor durante 4 minutos (debe quedar crujiente).",
      "En un cuenco hondo, arma la base de arroz, coloca el pollo dorado, el brócoli y corona con aguacate."
    ]
  },
  {
    "id": "rec_alm_2",
    "title": "Bife Magro con Batata Asada y Espárragos",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "22 min",
    "servings": "1 porción",
    "calories": 490,
    "protein": 44,
    "carbs": 46,
    "fats": 13,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=80",
    "desc": "Hierro hemo, creatina natural y potasio para recargar la fuerza de los músculos principales.",
    "ingredients": [
      "180g de lomo o ternera magra sin grasa visible",
      "150g de boniato/batata cortado en gajos asado",
      "6 espárragos verdes frescos (80g)",
      "Romero fresco, pimienta y sal gruesa"
    ],
    "steps": [
      "Hornea los gajos de batata a 200°C durante 18 minutos con romero y sal.",
      "Pasa los espárragos por la plancha 3 minutos con gotas de aceite.",
      "Sella el bife de ternera a fuego muy alto durante 2 minutos por lado.",
      "Deja reposar la carne 1 minuto antes de servir."
    ]
  },
  {
    "id": "rec_alm_3",
    "title": "Filete de Salmón con Quinoa Real y Verduras Salteadas",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "18 min",
    "servings": "1 porción",
    "calories": 510,
    "protein": 38,
    "carbs": 40,
    "fats": 20,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80",
    "desc": "Omega-3 EPA/DHA de alto impacto antiinflamatorio para acelerar la recuperación de articulaciones.",
    "ingredients": [
      "160g de lomo de salmón fresco con piel",
      "100g de quinoa cocida",
      "1 calabacín pequeño en dados (100g)",
      "Eneldo fresco, limón y sal marina"
    ],
    "steps": [
      "Sella el salmón en sartén caliente por el lado de la piel durante 4 minutos hasta dorar.",
      "Voltea y cocina 2 minutos más.",
      "Saltea el calabacín con la quinoa en otra sartén durante 3 minutos.",
      "Sirve el salmón sobre el lecho de quinoa con zumo de limón y eneldo."
    ]
  },
  {
    "id": "rec_alm_4",
    "title": "Pechuga Rellena de Espinacas y Ricota con Arroz Integral",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "25 min",
    "servings": "1 porción",
    "calories": 470,
    "protein": 50,
    "carbs": 45,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=80",
    "desc": "Comida anabólica con densidad de aminoácidos para jornadas de alto volumen calisténico.",
    "ingredients": [
      "200g de pechuga de pollo abierta en mariposa",
      "50g de ricota magra o requesón 0%",
      "60g de espinacas cocidas bien escurridas",
      "120g de arroz integral cocido al vapor",
      "Ajo en polvo y pimentón"
    ],
    "steps": [
      "Sazona el pollo con ajo, pimentón y sal marina.",
      "Mezcla la ricota y espinacas, rellenando el centro de la pechuga.",
      "Cierra con palillos y dora en sartén tapada durante 12 minutos girando con cuidado.",
      "Sirve junto al arroz integral."
    ]
  },
  {
    "id": "rec_alm_5",
    "title": "Lentejas Estofadas con Lomo de Cerdo Magro y Verduras",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "22 min",
    "servings": "1 porción",
    "calories": 460,
    "protein": 42,
    "carbs": 50,
    "fats": 7,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80",
    "desc": "Fibra prebiótica, hierro no hemo y proteína vegetal/animal para saciedad total de 5 horas.",
    "ingredients": [
      "150g de lentejas cocidas de bote lavadas",
      "140g de lomo de cerdo extra magro en dados",
      "1 zanahoria mediana en rodajas (60g)",
      "1 hoja de laurel y pimentón de la Vera"
    ],
    "steps": [
      "Saltea los dados de cerdo en una cacerola pequeña con unas gotas de aceite hasta dorar.",
      "Añade la zanahoria, el laurel y el pimentón.",
      "Agrega las lentejas cocidas y 150ml de agua o caldo desgrasado.",
      "Cocina a fuego medio durante 10 minutos para integrar sabores."
    ]
  },
  {
    "id": "rec_alm_6",
    "title": "Bowl Pescador de Atún Fresco Marinado con Edamame y Arroz",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "15 min",
    "servings": "1 porción",
    "calories": 480,
    "protein": 46,
    "carbs": 48,
    "fats": 10,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    "desc": "Proteína pura del mar con soja edamame rica en glutamina para reconstrucción muscular.",
    "ingredients": [
      "160g de atún fresco cortado en cubos",
      "120g de arroz de sushi o basmati cocido",
      "60g de edamames cocidos pelados",
      "1 cucharada de salsa de soja baja en sodio y semillas de sésamo"
    ],
    "steps": [
      "Marina los cubos de atún 5 minutos con salsa de soja y toque de jengibre.",
      "En un bol coloca el arroz tibio.",
      "Añade el atún marinado, los edamames y decora con sésamo."
    ]
  },
  {
    "id": "rec_alm_7",
    "title": "Pavo a la Plancha con Puré Rústico de Calabaza y Nueces",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "18 min",
    "servings": "1 porción",
    "calories": 420,
    "protein": 45,
    "carbs": 32,
    "fats": 11,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&auto=format&fit=crop&q=80",
    "desc": "L-Triptófano y betacarotenos para regular el estrés oxidativo y mantener la lucidez mental.",
    "ingredients": [
      "180g de solomillo o filete de pavo",
      "200g de calabaza cocida triturada",
      "15g de nueces picadas",
      "Nuez moscada y sal marina"
    ],
    "steps": [
      "Mezcla la calabaza triturada con sal marina y nuez moscada.",
      "Haz el pavo a la plancha muy caliente durante 3 minutos por lado.",
      "Sirve sobre el puré y espolvorea las nueces picadas encima."
    ]
  },
  {
    "id": "rec_alm_8",
    "title": "Arroz Integral Salteado con Tofu Firme, Pollo y Verduras Wok",
    "category": "almuerzo",
    "categoryLabel": "Almuerzo",
    "time": "16 min",
    "servings": "1 porción",
    "calories": 460,
    "protein": 47,
    "carbs": 45,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
    "desc": "Combinación táctica híbrida de proteína animal y vegetal con vegetales crujientes al dente.",
    "ingredients": [
      "120g de pechuga de pollo en tiras",
      "80g de tofu firme en cubos prensado",
      "100g de arroz integral cocido",
      "1 taza de pimientos y cebolla en juliana (100g)"
    ],
    "steps": [
      "Saltea el pollo y tofu en sartén bien caliente con spray de aceite 5 minutos.",
      "Agrega las verduras y saltea 3 minutos a fuego alto.",
      "Incorpora el arroz integral, mezcla y condimenta con salsa de soja."
    ]
  },
  {
    "id": "rec_cen_1",
    "title": "Pescado Blanco en Papillote con Verduras de Huerta",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "20 min",
    "servings": "1 porción",
    "calories": 304,
    "protein": 48,
    "carbs": 6,
    "fats": 10,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80",
    "desc": "Cena de máxima digestibilidad que no interrumpe el descanso profundo ni la hormona del crecimiento.",
    "ingredients": [
      "180g de filete de merluza, bacalao o lenguado",
      "1/2 calabacín laminado (80g)",
      "1/2 zanahoria en tiras finas (40g)",
      "1 cucharadita de aceite de oliva (5ml)",
      "Hierbas provenzales, sal y limón"
    ],
    "steps": [
      "Extiende una hoja de papel de horno o aluminio.",
      "Coloca la base de verduras y encima el filete de pescado.",
      "Rocía con el aceite, sal, hierbas y unas rodajas finas de limón.",
      "Cierra el paquete herméticamente y hornea a 190°C durante 15 minutos."
    ]
  },
  {
    "id": "rec_cen_2",
    "title": "Ensalada Tibia de Pavo Salteado y Nueces",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "12 min",
    "servings": "1 porción",
    "calories": 320,
    "protein": 36,
    "carbs": 8,
    "fats": 15,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
    "desc": "Baja en carbohidratos, rica en magnesio y L-triptófano para inducir sueño reparador.",
    "ingredients": [
      "150g de pechuga de pavo cortada en tiras",
      "100g de mezcla de hojas verdes (rúcula, espinaca baby)",
      "15g de nueces troceadas",
      "1 cucharadita de vinagre de manzana y orégano"
    ],
    "steps": [
      "Saltea las tiras de pavo con orégano y sal marina hasta dorar.",
      "En un bol coloca las hojas verdes frescas.",
      "Añade el pavo tibio sobre las hojas y decora con las nueces.",
      "Aliña con el vinagre de manzana."
    ]
  },
  {
    "id": "rec_cen_3",
    "title": "Crema de Calabacín y Pollo Desmechado con Chía",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "18 min",
    "servings": "1 porción",
    "calories": 280,
    "protein": 38,
    "carbs": 12,
    "fats": 8,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80",
    "desc": "Caliente, saciante y libre de pesadez nocturna.",
    "ingredients": [
      "150g de pechuga de pollo hervida desmechada",
      "1 calabacín mediano cortado (200g)",
      "1/2 puerro (40g)",
      "1 cucharadita de chía (5g)",
      "Nuez moscada y sal marina"
    ],
    "steps": [
      "Hierve el calabacín y puerro en agua durante 10 minutos.",
      "Tritura con batidora hasta obtener crema fina.",
      "Sirve caliente en un cuenco con el pollo desmechado por encima y las semillas de chía."
    ]
  },
  {
    "id": "rec_cen_4",
    "title": "Hamburguesas Caseras de Ternera Magra al Plato con Ensalada",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "15 min",
    "servings": "1 porción",
    "calories": 340,
    "protein": 42,
    "carbs": 6,
    "fats": 16,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
    "desc": "Zinc y hierro para recuperación de testosterona nocturna sin carbohidratos rápidos.",
    "ingredients": [
      "180g de carne picada de ternera magra (<5% grasa)",
      "1 clara de huevo para ligar",
      "100g de hojas verdes y tomate cherry",
      "Ajo, perejil, sal marina y pimienta"
    ],
    "steps": [
      "Mezcla la carne con la clara, ajo, perejil y sal marina.",
      "Forma dos medallones y cocina en plancha 3 minutos por lado.",
      "Acompaña de la ensalada verde aliñada con limón."
    ]
  },
  {
    "id": "rec_cen_5",
    "title": "Tortilla Francesa de 2 Huevos y Espárragos Verdes con Queso Cottage",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "10 min",
    "servings": "1 porción",
    "calories": 270,
    "protein": 26,
    "carbs": 6,
    "fats": 14,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&auto=format&fit=crop&q=80",
    "desc": "Caseína natural y proteína de absorción mixta para nutrición nocturna continua.",
    "ingredients": [
      "2 huevos enteros frescos",
      "6 espárragos trigueros cortados en trozos (70g)",
      "40g de queso cottage 0% grasa",
      "Sal marina y cebollino"
    ],
    "steps": [
      "Saltea los espárragos en sartén 3 minutos con spray de aceite.",
      "Bate los huevos con sal y vierte sobre los espárragos.",
      "Cocina a fuego bajo, rellena con el queso cottage en el centro y dobla."
    ]
  },
  {
    "id": "rec_cen_6",
    "title": "Calamares a la Plancha con Ajo, Perejil y Ensalada de Canónigos",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "12 min",
    "servings": "1 porción",
    "calories": 250,
    "protein": 36,
    "carbs": 5,
    "fats": 7,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=80",
    "desc": "Proteína marina ultra magra con menos de 250 kcal totales para definición rápida.",
    "ingredients": [
      "200g de anillas o tubos de calamar limpios",
      "1 diente de ajo picado fino y perejil fresco",
      "80g de canónigos frescos",
      "1 cucharadita de aceite de oliva (5ml) y limón"
    ],
    "steps": [
      "Seca bien los calamares con papel de cocina.",
      "Cocina en plancha muy caliente durante 2 minutos por lado con el ajo y perejil.",
      "Rocía con limón y sirve con los canónigos."
    ]
  },
  {
    "id": "rec_cen_7",
    "title": "Wok Nocturno de Tofu Salteado con Champiñones y Brotes",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "14 min",
    "servings": "1 porción",
    "calories": 260,
    "protein": 26,
    "carbs": 11,
    "fats": 11,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    "desc": "Proteína vegetal limpia y antioxidantes con digestión ligera para noches de descanso.",
    "ingredients": [
      "180g de tofu firme en cubos prensado",
      "100g de champiñones laminados",
      "50g de brotes de soja",
      "Salsa de soja ligera y jengibre en polvo"
    ],
    "steps": [
      "Dora el tofu en sartén antiadherente hasta que tome tono dorado.",
      "Agrega los champiñones y brotes, salteando 4 minutos.",
      "Sazona con salsa de soja y jengibre."
    ]
  },
  {
    "id": "rec_cen_8",
    "title": "Brochetas de Pollo y Verduras Asadas al Romero",
    "category": "cena",
    "categoryLabel": "Cena",
    "time": "16 min",
    "servings": "2 brochetas",
    "calories": 290,
    "protein": 40,
    "carbs": 8,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80",
    "desc": "Formato visual entretenido y apetitoso con balance perfecto para cerrar la jornada.",
    "ingredients": [
      "180g de pechuga de pollo cortada en dados gruesos",
      "1/2 pimiento verde y 1/2 cebolla en trozos",
      "4 tomates cherry",
      "Romero seco, ajo en polvo y sal"
    ],
    "steps": [
      "Ensarta alternadamente el pollo, pimiento, cebolla y tomates en brochetas de madera.",
      "Cocina en plancha caliente durante 8 minutos girando cada 2 minutos.",
      "Sirve caliente."
    ]
  },
  {
    "id": "rec_pre_1",
    "title": "Batido Táctico Pre-Misión (Energía Inmediata)",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "5 min",
    "servings": "1 batido",
    "calories": 206,
    "protein": 6,
    "carbs": 43,
    "fats": 2,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80",
    "desc": "Consumir 45 minutos antes del entrenamiento para elevar el glucógeno y la fuerza muscular.",
    "ingredients": [
      "1 plátano maduro mediano (100g)",
      "30g de copos de avena fina",
      "1 vaso de agua o leche vegetal (200ml)",
      "1 cucharadita de café instantáneo (opcional)"
    ],
    "steps": [
      "Coloca todos los ingredientes en la licuadora.",
      "Tritura 45 segundos hasta obtener textura uniforme y suave.",
      "Bebe 45 minutos antes de iniciar tu misión."
    ]
  },
  {
    "id": "rec_pre_2",
    "title": "Pancakes Tácticos de Avena y Claras (Post-Entreno)",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "12 min",
    "servings": "1 porción",
    "calories": 330,
    "protein": 32,
    "carbs": 42,
    "fats": 4,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80",
    "desc": "Ventana de recuperación muscular inmediata con leucina y carbohidratos no inflamatorios.",
    "ingredients": [
      "4 claras de huevo (140ml)",
      "50g de avena molida",
      "1 cucharadita de canela",
      "1 cucharadita de miel pura de abeja (10g)"
    ],
    "steps": [
      "Bate las claras con la avena molida y la canela.",
      "Cocina en sartén antiadherente a fuego medio 2 minutos por lado.",
      "Sirve caliente con los hilos de miel pura por encima."
    ]
  },
  {
    "id": "rec_pre_3",
    "title": "Batido Post-Entreno de Cacao, Plátano y Proteína Aislada",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "5 min",
    "servings": "1 batido",
    "calories": 310,
    "protein": 36,
    "carbs": 38,
    "fats": 3,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80",
    "desc": "Recuperación anabólica rápida tras entrenamientos intensos de calistenia.",
    "ingredients": [
      "1 scoop de proteína aislada de suero o vegetal (30g)",
      "1 plátano maduro (100g)",
      "1 cucharada de cacao puro desgrasado (10g)",
      "250ml de agua fría o bebida vegetal sin azúcar"
    ],
    "steps": [
      "Mezcla el plátano, proteína, cacao y agua en batidora con 2 cubos de hielo.",
      "Licúa a potencia alta 40 segundos.",
      "Consumir dentro de los 45 minutos posteriores al entrenamiento."
    ]
  },
  {
    "id": "rec_pre_4",
    "title": "Bol de Yogur Griego, Miel Pura y Almendras Pre-Fuerza",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "4 min",
    "servings": "1 porción",
    "calories": 270,
    "protein": 22,
    "carbs": 26,
    "fats": 8,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
    "desc": "Energía sostenida sin picos glucémicos para sesiones de calistenia de más de 30 minutos.",
    "ingredients": [
      "170g de yogur griego natural 0%",
      "1 cucharada de miel de abeja pura (15g)",
      "10 almendras crudas picadas (15g)",
      "Canela en polvo"
    ],
    "steps": [
      "Coloca el yogur griego en un cuenco.",
      "Añade la miel, las almendras picadas y espolvorea con canela."
    ]
  },
  {
    "id": "rec_pre_5",
    "title": "Arroz con Leche Proteico Fit de Vainilla y Canela",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "15 min",
    "servings": "1 porción",
    "calories": 290,
    "protein": 26,
    "carbs": 42,
    "fats": 2,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=500&auto=format&fit=crop&q=80",
    "desc": "Glucógeno de fácil digestión para recargar músculos tras días de alta exigencia.",
    "ingredients": [
      "100g de arroz blanco ya cocido",
      "150ml de leche desnatada o vegetal",
      "20g de proteína de vainilla o 3 claras de huevo",
      "Canela y piel de limón"
    ],
    "steps": [
      "Calienta el arroz con la leche y piel de limón 5 minutos a fuego suave.",
      "Retira la piel de limón, añade la proteína disuelta y remueve enérgicamente.",
      "Sirve espolvoreado con canela abundante."
    ]
  },
  {
    "id": "rec_pre_6",
    "title": "Tostada Energética de Centeno con Mantequilla de Maní y Plátano",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "4 min",
    "servings": "1 tostada",
    "calories": 260,
    "protein": 9,
    "carbs": 36,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
    "desc": "Snack pre-entreno clásico de calisténicos para consumir 60 minutos antes.",
    "ingredients": [
      "1 rebanada de pan de centeno integral (40g)",
      "15g de mantequilla de cacahuete 100% natural",
      "1/2 plátano en rodajas finas (50g)",
      "Semillas de chía"
    ],
    "steps": [
      "Tuesta el pan de centeno.",
      "Unta la mantequilla de cacahuete, acomoda las rodajas de plátano y espolvorea chía."
    ]
  },
  {
    "id": "rec_pre_7",
    "title": "Tortitas de Claras y Manzana con Toque de Jengibre",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "10 min",
    "servings": "1 porción",
    "calories": 220,
    "protein": 24,
    "carbs": 26,
    "fats": 2,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80",
    "desc": "Digestión ultra liviana y acción termogénica suave con jengibre fresco.",
    "ingredients": [
      "4 claras de huevo frescas (140ml)",
      "1/2 manzana rallada (70g)",
      "20g de harina de avena",
      "Jengibre y canela rallados"
    ],
    "steps": [
      "Bate las claras con la avena, la manzana rallada y el jengibre.",
      "Dora en sartén caliente 2 minutos por lado.",
      "Sirve caliente."
    ]
  },
  {
    "id": "rec_pre_8",
    "title": "Sándwich Táctico de Pavo y Huevo en Pan de Masa Madre",
    "category": "pre_post",
    "categoryLabel": "Pre/Post Entreno",
    "time": "8 min",
    "servings": "1 sándwich",
    "calories": 340,
    "protein": 30,
    "carbs": 32,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80",
    "desc": "Comida sólida y práctica para cuando entrenas fuera de casa o en parques de barras.",
    "ingredients": [
      "2 rebanadas de pan de masa madre (60g)",
      "80g de pechuga de pavo asada",
      "1 huevo cocido en rodajas",
      "Hojas de espinaca baby y mostaza de Dijon"
    ],
    "steps": [
      "Unta la mostaza de Dijon sobre una rebanada de pan.",
      "Arma capas con el pavo, las rodajas de huevo y la espinaca fresca.",
      "Cierra el sándwich y corta en diagonal."
    ]
  },
  {
    "id": "rec_pro_1",
    "title": "Wrap Anabólico de Atún, Claras y Mostaza Dijon",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "8 min",
    "servings": "1 wrap",
    "calories": 286,
    "protein": 42,
    "carbs": 21,
    "fats": 3,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=80",
    "desc": "Más de 40g de proteína magra con casi nada de grasa; ideal para corte de definición.",
    "ingredients": [
      "1 tortilla integral grande",
      "1 lata de atún al natural escurrida (110g)",
      "2 claras de huevo cocidas picadas",
      "1 cucharadita de mostaza Dijon y hojas de lechuga"
    ],
    "steps": [
      "Mezcla el atún escurrido con las claras picadas y la mostaza.",
      "Coloca en el centro de la tortilla con la lechuga fresca.",
      "Enrolla apretando los extremos y tuesta 2 minutos en sartén para sellar."
    ]
  },
  {
    "id": "rec_pro_2",
    "title": "Solomillo de Cerdo Magro con Puré de Guisantes",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "20 min",
    "servings": "1 porción",
    "calories": 420,
    "protein": 48,
    "carbs": 28,
    "fats": 11,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&auto=format&fit=crop&q=80",
    "desc": "Corte magro con alto contenido de vitamina B1 y zinc para síntesis proteica óptima.",
    "ingredients": [
      "200g de solomillo de cerdo desgrasado en medallones",
      "150g de guisantes verdes cocidos",
      "1 cucharadita de aceite de oliva (5ml)",
      "Romero fresco y sal gruesa"
    ],
    "steps": [
      "Tritura los guisantes con sal marina y aceite hasta lograr un puré rústico.",
      "Sella los medallones de solomillo en plancha muy caliente durante 3 minutos por lado.",
      "Sirve la carne sobre el puré de guisantes."
    ]
  },
  {
    "id": "rec_pro_3",
    "title": "Ensalada Anabólica de Garbanzos, Atún y Huevo Duro",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "10 min",
    "servings": "1 porción",
    "calories": 440,
    "protein": 46,
    "carbs": 35,
    "fats": 12,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
    "desc": "Combinación balanceada de proteína vegetal y animal con fibra soluble saciante.",
    "ingredients": [
      "120g de garbanzos cocidos lavados y escurridos",
      "1 lata de atún al natural (100g escurrido)",
      "1 huevo duro grande picado",
      "1 tomate picado en cubos y vinagre de manzana"
    ],
    "steps": [
      "Mezcla los garbanzos con el atún desmenuzado, el huevo picado y el tomate.",
      "Sazona con vinagre de manzana, sal marina y orégano."
    ]
  },
  {
    "id": "rec_pro_4",
    "title": "Pechuga a la Parrilla con Costra de Semillas de Cáñamo",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "18 min",
    "servings": "1 porción",
    "calories": 430,
    "protein": 52,
    "carbs": 6,
    "fats": 19,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    "desc": "52 gramos de proteína pura con ácidos grasos esenciales para articulaciones.",
    "ingredients": [
      "220g de pechuga de pollo",
      "20g de semillas de cáñamo o sésamo",
      "Zumo de medio limón, sal y pimienta"
    ],
    "steps": [
      "Pasa la pechuga por limón y rebózala en las semillas presionando firmemente.",
      "Cocina a fuego medio en plancha durante 6 minutos por lado hasta que las semillas doren."
    ]
  },
  {
    "id": "rec_pro_5",
    "title": "Tarta Fit de Claras, Pavo y Queso 0% en Sartén",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "12 min",
    "servings": "1 porción grande",
    "calories": 310,
    "protein": 44,
    "carbs": 6,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&auto=format&fit=crop&q=80",
    "desc": "Alto volumen y textura suave con máxima pureza de macronutrientes.",
    "ingredients": [
      "6 claras de huevo + 1 huevo entero",
      "80g de jamón de pavo picado en dados",
      "40g de queso bajo en grasa rallado",
      "Orégano y sal marina"
    ],
    "steps": [
      "Bate los huevos con sal y orégano.",
      "Vierte en sartén con el pavo y queso distribuido uniformemente.",
      "Tapa y cocina a fuego muy bajo durante 8 minutos hasta que cuaje por completo."
    ]
  },
  {
    "id": "rec_pro_6",
    "title": "Bowl Proteico de Requesón, Proteína Aislada y Almendras",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "3 min",
    "servings": "1 porción",
    "calories": 340,
    "protein": 45,
    "carbs": 12,
    "fats": 11,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
    "desc": "Snack denso en caseína micelar para períodos largos de ayuno o descanso nocturno.",
    "ingredients": [
      "180g de requesón magro o queso quark",
      "20g de proteína de suero aislada en polvo",
      "15g de almendras picadas",
      "Canela y gotas de estevia"
    ],
    "steps": [
      "Bate el requesón con la proteína en polvo y unas gotas de estevia hasta lograr crema lisa.",
      "Decora con las almendras picadas y canela."
    ]
  },
  {
    "id": "rec_pro_7",
    "title": "Tataki de Lomo de Ternera Sellado con Soja y Sésamo",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "12 min",
    "servings": "1 porción",
    "calories": 390,
    "protein": 49,
    "carbs": 5,
    "fats": 18,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=80",
    "desc": "Sellado a fuego extremo manteniendo el interior jugoso y cargado de nutrientes.",
    "ingredients": [
      "200g de lomo de ternera magra en pieza gruesa",
      "1 cucharada de salsa de soja",
      "10g de semillas de sésamo tostado",
      "Jengibre rallado"
    ],
    "steps": [
      "Sella la pieza de carne en sartén muy caliente 1 minuto por cada uno de sus lados.",
      "Corta en láminas finas en diagonal.",
      "Baña con salsa de soja y espolvorea sésamo."
    ]
  },
  {
    "id": "rec_pro_8",
    "title": "Cazuela Marinera de Merluza y Gambas al Ajillo Suave",
    "category": "altas_proteinas",
    "categoryLabel": "Altas Proteínas",
    "time": "15 min",
    "servings": "1 porción",
    "calories": 320,
    "protein": 46,
    "carbs": 4,
    "fats": 12,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=500&auto=format&fit=crop&q=80",
    "desc": "Pescado blanco y marisco para un aporte masivo de proteína con mínima carga calórica.",
    "ingredients": [
      "150g de filete de merluza en dados",
      "100g de gambas o langostinos pelados",
      "1 diente de ajo laminado y guindilla al gusto",
      "1 cucharadita de aceite de oliva (5ml) y perejil"
    ],
    "steps": [
      "Dora el ajo laminado en sartén con el aceite sin quemar.",
      "Añade las gambas y los dados de merluza salteando 4 minutos.",
      "Corona con perejil fresco picado y sirve caliente."
    ]
  },
  {
    "id": "rec_cal_1",
    "title": "Wok Liviano de Pollo y Verduras Crujientes",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "15 min",
    "servings": "1 porción grande",
    "calories": 325,
    "protein": 58,
    "carbs": 6,
    "fats": 7,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80",
    "desc": "Gran volumen en el plato con menos de 300 kcal para períodos estrictos de pérdida de grasa.",
    "ingredients": [
      "180g de pechuga de pollo en tiras",
      "1 taza de brócoli en ramilletes pequeños (80g)",
      "1/2 pimiento rojo en tiras (60g)",
      "Salsa de soja baja en sodio y gotas de aceite"
    ],
    "steps": [
      "Dora el pollo en sartén wok bien caliente durante 4 minutos.",
      "Añade las verduras y 2 cucharadas de agua para que se cocinen al vapor mientras se doran.",
      "Añade salsa de soja y sirve crujiente."
    ]
  },
  {
    "id": "rec_cal_2",
    "title": "Zoodles (Espaguetis de Calabacín) con Boloñesa Magra",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "15 min",
    "servings": "1 porción",
    "calories": 260,
    "protein": 36,
    "carbs": 11,
    "fats": 7,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80",
    "desc": "Sustitución perfecta de pastas tradicionales con densidad calórica 5 veces menor.",
    "ingredients": [
      "2 calabacines medianos en espirales (zoodles, 300g)",
      "150g de carne picada de pavo o ternera extra magra",
      "100g de tomate triturado natural sin azúcar",
      "Orégano y albahaca fresca"
    ],
    "steps": [
      "Cocina la carne picada con sal y orégano hasta que cambie de color.",
      "Añade el tomate triturado y deja reducir 5 minutos a fuego medio.",
      "Saltea los zoodles durante solo 2 minutos para que queden al dente.",
      "Vierte la boloñesa caliente sobre los zoodles."
    ]
  },
  {
    "id": "rec_cal_3",
    "title": "Sopa Termogénica de Pollo, Jengibre y Espinacas",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "14 min",
    "servings": "1 porción grande",
    "calories": 210,
    "protein": 32,
    "carbs": 6,
    "fats": 5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80",
    "desc": "Acción termogénica con jengibre fresco que estimula el gasto calórico basal.",
    "ingredients": [
      "140g de pechuga de pollo en tiras finas",
      "1 taza colmada de espinacas baby (60g)",
      "1 cucharadita de jengibre fresco rallado",
      "300ml de caldo de verduras o pollo desgrasado"
    ],
    "steps": [
      "Hierve el caldo con el jengibre rallado.",
      "Añade las tiras de pollo y cocina 5 minutos a fuego medio.",
      "Agrega las espinacas, apaga el fuego y sirve caliente."
    ]
  },
  {
    "id": "rec_cal_4",
    "title": "Carpaccio de Champiñones Portobello con Limón y Tiras de Pavo",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "8 min",
    "servings": "1 porción",
    "calories": 190,
    "protein": 28,
    "carbs": 5,
    "fats": 5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
    "desc": "Menos de 200 kcal con alto impacto visual y sensorial.",
    "ingredients": [
      "120g de pechuga de pavo asada cortada en finas lonchas",
      "100g de champiñones portobello cortados en láminas muy finas",
      "Zumo de 1 limón verde y pimienta negra recién molida",
      "1 cucharadita de aceite de oliva (5ml)"
    ],
    "steps": [
      "Extiende las láminas de champiñones en un plato grande.",
      "Acomoda las lonchas de pavo intercaladas.",
      "Aliña con el zumo de limón, aceite de oliva y pimienta negra."
    ]
  },
  {
    "id": "rec_cal_5",
    "title": "Ensalada Verde Desintoxicante con Pepino, Atún y Cilantro",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "6 min",
    "servings": "1 bol grande",
    "calories": 220,
    "protein": 34,
    "carbs": 6,
    "fats": 5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
    "desc": "Diurética natural rica en potasio para eliminar retención de líquidos.",
    "ingredients": [
      "1 lata de atún al natural escurrida (100g)",
      "1 pepino mediano en rodajas finas (150g)",
      "80g de lechuga romana o espinaca baby",
      "Cilantro fresco picado y vinagre de manzana"
    ],
    "steps": [
      "Mezcla en un tazón el pepino, las hojas verdes y el cilantro.",
      "Añade el atún escurrido por encima.",
      "Sazona con vinagre de manzana y sal marina."
    ]
  },
  {
    "id": "rec_cal_6",
    "title": "Revuelto de Espárragos Trigueros y Claras con Pimienta Rosa",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "8 min",
    "servings": "1 porción",
    "calories": 160,
    "protein": 26,
    "carbs": 5,
    "fats": 2,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&auto=format&fit=crop&q=80",
    "desc": "Aporte de proteína pura con la menor densidad calórica del protocolo.",
    "ingredients": [
      "5 claras de huevo frescas (160ml)",
      "80g de espárragos trigueros cortados",
      "Pimienta rosa en grano y sal marina"
    ],
    "steps": [
      "Saltea los espárragos en sartén 3 minutos con spray de aceite.",
      "Vierte las claras y revuelve suavemente a fuego lento.",
      "Corona con pimienta rosa molida al instante."
    ]
  },
  {
    "id": "rec_cal_7",
    "title": "Merluza al Vapor con Jengibre y Ensalada de Rúcula",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "12 min",
    "servings": "1 porción",
    "calories": 210,
    "protein": 34,
    "carbs": 3,
    "fats": 5.5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=80",
    "desc": "Pescado blanco al vapor preservando todas sus vitaminas intactas.",
    "ingredients": [
      "180g de lomo de merluza fresca",
      "Láminas finas de jengibre y medio limón",
      "60g de rúcula salvaje aliñada con limón"
    ],
    "steps": [
      "Coloca el lomo de merluza en vaporera con las láminas de jengibre encima.",
      "Cocina al vapor durante 8 minutos hasta que se separe en lascas.",
      "Sirve sobre el lecho de rúcula fresca."
    ]
  },
  {
    "id": "rec_cal_8",
    "title": "Crema Liviana de Coliflor Tostada con Pollo al Pimentón",
    "category": "bajas_calorias",
    "categoryLabel": "Bajas Calorías",
    "time": "16 min",
    "servings": "1 porción grande",
    "calories": 240,
    "protein": 32,
    "carbs": 12,
    "fats": 4.5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=80",
    "desc": "Textura cremosa similar a una sopa de papa pero con un 75% menos de calorías.",
    "ingredients": [
      "200g de coliflor hervida",
      "120g de pechuga de pollo cocida desmenuzada",
      "Caldo de verduras, ajo en polvo y pimentón ahumado"
    ],
    "steps": [
      "Tritura la coliflor caliente con un chorrito de caldo hasta lograr crema sedosa.",
      "Vierte en un bol y agrega el pollo desmenuzado en el centro.",
      "Espolvorea con pimentón ahumado."
    ]
  },
  {
    "id": "rec_rap_1",
    "title": "Scramble Rápido de Claras, Queso Cottage y Tomate",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "6 min",
    "servings": "1 porción",
    "calories": 142,
    "protein": 22,
    "carbs": 6,
    "fats": 3,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
    "desc": "Listo en 360 segundos: proteína completa cremosa sin ensuciar casi nada.",
    "ingredients": [
      "4 claras de huevo + 1 huevo entero",
      "60g de queso cottage bajo en grasa",
      "1 tomate pequeño picado en dados",
      "Orégano y sal marina"
    ],
    "steps": [
      "Saltea el tomate en la sartén 1 minuto.",
      "Vierte los huevos batidos y revuelve a fuego medio.",
      "Retira del fuego e incorpora el queso cottage para dar cremosidad."
    ]
  },
  {
    "id": "rec_rap_2",
    "title": "Quesadilla Rápida de Pollo Deshebrado y Queso Magro",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "8 min",
    "servings": "1 porción",
    "calories": 320,
    "protein": 38,
    "carbs": 22,
    "fats": 8,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=80",
    "desc": "Solución exprés para días sin tiempo usando sobras de pollo.",
    "ingredients": [
      "1 tortilla integral grande",
      "130g de pechuga de pollo cocida desmechada",
      "40g de queso magro rallado",
      "2 rodajas de tomate fino"
    ],
    "steps": [
      "Coloca la tortilla en la sartén caliente.",
      "Pon el pollo, tomate y queso en una mitad y dobla por la mitad.",
      "Dora 3 minutos por lado hasta que el queso funda."
    ]
  },
  {
    "id": "rec_rap_3",
    "title": "Tazón Exprés de Atún Claro, Arroz Microondas y Aguacate",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "4 min",
    "servings": "1 porción",
    "calories": 390,
    "protein": 36,
    "carbs": 42,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    "desc": "Cero cocina: solo abrir, ensamblar y alimentar el músculo con ingredientes limpios.",
    "ingredients": [
      "1 vasito de arroz integral para microondas (125g)",
      "1 lata de atún claro al natural (100g escurrido)",
      "40g de aguacate maduro en cubos",
      "Salsa de soja ligera y sésamo"
    ],
    "steps": [
      "Calienta el arroz 60 segundos en el microondas.",
      "Vierte en un bol y agrega el atún y aguacate.",
      "Sazona con salsa de soja y disfruta."
    ]
  },
  {
    "id": "rec_rap_4",
    "title": "Tostada Nórdica de Salmón Ahumado y Queso Fresco Batido",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "5 min",
    "servings": "1 porción",
    "calories": 280,
    "protein": 26,
    "carbs": 22,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
    "desc": "Grasas buenas Omega-3 y proteína de absorción rápida en 300 segundos.",
    "ingredients": [
      "1 rebanada grande de pan integral o de centeno (50g)",
      "80g de salmón ahumado en lonchas",
      "40g de queso fresco batido 0%",
      "Eneldo fresco y zumo de limón"
    ],
    "steps": [
      "Tuesta la rebanada de pan.",
      "Unta con el queso batido, coloca las lonchas de salmón encima y rocía con limón y eneldo."
    ]
  },
  {
    "id": "rec_rap_5",
    "title": "Sartén Exprés de Tofu Rallado al Curry con Espinacas",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "9 min",
    "servings": "1 porción",
    "calories": 270,
    "protein": 24,
    "carbs": 9,
    "fats": 13,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    "desc": "El tofu rallado absorbe el curry al instante logrando una textura de carne picada.",
    "ingredients": [
      "180g de tofu firme rallado con rallador de queso",
      "1 taza de espinacas frescas baby (60g)",
      "1 cucharadita de curry en polvo y sal marina"
    ],
    "steps": [
      "Saltea el tofu rallado en sartén caliente 4 minutos hasta dorar.",
      "Añade el curry, sal marina y las espinacas hasta que reduzcan.",
      "Sirve caliente."
    ]
  },
  {
    "id": "rec_rap_6",
    "title": "Wrap Frío de Jamón de Pavo, Manzana y Mostaza",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "5 min",
    "servings": "1 wrap",
    "calories": 260,
    "protein": 26,
    "carbs": 28,
    "fats": 4,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&auto=format&fit=crop&q=80",
    "desc": "Contraste crujiente y dulce con la manzana verde ideal para llevar al trabajo.",
    "ingredients": [
      "1 tortilla de trigo integral",
      "100g de pechuga de pavo en lonchas",
      "1/2 manzana verde en bastones finos",
      "Mostaza de Dijon y hojas de rúcula"
    ],
    "steps": [
      "Unta la tortilla con mostaza.",
      "Coloca las lonchas de pavo, los bastones de manzana y la rúcula.",
      "Enrolla apretadamente y corta por la mitad."
    ]
  },
  {
    "id": "rec_rap_7",
    "title": "Huevos Revueltos al Microondas con Jamón Serrano Desgrasado",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "3 min",
    "servings": "1 porción",
    "calories": 240,
    "protein": 26,
    "carbs": 2,
    "fats": 14,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
    "desc": "Preparación de emergencia en taza apta para microondas en menos de 180 segundos.",
    "ingredients": [
      "2 huevos enteros + 2 claras",
      "40g de jamón serrano sin tocino picado",
      "Pimienta negra y orégano"
    ],
    "steps": [
      "Bate los huevos en una taza grande con la pimienta y el jamón.",
      "Cocina en microondas a máxima potencia durante 60 segundos, remueve con tenedor y cocina 45 segundos más."
    ]
  },
  {
    "id": "rec_rap_8",
    "title": "Tazón Rápido de Garbanzos Aliñados con Sardinas en Aceite de Oliva",
    "category": "rapidas",
    "categoryLabel": "Rápidas (<15m)",
    "time": "4 min",
    "servings": "1 porción",
    "calories": 360,
    "protein": 32,
    "carbs": 26,
    "fats": 13,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80",
    "desc": "Bomba de calcio, vitamina D y omega-3 directo de conservas de alta calidad.",
    "ingredients": [
      "120g de garbanzos cocidos en conserva",
      "1 lata de sardinillas en aceite de oliva (80g escurrida)",
      "Zumo de medio limón y perejil fresco"
    ],
    "steps": [
      "Enjuaga y escurre los garbanzos.",
      "Vierte en un bol, añade las sardinillas enteras o troceadas.",
      "Rocía con limón fresco y perejil."
    ]
  },
  {
    "id": "rec_pos_1",
    "title": "Mousse Proteico de Chocolate Oscuro y Yogur Griego",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "5 min",
    "servings": "1 porción",
    "calories": 106,
    "protein": 18,
    "carbs": 7,
    "fats": 1,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    "desc": "Elimina los antojos dulces de raíz sin romper el déficit calórico ni la disciplina.",
    "ingredients": [
      "180g de yogur griego natural 0%",
      "1 cucharada colmada de cacao puro 100% (12g)",
      "Gotas de estevia al gusto",
      "5g de chocolate negro 85% rallado"
    ],
    "steps": [
      "Bate enérgicamente el yogur griego con el cacao puro y la estevia con cuchara durante 90 segundos.",
      "Corona con el chocolate negro rallado por encima y disfruta."
    ]
  },
  {
    "id": "rec_pos_2",
    "title": "Pudín de Chía y Cacao Puro con Leche de Almendras",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "5 min (+reposo)",
    "servings": "1 porción",
    "calories": 180,
    "protein": 10,
    "carbs": 14,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=500&auto=format&fit=crop&q=80",
    "desc": "Postre saciante cargado de ácidos grasos Omega-3, fibra soluble y magnesio.",
    "ingredients": [
      "25g de semillas de chía (2 cucharadas colmadas)",
      "150ml de leche de almendras sin azúcar",
      "1 cucharadita de cacao puro 100% (5g)",
      "3 frambuesas o fresas para decorar"
    ],
    "steps": [
      "En un tarro mezcla la leche de almendras, la chía y el cacao con estevia.",
      "Remueve bien durante 1 minuto para evitar grumos.",
      "Deja reposar en el refrigerador al menos 2 horas hasta que gelifique.",
      "Decora con los frutos rojos."
    ]
  },
  {
    "id": "rec_pos_3",
    "title": "Bolitas Energéticas de Avena, Dátiles y Mantequilla de Maní",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "10 min",
    "servings": "4 bolitas (2 porciones)",
    "calories": 220,
    "protein": 8,
    "carbs": 26,
    "fats": 9,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    "desc": "Snack denso en micronutrientes para combatir cualquier antojo dulce de forma 100% limpia.",
    "ingredients": [
      "40g de avena en copos finos",
      "3 dátiles Medjool deshuesados",
      "20g de mantequilla de cacahuete natural",
      "Canela en polvo"
    ],
    "steps": [
      "Tritura los dátiles con la mantequilla de cacahuete.",
      "Incorpora la avena y canela, amasando con las manos.",
      "Forma 4 bolitas compactas y refrigera 15 minutos."
    ]
  },
  {
    "id": "rec_pos_4",
    "title": "Helado Exprés de Plátano Congelado y Proteína de Vainilla",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "4 min",
    "servings": "1 porción",
    "calories": 210,
    "protein": 22,
    "carbs": 28,
    "fats": 1.5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
    "desc": "Textura idéntica al helado artesanal con cero azúcar añadido y 22g de proteína.",
    "ingredients": [
      "1 plátano maduro previamente congelado en rodajas (100g)",
      "20g de proteína de vainilla o suero aislada",
      "3 cucharadas de leche de almendras (30ml)"
    ],
    "steps": [
      "Coloca las rodajas de plátano congelado y la proteína en el procesador con la leche.",
      "Tritura en pulsos durante 90 segundos hasta lograr textura cremosa de helado suave.",
      "Sirve de inmediato."
    ]
  },
  {
    "id": "rec_pos_5",
    "title": "Crepes Proteicos Finos con Relleno de Manzana Caliente y Canela",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "12 min",
    "servings": "2 crepes",
    "calories": 230,
    "protein": 20,
    "carbs": 30,
    "fats": 2.5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80",
    "desc": "Aroma reconfortante a tarta de manzana casera con bajo impacto glucémico.",
    "ingredients": [
      "3 claras de huevo + 15g de harina de avena",
      "1/2 manzana picada en cubos pequeños",
      "Canela abundante y estevia"
    ],
    "steps": [
      "Saltea los cubos de manzana con canela y 2 cucharadas de agua en microondas 2 minutos.",
      "Bate las claras con la avena y haz 2 crepes muy finos en sartén antiadherente.",
      "Rellena los crepes con la manzana templada y enrolla."
    ]
  },
  {
    "id": "rec_pos_6",
    "title": "Gelatina Proteica de Frutos Rojos con Yogur Griego",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "5 min (+frío)",
    "servings": "2 vasitos",
    "calories": 140,
    "protein": 22,
    "carbs": 8,
    "fats": 1,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
    "desc": "Colágeno para tendones y ligamentos calisténicos con proteína fresca.",
    "ingredients": [
      "1 sobre de gelatina sin azúcar de frutos rojos (10g)",
      "150g de yogur griego natural 0%",
      "200ml de agua caliente y 100ml de agua fría"
    ],
    "steps": [
      "Disuelve la gelatina en agua caliente.",
      "Agrega el agua fría y luego integra el yogur griego con batidor de mano.",
      "Vierte en vasitos y refrigera 3 horas hasta cuajar."
    ]
  },
  {
    "id": "rec_pos_7",
    "title": "Tostada Dulce de Queso Cottage, Frutillas y Miel",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "4 min",
    "servings": "1 porción",
    "calories": 190,
    "protein": 16,
    "carbs": 24,
    "fats": 3,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
    "desc": "Snack crujiente y fresco para saciar la media tarde con fresas ricas en vitamina C.",
    "ingredients": [
      "1 rebanada de pan integral tostada (35g)",
      "70g de queso cottage bajo en grasa",
      "4 fresas en rodajas (50g)",
      "1 cucharadita de miel pura de abeja (5g)"
    ],
    "steps": [
      "Tuesta el pan integral.",
      "Unta con el queso cottage, coloca las rodajas de fresa y añade los hilos de miel."
    ]
  },
  {
    "id": "rec_pos_8",
    "title": "Chips Horneadas de Manzana con Canela Crujiente",
    "category": "postres",
    "categoryLabel": "Postres & Snacks",
    "time": "15 min",
    "servings": "1 porción grande",
    "calories": 110,
    "protein": 1,
    "carbs": 26,
    "fats": 0.5,
    "isSystem": true,
    "img": "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=500&auto=format&fit=crop&q=80",
    "desc": "Textura ultra crocante para picar en el cine o trabajando sin remordimientos.",
    "ingredients": [
      "1 manzana mediana descorazonada y cortada en láminas muy finas con mandolina",
      "Canela de Ceilán en polvo abundante"
    ],
    "steps": [
      "Acomoda las láminas de manzana sin superponer en una bandeja con papel de horno.",
      "Espolvorea canela por encima.",
      "Hornea a 140°C durante 15-20 minutos hasta que queden secas y crujientes."
    ]
  }
];

  /**
   * Obtiene la lista unificada de recetas filtradas y ordenadas
   * Garantiza la privacidad estricta: las recetas del usuario se aíslan
   */
  function getAll(filterCategory = 'todos', searchQuery = '', customRecipes = []) {
    let combined = [];

    if (filterCategory === 'mis_recetas') {
      combined = [...customRecipes];
    } else if (filterCategory === 'todos') {
      combined = [...SYSTEM_RECIPES, ...customRecipes];
    } else {
      const sys = SYSTEM_RECIPES.filter(r => r.category === filterCategory);
      const cust = customRecipes.filter(r => r.category === filterCategory);
      combined = [...sys, ...cust];
    }

    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      combined = combined.filter(r => 
        r.title.toLowerCase().includes(q) ||
        (r.desc && r.desc.toLowerCase().includes(q)) ||
        (r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(q)))
      );
    }

    return combined;
  }

  function getById(id, customRecipes = []) {
    if (!id) return null;
    const sys = SYSTEM_RECIPES.find(r => r.id === id);
    if (sys) return sys;
    return (customRecipes || []).find(r => r.id === id) || null;
  }

  function getCategories() {
    return [...RECIPE_CATEGORIES];
  }

  window.RecipesDB = {
    getAll,
    getById,
    getCategories,
    getGoals: getCategories,
    getByGoal: (goalId, cust = []) => getAll(goalId, '', cust)
  };
})();
