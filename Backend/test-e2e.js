async function runTest() {
    console.log('--- Starting API Stress Test ---');
    try {
        const baseUrl = 'http://127.0.0.1:3000';
        
        // 1. Health Check
        console.log('Pinging Health Check...');
        const health = await fetch(baseUrl + '/api/health').then(r => r.json());
        console.log('Health OK:', health);
        
        // 2. Register / Login
        console.log('Testing Registration/Login...');
        let cookie = '';
        let authRes = await fetch(baseUrl + '/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testuser', email: 'test@example.com', password: 'password123' })
        });
        
        if (authRes.status === 409) {
            console.log('User exists, logging in instead...');
            authRes = await fetch(baseUrl + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
            });
        }
        
        cookie = authRes.headers.get('set-cookie');
        console.log('Auth successful.');
        
        // 3. Generate Interview Report (Google API)
        console.log('Testing Google API (Generate Interview Report)...');
        const formData = new FormData();
        formData.append('jobDescription', 'React Developer');
        formData.append('selfDescription', 'I am a react developer');
        
        const reportRes = await fetch(baseUrl + '/api/interview/', {
            method: 'POST',
            headers: { 'Cookie': cookie },
            body: formData
        });
        
        const reportData = await reportRes.json();
        
        if (!reportRes.ok) {
            console.error('--- DIAGNOSTICS: API ERROR ENCOUNTERED ---');
            console.error('Endpoint: /api/interview/');
            console.error('Status:', reportRes.status);
            console.error('Message:', reportData.message);
            if (reportData.message && reportData.message.includes('API key')) {
                console.error('REASON: Google API Key is invalid or rate limited.');
            }
            process.exit(1);
        }
        
        console.log('Report Generation Successful!');
    } catch (e) {
        console.error('FATAL ERROR:', e.message);
        process.exit(1);
    }
}

runTest();
