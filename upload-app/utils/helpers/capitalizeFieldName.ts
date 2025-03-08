export default function capitalizeFieldName(fieldName: string): string {
  return fieldName
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')  // Add space between camelCase 
    .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize first letter of each word
}