import { CurriculumVitaeData } from "@/tsmod/CurriculumVitaeData";
import type { PublicWebUiData } from "@/tsmod/PublicWebUiData";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { LoginMananger } from "@/model/LoginMananger";

export const secretDataApiBasePath = "/static/secret/";
export const publicDataApiBasePath = "/static/public/";

function getData<T>(url: string, config?: AxiosRequestConfig): Promise<Partial<T>> {
  return new Promise<Partial<T>>((resolve: (cvData: Partial<T>) => void, reject: (reason: any) => void) => {
    axios.get(url, config).then((response) => {
      const responseData = response.data;
      resolve(responseData);
    }, reject);
  });
}

export function getCurriculumVitaeData(loginManager: LoginMananger): Promise<Partial<CurriculumVitaeData>> {
  let apiBasePath = secretDataApiBasePath;
  if (loginManager.isAnonymous()) {
    apiBasePath = publicDataApiBasePath;
  }

  return getData("." + apiBasePath + "json/xflsCurriculumVitaeData.json", {
    headers: { "Cache-Control": "no-cache" }
  });
}

export function getPublicWebUiData(): Promise<PublicWebUiData> {
  return getData("." + publicDataApiBasePath + "json/publicWebUiData.json");
}
