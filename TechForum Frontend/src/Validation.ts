import * as yup from "yup";

const validationSchema1 = yup.object().shape({
  title: yup
    .string()
    .max(140, "Title should be less than 140 characters.")
    .required("Title Required"),
  author: yup
    .string()
    .max(90, "Author name should be less than 90 characters.")
    .matches(
      /^[A-Za-z\s]+$/,
      "Author name should contain only alphabets and spaces."
    )
    .required("Author Required"),
  tags: yup.string().max(90, "Tags should be less than 90 characters."),
});

export const validateInputaArticle = async (
  title: string,
  author: string,
  tags: string
) => {
  try {
    await validationSchema1.validate({ title, author, tags });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      alert(error.message);
      return false;
    }
  }
};

const validationSchema2 = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Author name should contain only alphabets and spaces."
    )
    .max(90, "Name should be less than 90 characters."),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must be a valid email address."
    )
    .max(100, "Email should be less than 100 characters."),
  password: yup
    .string()
    .max(20, "Password should be less than 20 characters.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain both letters and numbers."
    ),
});

export const validateInputUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    await validationSchema2.validate({ name, email, password });
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      alert(error.message);
      return false;
    }
  }
};

const validationSchema3 = yup.object().shape({
  EmpName: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Author name should contain only alphabets and spaces."
    )
    .max(90, "Name should be less than 90 characters."),
  Email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must be a valid email address."
    )
    .max(100, "Email should be less than 100 characters."),
  Dept: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Department should contain only alphabets and spaces."
    )
    .max(90, "Department should be less than 90 characters."),
  Password: yup
            .string()
            .min(5, "Password must contain at least 5 characters.")
            .max(20, "Password should be less than 20 characters."),
  IsAdmin: yup.boolean(),
});

export const validateInputEmployee = async (employee: any) => {
  try {
    await validationSchema3.validate(employee);
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      alert(error.message);
      return false;
    }
  }
};

const validationSchema4 = yup.object().shape({
  empName: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Author name should contain only alphabets and spaces."
    )
    .max(90, "Name should be less than 90 characters."),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must be a valid email address."
    )
    .max(100, "Email should be less than 100 characters."),
  department: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Author name should contain only alphabets and spaces."
    )
    .max(90, "Department should be less than 90 characters."),
});

export const validateEditEmployee = async (employee: any) => {
  try {
    await validationSchema4.validate(employee);
    return true;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      alert(error.message);
    }
    return false;
  }
};
