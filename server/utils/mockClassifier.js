export function mockClassify() {
  const materials = ['Plastic', 'Glass', 'Metal', 'Paper', 'Cardboard', 'Organic'];
  
  // Return a random material for mock classification
  const randomIndex = Math.floor(Math.random() * materials.length);
  return materials[randomIndex];
}
