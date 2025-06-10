import { deleteRequest, postRequest } from "./httpServices";

export const releaseAvailability = async (vehicleHoldKey: string) => {
  try {
    const response = await deleteRequest(
      `api/hold/release?vehicleHoldKey=${vehicleHoldKey}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const holdBusAvailability = async (
  fromDate: string,
  toDate: string,
  vehicleNumber: string[]
) => {
  try {
    const response = await postRequest("/api/hold/holdVehicle", {
      fromDate,
      toDate,
      vehicleNumber,
    });
    if (response) {
      return response;
    }
  } catch (error) {
    throw error;
  }
};
