import { use } from "react";
import { AuthContext } from "../../providers/AuthContext";

const Home = () => {
    const {user} = use(AuthContext)
    console.log(user)
    return (
        <div>
            This is home page
        </div>
    );
};

export default Home;