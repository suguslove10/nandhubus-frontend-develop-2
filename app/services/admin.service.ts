import { Vehicle } from "../types/vehicleType";
import {
  deleteRequest,
  getRequest,
  postRequest,
  postRequestFormData,
  putRequest,
} from "./httpServices";

interface Vendor {
  vendorId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  vendorCompanyName: string;
  address: string;
  totalVehicles: number;
  availableVehicles: number;
  gstNumber: string;
  policyDtoList:{
    policyId:string;
    policyDescription:string;
    policyData:{
      id:string;
      policyMessage:string;
    }[]
  }[]
}

export const addVendor = async (data: any) => {
  try {
    const res = await postRequest("/api/vendor", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const fetchAllVender = async (): Promise<Vendor[]> => {
  try {
    const res = await getRequest("/api/getAllVendorDetails");

    if (!res || !Array.isArray(res)) {
      return [];
    }

    return res as Vendor[];
  } catch (error) {
    return [];
  }
};

export const addVehcle = async (formData: FormData) => {
  // Log the form data by iterating over the entries
  for (const [key, value] of formData.entries()) {
  }

  try {
    const res = await postRequestFormData("/api/vehicle/addVehicle", formData);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateVenderDeatils = async (data: any) => {
  try {
    const res = await putRequest("/api/updateVendor", data);
    return res;
  } catch (error) {
    throw error;
  }
};

export const GetVendorVehiclesById = async (vendorId: string) => {
  try {
    const res = await getRequest(
      `/api/getVendorVehicleData?vendorId=${vendorId}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const deleteVendor = async (vendorId: string) => {
  try {
    const res = await deleteRequest(`/api/deleteVendor?vendorId=${vendorId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

// #########################################  vehicle sevises ##############################

export const fetchVehicles = async () => {
  try {
    const response = await getRequest(`/api/vehicle/getAllVehicles`);
    if (response) {
      return response as Vehicle[];
    }
  } catch (error) {}
};

export const fetchVehicleById = async (id: string) => {
  try {
    const response = await getRequest(
      `/api/vehicle/getVehicleByVehicleId?vehicleId=${id}`
    );
    if (response) {
      return response as Vehicle;
    }
  } catch (error) {
    throw error;
  }
};

export const updateVehicle = async (data: any) => {
  try {
    const response = await putRequest("/api/vehicle/updateVehicle", data);
    if (response) {
      return response;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteVehicle = async (vehicleId: string) => {
  try {
    const res = await deleteRequest(`api/vehicle/deleteVehicle?vehicleId=${vehicleId}`);
    return res;
  } catch (error) {
    throw error;
  }
};
