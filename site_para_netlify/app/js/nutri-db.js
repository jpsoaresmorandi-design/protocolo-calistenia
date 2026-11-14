/**
 * Base de Datos Nutricional Táctica (TACO & USDA FoodData Central)
 * Proporciona valores nutricionales exactos por cada 100g de alimento
 * Utilizada como anclaje de precisión híbrida junto a Google Gemini
 */
(function() {
  'use strict';

  const FOOD_DATABASE = [
    // --- PROTEÍNAS MAGRAS & CARNES ---
    { id: 'pollo_pechuga', name: 'Pechuga de Pollo a la Plancha', category: 'proteina', calories: 165, protein: 31.0, carbs: 0.0, fats: 3.6, portionDefault: 150, unit: 'g' },
    { id: 'pollo_cocido', name: 'Pechuga de Pollo Cocida / Desmechada', category: 'proteina', calories: 150, protein: 29.5, carbs: 0.0, fats: 3.2, portionDefault: 150, unit: 'g' },
    { id: 'carne_res_magra', name: 'Carne de Res Magra a la Plancha (Lomo / Ternera)', category: 'proteina', calories: 215, protein: 29.0, carbs: 0.0, fats: 10.5, portionDefault: 150, unit: 'g' },
    { id: 'carne_molida_magra', name: 'Carne Molida Magra Guisada', category: 'proteina', calories: 210, protein: 26.5, carbs: 1.0, fats: 11.0, portionDefault: 140, unit: 'g' },
    { id: 'tilapia_blanco', name: 'Filete de Pescado Blanco / Tilapia a la Plancha', category: 'proteina', calories: 128, protein: 26.0, carbs: 0.0, fats: 2.7, portionDefault: 180, unit: 'g' },
    { id: 'salmon_plancha', name: 'Salmón Fresco a la Plancha', category: 'proteina', calories: 206, protein: 22.0, carbs: 0.0, fats: 12.3, portionDefault: 150, unit: 'g' },
    { id: 'atun_agua', name: 'Atún al Natural (Enlatado en Agua)', category: 'proteina', calories: 116, protein: 26.0, carbs: 0.0, fats: 1.0, portionDefault: 120, unit: 'g' },
    { id: 'huevo_entero', name: 'Huevo de Gallina Entero (Cocido / Plancha)', category: 'proteina', calories: 143, protein: 12.6, carbs: 0.7, fats: 9.5, portionDefault: 100, unit: 'g (aprox. 2 huevos)' },
    { id: 'clara_huevo', name: 'Claras de Huevo', category: 'proteina', calories: 52, protein: 11.0, carbs: 0.7, fats: 0.2, portionDefault: 100, unit: 'g (aprox. 3 claras)' },
    { id: 'queso_cottage', name: 'Queso Cottage / Ricotta Magra', category: 'proteina', calories: 98, protein: 11.1, carbs: 3.4, fats: 4.3, portionDefault: 100, unit: 'g' },
    { id: 'yogur_griego_natural', name: 'Yogur Griego Natural Desnatado (Sin Azúcar)', category: 'proteina', calories: 59, protein: 10.0, carbs: 3.6, fats: 0.4, portionDefault: 170, unit: 'g' },
    { id: 'proteina_whey', name: 'Proteína Whey en Polvo (Aislada / Concentrada)', category: 'proteina', calories: 380, protein: 80.0, carbs: 6.0, fats: 4.0, portionDefault: 30, unit: 'g (1 scoop)' },

    // --- CARBOHIDRATOS COMPLEJOS & GRANOS ---
    { id: 'arroz_blanco', name: 'Arroz Blanco Cocido', category: 'carbohidrato', calories: 130, protein: 2.7, carbs: 28.2, fats: 0.3, portionDefault: 150, unit: 'g' },
    { id: 'arroz_integral', name: 'Arroz Integral Cocido', category: 'carbohidrato', calories: 124, protein: 2.6, carbs: 25.8, fats: 1.0, portionDefault: 150, unit: 'g' },
    { id: 'frijol_negro', name: 'Frijoles Negros Cocidos con Caldo', category: 'carbohidrato', calories: 77, protein: 4.5, carbs: 14.0, fats: 0.5, portionDefault: 130, unit: 'g' },
    { id: 'frijol_carioca', name: 'Frijoles Pintos / Carioca Cocidos', category: 'carbohidrato', calories: 76, protein: 4.8, carbs: 13.6, fats: 0.5, portionDefault: 130, unit: 'g' },
    { id: 'lentejas_cocidas', name: 'Lentejas Cocidas', category: 'carbohidrato', calories: 116, protein: 9.0, carbs: 20.1, fats: 0.4, portionDefault: 140, unit: 'g' },
    { id: 'garbanzos_cocidos', name: 'Garbanzos Cocidos', category: 'carbohidrato', calories: 164, protein: 8.9, carbs: 27.4, fats: 2.6, portionDefault: 130, unit: 'g' },
    { id: 'avena_hojuelas', name: 'Avena en Hojuelas Cruda', category: 'carbohidrato', calories: 389, protein: 16.9, carbs: 66.3, fats: 6.9, portionDefault: 40, unit: 'g' },
    { id: 'batata_dulce', name: 'Batata / Camote Cocido o Asado', category: 'carbohidrato', calories: 86, protein: 1.6, carbs: 20.1, fats: 0.1, portionDefault: 150, unit: 'g' },
    { id: 'papa_cocida', name: 'Papa / Patata Cocida', category: 'carbohidrato', calories: 87, protein: 1.9, carbs: 20.1, fats: 0.1, portionDefault: 150, unit: 'g' },
    { id: 'yuca_mandioca', name: 'Yuca / Mandioca Cocida', category: 'carbohidrato', calories: 125, protein: 0.6, carbs: 30.1, fats: 0.3, portionDefault: 120, unit: 'g' },
    { id: 'pasta_integral', name: 'Pasta Integral Cocida', category: 'carbohidrato', calories: 124, protein: 5.3, carbs: 26.5, fats: 0.5, portionDefault: 140, unit: 'g' },
    { id: 'pan_integral', name: 'Pan 100% Integral de Grano Entero', category: 'carbohidrato', calories: 247, protein: 12.0, carbs: 41.0, fats: 3.4, portionDefault: 50, unit: 'g (2 rebanadas)' },
    { id: 'quinoa_cocida', name: 'Quinoa Cocida', category: 'carbohidrato', calories: 120, protein: 4.4, carbs: 21.3, fats: 1.9, portionDefault: 140, unit: 'g' },

    // --- VEGETALES & VERDURAS ---
    { id: 'brocoli', name: 'Brócoli al Vapor o Salteado', category: 'vegetal', calories: 35, protein: 2.8, carbs: 7.2, fats: 0.4, portionDefault: 100, unit: 'g' },
    { id: 'espinacas', name: 'Espinacas Frescas o Salteadas', category: 'vegetal', calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, portionDefault: 80, unit: 'g' },
    { id: 'ensalada_verde', name: 'Ensalada Verde Mixta (Lechuga, Rúcula, Pepino)', category: 'vegetal', calories: 15, protein: 1.2, carbs: 2.8, fats: 0.2, portionDefault: 100, unit: 'g' },
    { id: 'tomate', name: 'Tomate Rojo Fresco', category: 'vegetal', calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, portionDefault: 100, unit: 'g' },
    { id: 'zanahoria', name: 'Zanahoria Rallada o al Vapor', category: 'vegetal', calories: 41, protein: 0.9, carbs: 9.6, fats: 0.2, portionDefault: 80, unit: 'g' },
    { id: 'champinones', name: 'Champiñones / Setas Salteadas', category: 'vegetal', calories: 22, protein: 3.1, carbs: 3.3, fats: 0.3, portionDefault: 80, unit: 'g' },
    { id: 'calabacin', name: 'Calabacín / Zucchini a la Plancha', category: 'vegetal', calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3, portionDefault: 100, unit: 'g' },

    // --- GRASAS SALUDABLES & FRUTOS SECOS ---
    { id: 'aceite_oliva', name: 'Aceite de Oliva Virgen Extra', category: 'grasa', calories: 884, protein: 0.0, carbs: 0.0, fats: 100.0, portionDefault: 10, unit: 'ml (1 cda sopera)' },
    { id: 'aguacate', name: 'Aguacate / Palta Fresca', category: 'grasa', calories: 160, protein: 2.0, carbs: 8.5, fats: 14.7, portionDefault: 60, unit: 'g (aprox. 1/3 aguacate)' },
    { id: 'almendras', name: 'Almendras Naturales sin Sal', category: 'grasa', calories: 579, protein: 21.2, carbs: 21.6, fats: 49.9, portionDefault: 25, unit: 'g (un puñado)' },
    { id: 'nueces', name: 'Nueces de Nogal', category: 'grasa', calories: 654, protein: 15.2, carbs: 13.7, fats: 65.2, portionDefault: 25, unit: 'g' },
    { id: 'mantequilla_mani', name: 'Mantequilla de Maní / Cacahuate 100% Pura', category: 'grasa', calories: 588, protein: 25.1, carbs: 20.0, fats: 50.4, portionDefault: 20, unit: 'g (1 cda)' },

    // --- FRUTAS FRESCAS ---
    { id: 'platano_banana', name: 'Plátano / Banana Fresca', category: 'fruta', calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3, portionDefault: 100, unit: 'g (1 unidad mediana)' },
    { id: 'manzana', name: 'Manzana con Piel', category: 'fruta', calories: 52, protein: 0.3, carbs: 13.8, fats: 0.2, portionDefault: 150, unit: 'g (1 unidad)' },
    { id: 'fresas', name: 'Fresas / Frutillas Frescas', category: 'fruta', calories: 32, protein: 0.7, carbs: 7.7, fats: 0.3, portionDefault: 150, unit: 'g (1 taza)' },
    { id: 'naranja', name: 'Naranja Fresca Entera', category: 'fruta', calories: 47, protein: 0.9, carbs: 11.8, fats: 0.1, portionDefault: 130, unit: 'g' },
    { id: 'arandanos', name: 'Arándanos Frescos', category: 'fruta', calories: 57, protein: 0.7, carbs: 14.5, fats: 0.3, portionDefault: 100, unit: 'g' }
  ];

  /**
   * Calcula los macronutrientes exactos a partir de los gramos consumidos
   */
  function calculateMacros(foodId, grams) {
    const food = FOOD_DATABASE.find(f => f.id === foodId);
    if (!food) return null;
    const factor = (grams || 0) / 100.0;
    return {
      foodId: food.id,
      name: food.name,
      grams: Math.round(grams),
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fats: Math.round(food.fats * factor * 10) / 10
    };
  }

  /**
   * Busca alimentos por texto (autocompletado inteligente)
   */
  function searchFoods(query) {
    if (!query || typeof query !== 'string') return FOOD_DATABASE.slice(0, 15);
    const q = query.toLowerCase().trim();
    return FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }

  /**
   * Encuentra el mejor emparejamiento con el resultado visual del Gemini
   */
  function matchGeminiItem(geminiName) {
    if (!geminiName) return null;
    const clean = geminiName.toLowerCase();
    
    // Mapeos inteligentes para alimentos comunes
    if (clean.includes('pollo') || clean.includes('chicken') || clean.includes('pechuga')) return FOOD_DATABASE.find(f => f.id === 'pollo_pechuga');
    if (clean.includes('arroz') || clean.includes('rice')) return FOOD_DATABASE.find(f => f.id === 'arroz_blanco');
    if (clean.includes('frijol') || clean.includes('frejol') || clean.includes('poroto') || clean.includes('feijao')) return FOOD_DATABASE.find(f => f.id === 'frijol_negro');
    if (clean.includes('huevo') || clean.includes('egg') || clean.includes('omelette')) return FOOD_DATABASE.find(f => f.id === 'huevo_entero');
    if (clean.includes('carne') || clean.includes('bife') || clean.includes('res') || clean.includes('steak')) return FOOD_DATABASE.find(f => f.id === 'carne_res_magra');
    if (clean.includes('pescado') || clean.includes('tilapia') || clean.includes('fish')) return FOOD_DATABASE.find(f => f.id === 'tilapia_blanco');
    if (clean.includes('salmón') || clean.includes('salmon')) return FOOD_DATABASE.find(f => f.id === 'salmon_plancha');
    if (clean.includes('atun') || clean.includes('atún') || clean.includes('tuna')) return FOOD_DATABASE.find(f => f.id === 'atun_agua');
    if (clean.includes('brocoli') || clean.includes('brócoli') || clean.includes('broccoli')) return FOOD_DATABASE.find(f => f.id === 'brocoli');
    if (clean.includes('espinaca') || clean.includes('spinach')) return FOOD_DATABASE.find(f => f.id === 'espinacas');
    if (clean.includes('ensalada') || clean.includes('lechuga') || clean.includes('salad')) return FOOD_DATABASE.find(f => f.id === 'ensalada_verde');
    if (clean.includes('aguacate') || clean.includes('palta') || clean.includes('avocado')) return FOOD_DATABASE.find(f => f.id === 'aguacate');
    if (clean.includes('avena') || clean.includes('oatmeal')) return FOOD_DATABASE.find(f => f.id === 'avena_hojuelas');
    if (clean.includes('batata') || clean.includes('camote') || clean.includes('sweet potato')) return FOOD_DATABASE.find(f => f.id === 'batata_dulce');
    if (clean.includes('papa') || clean.includes('patata') || clean.includes('potato')) return FOOD_DATABASE.find(f => f.id === 'papa_cocida');
    if (clean.includes('platano') || clean.includes('banana')) return FOOD_DATABASE.find(f => f.id === 'platano_banana');

    // Búsqueda genérica por substring
    const found = FOOD_DATABASE.find(f => f.name.toLowerCase().includes(clean) || clean.includes(f.name.toLowerCase()));
    return found || null;
  }

  window.NutriDB = {
    getAll: () => [...FOOD_DATABASE],
    getById: (id) => FOOD_DATABASE.find(f => f.id === id) || null,
    calculateMacros,
    searchFoods,
    matchGeminiItem
  };
})();

