export class IncomeVsExpenseModel {
  public readonly income: number;
  public readonly expense: number;
  public readonly net: number;

  private constructor(data: {
    income: number;
    expense: number;
    net: number;
  }) {
    this.income = data.income;
    this.expense = data.expense;
    this.net = data.net;
  }

  static create(
    income: number,
    expense: number,
  ): IncomeVsExpenseModel {
    return new IncomeVsExpenseModel({
      income,
      expense,
      net: income - expense,
    });
  }
}
