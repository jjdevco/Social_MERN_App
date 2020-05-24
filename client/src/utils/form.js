export const inputValidator = (value, validate, samePassword) => {
  let error = "";

  if (
    validate.indexOf("email") !== -1 &&
    // eslint-disable-next-line
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  )
    error = "Should be a valid email address";

  if (validate.indexOf("repeatPassword") !== -1 && value !== samePassword)
    error = "Password and Repeat Password should be equal";

  if (
    validate.indexOf("password") !== -1 &&
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]/.test(value)
  )
    error = "Should have at least one letter, number and special character";

  if (validate.indexOf("maxPassword") !== -1 && value.length > 18)
    error = "Maximum 18 characters";

  if (validate.indexOf("minPassword") !== -1 && value.length < 6)
    error = "Minimum 6 characters";

  if (validate.indexOf("required") !== -1 && value.trim() === "")
    error = "This is required";

  return {
    valid: !!error ? false : true,
    error,
  };
};
