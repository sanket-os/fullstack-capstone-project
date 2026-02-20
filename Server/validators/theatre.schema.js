const { z } = require("zod");

const theatreSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    phone: z.string().min(10),
    email: z.string().email(),
  }),
});

module.exports = {
  theatreSchema,
};