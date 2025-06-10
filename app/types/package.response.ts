export interface TravelPackage {
  packageName: string;
  days: number;
  startingPrice: number;
  imageUrl: string;
  includedPlaces: string[];
  excludedPlaces: string[];
}
