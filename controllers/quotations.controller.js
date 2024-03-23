const { nanoid } = require('nanoid');
const db = require("../models");

const Quotation = db.quotations; // Assuming your quotation model is named "quotations"

exports.get = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    // Verify the bearer token and get the user ID
    const userId = TokenManager.verifyRefreshToken(bearerHeader);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const quotations = await Quotation.findAll({
      where: { userId: userId }
    });

    res.json({ data: quotations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    // Verify the bearer token and get the user ID
    const userId = TokenManager.verifyRefreshToken(bearerHeader);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { quote, bookId, page } = req.body;

    if (!quote || !bookId || !page) {
      throw new Error("Please provide all required fields: quote, bookId, page, userId");
    }

    const newQuotation = await Quotation.create({
      id: `quotation-${nanoid(16)}`,
      quote,
      bookId,
      page,
      userId,
    });

    res.json({ message: "Quotation created successfully.", data: newQuotation });
  } catch (err) {
    next(err);
  }
};

// Function to update a quotation by its ID
exports.update = async (req, res, next) => {
  try {
    const quotationId = req.params.id;
    const { quote, bookId, page, userId } = req.body;

    const [updatedCount] = await Quotation.update(
      { quote, bookId, page, userId },
      { where: { id: quotationId } }
    );

    if (updatedCount === 0) {
      throw new Error("Quotation not found");
    }

    const updatedQuotation = await Quotation.findByPk(quotationId);
    res.json({ message: "Quotation updated successfully.", data: updatedQuotation });
  } catch (err) {
    next(err);
  }
};

// Function to delete a quotation by its ID
exports.delete = async (req, res, next) => {
  try {
    const quotationId = req.params.id;

    const deletedCount = await Quotation.destroy({ where: { id: quotationId } });

    if (deletedCount === 0) {
      throw new Error("Quotation not found");
    }

    res.json({ message: "Quotation deleted successfully." });
  } catch (err) {
    next(err);
  }
};