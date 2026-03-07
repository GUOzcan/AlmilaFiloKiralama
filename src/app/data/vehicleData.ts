export type StatusType = "valid" | "warning" | "expired";

export interface Vehicle {
  id: string;
  category: "Yönetim" | "Ticari";
  owner?: string;
  registrationOwner?: string;
  licensePlate: string;
  brand?: string;
  model: string;
  modelYear?: number;
  engine?: string;
  horsepower?: number;
  fuel?: string;
  transmission?: string;
  color?: string;
  mileage?: number;
  sigorta: {
    status: StatusType;
    date?: string;
    amount?: number;
    institution?: string;
  };
  kasko: {
    status: StatusType;
    date?: string;
    amount?: number;
    institution?: string;
  };
  mtv: {
    status: StatusType;
    date?: string;
    amount?: number;
    institution?: string;
  };
  muayene: {
    status: StatusType;
    date?: string;
  };
}

export interface Alert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  type: "Sigorta" | "Kasko" | "MTV" | "Muayene";
  date: string;
  status: StatusType;
}

const STORAGE_KEY = "almila_filo_vehicles";

export function loadVehicles(): Vehicle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Vehicle[];
  } catch {}
  return [];
}

export function saveVehicles(data: Vehicle[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addVehicle(vehicle: Omit<Vehicle, "id">): Vehicle {
  const all = loadVehicles();
  const newVehicle: Vehicle = { ...vehicle, id: Date.now().toString() };
  all.push(newVehicle);
  saveVehicles(all);
  return newVehicle;
}

export function updateVehicle(updated: Vehicle): void {
  const all = loadVehicles();
  const idx = all.findIndex((v) => v.id === updated.id);
  if (idx !== -1) { all[idx] = updated; saveVehicles(all); }
}

export function deleteVehicle(id: string): void {
  saveVehicles(loadVehicles().filter((v) => v.id !== id));
}

export function generateAlerts(vehicleList: Vehicle[]): Alert[] {
  return vehicleList
    .flatMap((vehicle) => {
      const vehicleAlerts: Alert[] = [];
      const check = (type: "Sigorta" | "Kasko" | "MTV" | "Muayene", doc: { status: StatusType; date?: string }) => {
        if ((doc.status === "expired" || doc.status === "warning") && doc.date) {
          vehicleAlerts.push({ id: `${vehicle.id}-${type}`, vehicleId: vehicle.id, vehicleName: `${vehicle.brand || ""} ${vehicle.model}`.trim(), licensePlate: vehicle.licensePlate, type, date: doc.date, status: doc.status });
        }
      };
      check("Sigorta", vehicle.sigorta);
      check("Kasko", vehicle.kasko);
      check("MTV", vehicle.mtv);
      check("Muayene", vehicle.muayene);
      return vehicleAlerts;
    })
    .sort((a, b) => (a.status === "expired" && b.status !== "expired" ? -1 : a.status !== "expired" && b.status === "expired" ? 1 : 0));
}
