import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

function App() {

    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (e) {

        }
    }

    if (store.isLoading) {
        return <div>loading....</div>
    }

    if (!store.isAuth) {
        return (
            <div>
                <LoginForm/>
                <button onClick={getUsers}>get users</button>
            </div>

        )
    }

    return (
        <div>
            <h1>{store.isAuth ? `authorized user ${store.user.email}` : "authorize please"}</h1>
            <h2>{store.user.isActivated ? "confirmed account" : "please confirm account"}</h2>
            <button onClick={() => store.logout()}>logout</button>
            <div>
                <button onClick={getUsers}>get users</button>
            </div>
            {
                users.map(user =>
                    <div key={user.id}>{user.email}</div>
                )}
        </div>
    );
}

export default observer(App);
