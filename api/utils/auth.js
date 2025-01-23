import validator from 'validator';

export const validateSignUpInput = (username, name, email, password) => {
  const errors = {};
  if (validator.isEmpty(name)) {
      errors.name = 'Name must not be empty';
  }
  if (validator.isEmpty(username)) {
      errors.username = 'Username must not be empty';
  }
  if (!validator.isEmail(email)) {
      errors.email = 'Email must be a valid email address';
  }
  if (validator.isEmpty(password)) {
      errors.password = 'Password must not be empty';
  }
  return {
      errors,
      valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInput = (username, password) => {
  const errors = {};
  if (validator.isEmpty(username)) {
      errors.username = 'Username must not be empty';
  }
  if (validator.isEmpty(password)) {
      errors.password = 'Password must not be empty';
  }
  return {
      errors,
      valid: Object.keys(errors).length < 1,
  };
};
