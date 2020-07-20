import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button, TextField, MenuItem } from "@material-ui/core";
import { Formik } from "formik";
import { commonStyles } from "../commonStyles";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import * as Yup from "yup";

const VacatingNoticeSchema = Yup.object().shape({
  tenant: Yup.string().required("Tenant is required"),
  landlord: Yup.string().required("Landlord is required"),
  notification_date: Yup.date().required("Vacating Date Required"),
  vacating_date: Yup.date().required("Vacating Date Required"),
  actual_vacated_date: Yup.date(),
  notice_details: Yup.string().trim().required('Notice Details are required')
});

const NoticeInputForm = (props) => {
  const history = useHistory();
  const classes = commonStyles();

  const { contacts, users, noticeToEdit, submitForm } = props;

  let noticeValues = { ...noticeToEdit };

  return (
    <Formik
      initialValues={noticeValues}
      validationSchema={VacatingNoticeSchema}
      onSubmit={(values, { resetForm }) => {
        const vacatingNotice = {
          tenant: values.tenant,
          landlord: values.landlord,
          notice_details: values.notice_details,
          vacating_date: values.vacating_date,
          actual_vacated_date: values.actual_vacated_date,
          notification_date: values.notification_date,
          notice_details: values.notice_details,
        };
        submitForm(vacatingNotice, "notices").then(
          (response) => {
            resetForm({});
            if (values.id) {
              history.goBack()
            }
          }
        );
      }}
    >
      {({
        values,
        handleSubmit,
        errors,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
          <form
            className={classes.form}
            method="post"
            id="noticeInputForm"
            onSubmit={handleSubmit}
          >
            <Grid
              container
              spacing={4}
              justify="center"
              alignItems="stretch"
              direction="column"
            >
              <Grid item>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  id="landlord"
                  name="landlord"
                  label="LandLord"
                  value={values.landlord}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"landlord" in errors}
                  helperText={errors.landlord}
                >
                  {users.map((user, index) => (
                    <MenuItem key={index} value={user.id}>
                      {user.first_name + " " + user.last_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  select
                  variant="outlined"
                  id="tenant"
                  name="tenant"
                  label="Tenant"
                  value={values.tenant}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"tenant" in errors}
                  helperText={errors.tenant}
                >
                  {contacts.map((contact, index) => (
                    <MenuItem key={index} value={contact.id}>
                      {contact.first_name + " " + contact.last_name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="notification_date"
                  name="notification_date"
                  label="Notification Date"
                  value={values.notification_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"notification_date" in errors}
                  helperText={errors.notification_date
                  }
                />
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="vacating_date"
                  name="vacating_date"
                  label="Vacating Date"
                  value={values.vacating_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"vacating_date" in errors}
                  helperText={errors.vacating_date}
                />
                <TextField
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  id="actual_vacated_date"
                  name="actual_vacated_date"
                  label="Actual Date Vacated"
                  value={values.actual_vacated_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"actual_vacated_date" in errors}
                  helperText={errors.actual_vacated_date}
                />
                <TextField
                  fullWidth
                  rows={4}
                  multiline
                  variant="outlined"
                  id="notice_details"
                  name="notice_details"
                  label="Notice Details"
                  value={values.notice_details}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={"notice_details" in errors}
                  helperText={errors.notice_details}
                />
              </Grid>
              <Grid item className={classes.buttonBox}>
                <Button
                  color="secondary"
                  variant="contained"
                  size="medium"
                  startIcon={<CancelIcon />}
                  onClick={() => history.goBack()}
                  disableElevation
                >
                  Cancel
              </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="medium"
                  startIcon={<SaveIcon />}
                  form="noticeInputForm"
                  disabled={isSubmitting}
                >
                  Save
              </Button>
              </Grid>
            </Grid>
          </form>
        )}
    </Formik>
  );
};

export default NoticeInputForm;