import React from 'react'
import Box from '@mui/material/Box';
import { useForm } from "react-hook-form";
import { Button, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import classNames from "classnames";
import { Controller } from "react-hook-form";
import CircularProgress from '@mui/material/CircularProgress'
import { emailRequired, maxLength, minLength, passwordRequired } from '../../constants/ErrorValidations';
import { infoToast, errorToast, warningToast } from '../../notifications/index';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';


export default function Login({ handleChange }) {
  const [values, setValues] = React.useState({
    showPassword: false,
  });
  const { setUser } = ChatState()
  const history = useNavigate();
  const [loading, isLoading] = React.useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
  const onSubmit = async Userdata => {
    isLoading(true)
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const { data } = await axios.post("/api/user/login", {
        Userdata
      }, config)
      localStorage.setItem('userInfo', JSON.stringify(data))
      setUser(data)
      reset();
      isLoading(false);
      console.log("move to chats")
      history('/chats')

    } catch (err) {
      console.log("error ", err)
      errorToast(err.response.data.message)
      reset();
      isLoading(false)
    }
  }
  const handleClickShowPassword = () => {
    setValues({
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>

        <h4 id="demo-simple-select-label">Email Address*</h4>
        <FormControl sx={{ m: 1, width: '100%', marginTop: '-10px' }} variant="outlined" >
          <TextField
            autoComplete="off"
            id="standard-basic"
            label="Email Address"
            name="email"
            fullWidth
            {...register("email", { required: emailRequired })}
            error={Boolean(errors.email)}
          />
          {errors.email && (
            <span className="invalid-field-text">
              <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                {errors.email.message}
              </Typography>
            </span>
          )}
        </FormControl>

        <h4 id="demo-simple-select-label">Password*</h4>
        <FormControl sx={{ m: 1, width: '100%', marginTop: '-10px' }} variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <Controller
            control={control}
            render={({ field }) => (
              <OutlinedInput
                {...field}
                className={classNames({ "is-Invalid": errors.password })}
                disableUnderline={true}
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...register("password", { required: passwordRequired })}
                error={Boolean(errors.password)}
                label="Password"
              />
            )}
            name='password'
            defaultValue=""
            rules={{
              required: passwordRequired,
              minLength: {
                value: '5',
                message: minLength,
              },
              maxLength: {
                value: '10',
                message: maxLength,
              },
            }}
          />
          {errors.password && (
            <span className="invalid-field-text">
              <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                {errors.password.message}
              </Typography>
            </span>
          )}
        </FormControl>

        <Box style={{ display: "flex", justifyContent: "center" }}>
          {loading && <CircularProgress />}</Box>

        <Box sx={{ marginTop: "20px" }}>
          <Button disabled={loading} variant="contained" sx={{ padding: '10px' }} fullWidth type="submit">Login</Button>
        </Box>

        <Box sx={{ marginTop: "30px", textAlign: 'center' }}>
          <Typography>Don't have an account? <Button onClick={(e) => handleChange(e, 1)}>Sign up here</Button> </Typography>
        </Box>
      </form>
    </>
  )
}
