import axios from "axios";
import type { IJsonApiResponseData } from "@/model/JsonApiResponseData";

export class LoginMananger {
  phoneNumber: string = "";

  anonymousFlag: boolean = false;

  async loginAsAnonymous(): Promise<boolean> {
    this.anonymousFlag = true;
    return true;
  }

  async loginViaSms(phoneNumber: string, verificationCode: string): Promise<IJsonApiResponseData> {
    this.phoneNumber = phoneNumber;
    return (
      await axios.post<IJsonApiResponseData>(
        "login",
        {
          phoneNumber,
          verificationCode
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      )
    ).data;
  }

  isAnonymous = () => this.anonymousFlag;

  isAlreadyLogin = async (): Promise<boolean> =>
    this.anonymousFlag ? true : (await axios.get("login/status")).data;

  logout = async () => {
    if (this.anonymousFlag) {
      this.anonymousFlag = false;
      return true;
    } else {
      return (await axios.post("logout")).data;
    }
  };
}
