import { useEffect, useState } from "react";

const noopAuthenticate = () => true;

function useFormValidation(initialState, validate, authenticate = noopAuthenticate) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
      if (isSubmitting) {
        const noErrors = Object.keys(errors).length === 0;
        if (noErrors) {
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