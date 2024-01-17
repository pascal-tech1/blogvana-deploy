const sendAcctVerificationEmailCtrl = expressAsyncHandler(
	async (req, res) => {
		const loginUserId = req.user.id;
		const foundUser = await User.findById(loginUserId);
		const verificationToken = await foundUser.accountVerificationHandler();
		await foundUser.save();
		let mailDetails = {
			from: "pascalazubike003@gmail.com",
			to: `pascalazubike003@gmail.com`,
			subject: "Full Stack Developer Position",
			html: email,
			attachments: [
				{
					filename: "pascal-resume.pdf", // Customize the filename
					path: path.join(__dirname, "pascal-resume.pdf"), // Specify the path to your PDF file
				},
			],
		};

		mailTransporter.sendMail(mailDetails, function (err, data) {
			if (err) res.json(err);
			res.json(mailDetails);
		});
	}
);
