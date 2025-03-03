import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { API_URL } from "../utils/url";
import user from "../reducers/user";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signup");
  const [errorMessage, setErrorMessage] = useState(null);

  const accessToken = useSelector((store) => store.user.accessToken);
  const error = useSelector((store) => store.user.error);
  console.log(error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    };

    fetch(API_URL(mode), options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          batch(() => {
            dispatch(user.actions.setUserId(data.response.userId));
            dispatch(user.actions.setUsername(data.response.username));
            dispatch(user.actions.setEmail(data.response.email));
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setError(null));
          });
        } else {
          batch(() => {
            dispatch(user.actions.setUserId(null));
            dispatch(user.actions.setUsername(null));
            dispatch(user.actions.setEmail(null));
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setError(data.response));
            setErrorMessage(data.message);
          });
        }
      });
  };

  return (
    <>
      <LoginContainer>
        <form onSubmit={onFormSubmit}>
          <p> Username </p>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <p> Password </p>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <p> Email </p>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <RadioButtonContainer>
            <label htmlFor="signup">Signup</label>
            <input
              id="signup"
              type="radio"
              checked={mode === "signup"}
              onChange={() => setMode("signup")}
            />
            <label htmlFor="signin">Signin</label>
            <input
              id="signin"
              type="radio"
              checked={mode === "signin"}
              onChange={() => setMode("signin")}
            />
          </RadioButtonContainer>
          <ButtonContainer>
            <SubmitButton type="submit">Submit</SubmitButton>
          </ButtonContainer>
          {errorMessage !== null && <p>{error.message}</p>}
        </form>
      </LoginContainer>
    </>
  );
};

export default Login;

const LoginContainer = styled.div`
  background-color: rgba(42, 101, 42, 0.783);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  padding: 20px;
  border-radius: 30px;
  border: 1px solid black;
  box-shadow: 5px 5px;
  color: white;
`;

const RadioButtonContainer = styled.div`
  background-color: gray;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  padding: 15px;
  border-radius: 10px;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
`;

const SubmitButton = styled.button`
  padding: 10px;
  border-radius: 10px;
`;
