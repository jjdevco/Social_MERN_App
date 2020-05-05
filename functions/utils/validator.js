exports.user = function (form, action) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const inputs = {
    signin: ["password", "email"],
    signup: ["username", "password", "email", "repeatPassword"],
  };

  return new Promise((resolve) => {
    let errors = {};

    for (input of inputs[action]) {
      if (Object.keys(form).indexOf(input) == -1)
        errors[input] = "This is required.";
    }

    for (input in form) {
      if (form[input].trim() === "") errors[input] = "Must not be empty.";

      if (input === "email" && !emailRegex.test(form[input]))
        errors.email = "Must be a valid address.";

      if (input === "repeatPassword" && form[input] !== form["password"])
        errors.repeatPassword = "Passwords must be the same.";
    }

    resolve(errors);
  });
};
