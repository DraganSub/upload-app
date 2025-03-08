import { ref, computed } from "vue";
import capitalizeFieldName from "~/utils/helpers/capitalizeFieldName";

interface ValidationErrors {
  email?: string;
  password?: string;
  repeatPassword?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
}

export function useValidation() {
  const errors = ref<ValidationErrors>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    errors.value.email = emailRegex.test(email) ? "" : "Invalid email format";
  };

  const validatePassword = (password: string) => {
    errors.value.password =
      password.length >= 8 ? "" : "Password must be at least 8 characters long";
  };

  const validateRepeatPassword = (password: string, repeatPassword: string) => {
    errors.value.repeatPassword =
      password === repeatPassword ? "" : "Passwords do not match";
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    errors.value.phoneNumber = phoneRegex.test(phoneNumber)
      ? ""
      : "Invalid phone number";
  };

  const validateRequired = (field: string, fieldName: keyof ValidationErrors) => {
    errors.value[fieldName] = field.trim() ? "" : `${capitalizeFieldName(fieldName)} is required`;
  };

  const isValid = computed(() => {
    return Object.values(errors.value).every((error) => !error);
  });

  const validate = (formData: { [key: string]: any }) => {
    validateEmail(formData.email);
    validatePassword(formData.password);
    validateRepeatPassword(formData.password, formData.repeatPassword);
    validatePhoneNumber(formData.phoneNumber);
    validateRequired(formData.firstName, "firstName");
    validateRequired(formData.lastName, "lastName");
    validateRequired(formData.country, "country");
    validateRequired(formData.address, "address");
  };

  const validateLoginCredentials = (formData: { [key: string]: any }) => {
    validateEmail(formData.email);
    validatePassword(formData.password);
  }


  return {
    errors,
    validate,
    isValid,
    validateRequired,
    validateLoginCredentials
  };
}
