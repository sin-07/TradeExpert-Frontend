import jwt from 'jsonwebtoken';
import connectDB from './db';
import User from './models/User';

export async function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return { error: 'No token, authorization denied', status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return { error: 'User not found', status: 401 };
    }

    return { user };
  } catch (err) {
    return { error: 'Token is not valid', status: 401 };
  }
}

