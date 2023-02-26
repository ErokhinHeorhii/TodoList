import React from 'react'

import { Paper } from '@mui/material'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { FormikHelpers, useFormik } from 'formik'
import { Navigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../State/Store'

import { loginTC } from './auth-reducers'
import { selectIsLoggedIn } from './selectors'

type FormikValueType = {
  email: string
  password: string
  rememberMe: boolean
}
type FormikErrorType = Partial<FormikValueType>

export const Login = () => {
  const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const validate = (values: FormikValueType) => {
    const errors: FormikErrorType = {}

    if (!values.email) {
      errors.email = 'Required email'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
    if (values.password && values.password.length < 3) {
      errors.password = 'Required password more 3 letters'
    }

    return errors
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate,
    onSubmit: async (values: FormikValueType, formikHelpers: FormikHelpers<FormikValueType>) => {
      const action = await dispatch(loginTC(values))

      if (loginTC.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload?.fieldsErrors[0]

          formikHelpers.setFieldError(error.field, error.error)
        }
      }
    },
  })

  if (isLoggedIn) {
    return <Navigate to="/" />
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <Paper style={{ padding: '25px', width: '18rem', margin: '35% auto' }}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl>
              <FormLabel>
                <p>
                  To log in get registered
                  <a
                    href={'https://social-network.samuraijs.com/'}
                    target={'_blank'}
                    rel="noreferrer"
                  >
                    {' '}
                    here
                  </a>
                </p>
                <p>or use common test account credentials:</p>
                <p>Email: free@samuraijs.com</p>
                <p>Password: free</p>
              </FormLabel>
              <FormGroup>
                <TextField label="Email" margin="normal" {...formik.getFieldProps('email')} />
                {formik.errors.email && formik.touched.email ? (
                  <div style={{ color: 'red' }}>{formik.errors.email}</div>
                ) : null}
                <TextField
                  type="password"
                  label="Password"
                  margin="normal"
                  {...formik.getFieldProps('password')}
                />
                {formik.errors.password && formik.touched.password ? (
                  <div style={{ color: 'red' }}>{formik.errors.password}</div>
                ) : null}
                <FormControlLabel
                  label={'Remember me'}
                  control={<Checkbox />}
                  {...formik.getFieldProps('rememberMe')}
                  checked={formik.values.rememberMe}
                />
                <Button type={'submit'} variant={'contained'} color={'primary'}>
                  Login
                </Button>
              </FormGroup>
            </FormControl>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}
