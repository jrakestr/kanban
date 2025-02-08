import { Request, Response, NextFunction } from 'express';

export const debugMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    console.log('\n=== Debug Request Info ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('=== End Debug Info ===\n');
    next();
};
