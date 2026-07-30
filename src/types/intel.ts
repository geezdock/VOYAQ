export interface IntelArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  snippet: string;
}

export interface GovAdvisory {
  state: string;
  severity: "info" | "advisory" | "warning";
  title: string;
  description: string;
  source: string;
  updatedAt: string;
}

export interface WeatherAlertEvent {
  title: string;
  description: string;
  severity: "info" | "advisory" | "warning";
  start: string;
  end: string;
  destination: string;
}
