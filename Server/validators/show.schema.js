const { z } = require("zod");

const showSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    date: z.string(),
    time: z.string(),
    movie: z.string(),
    ticketPrice: z.number().positive(),
    totalSeats: z.number().positive(),
  }),
});

module.exports = {
  showSchema,
};
