import { api } from "./api";

export type SensorReading = {
  id: string;
  sensorId: string;
  temperature?: number | null;
  airHumidity?: number | null;
  soilMoisture?: number | null;
  luminosity?: number | null;
  readingDate: string;
  createdAt: string;
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: string | number;
  status: string | number;
  createdAt: string;
};

export type AiAnalysis = {
  id: string;
  alertId: string;
  riskLevel: string;
  reason: string;
  recommendation: string;
  provider: string;
  createdAt: string;
};

export type HealthResponse = {
  status: string;
};

export type Sensor = {
  id: string;
  name?: string;
  type?: string | number;
  sensorType?: string | number;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
};

async function getArray<T>(url: string): Promise<T[]> {
  const response = await api.get<T[]>(url);

  if (response.status === 204 || !response.data) {
    return [];
  }

  return response.data;
}

export async function getSensorReadings() {
  return getArray<SensorReading>("/api/sensor-readings");
}

export async function getAlerts() {
  return getArray<Alert>("/api/alerts");
}

export async function getAiAnalyses() {
  return getArray<AiAnalysis>("/api/ai-analyses");
}

export async function getApiHealth() {
  const response = await api.get<HealthResponse>("/health");
  return response.data;
}

export async function getSensors() {
  return getArray<Sensor>("/api/sensors");
}