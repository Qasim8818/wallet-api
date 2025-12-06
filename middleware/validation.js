// middleware/validation.js – Joi + Celebrate input validators

const { celebrate, Joi, Segments } = require('celebrate');

const walletCreateSchema = celebrate({
    [Segments.BODY]: Joi.object({
        owner: Joi.string().email().required(),
        balance: Joi.number().min(0).default(0),
    }),
});

const walletUpdateSchema = celebrate({
    [Segments.PARAMS]: Joi.object({
        id: Joi.string().hex().length(24).required(),
    }),
    [Segments.BODY]: Joi.object({
        amount: Joi.number().positive().required(),
    }),
});

module.exports = {
    walletCreateSchema,
    walletUpdateSchema,
};