export class DiffUtil {
  /**
   * Compares two objects and returns a list of formatted strings describing the changes.
   * Format: "field: newValue"
   * @param oldObj The original object/entity
   * @param newObj The updated object/entity
   * @param fieldsToIgnore Optional list of field names to skip
   */
  static getChanges(oldObj: Record<string, unknown>, newObj: Record<string, unknown>, fieldsToIgnore: string[] = ["updatedAt", "createdAt"]): string[] {
    const changes: string[] = [];

    // We iterate over the new object's keys
    Object.keys(newObj).forEach((key) => {
      if (fieldsToIgnore.includes(key)) return;

      const oldValue = oldObj[key];
      const newValue = newObj[key];

      // Simple comparison (handles primitives and dates if they are Date objects)
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        // If it's a date object, we might want to format it, but for now we'll use stringify
        changes.push(`${key}: ${String(newValue)}`);
      }
    });

    return changes;
  }
}
