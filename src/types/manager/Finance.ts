/**
 * Represents financial information for order.
 * @property {string} bill - The bill number.
 * @property {number} total - The total amount.
 * @property {number} pay - The amount paid.
 * @property {number} final - The final amount.
 * @property {string} currency - The currency of the amounts.
 */
type Finance = {
  bill: string;
  total: number;
  pay: number;
  final: number;
  currency: string;
};

export default Finance;
