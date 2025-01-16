// App.js

import React, {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {updateAccessToken} from "./utils/updateToken";
import AppRoutes from "./routes/AppRoutes";

function App() {

    useEffect(() => {
        const intervalId = setInterval(async () => {
            await updateAccessToken();
        }, 2 * 60 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Router>
            <AppRoutes/>
        </Router>

    );
}

export default App;

