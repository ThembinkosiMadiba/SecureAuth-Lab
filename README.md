# 🛡️ SecureAuth Lab

An educational cybersecurity laboratory for understanding brute-force attacks and authentication security.

🌐 **Live Site:** [https://valentine-invintation.netlify.app/](https://secure-auth-lab.netlify.app/)

## ⚠️ Educational Use Only

**This simulator is strictly for educational purposes.** It operates entirely within your browser and does not connect to any external systems. No real credentials are used or stored, and no actual systems are attacked.

## 🎯 What This Demonstrates

SecureAuth Lab teaches you:

- **How brute-force attacks work** - See step-by-step how attackers try to guess passwords
- **Password strength matters** - Understand why complex passwords are essential
- **Defense mechanisms** - Learn how rate limiting and account lockouts protect systems
- **Real-time analytics** - Visualize attack patterns and security metrics

## 🚀 Features

### 1. Password Testing

- Enter any password to test its strength against a brute-force simulation
- Uses a predefined wordlist of common passwords
- See exactly how long it takes to crack weak passwords

### 2. Defense Controls

- **Rate Limiting**: Adds delays between attempts to slow attacks
- **Account Lockout**: Locks after multiple failed attempts
- **Attempt Limits**: Configure maximum number of attempts allowed

### 3. Real-Time Visualization

- Live charts showing attempts over time
- Success vs failure distribution
- Attempt intervals and performance metrics
- Detailed attempt logs

### 4. Clear Results

- If password is found: Shows the exact password, time taken, and why it was vulnerable
- If password is secure: Explains why defenses were effective
- Security recommendations based on results

## 🎨 Design

SecureAuth Lab features an Apple-inspired UI with:

- Clean, minimalist layout
- Soft gradients and shadows
- Frosted glass effects
- Smooth animations
- Professional typography

## 🔒 Safety & Ethics

✅ **Safe for portfolios and demonstrations**
✅ Runs entirely in the browser (no backend required)
✅ No real authentication systems are attacked
✅ No credentials are collected or stored
✅ Educational disclaimers throughout

⚠️ **Important**: Unauthorized access to computer systems is illegal. This tool is designed solely to teach defensive security concepts.

## 🛠️ Technical Stack

- **React** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📚 How It Works

1. **Enter a Password**: Input any password you want to test
2. **Configure Defenses**: Enable/disable security mechanisms
3. **Run Simulation**: Watch as the system attempts to crack the password
4. **View Results**: See detailed analysis and recommendations

The simulator uses a predefined wordlist of common passwords (like "password", "123456", etc.) and systematically tries each one. If your password matches one in the list, it demonstrates how quickly weak passwords can be compromised.

## 🎓 Learning Outcomes

After using SecureAuth Lab, you'll understand:

- Why dictionary words make poor passwords
- How defensive mechanisms protect against attacks
- The importance of password complexity
- Real-world attack timelines and patterns
- Security best practices for authentication

---

Built with a focus on education, security awareness, and ethical practices.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
