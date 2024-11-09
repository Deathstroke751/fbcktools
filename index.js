const express = require('express');
const app = express();
const login = require("fca-kaito");
const port = process.env.PORT || 3000;

app.use(express.json());  // Middleware to parse JSON request bodies

// Function to extract selected cookies from a cookie string
function getSelectedCookies(cookieString) {
    const cookieNames = ['fr', 'sb', 'datr', 'c_user', 'xs'];
    const cookies = {};

    const cookieArray = cookieString.split('; ');

    cookieArray.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (cookieNames.includes(name)) {
            cookies[name] = value;
        }
    });
    return cookies;
}

// Function to obtain cookies in the format of a cookie string
function obtainCookies(cookieString) {
    const cookieObject = getSelectedCookies(cookieString);
    return Object.entries(cookieObject)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
}

// Function to handle user login
async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        console.log(`Attempting login for email: ${email}`); // Log the login attempt

        login({ email, password }, (err, api) => {
            if (err) {
                console.error('Login failed:', err); // Log the error for debugging
                reject(new Error('Login failed: ' + err)); // Reject with an Error object
            } else {
                // Log the cookies for debugging
                const cookies = obtainCookies(api.getCookie());
                console.log('Login successful, cookies obtained:', cookies);
                resolve(cookies); // Resolve with the cookies
            }
        });
    });
};

// Example POST /login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Simulate login logic here (e.g., use fca-kaito or another method)
    if (email && password) {
        try {
            const cookies = await loginUser(email, password);
            res.status(200).json(cookies); // Return the cookies as the response
        } catch (error) {
            res.status(500).json({ success: false, message: error.message }); // Return error message if login fails
        }
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Home route for health check
app.get('/', (req, res) => {
    res.status(200).json({ status: 200, message: 'working' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
