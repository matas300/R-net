const { verifyToken } = require('../config/auth');

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.admin_token;
  if (!token) return res.redirect('/admin/login');

  const decoded = verifyToken(token);
  if (!decoded) {
    res.clearCookie('admin_token');
    return res.redirect('/admin/login');
  }

  req.admin = decoded;
  next();
}

module.exports = requireAuth;
