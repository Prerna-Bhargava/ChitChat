import React, { useState } from 'react'
import Box from '@mui/material/Box';
import { useForm } from "react-hook-form";
import { Button, Input, Typography, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress'
import classNames from "classnames";
import { Controller } from "react-hook-form";
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import { infoToast, errorToast, warningToast } from '../../notifications/index';
import { useNavigate } from 'react-router-dom';
import { confirmPasswordRequired, emailRequired, maxLength, minLength, minName, nameRequired, passwordMatch, passwordRequired, validEmail } from '../../constants/ErrorValidations';

export default function Register() {
  const [values, setValues] = React.useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const history = useNavigate();
  const [pic, setPic] = React.useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const [picUpload, setPicUpload] = useState(false);
  const { register, handleSubmit, getValues, reset, control, formState: { errors } } = useForm();

  const onSubmit = async Userdata => {

    if (Userdata.password != Userdata.confirmPassword) {
      errorToast("Passwords Do not Match")
    }
    else {
      setPicUpload(true)
      try {
      
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }
        const { data } = await axios.post("/api/user", {
          ...Userdata, pic
        }, config)
        console.log("data  = ", data)
        localStorage.setItem('userInfo', JSON.stringify(data))
        reset();
        setPicUpload(false);
        history('/chats')

      } catch (err) {
        errorToast(err.response.data.message)
        reset();
        setPicUpload(false)
        // setLoading(false)
      }
    }

  }
  const handleClickShowPassword = () => {
    setValues({
      showPassword: !values.showPassword,
    });
  };
  const handleClickShowCPassword = () => {
    setValues({
      showConfirmPassword: !values.showConfirmPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const postDetails = (pic) => {
    if (pic == undefined) {
      warningToast("Please select an image")
      return;
    }
    if (pic.type === "image/png" || pic.type === "imaege/jpeg") {
      setPicUpload(true)
      const data = new FormData();
      data.append('file', pic)
      data.append('upload_preset', 'chatApp')
      data.append('cloud_name', 'dlqtgcsk9')
      fetch('https://api.cloudinary.com/v1_1/dlqtgcsk9/image/upload', {
        method: "post",
        body: data,
      }).then((res) => res.json()).then((data) => {
        setPic(data.url.toString())
        setPicUpload(false)
      }).catch((error) => {
        errorToast("Error uploading file")
      })
    }
    else {
      errorToast("Please select png or jpeg files only")
    }

  };
  return (
    <>

      <form onSubmit={handleSubmit(onSubmit)}>
        <h4 id="demo-simple-select-label">Name *</h4>
        <FormControl sx={{ m: 1, width: '100%', marginTop: '-10px', marginBottom: '-10px' }} variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-email">Enter your Name</InputLabel>
          <Controller
            control={control}
            render={({ field }) => (
              <OutlinedInput
                {...field}
                className={classNames({ "is-Invalid": errors.name })}
                disableUnderline={true}
                id="filled-name-label"
                type="text"
                {...register("name", { required: nameRequired })}
                error={Boolean(errors.email)}
                label="Enter your Name"
              />
            )}
            name='name'
            defaultValue=""
            rules={{
              required: nameRequired,
              minLength: {
                value: '3',
                message: minName,
              },
            }}
          />
          {errors.name && (
            <span className="invalid-field-text">
              <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                {errors.name.message}
              </Typography>
            </span>
          )}
        </FormControl>

        <h4 id="demo-simple-select-label">Email Address *</h4>
        <FormControl sx={{ m: 1, width: '100%', marginTop: '-10px', marginBottom: '-10px' }} variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
          <Controller
            control={control}
            render={({ field }) => (
              <OutlinedInput
                {...field}
                // className={classNames}
                className={classNames({ "is-Invalid": errors.email })}
                disableUnderline={true}
                id="filled-name-label"
                type="text"
                label="Email"
                {...register("email", { required: emailRequired })}
                error={Boolean(errors.email)}
              />
            )}
            name='email'
            defaultValue=""
            rules={{
              required: emailRequired,
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: validEmail,
              },
            }}
          />
          {errors.email && (
            <span className="invalid-field-text">
              <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                {errors.email.message}
              </Typography>
            </span>
          )}
        </FormControl>

        <h4 id="demo-simple-select-label">Password *</h4>
        <FormControl sx={{ m: 1, width: '100%', marginTop: '-10px', marginBottom: '-10px' }} variant="outlined" >
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

        <h4 id="demo-simple-select-label">Confirm Password *</h4>
        <FormControl sx={{ m: 1, width: '100%', marginTop: '-10px', marginBottom: '-10px' }} variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
          <Controller
            control={control}
            render={({ field }) => (
              <OutlinedInput
                {...field}
                className={classNames({ "is-Invalid": errors.confirmPassword })}
                disableUnderline={true}
                id="outlined-adornment-confirm-password"
                type={values.showConfirmPassword ? "text" : "Password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowCPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                {...register("confirmPassword", { required: confirmPasswordRequired })}
                error={Boolean(errors.confirmPassword)}
                label="Confirm Password"
              />
            )}
            name='confirmPassword'
            defaultValue=""
            rules={{
              required: confirmPasswordRequired,
              validate: value =>
                getValues("password") === value || passwordMatch
            }}
          />
          {errors.confirmPassword && (
            <span className="invalid-field-text">
              <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                {errors.confirmPassword.message}
              </Typography>
            </span>
          )}
        </FormControl>

        <h4 id="demo-simple-select-label">Upload your Picture</h4>
        <FormControl id="pic" sx={{ marginTop: '-10px' }}>
          <Input
            type="file"
            accept="image/*"
            disableUnderline
            onChange={(e) => postDetails(e.target.files[0])}
          />

        </FormControl>

        <Box style={{ display: "flex", justifyContent: "center" }}>
          {picUpload && <CircularProgress />}</Box>

        <Box sx={{ marginTop: "20px" }}>
          <LoadingButton disabled={picUpload} variant="contained" sx={{ padding: '10px' }} fullWidth type="submit">Sign Up</LoadingButton>
        </Box>


      </form>
    </>
  )
}
