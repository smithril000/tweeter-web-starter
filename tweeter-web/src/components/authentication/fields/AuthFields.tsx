interface Props {
  onClick: (event: React.KeyboardEvent<HTMLElement>) => void;
  alias: string;
  password: string;
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
}

const AuthFields = (props: Props) => {
  const checkOnClick = (event: React.KeyboardEvent<HTMLElement>) => {
    // if (event.key == "Enter" && !checkSubmitButtonStatus()) {
    //   //props.onClick();
    // }
  };
  // const checkSubmitButtonStatus = (): boolean => {
  //   return !props.alias || !props.password;
  // };

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={props.onClick}
          value={props.alias}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={props.onClick}
          value={props.password}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};
export default AuthFields;
