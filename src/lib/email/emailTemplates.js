export const otpEmailTemplate = (otp, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 32px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
          letter-spacing: 8px;
          margin: 30px 0;
        }
        .info-text {
          color: #666666;
          line-height: 1.6;
          margin: 20px 0;
        }
        .warning {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          color: #856404;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TradeXpert</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p class="info-text">
            You requested to verify your email address. Please use the following OTP (One-Time Password) to complete your verification:
          </p>
          <div class="otp-box">
            ${otp}
          </div>
          <p class="info-text">
            This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
          </p>
          <div class="warning">
            <strong>Security Notice:</strong> If you didn't request this verification, please ignore this email and ensure your account is secure.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const welcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content {
          padding: 40px;
          text-align: center;
        }
        .content h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          margin: 10px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h1>Welcome to TradeXpert! 🎉</h1>
          <p><strong>Hello ${userName}!</strong></p>
          <p>Welcome aboard! Your account is ready and verified. You can start trading with real-time market data.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const orderConfirmationEmailTemplate = (userName, orderDetails) => {
  const { side, symbol, stockName, quantity, price, totalAmount, orderType, market, orderId, executedAt } = orderDetails;
  
  const isBuy = side === 'Buy';
  const actionColor = isBuy ? '#10b981' : '#ef4444';
  const actionText = isBuy ? 'BOUGHT' : 'SOLD';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 30px;
        }
        .status-badge {
          background-color: ${actionColor};
          color: #ffffff;
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .order-details {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .total-row {
          font-weight: bold;
          font-size: 18px;
          color: #1e293b;
          border-top: 2px solid #cbd5e1;
          margin-top: 10px;
          padding-top: 15px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TradeXpert Order Confirmation</h1>
        </div>
        <div class="content">
          <div class="status-badge">${actionText} - ${orderType}</div>
          <h2>Hello ${userName}!</h2>
          <p>Your order for <strong>${stockName} (${symbol})</strong> has been successfully executed.</p>
          
          <div class="order-details">
            <div class="detail-row"><span>Order ID:</span> <span>#${orderId}</span></div>
            <div class="detail-row"><span>Action:</span> <span>${side}</span></div>
            <div class="detail-row"><span>Quantity:</span> <span>${quantity}</span></div>
            <div class="detail-row"><span>Price per Unit:</span> <span>₹${Number(price).toFixed(2)}</span></div>
            <div class="detail-row"><span>Market:</span> <span>${market}</span></div>
            <div class="detail-row total-row"><span>Total Amount:</span> <span>₹${Number(totalAmount).toFixed(2)}</span></div>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const forgotPasswordEmailTemplate = (userName, resetToken) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .token-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          font-size: 28px;
          font-weight: bold;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
          letter-spacing: 6px;
          margin: 30px 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>We received a request to reset your password. Use the code below:</p>
          <div class="token-box">${resetToken}</div>
          <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TradeXpert. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
