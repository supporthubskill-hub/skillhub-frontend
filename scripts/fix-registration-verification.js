const fs=require('fs');
const p='zeqviro.html';
let s=fs.readFileSync(p,'utf8');
s=s.replace("function resetRegistrationVerification() {\n            registrationVerificationToken = '';", "function resetRegistrationVerification() {\n            const sendButton = document.getElementById('sendRegistrationCodeButton');\n            if (sendButton && sendButton.textContent.includes('verificado')) return;\n            registrationVerificationToken = '';");
s=s.replace("document.getElementById('sendRegistrationCodeButton').textContent = 'Correo verificado ✓';", "const verifiedButton = document.getElementById('sendRegistrationCodeButton');\n                verifiedButton.textContent = 'Correo verificado ✓';\n                verifiedButton.disabled = true;\n                document.getElementById('authEmail').readOnly = true;\n                document.getElementById('authError').textContent = '';");
fs.writeFileSync(p,s);
