import { useEffect, useState } from "react";

const noopAuthenticate = () => true;

const noErrors = (errors) => {
  return (
    !errors ||
    Object.keys(errors).length === 0 ||
    Object.values(errors).every((error) => !error)
  );
};

function useFormValidation(initialState, validate, authenticate = noopAuthenticate) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
      if (isSubmitting) {
        if (noErrors(errors)) {
            authenticate(values);
        }
        setSubmitting(false);
      }
  }, [errors]);
  /* eslint-enable react-hooks/exhaustive-deps */

  function handleBlur() {
    setErrors(validate(values));
  };

  function handleChange(event) {
    event.persist();
    setValues((previousValues) => {
        return {
            ...previousValues,
            [event.target.name]: event.target.value,
        }
    });
  };

  function handleSubmit(event) {
      event.preventDefault();
      setSubmitting(true);
      const validationErrors = validate(values);
      setErrors(validationErrors);
  }

  return { errors, handleBlur, handleChange, handleSubmit, isSubmitting, values };
}

export default useFormValidation;