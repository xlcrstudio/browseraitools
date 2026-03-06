// Pure client-side application, no backend storage needed
export interface IStorage {}
export class MemStorage implements IStorage {}
export const storage = new MemStorage();
