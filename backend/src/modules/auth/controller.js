const authService = require('./service');
const { z } = require('zod');

// Validation schemas
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['user', 'admin']).optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

class AuthController {
    async register(req, res) {
        try {
            // Validate input
            const parsedData = registerSchema.parse(req.body);

            // Call service
            const response = await authService.register(parsedData);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: response
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ success: false, errors: error.errors });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async login(req, res) {
        try {
            const parsedData = loginSchema.parse(req.body);
            const response = await authService.login(parsedData.email, parsedData.password);

            res.status(200).json({
                success: true,
                message: 'Logged in successfully',
                data: response
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ success: false, errors: error.errors });
            }
            res.status(401).json({ success: false, message: error.message });
        }
    }
}

module.exports = new AuthController();
