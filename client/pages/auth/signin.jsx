import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center h-screen"
    >
      <h1 className="text-4xl font-bold mb-2">Sign In</h1>
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
      {errors}
      <button className="p-2 m-4 bg-orange-400 ">Sign In</button>
    </form>
  );
};
