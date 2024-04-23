import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
// import UploadWidget from '../../components/uploadWidget/UploadWidget';
import './UpdateAccount.scss';
import apiRequest from '../../utils/apiRequest';

function UpdateAccount() {
	const { currentUser, updateUser } = useContext(AuthContext);
	const [errorUpdateUser, setErrorUpdateUser] = useState('');
	const [errorUpdatePassword, setErrorUpdatePassword] = useState('');
	// const [avatar, setAvatar] = useState([]);

	const navigate = useNavigate();

	const handleUpdateUserDetails = async e => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const { name, email } = Object.fromEntries(formData);
		// const photo = formData.get('photo');
		// console.log(photo);

		try {
			const res = await apiRequest.patch(`/users/update-details`, {
				name,
				email,
				// photo,
			});
			updateUser(res.data.data.user);
			navigate('/my-account');
		} catch (err) {
			console.log(err);
			setErrorUpdateUser(err.response.data.message);
		}
	};

	const handleUpdatePassword = async e => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const { currentPwd, newPwd, newPwdConfirm } = Object.fromEntries(formData);

		try {
			await apiRequest.patch(`/users/update-password`, {
				currentPwd,
				newPwd,
				newPwdConfirm,
			});
			navigate('/my-account');
		} catch (err) {
			console.log(err);
			setErrorUpdatePassword(err.response.data.message);
		}
	};

	return (
		<div className="updateAccount">
			<div className="formContainer">
				<form onSubmit={handleUpdateUserDetails}>
					<h1>Update User details</h1>
					<div className="item">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							name="name"
							type="text"
							defaultValue={currentUser.name}
						/>
					</div>
					<div className="item">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							defaultValue={currentUser.email}
						/>
					</div>
					{/* <div className="item">
						<label htmlFor="photo">Avatar</label>
						<img
							className="img"
							src={`/users/${currentUser.photo || 'default.jpg'}`}
							alt="User avatar"
						/>
					</div>
					<input id="photo" name="photo" type="file" accept="image/*" /> */}
					<button>Update User</button>
					{errorUpdateUser && <span>{errorUpdateUser}</span>}
				</form>
				<form onSubmit={handleUpdatePassword}>
					<h1>Update Password</h1>
					<div className="item">
						<label htmlFor="currentPwd">Current password</label>
						<input
							id="currentPwd"
							name="currentPwd"
							type="password"
							required
						/>
					</div>
					<div className="item">
						<label htmlFor="newPwd">Password</label>
						<input id="newPwd" name="newPwd" type="password" required />
					</div>
					<div className="item">
						<label htmlFor="newPwdConfirm">Confirm password</label>
						<input
							id="newPwdConfirm"
							name="newPwdConfirm"
							type="password"
							required
						/>
					</div>
					<button>Update password</button>
					{errorUpdatePassword && <span>{errorUpdatePassword}</span>}
				</form>
			</div>
			{/* <div className="sideContainer">
				<UploadWidget
					uwConfig={{
						cloudName: 'lamadev',
						uploadPreset: 'estate',
						multiple: false,
						maxImageFileSize: 2000000,
						folder: 'avatars',
					}}
					setState={setAvatar}
				/>
			</div> */}
		</div>
	);
}

export default UpdateAccount;
