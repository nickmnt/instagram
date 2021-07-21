import {useState, useContext} from 'react';
import FileInput from '../components/file-input';
import PageTemplate from '../templates/page-template';
import UserContext from '../context/user';
import useUser from '../hooks/use-user';
import { useHistory } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Publish() {
    const history = useHistory();
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);

    const [img,setImg] = useState();
    const handleSubmit = e => {
        e.preventDefault();

        let formData = new FormData();
     
        formData.append("img", img);console.log(formData.get('img'));
        fetch(`/images/users/${user.username}`, {method: "POST", body: formData}).then(()=> {
            toast("Success");
            history.push(ROUTES.DASHBOARD);
        }).catch(()=> {
            toast("Failed to publish post, check your internet connection.")
        });

    };

    return (
        <PageTemplate>
            <ToastContainer />
            <div className="publish">
                <div className="publish__initial">
                    {/*<div className="publish__drop-container noselect">
                        Drop your picture here
                    </div>*/}
                    <div className="publish__file-input">
                        <FileInput setImg={setImg}/>
                    </div>
                    {img && 
                        <>
                        <img src={URL.createObjectURL(img)} className="publish__img" />
                        <form className="edit-profile__form" onSubmit={handleSubmit}>
                            <div className="edit-profile__form-item">
                            <div className="edit-profile__input-group">
                                <input type="text" className="edit-profile__input" placeholder="Caption" name="caption"/>
                                <label className="edit-profile__title">Caption</label>
                            </div></div>
                            <div className="edit-profile__form-item">
                                <button className="btn edit-profile__submit">Post</button>
                            </div>
                        </form>
                        </>
                    }
                </div>
            </div>
        </PageTemplate>
    );
}