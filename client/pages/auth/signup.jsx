import { useState } from "react";
import axios from "axios";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/users/signup", {
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.errors);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center h-screen"
    >
      <h1 className="text-4xl font-bold mb-2">Sign Up</h1>
      <div className="py-4 flex-col inline-flex text-center">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="border-2"
        />
      </div>
      <div className="py-4 flex-col inline-flex text-center">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="border-2"
        />
      </div>
      {errors.map((err) => err.message)}
      <button className="p-2 m-4 bg-orange-400 ">Sign Up</button>
    </form>
  );
};
