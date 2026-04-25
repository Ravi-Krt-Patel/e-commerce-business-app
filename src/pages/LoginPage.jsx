import { useContext, useMemo, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { ShopContext } from '../context/ShopContext'

const profileSchema = Yup.object({
  firstName: Yup.string().trim().min(2, 'Enter at least 2 characters').required('First name is required'),
  lastName: Yup.string().trim().min(2, 'Enter at least 2 characters').required('Last name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit contact number')
    .required('Contact number is required'),
  image: Yup.string().trim().url('Enter a valid image URL').required('Profile image is required'),
  addressLine1: Yup.string().trim().min(8, 'Enter a full address').required('Address is required'),
  city: Yup.string().trim().required('City is required'),
  state: Yup.string().trim().required('State is required'),
  pincode: Yup.string()
    .trim()
    .matches(/^[0-9]{6}$/, 'Enter a valid 6-digit pincode')
    .required('Pincode is required'),
})

function LoginPage() {
  const { user, login, updateUser, logout } = useContext(ShopContext)
  const [isEditing, setIsEditing] = useState(!user)
  const initialValues = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      image: user?.image || '',
      addressLine1: user?.address?.line1 || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    }),
    [user],
  )

  return (
    <section className="panel">
      <h2>{user ? 'Your Account' : 'Create Your Profile'}</h2>
      {user && !isEditing ? (
        <div className="account-box">
          <div className="account-summary">
            <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="account-avatar" />
            <div>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Contact:</strong> {user.phone}</p>
            </div>
          </div>
          <div className="account-address-box">
            <p className="muted-label">Delivery Address</p>
            <p>
              {user.address.line1}, {user.address.city}, {user.address.state} - {user.address.pincode}
            </p>
          </div>
          <div className="account-actions">
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            <button type="button" onClick={logout} className="logout-btn-inline">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={profileSchema}
          onSubmit={(values, { setSubmitting }) => {
            const profile = {
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
              email: values.email.trim(),
              phone: values.phone.trim(),
              image: values.image.trim(),
              address: {
                line1: values.addressLine1.trim(),
                city: values.city.trim(),
                state: values.state.trim(),
                pincode: values.pincode.trim(),
              },
            }
            if (user) {
              updateUser(profile)
            } else {
              login(profile)
            }
            setSubmitting(false)
            setIsEditing(false)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="firstName">First Name</label>
                  <Field id="firstName" name="firstName" type="text" />
                  <ErrorMessage name="firstName" component="p" className="form-error" />
                </div>
                <div className="form-field">
                  <label htmlFor="lastName">Last Name</label>
                  <Field id="lastName" name="lastName" type="text" />
                  <ErrorMessage name="lastName" component="p" className="form-error" />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <Field id="email" name="email" type="email" />
                  <ErrorMessage name="email" component="p" className="form-error" />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Contact Number</label>
                  <Field id="phone" name="phone" type="tel" />
                  <ErrorMessage name="phone" component="p" className="form-error" />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="image">Profile Image URL</label>
                <Field id="image" name="image" type="url" />
                <ErrorMessage name="image" component="p" className="form-error" />
              </div>

              <div className="address-section">
                <h3>Delivery Address</h3>
                <div className="form-field">
                  <label htmlFor="addressLine1">Address</label>
                  <Field id="addressLine1" name="addressLine1" type="text" />
                  <ErrorMessage name="addressLine1" component="p" className="form-error" />
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="city">City</label>
                    <Field id="city" name="city" type="text" />
                    <ErrorMessage name="city" component="p" className="form-error" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="state">State</label>
                    <Field id="state" name="state" type="text" />
                    <ErrorMessage name="state" component="p" className="form-error" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="pincode">Pincode</label>
                    <Field id="pincode" name="pincode" type="text" />
                    <ErrorMessage name="pincode" component="p" className="form-error" />
                  </div>
                </div>
              </div>

              <div className="account-actions">
                <button type="submit" disabled={isSubmitting}>
                  {user ? 'Save Changes' : 'Create Profile'}
                </button>
                {user ? (
                  <button type="button" className="logout-btn-inline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                ) : null}
              </div>
            </Form>
          )}
        </Formik>
      )}
    </section>
  )
}

export default LoginPage
