import visitorModel from "../models/visitorModel.js";

export const trackVisitor = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ success: false });
    }

    const visitor = await visitorModel.findOne({ visitorId });

    if (visitor) {
      visitor.visits += 1;
      visitor.lastVisitedAt = new Date();
      await visitor.save();
    } else {
      await visitorModel.create({ visitorId });
    }

    return res.json({ success: true });
  } catch (err) {
    console.log("Visitor tracking error:", err);
    return res.json({ success: false });
  }
};
