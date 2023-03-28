
import axios from 'axios';
import React, { useState } from 'react'
import { UserState } from '../Context/UserProvider';

const EditProfile = () => {
    const { user, setUser } = UserState()
    const [phone, setPhone] = useState();
    const onSubmitHandler = async(e) => {
        try {
            e.preventDefault();
            console.log(phone);
            const { data } = await axios.put("/api/user/edits", {phone:phone}, { headers: {  'auth-token': localStorage.getItem("token") } })
            console.log(data);
            setUser({...user,phone:phone})
            window.location.reload()

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <form onSubmit={onSubmitHandler}>
            <label htmlFor="phone number" ><b>Phone Number(with country code):</b></label>
            <input type="tel" name="phone" placeholder={user.phone ? user.phone : "+91-123-456-7890"} onChange={(e) => { setPhone(e.target.value) }} /><br />
                <input type="submit" value="Edit" />  <br/>
            </form>
        </>


    )
}

export default EditProfile