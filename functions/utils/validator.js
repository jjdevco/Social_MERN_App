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

      if (input === "username" && form[input].match(/[^A-Za-z0-9_]/gi))
        errors.username = "Only letters (a-z) and numbers are allowed.";

      if (input === "email" && !emailRegex.test(form[input]))
        errors.email = "Must be a vsssalid address.";

      if (input === "repeatPassword" && form[input] !== form["password"])
        errors.repeatPassword = "Passwords must be the same.";
    }

    resolve(errors);
  });
};

exports.userDetails = function (form) {
  const fields = {};

  for (input in form) {
    if (!!form[input].trim()) {
      input === "website" && !form[input].substring(0, 4) !== "http"
        ? (fields[input] = `http://${form[input]}`)
        : (fields[input] = form[input]);
    }
  }

  return fields;
};
