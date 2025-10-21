interface FormInfoUserProps {
  form: FormData;
  onChange: (value: string, field: keyof FormData) => void;
}
