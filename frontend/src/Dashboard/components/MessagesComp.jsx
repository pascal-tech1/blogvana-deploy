import React from "react";

import { Link } from "react-router-dom";
import { LazyLoadImg } from "../../components";
import MessageUser from "./MessageUser"

const MessagesComp = ({ msg, IsMessage }) => {
	return (
		<div className="flex gap-6 flex-col font-inter max-w-fit">
			{msg.map((message, index) => {
				return (
					<div key={index} className="flex  justify-between gap-2">
						<div className="flex gap-2">
							<Link
								to={
									message?.sender?._id
										? `/profile/${message?.sender?._id}`
										: ""
								}
							>
								<LazyLoadImg
									backgroundClassName={
										"self-start border w-8 h10 rounded-lg relative"
									}
									imgClassName={
										"absolute inset-0 w-full h-full  object-cover rounded-lg "
									}
									originalImgUrl={
										message?.sender?.profilePhoto
											? message?.sender?.profilePhoto
											: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blq…auto,w_200/ank-profile-picture-973460_960_720.png"
									}
									blurImageStr={message?.sender?.blurProfilePhoto}
									optimizationStr={"q_auto,f_auto,w_100"}
									paddingBottom={"100%"}
								/>
							</Link>
							<Link
								to={`/profile-message`}
								className="flex justify-between"
							>
								<div className=" font-medium flex gap-1 flex-col">
									<h3 className="  text-pink-400">
										{message?.sender
											? `${message?.sender?.firstName} ${message?.sender?.lastName}`
											: "deleted user"}
									</h3>

									<h3 className="">{message?.message}</h3>
								</div>
							</Link>
						</div>
						{IsMessage && message?.sender && (
							<div>
								<MessageUser receiverId={message?.sender?._id} />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default MessagesComp;
