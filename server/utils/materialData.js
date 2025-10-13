const materialDatabase = {
  Plastic: {
    materialType: 'Plastic',
    binColor: 'Blue',
    recyclable: true,
    tip: 'Remove caps and rinse before recycling. Check for recycling symbol (1-7).',
    description: 'Plastic bottles, containers, and packaging materials',
    examples: ['Water bottles', 'Food containers', 'Plastic bags', 'Bottle caps']
  },
  Glass: {
    materialType: 'Glass',
    binColor: 'Blue',
    recyclable: true,
    tip: 'Rinse bottles and jars. Remove metal lids. Do not include broken glass.',
    description: 'Glass bottles, jars, and containers',
    examples: ['Wine bottles', 'Jam jars', 'Glass containers', 'Beer bottles']
  },
  Metal: {
    materialType: 'Metal',
    binColor: 'Blue',
    recyclable: true,
    tip: 'Rinse cans and tins. Crush to save space. Remove paper labels if possible.',
    description: 'Aluminum and steel cans, tins, and foils',
    examples: ['Soda cans', 'Tin cans', 'Aluminum foil', 'Metal lids']
  },
  Paper: {
    materialType: 'Paper',
    binColor: 'Blue',
    recyclable: true,
    tip: 'Keep paper dry and clean. Remove any plastic windows from envelopes.',
    description: 'Newspapers, magazines, office paper, and cardboard',
    examples: ['Newspapers', 'Magazines', 'Office paper', 'Envelopes']
  },
  Cardboard: {
    materialType: 'Cardboard',
    binColor: 'Blue',
    recyclable: true,
    tip: 'Flatten boxes to save space. Remove any tape or staples.',
    description: 'Cardboard boxes and packaging materials',
    examples: ['Shipping boxes', 'Cereal boxes', 'Pizza boxes (if clean)', 'Egg cartons']
  },
  Organic: {
    materialType: 'Organic Waste',
    binColor: 'Green',
    recyclable: false,
    tip: 'Compost food scraps and garden waste. Keep separate from recyclables.',
    description: 'Food waste, yard trimmings, and biodegradable materials',
    examples: ['Fruit peels', 'Vegetable scraps', 'Garden waste', 'Coffee grounds']
  },
  'E-waste': {
    materialType: 'Electronic Waste',
    binColor: 'Red',
    recyclable: false,
    tip: 'Take to designated e-waste collection centers. Never throw in regular bins.',
    description: 'Electronic devices and components',
    examples: ['Old phones', 'Batteries', 'Chargers', 'Small electronics']
  },
  Hazardous: {
    materialType: 'Hazardous Waste',
    binColor: 'Red',
    recyclable: false,
    tip: 'Take to hazardous waste facility. Do not dispose in regular trash.',
    description: 'Toxic, flammable, or dangerous materials',
    examples: ['Batteries', 'Paint cans', 'Cleaning chemicals', 'Light bulbs']
  }
};

export function getMaterialData(materialType) {
  return materialDatabase[materialType] || materialDatabase.Plastic;
}
