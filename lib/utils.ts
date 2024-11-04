import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseDateString(dateString: string) {
  // Split the date and time
  const [datePart, timePart] = dateString.split(" ");
  
  // Split the date into day, month, year
  const [day, month, year] = datePart.split(".").map(Number);
  
  // Split the time into hours, minutes, seconds
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  
  // Create a new Date object
  return new Date(year, month - 1, day, hours, minutes, seconds);
}