/**
 * Represents a type for goods of an order.
 * @property {number} position - The position of the goods.
 * @property {string} name - The name of the goods.
 * @property {number} width - The width of the goods.
 * @property {number} height - The height of the goods.
 * @property {number} amount - The amount of the goods.
 * @property {number} pieces - The number of pieces of the goods.
 * @property {number} in - The in quantity of the goods.
 * @property {number} out - The out quantity of the goods.
 */
type Goods = {
  position: number;
  name: string;
  width: number;
  height: number;
  amount: number;
  pieces: number;
  in: number;
  out: number;
};

export default Goods;
