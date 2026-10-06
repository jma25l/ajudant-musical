export interface Canco {
  id: string;
  nom: string;
  autor?: string;
}

export interface CanconerApiInterface {
  cancons: Canco[];
}

export interface AcordDB {
  estat?: number;
  ukelele?: number[];
  simp?: string; // Acord (més senzill) que el pot substituir
}

export type AcordsDBList = Record<string, AcordDB>;

export interface AcordsApiInterface {
  coneguts: AcordsDBList;
}

export function detColorEstatAcord(st: number | undefined): string {
  switch (st) {
    case 0:
      return "yellow"; // En procés d'assoliment
    case 1:
      return "lightgreen"; // Asolit
    case 2:
      return "red"; // Millor no intentar-lo
    default:
      return "lightgray"; // No indexat
  }
}
