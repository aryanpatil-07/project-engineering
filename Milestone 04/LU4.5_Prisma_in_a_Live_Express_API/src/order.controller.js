const prisma = require('./lib/db');

async function purchaseItem(req, res) {
  try {
    const { userId, productId } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return null;
      }

      const order = await tx.order.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      return order;
    });

    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(201).json({ order: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOrdersByUser(req, res) {
  try {
    const userId = parseInt(req.params.userId);

    const orders = await prisma.order.findMany({
      where: { userId },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { purchaseItem, getOrdersByUser };