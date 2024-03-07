type Car = {
  id: string;
  name: string;
  imei: number;
  vehicle_params: {
    vin: string | null;
    make: string;
    model: string | null;
    plate_number: string | null;
    average_fuel_consumption: number;
    fuel_tank_capacity: number | null;
    fuel_type: string;
  };
};

export default Car;
