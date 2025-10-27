// Seed demo user through backend API (MongoDB storage)
export default async function seedDemoUser() {
  try {
    // Try to create demo user in MongoDB via backend
    await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Demo User',
        email: 'demo@tradexpert.com',
        password: 'demo123'
      })
    })
    // Silently succeed or fail - demo user may already exist
  } catch (error) {
    // Ignore errors - demo user setup is optional
  }
}
