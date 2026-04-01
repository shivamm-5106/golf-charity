const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepo = require('./repository');

class AuthService {
    async register(userData) {
        const { name, email, password, role } = userData;

        // Check if user exists
        const existingUser = await authRepo.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await authRepo.createUser({
            name,
            email,
            password: hashedPassword,
            role
        });

        return this.generateAuthResponse(newUser);
    }

    async login(email, password) {
        // Find user
        const user = await authRepo.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return this.generateAuthResponse(user);
    }

    generateAuthResponse(user) {
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
}

module.exports = new AuthService();
