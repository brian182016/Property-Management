import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import UserInputForm from "../components/users/UserInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit, handleDelete } from '../actions/actions'

let UserPage = (props) => {
	const { match, currentUser, handleItemDelete, handleItemSubmit } = props
	let pageTitle = "Edit Profile"
	return (
		<Layout pageTitle="User Profile">
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
					<UserInputForm match={match} userToEdit={currentUser} handleItemSubmit={handleItemSubmit} handleItemDelete={handleItemDelete} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
		error: state.error,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};

UserPage = connect(mapStateToProps, mapDispatchToProps)(UserPage);

export default withRouter(UserPage);