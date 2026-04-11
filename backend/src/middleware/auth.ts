import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'ghost-content-secret-key-2024';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Accès non autorisé' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        let user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        // Auto-recover temp user if DB was reset but token is still valid
        if (!user && (decoded.id === 'temp-user-id' || decoded.email === 'admin@duupflow.com' || decoded.email === 'ghost@centent.com')) {
             user = await prisma.user.upsert({
                 where: { id: decoded.id || 'temp-user-id' },
                 update: {},
                 create: { 
                     id: decoded.id || 'temp-user-id', 
                     email: decoded.email || 'admin@duupflow.com', 
                     password: 'password', // Placeholder
                     isActive: true,
                     role: decoded.role || UserRole.ADMIN,
                     settings: {
                         create: {
                             postsPerDayLimit: 3,
                             commentsPerPostLimit: 5
                         }
                     }
                 }
             });
        }

        if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé. Veuillez vous reconnecter.' });
        
        // Check if account is active and subscription hasn't expired
        const now = new Date();
        const isExpired = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < now;

        if (!user.isActive || isExpired) {
            return res.status(403).json({ 
                error: isExpired 
                    ? 'Votre abonnement a expiré, contactez l\'administrateur pour le renouveler.'
                    : 'Votre compte est en attente d\'activation ou a été désactivé par l\'administrateur.',
                isInactive: true,
                isExpired: !!isExpired
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Session expirée ou invalide' });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Accès administrateur requis' });
    }
    next();
};
