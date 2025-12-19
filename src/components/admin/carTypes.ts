export const CarProperty = {
  enginePower: "enginePower" as const,
  transmission: "transmission" as const,
  fuel: "fuel" as const,
  doors: "doors" as const,
  seats: "seats" as const,
  warranty: "warranty" as const,
  co2Emissions: "co2Emissions" as const,
  acceleration: "acceleration" as const,
  topSpeed: "topSpeed" as const,
  efficiency: "efficiency" as const,
  bootSpace: "bootSpace" as const,
  safetyRating: "safetyRating" as const,
} as const;

// Export the type of these properties
export type CarPropertyType = typeof CarProperty[keyof typeof CarProperty];