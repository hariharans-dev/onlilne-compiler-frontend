import axios, { AxiosResponse } from "axios";
const request = async (
  url: string,
  data: any,
  headers: Record<string, any>,
  errorfunction: () => void
) => {
  let returndata: any = {};
  try {
    await axios
      .post(url, data, { headers })
      .then((response: AxiosResponse) => {
        returndata = response;
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          errorfunction();
        } else if (error.response.status === 500) {
          errorfunction();
        } else if (error.response.status) {
          returndata = error.response;
        } else {
          errorfunction();
        }
      });
  } catch (error) {
    errorfunction();
  }
  return returndata;
};

export default request;
