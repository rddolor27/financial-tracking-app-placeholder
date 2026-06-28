export class SpendingByCategoryModel {
  public readonly category_id: string;
  public readonly category_name: string;
  public readonly total: number;

  private constructor(data: {
    category_id: string;
    category_name: string;
    total: number;
  }) {
    this.category_id = data.category_id;
    this.category_name = data.category_name;
    this.total = data.total;
  }

  static create(
    categoryId: string,
    categoryName: string,
    total: number,
  ): SpendingByCategoryModel {
    return new SpendingByCategoryModel({
      category_id: categoryId,
      category_name: categoryName,
      total,
    });
  }
}
