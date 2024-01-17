const sendEmailForgotPassword = (foundUser, resetToken) => {
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta
			name="viewport"
			content="width=device-width, initial-scale=1.0"
		/>
		<style>
			body {
				font-family: "Arial", sans-serif;
				margin: 0;
				padding: 0;
				background-color: #f4f4f4;
			}
			.container {
				max-width: 600px;
				margin: 20px auto;
				padding: 20px;
				background-color: #ffffff;
				border-radius: 8px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			h2 {
				margin: 0 auto;
				background-color: #004aff;
				text-align: center;
				color: #ffffff;
				padding: 10px 0;
				border-radius: 10px 10px 0 0px;
			}
			p {
				color: #555555;
			}
			.verification-link {
				display: inline-block;
				padding: 10px 20px;
				background-color: #007bff;
				color: #ffffff;
				text-decoration: none;
				border-radius: 5px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<h2>Account Verification</h2>
			<p>Dear ${foundUser.firstName},</p>
			<p>
			you have requested to change your password click the below link to proceed 
			</p>
			<a href= "https://blogvana-5l46.onrender.com/reset-password/${resetToken}" class="verification-link"
				>Reset Password</a
			>
			<p>if the button is not working copy the below link to the browser </p>
			
			<p>https://blogvana-5l46.onrender.com/reset-password/${resetToken}</p>

			<p>If you did initiate this action, please disregard this email.</p>
			<p>Best regards,<br />BlogVana</p>
		</div>
	</body>
</html>`;
};
module.exports = sendEmailForgotPassword;
