const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator')

const User = require("../models/user");

const mongodb = require("mongodb");
const { log } = require('console');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bilalahamedgurani@gmail.com',
    pass: 'uitk xcze yfta trtu'
  },
});


exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1] === "true";
  const errorTitle = req.flash('errorTitle');
  const errorMessage = req.flash('errorMessage');

  res.render("auth/login", {
    title: "Login page",
    docTitle: "Login",
    path: "/login",
    isAuthenticated: false,
    errorTitle: errorTitle,
    errorMessage: errorMessage,
    userName: req?.user?.name,
    oldInput: {
      email: "",
      password: ""
    },
    validationError: []
  });
}
exports.getSignUp = (req, res, next) => {
  const errorTitle = req.flash('errorTitle');
  const errorMessage = req.flash('errorMessage');

  res.render("auth/signup", {
    title: "Signup page",
    docTitle: "Signup",
    path: "/signup",
    isAuthenticated: false,
    errorTitle: errorTitle,
    errorMessage: errorMessage,
    userName: req.user?.name,
    oldInput: {
      name: "",
      email: "",
      password: ""
    },
    validationError: []
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array());
    
    const firstError = error.array()[0]; 
    return res.status(422)
    .render("auth/login", {
      title: "Login page",
      docTitle: "Login",
      path: "/login",
      isAuthenticated: false,
      errorTitle: ['Invalid Credentials'],
      errorMessage: [firstError.msg],
      userName: req?.user?.name,
      oldInput: {
        email: email,
        password: password
      },
      validationError: error.array()
    });
  }
  User.findOne(email)
  .then(user => { 
    if (!user) {           
      return res.status(422)
      .render("auth/login", {
        title: "Login page",
        docTitle: "Login",
        path: "/login",
        isAuthenticated: false,
        errorTitle: ['Invalid User'],
        errorMessage: ['The username or password you entered is incorrect. Please check your credentials and try again.'],
        userName: req?.user?.name,
        oldInput: {
          email: email,
          password: password
        },
        validationError: error.array()
      });
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(() => {
            return res.status(422)
      .render("auth/login", {
        title: "Login page",
        docTitle: "Login",
        path: "/login",
        isAuthenticated: false,
        errorTitle: ['Invalid User'],
        errorMessage: ['The username or password you entered is incorrect. Please check your credentials and try again.'],
        userName: req?.user?.name,
        oldInput: {
          email: email,
          password: password
        },
        validationError: error.array()
      });
        });
      } else {
        req.flash('errorTitle', 'Invalid Credentials')
        req.flash('errorMessage', 'The username or password you entered is incorrect.')
        res.redirect("/login");
      }
    }).catch(err => { 
      console.log(err);
      req.flash('errorTitle', 'Server Error')
      req.flash('errorMessage', 'Something went wrong. Please try again.')
      res.redirect("/login");
    });
  })
  .catch(err => console.log(err));
}

exports.postSignUp = (req, res, next) => {  
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    req.flash('errorTitle', 'Missing Fields');
    req.flash('errorMessage', 'Please fill in all required fields.');
    return res.redirect("/signup");
  }

  if (password.length < 6) {
    req.flash('errorTitle', 'Weak Password');
    req.flash('errorMessage', 'Password must be at least 6 characters long.');
    return res.redirect("/signup");
  }

  const error = validationResult(req);
  if (!error.isEmpty()) {
    const firstError = error.array()[0]; 
    console.log(error.array());
    return res.status(422)
    .render("auth/signup", {
      title: "Signup page",
      docTitle: "Signup",
      path: "/signup",
      isAuthenticated: false,
      errorTitle: ['Validation Error'],
      errorMessage: [firstError.msg],
      userName: req.user?.name,
      oldInput: {
        name: name,
        email: email,
        password: password
      },
      validationError: error.array()
    });
  }
   bcrypt
    .hash(password, 12)
    .then(hashedPass => {
      const user = new User(name, email, hashedPass, undefined, undefined, {items: []}, undefined)
      return user.save();
    })
    .then(result => {
      console.log('About to send email to:', email);
      const templateData = {
        firstName: name,
        email: email,
        year: new Date().getFullYear(),
        createdDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        supportUrl: 'https://bkdesigndev.netlify.app/',
        helpUrl: 'https://bkdesigndev.netlify.app/',
        faqUrl: 'https://bkdesigndev.netlify.app/',
      };
      transporter.sendMail({
        to: email,
        from: 'user.bkdesign@gmail.com',
        subject: '🎉 Welcome to BK Design - Account Created Successfully!',
        html: getEmailTemplate(templateData),
      })
      .then(info => {
        console.log('Email sent successfully:', info);
      })
      .catch(err => {
        console.error("Error sending email:", err);
        // Could also log to a file or monitoring service
      });
      req.flash('errorTitle', 'Account Created');
      req.flash('errorMessage', 'Your account has been created successfully! Please log in.');
      res.redirect("/login");
  });
}


exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/")
  });
}

function getEmailTemplate(userData) {
  const { firstName, email, year, createdDate, supportUrl, helpUrl, faqUrl } = userData;
  return `
  <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome Email</title>
                <style>
                    /* Reset styles */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        background-color: #f8fafc;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    }
                    
                    /* Header with gradient */
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 40px 30px;
                        text-align: center;
                        color: white;
                    }
                    
                    .header h1 {
                        font-size: 28px;
                        font-weight: 700;
                        margin-bottom: 10px;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    
                    .header p {
                        font-size: 16px;
                        opacity: 0.9;
                        margin: 0;
                    }
                    
                    /* Success icon */
                    .success-icon {
                        background: rgba(255, 255, 255, 0.2);
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 20px auto 0;
                        backdrop-filter: blur(10px);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                    }
                    
                    .success-icon svg {
                        width: 40px;
                        height: 40px;
                        fill: white;
                    }
                    
                    /* Content section */
                    .content {
                        padding: 40px 30px;
                    }
                    
                    .welcome-message {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    
                    .welcome-message h2 {
                        font-size: 24px;
                        color: #2d3748;
                        margin-bottom: 15px;
                        font-weight: 600;
                    }
                    
                    .welcome-message p {
                        font-size: 16px;
                        color: #4a5568;
                        line-height: 1.7;
                    }
                    
                    /* Account details card */
                    .account-details {
                        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                        border-radius: 12px;
                        padding: 25px;
                        margin: 30px 0;
                        border: 1px solid #e2e8f0;
                    }
                    
                    .account-details h3 {
                        color: #2d3748;
                        font-size: 18px;
                        margin-bottom: 15px;
                        font-weight: 600;
                    }
                    
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 0;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    
                    .detail-label {
                        font-weight: 600;
                        color: #4a5568;
                    }
                    
                    .detail-value {
                        color: #2d3748;
                        font-weight: 500;
                    }
                    
                    /* CTA Button */
                    .cta-section {
                        text-align: center;
                        margin: 35px 0;
                    }
                    
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        padding: 15px 35px;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .cta-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
                    }
                    
                    /* Features section */
                    .features {
                        background: #f8fafc;
                        padding: 30px;
                        margin: 30px 0;
                        border-radius: 12px;
                    }
                    
                    .features h3 {
                        text-align: center;
                        color: #2d3748;
                        font-size: 20px;
                        margin-bottom: 25px;
                        font-weight: 600;
                    }
                    
                    .feature-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    
                    .feature-item {
                        text-align: center;
                        padding: 20px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    }
                    
                    .feature-icon {
                        width: 50px;
                        height: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 15px;
                    }
                    
                    .feature-icon svg {
                        width: 24px;
                        height: 24px;
                        fill: white;
                    }
                    
                    .feature-item h4 {
                        color: #2d3748;
                        font-size: 16px;
                        margin-bottom: 8px;
                        font-weight: 600;
                    }
                    
                    .feature-item p {
                        color: #4a5568;
                        font-size: 14px;
                        line-height: 1.5;
                    }
                    
                    /* Footer */
                    .footer {
                        background: #2d3748;
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    
                    .footer h3 {
                        margin-bottom: 15px;
                        font-size: 18px;
                        font-weight: 600;
                    }
                    
                    .footer p {
                        opacity: 0.8;
                        margin-bottom: 20px;
                        line-height: 1.6;
                    }
                    
                    .social-links {
                        margin: 20px 0;
                    }
                    
                    .social-links a {
                        display: inline-block;
                        margin: 0 10px;
                        color: white;
                        text-decoration: none;
                        font-weight: 500;
                        padding: 8px 16px;
                        border-radius: 20px;
                        background: rgba(255, 255, 255, 0.1);
                        transition: background 0.3s ease;
                    }
                    
                    .social-links a:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    
                    .footer-note {
                        font-size: 12px;
                        opacity: 0.6;
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                    }
                    
                    /* Responsive design */
                    @media (max-width: 600px) {
                        .email-container {
                            margin: 0;
                            box-shadow: none;
                        }
                        
                        .header, .content, .footer {
                            padding: 25px 20px;
                        }
                        
                        .header h1 {
                            font-size: 24px;
                        }
                        
                        .welcome-message h2 {
                            font-size: 20px;
                        }
                        
                        .account-details {
                            padding: 20px;
                        }
                        
                        .detail-row {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 5px;
                        }
                        
                        .cta-button {
                            padding: 12px 30px;
                            font-size: 14px;
                        }
                        
                        .feature-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <!-- Header Section -->
                    <div class="header">
                        <h1>🎉 Welcome Aboard!</h1>
                        <p>Your account has been successfully created</p>
                        <div class="success-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="content">
                        <div class="welcome-message">
                            <h2>Hello ${firstName}!</h2>
                            <p>Thank you for joining <strong>BK Design</strong>. We're thrilled to have you as part of our community. Your account is now active and ready to use.</p>
                        </div>
                        
                        <!-- Account Details -->
                        <div class="account-details">
                            <h3>📋 Account Information</h3>
                            <div class="detail-row">
                                <span class="detail-label">Email Address: </span>
                                <span class="detail-value">${email}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Account Created: </span>
                                <span class="detail-value">${createdDate}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Account Status: </span>
                                <span class="detail-value" style="color: #48bb78; font-weight: 600;">✅ Active</span>
                            </div>
                        </div>
                        
          
                    
                    <!-- Footer -->
                    <div class="footer">
                        <h3>Need Help?</h3>
                        <p>If you have any questions or need assistance, our support team is here to help you every step of the way.</p>
                        
                        <div class="social-links">
                            <a href="${supportUrl}">Contact Support</a>
                            <a href="${helpUrl}">Help Center</a>
                            <a href="${faqUrl}">FAQ</a>
                        </div>
                        
                        <div class="footer-note">
                            <p>This email was sent to ${email} because you created an account with us.<br>
                            If you didn't create this account, please <a href="${supportUrl}" style="color: #667eea;">contact our support team</a> immediately.</p>
                            <p>&copy; ${year} BK Design. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
  
  `
}

exports.getReset = (req, res, next) => {
  const errorTitle = req.flash('errorTitle');
  const errorMessage = req.flash('errorMessage');

  res.render("auth/reset", {
    title: "Reset page",
    docTitle: "Reset",
    path: "/reset",
    isAuthenticated: false,
    errorTitle: errorTitle,
    errorMessage: errorMessage,
    userName: req.user?.name
  });
}

exports.postReset = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash('errorTitle', 'Server Error');
      req.flash('errorMessage', 'Something went wrong. Please try again.');
      return res.redirect("/reset");
    }

    const token = buffer.toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000);
    // Convert to local time IST
    const localAsDate = new Date(tokenExpiry.getTime() - tokenExpiry.getTimezoneOffset() * 60000);

    User.findOne(email)
    .then(user => {
      if (!user) {
        req.flash('errorTitle', 'Invalid User')
        req.flash('errorMessage', 'No account found with that email address.')
        return res.redirect('/reset')
      }
      return User.setTokenWithExpiry(email, token, 1)
      .then(result => {
        if (!result) return;
        return transporter.sendMail({
          to: email,
          from: 'user.bkdesign@gmail.com',
          subject: 'Password Reset',
          html: 
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You requested a password reset for your BK Design account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/reset/${token}" 
                 style="background-color: #667eea; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">
              http://localhost:3000/reset/${token}
            </p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this reset, 
              please ignore this email.
            </p>
          </div>
          `,
        });
      })
      .then(() => {
        req.flash('errorTitle', 'Reset Email Sent');
        req.flash('errorMessage', 'Password reset instructions have been sent to your email.');
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
        req.flash('errorTitle', 'Server Error');
        req.flash('errorMessage', 'Something went wrong. Please try again.');
        res.redirect('/reset');
      })
    });
  });
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findByTokenWithExpiry(token)
  .then(user => {    
    const errorTitle = req.flash('errorTitle');
    const errorMessage = req.flash('errorMessage');

    res.render("auth/new-password", {
      title: "New Password page",
      docTitle: "New Password",
      path: "/new-password",
      isAuthenticated: false,
      errorTitle: errorTitle,
      errorMessage: errorMessage,
      userId: user._id.toString(),
      passwordToken: token,
      userName: req.user.name
    });
  })
  .catch(err => {
    console.log(err);
    req.flash('errorTitle', 'Server Error');
    req.flash('errorMessage', 'Something went wrong. Please try again.');
    res.redirect('/');
  })  
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const tokenExpiry = new Date();
  let resetUser;
  User.findOneWithTokenAndUserId(passwordToken, tokenExpiry, userId)
  .then(user => {
    console.log("----USER-----");
    
    console.log(user);
    
    resetUser = user;
    return bcrypt.hash(newPassword, 12)
  })
  .then(hashedPass => {    
    const db = require("../util/database").getDb();
    console.log("USERID: ");
    
    console.log(userId);
    
    return db.collection('users').updateOne(
      {_id: new mongodb.ObjectId(userId)},
      {
      $set: {
        password: hashedPass,
        token: undefined,
        tokenExpiry: undefined
      }
    }
    )
  })
  .then(user => {    
    req.flash('errorTitle', 'Password Reset Success');
    req.flash('errorMessage', 'Password has been reset successfully!');
    res.redirect('/login')
  })
  .catch(err => {
    console.log(err);
    req.flash('errorTitle', 'Server Error');
    req.flash('errorMessage', 'Something went wrong. Please try again.');
    res.redirect('/reset');
  })
}