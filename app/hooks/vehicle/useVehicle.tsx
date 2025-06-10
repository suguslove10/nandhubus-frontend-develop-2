import { fetchVehicleById, fetchVehicles } from "@/app/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export const useVehicles = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchVehicleById(id),
    enabled: !!id,
  });
};
