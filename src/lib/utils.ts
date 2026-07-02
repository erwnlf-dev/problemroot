// FILE: src/lib/utils.ts
'use client';

import { v4 as uuidv4 } from 'uuid';

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function generateId(): string {
  return uuidv4();
}

export function exportToJson(data: any): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'problemroot_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJson(file: File, callback: (data: any) => void): void {
  const reader = new FileReader();
  reader.onload = (event) => {
    const result = event.target?.result;
    if (typeof result === 'string') {
      try {
        const data = JSON.parse(result);
        callback(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  };
  reader.readAsText(file);
}
