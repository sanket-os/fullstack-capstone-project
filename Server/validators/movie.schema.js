const { z } = require("zod");

const movieSchema = z.object({
  body: z.object({
    movieName: z.string().min(2),
    description: z.string().min(10),
    duration: z.number().positive(),
    genre: z.array(z.string()).min(1),
    language: z.array(z.string()).min(1),
    releaseDate: z.coerce.date(),
    poster: z.string().url(),
  }),
});

const movieIdParamSchema = z.object({
  params: z.object({
    movieId: z.string().min(1),
  }),
});

module.exports = {
  movieSchema,
  movieIdParamSchema,
};
