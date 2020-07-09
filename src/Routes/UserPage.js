import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import UserInputForm from "../components/users/UserInputForm";
import { withRouter } from "react-router-dom";

let UserPage = (props) => {
	const {match, users} = props
	let userToEditId = props.match.params.userId;
	let userToEdit = users.find(({ id }) => id === userToEditId);
	userToEdit = typeof userToEdit !== 'undefined' ? userToEdit : {
		contact_images: []}
	let pageTitle = userToEditId ? "Edit User" : "New User(s)";

	return (
		<Layout pageTitle="User Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading paddingLeft={2} text={pageTitle} />
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<UserInputForm match={match} userToEdit={userToEdit} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		users: state.users,
		error: state.error,
	};
};

UserPage = connect(mapStateToProps)(UserPage);

export default withRouter(UserPage);
