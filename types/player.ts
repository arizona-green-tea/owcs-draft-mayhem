export type Role = "Tank" | "DPS" | "Support";

export type Player = {
  name: string;
  role: Role;
  nationality: string;
  mechanics: number;
  flexibility: number;
  consistency: number;
  clutch: number;
  rating: number;
  team: string;
  year: number;
};