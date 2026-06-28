export class CsvPreviewModel {
  public readonly rows: Record<string, unknown>[];
  public readonly duplicates_count: number;

  private constructor(data: {
    rows: Record<string, unknown>[];
    duplicates_count: number;
  }) {
    this.rows = data.rows;
    this.duplicates_count = data.duplicates_count;
  }

  static create(
    rows: Record<string, unknown>[],
    duplicatesCount: number,
  ): CsvPreviewModel {
    return new CsvPreviewModel({
      rows,
      duplicates_count: duplicatesCount,
    });
  }
}
