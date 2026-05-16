const { z } = require("zod");

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email").optional(),

  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),

  company: z.string().optional(),

  notes: z.string().max(500).optional(),

  status: z
    .enum(["new", "contacted", "qualified", "closed"])
    .optional(),
});

module.exports = { leadSchema };