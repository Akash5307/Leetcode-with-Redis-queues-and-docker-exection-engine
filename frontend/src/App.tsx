import React, { useState } from 'react';
import './App.css'; // Import CSS file

function CodeSubmissionForm() {
    const [userId, setUserId] = useState('');
    const [problemId, setProblemId] = useState('');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setLoading(true);

        const submission = {
            userId,
            problemId,
            code: code.replace(/"/g, '\\"'), 
            language
        };

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submission)
            });
            console.log(response);
            if (response.ok) {
                setSuccessMessage('Code submitted successfully');
                setUserId('');
                setProblemId('');
                setCode('');
                setLanguage('');
            } else {
                setError('Error submitting code');
            }
        } catch (error:any) {
            setError('Error submitting code: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="code-submission-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <div className="form-group">
                <label>User ID:</label>
                <input type="text" value={userId} placeholder="User Id" onChange={(e) => setUserId(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Problem ID:</label>
                <input type="text" value={problemId} placeholder="Problem Id"onChange={(e) => setProblemId(e.target.value)} required />
            </div>
            <div className="form-group-code">
                <label>Code:</label>
                <textarea value={code} placeholder="Write your code here" onChange={(e) => setCode(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Language:</label>
                <input type="text" value={language} placeholder="Language" onChange={(e) => setLanguage(e.target.value)} required />
            </div>
            <button className="submit-button" type="submit" disabled={loading}>Submit Code</button>
        </form>
    );
}

export default CodeSubmissionForm;
