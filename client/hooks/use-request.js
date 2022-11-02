import { useState } from "react";
import axios from "axios";

export default ({ url, method, body }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      return response.data;
    } catch (err) {
      setErrors(
        <div>
          {err.response.data.errors.map((errs) => (
            <p key={errs.message}>{errs.message}</p>
          ))}
        </div>
      );
    }
  };

  return { doRequest, errors };
};
