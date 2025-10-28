export const calculateAge = (dateOfBirth: Date | string): number => {
  const today = new Date();

  // Convertir la fecha de nacimiento a objeto Date
  const birthDate =
    typeof dateOfBirth === 'string'
      ? new Date(dateOfBirth)
      : new Date(dateOfBirth.getTime());

  // Validar que la fecha sea válida
  if (isNaN(birthDate.getTime())) {
    throw new Error('Fecha de nacimiento inválida');
  }

  // Validar que no sea fecha futura
  if (birthDate > today) {
    throw new Error('La fecha de nacimiento no puede ser en el futuro');
  }

  // Calcular edad
  let age = today.getFullYear() - birthDate.getFullYear();

  // Verificar si ya pasó el cumpleaños este año
  const currentMonth = today.getMonth();
  const birthMonth = birthDate.getMonth();
  const currentDay = today.getDate();
  const birthDay = birthDate.getDate();

  // Si no ha pasado el cumpleaños este año, restar 1
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
};
